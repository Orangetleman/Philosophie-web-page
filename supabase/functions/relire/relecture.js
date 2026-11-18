/* ════════════════════════════════════════════════════════════════════════
   supabase/functions/relire/relecture.js — ce que la relecture par l'IA
   calcule sans réseau (lot A4, docs/chantier-administration.md).
   ────────────────────────────────────────────────────────────────────────
   Repris de philo-aggregator/review.py (consigne, lecture du verdict) et
   export.py (rendu anonyme d'une boîte, masquer_coordonnees), fichiers
   retirés au lot A6 (ils restent dans l'historique git). Module pur :
   la fonction Supabase (index.ts, Deno) l'importe, et
   outils/essais_relecture.mjs l'éprouve dans Node.
   ════════════════════════════════════════════════════════════════════════ */

/* La consigne donnée à Gemini : son rôle et le format exact de la réponse.
   Texte de SYSTEM_INSTRUCTION de review.py, plus l'obligation du français
   (18 nov. 2026 : la boîte n° 36 avait reçu un avis en anglais). */
export const CONSIGNE = `Tu es correcteur de philosophie pour des élèves de Terminale (France).
On te soumet une proposition de contribution à un site de révision
(ajout, correction ou remarque sur une notion, un auteur, un texte, un
concept ou une dissertation).

Évalue-la sur trois critères :
  1. Exactitude : pas d'erreur factuelle ou d'attribution fausse.
  2. Pertinence : en lien avec le programme de philosophie de Terminale.
  3. Clarté : formulation compréhensible, niveau lycée.

Écris TOUJOURS en français, y compris "review" (même si la proposition
contient de l'anglais ou des titres étrangers).

Réponds UNIQUEMENT par un objet JSON valide, sans texte autour, de la
forme exacte :
{"verdict": "valide|douteux|rejet", "review": "une à trois phrases",
 "message_contributeur": "une à deux phrases"}

- "verdict" : "valide" (rien de bloquant, intégrable tel quel ou presque),
  "douteux" (à vérifier de près : erreur possible, doublon probable,
  formulation floue, hors niveau) ou "rejet" (manifestement faux,
  hors-sujet ou spam).
- "review" : explique brièvement le verdict, en français, pour le
  RELECTEUR du site (langage technique permis : « doublon probable »,
  « attribution à vérifier »…).
- "message_contributeur" : la MÊME appréciation, mais rédigée pour la
  personne qui a fait la proposition — un élève, pas un développeur.
  Règles : tutoiement, ton bienveillant et encourageant, français simple,
  AUCUN jargon (ne dis jamais « verdict », « valide/douteux/rejet »,
  « doublon », « base de données »). Remercie pour la contribution, puis,
  si besoin, indique avec tact le point à revoir. Reste FACTUEL : ne
  promets pas que la proposition sera publiée (un humain tranche ensuite).
`;

export const VERDICTS = ['valide', 'douteux', 'rejet'];

// Mêmes motifs que export.py (_RE_EMAIL, _RE_TEL).
const RE_EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
const RE_TEL = /(?<!\d)(?:\+\d{1,3}[ .-]?)?(?:\d[ .-]?){9,12}\d(?!\d)/g;

/* masquer(texte) — adresses e-mail et numéros de téléphone remplacés par
   un repère neutre : rien qui désigne une personne ne part chez Google. */
export function masquer(texte) {
  return String(texte).replace(RE_EMAIL, '[adresse masquée]').replace(RE_TEL, '[numéro masqué]');
}

/* texteBoite(contenu) — la boîte décrite à Gemini : catégorie, cible, type,
   puis chaque champ « clé : valeur » (les idées d'un auteur une par une).
   Seulement le contenu : ni pseudo, ni date, ni compte, ni note interne ;
   la fonction ne reçoit d'ailleurs que payload.boxes[rang]. */
export function texteBoite(contenu) {
  const c = contenu || {}, f = c.fields || {};
  const ligne = (k, v) => {
    if (v == null) return '';
    const t = Array.isArray(v) ? v.filter(x => String(x).trim()).join(' · ') : String(v).trim();
    return t ? `${k} : ${masquer(t)}\n` : '';
  };
  // La consigne rappelée en tête du texte : le modèle léger suit mieux une
  // langue demandée près de la question qu'au seul message système.
  let s = `(Réponds en français.)\nCatégorie : ${c.categorie || '?'} · cible : ${c.cible || '?'} · type : ${c.type || 'ajout'}\n`;
  Object.keys(f).forEach(k => { if (k !== 'ideas') s += ligne(k, f[k]); });
  (Array.isArray(f.ideas) ? f.ideas : []).forEach((it, i) => {
    s += `Idée ${i + 1} :\n`;
    Object.keys(it || {}).forEach(k => { s += '  ' + ligne(k, it[k]); });
  });
  return s;
}

/* lireVerdict(texte) — {verdict, avis, message} depuis la réponse brute.
   Gemini entoure parfois son JSON de ``` : on les retire. Une réponse
   illisible ou un verdict inconnu donnent « douteux » : mieux vaut
   signaler à l'humain que perdre la boîte (comme parse_verdict). */
export function lireVerdict(texte) {
  let brut = String(texte || '').trim();
  if (brut.startsWith('```')) {
    brut = brut.replace(/^`+|`+$/g, '');
    if (brut.slice(0, 4).toLowerCase() === 'json') brut = brut.slice(4);
    brut = brut.trim();
  }
  try {
    const o = JSON.parse(brut);
    const avis = String(o.review || ''), message = String(o.message_contributeur || '');
    if (!VERDICTS.includes(o.verdict))
      return { verdict: 'douteux', avis: `Verdict IA non reconnu (${JSON.stringify(o.verdict)}). Réponse : ${avis}`, message };
    return { verdict: o.verdict, avis, message };
  } catch (e) {
    return { verdict: 'douteux', avis: 'Réponse IA illisible : ' + brut.slice(0, 300), message: '' };
  }
}

/* avisContributeur(boites) — le texte de contributions.avis_ia (« Avis
   automatique » de « Mes propositions ») : le message de chaque boîte
   relue, précédé de « Partie n » quand la proposition en a plusieurs. */
export function avisContributeur(boites) {
  const avec = (boites || []).filter(b => b.ia_message && String(b.ia_message).trim()).sort((a, b) => a.rang - b.rang);
  if (!avec.length) return null;
  if ((boites || []).length === 1) return String(avec[0].ia_message).trim();
  return avec.map(b => `Partie ${b.rang + 1} : ${String(b.ia_message).trim()}`).join('\n');
}

/* attenteQuota(texte) — en cas de refus pour débit (429) : null si c'est le
   quota du JOUR (inutile d'attendre, on arrête le lot), sinon les secondes
   à patienter, d'après « retry in 26.5s » (bornées à 30 s). */
export function attenteQuota(texte) {
  const t = String(texte || '');
  // « PerDay », « per day », « per-day » (comme _is_daily_quota de review.py).
  if (/perday/i.test(t.replace(/[^a-z]/gi, ''))) return null;
  const m = t.match(/retry(?:_?delay)?[^0-9]*?(\d+(?:\.\d+)?)\s*s/i);
  return Math.min(30, (m ? parseFloat(m[1]) : 20) + 1);
}
