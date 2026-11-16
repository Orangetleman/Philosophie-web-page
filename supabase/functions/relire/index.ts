/* ════════════════════════════════════════════════════════════════════════
   supabase/functions/relire/index.ts — la relecture par l'IA, côté Supabase
   (lot A4 du chantier Administration ; décision Q2 : elle quitte le PC).
   ────────────────────────────────────────────────────────────────────────
   Appelée par le bouton « 🤖 Relire avec l'IA » de /admin/ :
     POST /functions/v1/relire   corps : {limite?: 1..10} ou {ids: [n°…]}
   1. Agit avec le JETON de l'administrateur connecté, jamais avec une clé
      secrète : les fonctions SQL admin_boites() et admin_ecrire_avis()
      (2026_relecture.sql) refusent tout compte hors de app_admins. (Avec la
      clé de service, la fonction ne voyait pas app_admins sur ce projet,
      passé aux nouvelles clés sb_secret : essai du 15 nov. 2026.)
   2. Choisit les boîtes : celles demandées (ids, relues même si elles
      l'étaient déjà), sinon les plus anciennes en attente jamais relues,
      hors retours sur le site (rien de philosophique à vérifier).
   3. Pour chacune, demande un avis à Gemini (texte de la boîte seul, cf.
      relecture.js), puis écrit l'avis par admin_ecrire_avis (boîte, et
      avis pour le contributeur dans contributions.avis_ia).
   Réponse : {relues: [{id, verdict}], erreurs: [...], arret: texte|null}.

   Secrets (Supabase › Edge Functions › Secrets, ou `supabase secrets set`) :
     GEMINI_API_KEY (obligatoire), GEMINI_MODEL (facultatif,
     « gemini-2.5-flash-lite » par défaut : le modèle du .env de
     l'agrégateur ; l'alias gemini-flash-latest ne répondait plus du tout
     le 15 nov. 2026, plus de 2 minutes d'attente). SUPABASE_URL et SUPABASE_ANON_KEY
     sont fournis d'office par Supabase.
   Déploiement : `supabase functions deploy relire` (voir le cadrage, A4).
   ════════════════════════════════════════════════════════════════════════ */
import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
import { CONSIGNE, texteBoite, lireVerdict, attenteQuota } from './relecture.js';

const URL_SB = Deno.env.get('SUPABASE_URL')!;
const CLE_ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
const CLE_GEMINI = Deno.env.get('GEMINI_API_KEY') ?? '';
const MODELE = Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash-lite';
const DELAI_GEMINI_MS = 25000;    // au-delà, on abandonne la boîte (la fonction a 150 s en tout)
const PAUSE_MS = 1000;            // entre deux appels : palier gratuit de Gemini
const LIMITE_MAX = 10;            // une fonction Supabase vit 150 s au plus

// L'administration est appelée depuis le site et depuis le poste local.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const repondre = (corps: unknown, statut = 200) =>
  new Response(JSON.stringify(corps), { status: statut, headers: { ...CORS, 'Content-Type': 'application/json' } });
const dormir = (ms: number) => new Promise(r => setTimeout(r, ms));

/* demanderAGemini(texte) — un appel generateContent ; rend le texte de la
   réponse ou lève une erreur qui garde le statut HTTP et le message. */
async function demanderAGemini(texte: string): Promise<string> {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODELE}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': CLE_GEMINI },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: CONSIGNE }] },
      contents: [{ role: 'user', parts: [{ text: texte }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
    // Sans délai, un modèle muet faisait attendre jusqu'à la mort de la fonction.
    signal: AbortSignal.timeout(DELAI_GEMINI_MS),
  });
  const brut = await r.text();
  if (!r.ok) throw Object.assign(new Error(brut.slice(0, 500)), { statut: r.status });
  const j = JSON.parse(brut);
  return j?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ?? '';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return repondre({ erreur: 'méthode' }, 405);
  if (!CLE_GEMINI) return repondre({ erreur: 'gemini-absent' }, 500);

  // 1. Le client de l'appelant : la base vérifie elle-même qu'il est admin.
  const jeton = req.headers.get('Authorization') ?? '';
  const admin = createClient(URL_SB, CLE_ANON, { global: { headers: { Authorization: jeton } } });

  // 2. Les boîtes à relire (admin_boites rend aussi leur contenu).
  const corps = await req.json().catch(() => ({}));
  const ids: number[] = Array.isArray(corps.ids) ? corps.ids.map(Number).filter(Number.isSafeInteger).slice(0, LIMITE_MAX) : [];
  const limite = Math.max(1, Math.min(LIMITE_MAX, Number(corps.limite) || 8));
  const { data: toutes, error } = await admin.rpc('admin_boites');
  if (error) {
    if (error.code === '42501') return repondre({ erreur: 'pas-admin' }, 403);
    if (/jwt|auth/i.test(error.message)) return repondre({ erreur: 'non-connecte' }, 401);
    return repondre({ erreur: 'base', detail: error.message }, 500);
  }
  const aRelire = (toutes ?? [])
    .filter((b: any) => ids.length ? ids.includes(b.id)
      : b.statut === 'en_attente' && !b.ia_verdict && (b.contenu?.categorie ?? '') !== 'site')
    .sort((a: any, b: any) => a.id - b.id)
    .slice(0, ids.length || limite);

  // 3. Une boîte après l'autre.
  const relues: { id: number; verdict: string }[] = [], erreurs: string[] = [];
  let arret: string | null = null;
  for (const b of aRelire) {
    let reponse = '';
    for (let essai = 0; essai < 2; essai++) {
      try { reponse = await demanderAGemini(texteBoite(b.contenu)); break; }
      catch (e: any) {
        if (e.statut === 429 || e.statut === 503) {
          const attente = attenteQuota(e.message);
          if (attente === null) { arret = 'Quota Gemini du jour épuisé : réessaie demain.'; break; }
          if (essai === 0) { await dormir(attente * 1000); continue; }
          arret = 'Gemini est saturé : réessaie dans quelques minutes.';
        } else if (e.name === 'TimeoutError') erreurs.push(`n° ${b.id} : Gemini n'a pas répondu en ${DELAI_GEMINI_MS / 1000} s (modèle ${MODELE})`);
        else erreurs.push(`n° ${b.id} : Gemini a refusé (${e.statut ?? '?'} : ${String(e.message).slice(0, 120)})`);
        break;
      }
    }
    if (arret) break;
    if (!reponse) continue;
    const v = lireVerdict(reponse);
    const { error: e2 } = await admin.rpc('admin_ecrire_avis', {
      p_id: b.id, p_verdict: v.verdict, p_avis: v.avis, p_message: v.message,
    });
    if (e2) { erreurs.push(`n° ${b.id} : ${e2.message}`); continue; }
    relues.push({ id: b.id, verdict: v.verdict });
    await dormir(PAUSE_MS);
  }
  return repondre({ relues, erreurs, arret });
});
