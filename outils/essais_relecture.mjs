/* ════════════════════════════════════════════════════════════════════
   essais_relecture.mjs — essais de supabase/functions/relire/relecture.js
   (la partie sans réseau de la relecture par l'IA, lot A4).
   ────────────────────────────────────────────────────────────────────
   Chaque essai passe sur le vrai fichier, puis sur un TÉMOIN (le même
   fichier avec une faute glissée exprès), où il DOIT échouer.

     node outils/essais_relecture.mjs
   ════════════════════════════════════════════════════════════════════ */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const RACINE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FICHIER = path.join(RACINE, 'supabase', 'functions', 'relire', 'relecture.js');
const SOURCE = fs.readFileSync(FICHIER, 'utf8');

/* charger(src) — importe le module depuis son texte (adresse data:). */
const charger = src => import('data:text/javascript;base64,' + Buffer.from(src).toString('base64') + '#' + Math.random());
const remplace = (a, b) => src => {
  if (!src.includes(a)) throw new Error(`témoin : « ${a.slice(0, 50)} » absent de relecture.js`);
  return src.replace(a, b);
};

const ESSAIS = [
  { nom: "rien qui désigne une personne ne part chez Google (e-mail, téléphone)",
    temoin: remplace("return String(texte).replace(RE_EMAIL, '[adresse masquée]').replace(RE_TEL, '[numéro masqué]');", 'return String(texte);'),
    f: R => {
      const t = R.texteBoite({ categorie: 'site', cible: 'site-bug', fields: { bugdesc: 'écris-moi à lea.martin@exemple.fr ou au 06 12 34 56 78' } });
      return !/lea\.martin|06 12/.test(t) && /\[adresse masquée\]/.test(t) && /\[numéro masqué\]/.test(t);
    } },
  { nom: 'les idées d’un auteur sont décrites une par une',
    temoin: remplace("s += `Idée ${i + 1} :\\n`;", ''),
    f: R => /Idée 1 :\n  notion : travail\n  oeuvre : La Condition ouvrière/.test(
      R.texteBoite({ categorie: 'auteur', cible: 'auteur', fields: { nom: 'Weil', ideas: [{ notion: 'travail', oeuvre: 'La Condition ouvrière' }] } })) },
  { nom: 'verdict lu, même entouré de ```json',
    temoin: remplace("if (brut.slice(0, 4).toLowerCase() === 'json') brut = brut.slice(4);", ''),
    f: R => {
      const v = R.lireVerdict('```json\n{"verdict":"rejet","review":"hors sujet","message_contributeur":"Merci !"}\n```');
      return v.verdict === 'rejet' && v.avis === 'hors sujet' && v.message === 'Merci !';
    } },
  { nom: 'réponse illisible ou verdict inconnu : « douteux », jamais une erreur',
    temoin: remplace("if (!VERDICTS.includes(o.verdict))", 'if (false)'),
    f: R => R.lireVerdict('pas du JSON').verdict === 'douteux' && R.lireVerdict('{"verdict":"parfait"}').verdict === 'douteux' },
  { nom: 'avis au contributeur : « Partie n » seulement si plusieurs boîtes',
    temoin: remplace("if ((boites || []).length === 1) return String(avec[0].ia_message).trim();", ''),
    f: R => R.avisContributeur([{ rang: 0, ia_message: 'Merci !' }]) === 'Merci !'
      && R.avisContributeur([{ rang: 1, ia_message: 'B' }, { rang: 0, ia_message: 'A' }, { rang: 2, ia_message: null }]) === 'Partie 1 : A\nPartie 2 : B'
      && R.avisContributeur([{ rang: 0, ia_message: '' }]) === null },
  { nom: 'quota du jour : on arrête ; quota par minute : on attend (30 s au plus)',
    temoin: remplace("if (/perday/i.test(t.replace(/[^a-z]/gi, ''))) return null;", ''),
    f: R => R.attenteQuota('GenerateRequestsPerDayPerProjectPerModel-FreeTier') === null
      && R.attenteQuota('Please retry in 26.5s') === 27.5 && R.attenteQuota('retry in 90s') === 30 },
  { nom: 'l’avis est demandé en français (consigne et texte de la boîte)',
    temoin: src => remplace('Écris TOUJOURS en français', 'Écris')(remplace('(Réponds en français.)\\n', '')(src)),
    f: R => /TOUJOURS en français/.test(R.CONSIGNE) && R.texteBoite({ categorie: 'notion', fields: {} }).startsWith('(Réponds en français.)') },
];

let ko = 0;
for (const e of ESSAIS) {
  const ok = await charger(SOURCE).then(e.f).catch(err => { console.log('   erreur : ' + err.message); return false; });
  let vu;
  try { vu = !(await charger(e.temoin(SOURCE)).then(e.f).catch(() => false)); } catch (err) { vu = false; console.log('   ' + err.message); }
  console.log(`${ok ? 'ok ' : 'KO '} ${e.nom}  ·  témoin ${vu ? 'vu' : 'PAS VU'}`);
  if (!ok || !vu) ko++;
}
console.log(ko ? '\nÀ CORRIGER' : '\ncohérent');
process.exit(ko ? 1 : 0);
