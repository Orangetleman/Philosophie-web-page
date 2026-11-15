/* ════════════════════════════════════════════════════════════════════════
   supabase/functions/relire/index.ts — la relecture par l'IA, côté Supabase
   (lot A4 du chantier Administration ; décision Q2 : elle quitte le PC).
   ────────────────────────────────────────────────────────────────────────
   Appelée par le bouton « 🤖 Relire avec l'IA » de /admin/ :
     POST /functions/v1/relire   corps : {limite?: 1..10} ou {ids: [n°…]}
   1. Vérifie que l'appelant est administrateur (son jeton → son compte →
      table app_admins, lue avec la clé de service).
   2. Choisit les boîtes : celles demandées (ids, relues même si elles
      l'étaient déjà), sinon les plus anciennes en attente jamais relues,
      hors retours sur le site (rien de philosophique à vérifier).
   3. Pour chacune, demande un avis à Gemini (texte de la boîte seul, cf.
      relecture.js), puis écrit ia_verdict, ia_avis, ia_message, ia_le, et
      l'avis pour le contributeur (contributions.avis_ia).
   Réponse : {relues: [{id, verdict}], erreurs: [...], arret: texte|null}.

   Secrets (Supabase › Edge Functions › Secrets, ou `supabase secrets set`) :
     GEMINI_API_KEY (obligatoire), GEMINI_MODEL (facultatif,
     « gemini-flash-latest » par défaut). SUPABASE_URL, SUPABASE_ANON_KEY et
     SUPABASE_SERVICE_ROLE_KEY sont fournis d'office par Supabase.
   Déploiement : `supabase functions deploy relire` (voir le cadrage, A4).
   ════════════════════════════════════════════════════════════════════════ */
import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
import { CONSIGNE, texteBoite, lireVerdict, avisContributeur, attenteQuota } from './relecture.js';

const URL_SB = Deno.env.get('SUPABASE_URL')!;
const CLE_ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
const CLE_SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const CLE_GEMINI = Deno.env.get('GEMINI_API_KEY') ?? '';
const MODELE = Deno.env.get('GEMINI_MODEL') || 'gemini-flash-latest';
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

  // 1. L'appelant est-il administrateur ?
  const jeton = req.headers.get('Authorization') ?? '';
  const utilisateur = createClient(URL_SB, CLE_ANON, { global: { headers: { Authorization: jeton } } });
  const { data: u } = await utilisateur.auth.getUser();
  if (!u?.user) return repondre({ erreur: 'non-connecte' }, 401);
  const service = createClient(URL_SB, CLE_SERVICE);
  const { data: admin } = await service.from('app_admins').select('user_id').eq('user_id', u.user.id).maybeSingle();
  if (!admin) return repondre({ erreur: 'pas-admin' }, 403);

  // 2. Les boîtes à relire.
  const corps = await req.json().catch(() => ({}));
  const ids: number[] = Array.isArray(corps.ids) ? corps.ids.map(Number).filter(Number.isSafeInteger).slice(0, LIMITE_MAX) : [];
  const limite = Math.max(1, Math.min(LIMITE_MAX, Number(corps.limite) || 8));
  let q = service.from('boites').select('id, contribution, rang, statut, ia_verdict, contributions!inner(payload)');
  q = ids.length ? q.in('id', ids) : q.eq('statut', 'en_attente').is('ia_verdict', null).order('id').limit(limite * 3);
  const { data: lues, error } = await q;
  if (error) return repondre({ erreur: 'base', detail: error.message }, 500);
  const aRelire = (lues ?? [])
    .map((b: any) => ({ ...b, contenu: b.contributions?.payload?.boxes?.[b.rang] ?? {} }))
    .filter((b: any) => ids.length || (b.contenu.categorie ?? '') !== 'site')
    .slice(0, ids.length || limite);

  // 3. Une boîte après l'autre.
  const relues: { id: number; verdict: string }[] = [], erreurs: string[] = [];
  const touchees = new Set<string>();
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
        } else erreurs.push(`n° ${b.id} : Gemini a refusé (${e.statut ?? '?'})`);
        break;
      }
    }
    if (arret) break;
    if (!reponse) continue;
    const v = lireVerdict(reponse);
    const { error: e2 } = await service.from('boites').update({
      ia_verdict: v.verdict, ia_avis: v.avis, ia_message: v.message || null, ia_le: new Date().toISOString(),
    }).eq('id', b.id);
    if (e2) { erreurs.push(`n° ${b.id} : ${e2.message}`); continue; }
    relues.push({ id: b.id, verdict: v.verdict });
    touchees.add(b.contribution);
    await dormir(PAUSE_MS);
  }

  // L'avis pour le contributeur : toutes les boîtes relues de la proposition.
  for (const c of touchees) {
    const { data: bx } = await service.from('boites').select('rang, ia_message').eq('contribution', c);
    await service.from('contributions').update({ avis_ia: avisContributeur(bx ?? []) }).eq('id', c);
  }
  return repondre({ relues, erreurs, arret });
});
