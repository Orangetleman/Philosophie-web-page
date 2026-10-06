#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════
   verifier_contenu.mjs — contrôle de cohérence du contenu (data.js)
   ────────────────────────────────────────────────────────────────────
   Modèle : verifier_corpus.py de Fiches BUT. Une ligne par question,
   puis « cohérent » (sortie 0) ou « À CORRIGER » avec la liste des
   erreurs (sortie 1). Les AVERTISSEMENTS sont affichés sans bloquer.

     node outils/verifier_contenu.mjs            contrôle du dépôt
     node outils/verifier_contenu.mjs --temoins  contrôle + TÉMOINS :
         pour chaque question, une faute est glissée exprès dans une copie
         des données ; la question DOIT la voir. Un témoin qui passe
         inaperçu fait sortir 1 : un contrôle qui ne voit rien ne prouve rien.

   Aucune dépendance : Node seul. data.js est un script classique (des
   const globales) : on l'exécute dans un bac à sable (module vm) pour en
   lire D, KEYS, AM, CONCEPTS et PROGRAMME (la liste officielle, étape 4). index.html n'est lu que pour la table
   AUTHOR_ALIASES (formes de noms acceptées dans les dialogues).

   Depuis l'étape 3, data.js est GÉNÉRÉ par outils/construire.mjs (qui lance
   ce contrôle à la fin) ; la question 10 vérifie qu'il l'a bien été.
   Les règles viennent de CLAUDE.md et de docs/protocole-contenu.md. Une
   règle nouvelle = une question nouvelle ici, avec son témoin.
   ════════════════════════════════════════════════════════════════════ */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

// --racine <dossier> : contrôler une autre copie du site (ex. un ancien état).
const iR = process.argv.indexOf('--racine');
const RACINE = iR > 0 ? path.resolve(process.argv[iR + 1]) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES_RELATION = ['oppose', 'prolonge', 'complete', 'repond', 'distinction', 'implique'];
const DIRS_DIALOGUE = ['oppose', 'prolonge', 'repond'];
// Traces d'un support de cours : une source se cite par son œuvre, jamais
// par le numéro d'un recueil ou d'un polycopié (protocole, § 2).
const TRACE_COURS = /\bTEXTES? ?\d|\bpolycopi|\bfiche du prof|\bvu en cours\b/i;

/* charger() — lit data.js (et AUTHOR_ALIASES d'index.html). Lève une
   erreur lisible si le fichier ne s'exécute pas (faute de syntaxe…). */
function charger() {
  const src = fs.readFileSync(path.join(RACINE, 'data.js'), 'utf8');
  const bac = {};
  vm.createContext(bac);
  // PROGRAMME n'existe que depuis l'étape 4 : une copie plus ancienne (--racine)
  // se charge quand même, et la question 11 dit ce qui manque.
  const data = vm.runInContext(src + "\n;({D, KEYS, AM, CONCEPTS, PROGRAMME: typeof PROGRAMME === 'undefined' ? null : PROGRAMME})", bac, { filename: 'data.js' });
  // AUTHOR_ALIASES vit dans le code du site : js/*.js depuis l'étape 3 (avant,
  // dans index.html, encore lu pour contrôler une ancienne copie via --racine).
  const dJs = path.join(RACINE, 'js');
  const code = fs.existsSync(dJs)
    ? fs.readdirSync(dJs).filter(f => f.endsWith('.js')).map(f => fs.readFileSync(path.join(dJs, f), 'utf8')).join('\n')
    : fs.readFileSync(path.join(RACINE, 'index.html'), 'utf8');
  const m = code.replace(/\r\n/g, '\n').match(/const AUTHOR_ALIASES=(\{[\s\S]*?\n\});/);
  if (!m) throw new Error('AUTHOR_ALIASES introuvable dans js/ (ou index.html)');
  data.ALIASES = m ? vm.runInNewContext('(' + m[1] + ')') : {};
  return data;
}

/* Petits outils de parcours. */
const texte = s => String(s == null ? '' : s);
function auteursDe(D, KEYS) {               // [{k, a}] pour chaque entrée d'auteur
  const out = [];
  KEYS.forEach(k => (D[k] && D[k].auteurs || []).forEach(a => out.push({ k, a })));
  return out;
}
function citationsDe(a) {                   // citations d'une entrée, formats ancien et nouveau
  if (a.ideas) return a.ideas.flatMap(i => i.citations || (i.q ? [i.q] : []));
  return a.q ? [a.q] : [];
}
/* Toutes les chaînes de l'objet, avec leur chemin (pour la recherche de traces). */
function chaines(obj, chemin, out) {
  if (typeof obj === 'string') out.push([chemin, obj]);
  else if (Array.isArray(obj)) obj.forEach((v, i) => chaines(v, chemin + '[' + i + ']', out));
  else if (obj && typeof obj === 'object') Object.keys(obj).forEach(k => chaines(obj[k], chemin + '.' + k, out));
  return out;
}

/* ── Les questions ─────────────────────────────────────────────────────
   Chacune reçoit les données et renvoie {err:[…], warn:[…]}. */
const QUESTIONS = [
  { n: 1, titre: "KEYS liste exactement les notions de D, sans doublon",
    f({ D, KEYS }) {
      const err = [];
      const cles = Object.keys(D);
      cles.filter(k => !KEYS.includes(k)).forEach(k => err.push(`notion « ${k} » absente de KEYS (elle serait masquée)`));
      KEYS.filter(k => !D[k]).forEach(k => err.push(`KEYS cite « ${k} », qui n'existe pas dans D`));
      KEYS.filter((k, i) => KEYS.indexOf(k) !== i).forEach(k => err.push(`« ${k} » deux fois dans KEYS`));
      return { err, warn: [] };
    } },
  { n: 2, titre: "chaque notion a ses champs de base et des liens vers des notions existantes",
    f({ D, KEYS }) {
      const err = [];
      KEYS.filter(k => D[k]).forEach(k => {
        const n = D[k];
        ['c', 'l', 's', 'def'].forEach(ch => { if (!texte(n[ch]).trim()) err.push(`${k} : champ « ${ch} » vide`); });
        (n.liens || []).forEach(l => { if (!D[l] && !Object.values(D).some(x => x.l === l)) err.push(`${k} : lien vers « ${l} », notion inconnue`); });
      });
      return { err, warn: [] };
    } },
  { n: 3, titre: "chaque concept a un id et un terme uniques",
    f({ CONCEPTS }) {
      const err = [], ids = {}, termes = {};
      CONCEPTS.forEach((c, i) => {
        if (!c.id) err.push(`concept n° ${i} sans id`);
        if (!texte(c.term).trim()) err.push(`concept « ${c.id} » sans terme`);
        (ids[c.id] = ids[c.id] || []).push(i);
        const t = texte(c.term).toLowerCase().trim();
        (termes[t] = termes[t] || []).push(c.id);
      });
      Object.entries(ids).filter(([, v]) => v.length > 1).forEach(([id, v]) => err.push(`id « ${id} » porté par ${v.length} concepts (une seule carte de quiz pour deux fiches)`));
      Object.entries(termes).filter(([, v]) => v.length > 1).forEach(([t, v]) => err.push(`terme « ${t} » porté par ${v.join(', ')}`));
      return { err, warn: [] };
    } },
  { n: 4, titre: "chaque concept a une définition, des notions existantes et des relations valides",
    f({ D, CONCEPTS }) {
      const err = [], ids = new Set(CONCEPTS.map(c => c.id));
      CONCEPTS.forEach(c => {
        if (!texte(c.def).trim()) err.push(`${c.id} : définition vide`);
        if (!(c.notions || []).length) err.push(`${c.id} : aucune notion`);
        (c.notions || []).forEach(k => { if (!D[k]) err.push(`${c.id} : notion inconnue « ${k} »`); });
        (c.relations || []).forEach(r => {
          if (!TYPES_RELATION.includes(r.type)) err.push(`${c.id} : relation de type inconnu « ${r.type} »`);
          if (r.to && !ids.has(r.to)) err.push(`${c.id} : relation vers « ${r.to} », concept inconnu`);
        });
      });
      return { err, warn: [] };
    } },
  { n: 5, titre: "chaque repère suit le format du programme (id rep-…, au moins une distinction)",
    f({ CONCEPTS }) {
      const err = [];
      CONCEPTS.filter(c => c.cat === 'Repère').forEach(c => {
        if (!c.id.startsWith('rep-')) err.push(`repère « ${c.term} » : id « ${c.id} » sans préfixe rep-`);
        if (!(c.relations || []).some(r => r.type === 'distinction') && !(c.tensions || []).length)
          err.push(`repère « ${c.term} » : aucune relation de type distinction`);
      });
      return { err, warn: [] };
    } },
  { n: 6, titre: "chaque auteur des notions a sa fiche AM, sous le même nom",
    f({ D, KEYS, AM, ALIASES }) {
      const err = [], warn = [];
      const noms = new Set(auteursDe(D, KEYS).map(x => x.a.n));
      [...noms].filter(n => !AM[n]).forEach(n => err.push(`« ${n} » est cité dans les notions mais n'a pas d'entrée AM (fiche sans bio)`));
      Object.keys(AM).filter(n => !noms.has(n)).forEach(n => {
        const alias = /^Voir /.test(texte(AM[n].bio));
        if (!alias && !ALIASES[n]) warn.push(`AM « ${n} » ne correspond à aucun auteur des notions (bio jamais affichée ?)`);
      });
      return { err, warn };
    } },
  { n: 7, titre: "les dialogues entre auteurs ont un sens connu et une cible identifiable",
    f({ D, KEYS, AM, ALIASES }) {
      const err = [], warn = [];
      const connus = new Set([...Object.keys(AM), ...auteursDe(D, KEYS).map(x => x.a.n), ...Object.keys(ALIASES)]);
      Object.entries(AM).forEach(([n, m]) => (m.dialogues || []).forEach(d => {
        if (!DIRS_DIALOGUE.includes(d.dir)) err.push(`${n} : dialogue de sens inconnu « ${d.dir} »`);
        if (!connus.has(d.auteur)) warn.push(`${n} → « ${d.auteur} » : auteur sans fiche (texte mort tant qu'il n'en a pas)`);
      }));
      return { err, warn };
    } },
  { n: 8, titre: "les citations exactes sont entre guillemets français",
    f({ D, KEYS }) {
      const err = [], warn = [];
      auteursDe(D, KEYS).forEach(({ k, a }) => citationsDe(a).forEach(c => {
        const t = texte(c).replace(/<[^>]+>/g, '').trim();
        if (/^'|'$/.test(t)) err.push(`${k} / ${a.n} : citation entre apostrophes droites : ${t.slice(0, 60)}`);
        const o = (t.match(/«/g) || []).length, f = (t.match(/»/g) || []).length;
        if (o !== f) err.push(`${k} / ${a.n} : guillemets « » déséquilibrés : ${t.slice(0, 60)}`);
        if (t && !/[«“]/.test(t)) warn.push(`${k} / ${a.n} : reformulation (sans guillemets, hors quiz) : ${t.slice(0, 60)}`);
      }));
      return { err, warn };
    } },
  { n: 9, titre: "aucune trace de support de cours (« TEXTE 9 », polycopié…)",
    f(data) {
      const err = [];
      ['D', 'AM', 'CONCEPTS'].forEach(nom => chaines(data[nom], nom, []).forEach(([ch, s]) => {
        const m = s.match(TRACE_COURS);
        if (m) err.push(`${ch} : « ${m[0]} » (${s.slice(Math.max(0, m.index - 25), m.index + 20)})`);
      }));
      return { err, warn: [] };
    } },
  { n: 10, titre: "data.js est au format canonique (produit par le build)",
    f({ D, KEYS, CONCEPTS }) {
      const err = [];
      KEYS.filter(k => D[k]).forEach(k => {
        if (D[k].axes) err.push(`${k} : champ « axes » (ancien format, à convertir en plans)`);
        (D[k].auteurs || []).forEach(a => {
          if (!Array.isArray(a.ideas)) err.push(`${k} / ${a.n} : entrée d'auteur à plat (sans ideas)`);
          else a.ideas.forEach(i => { if (!Array.isArray(i.citations) || i.q !== undefined) err.push(`${k} / ${a.n} : idée sans citations[] ou avec l'ancien q`); });
        });
      });
      CONCEPTS.forEach(c => { if (c.tensions) err.push(`${c.id} : champ « tensions » (ancien format)`); });
      if (err.length) err.push('data.js doit être produit par « node outils/construire.mjs », pas édité à la main');
      return { err, warn: [] };
    } },
  /* 11 (étape 4) — le programme officiel est couvert : chaque notion du
     programme existe, chaque auteur de la liste a sa fiche ET au moins une
     idée dans une notion (sinon il n'apparaît nulle part sur le site). */
  { n: 11, titre: "le programme officiel est couvert (17 notions, 84 auteurs avec fiche et idées)",
    f({ D, KEYS, AM, PROGRAMME }) {
      const err = [], warn = [];
      if (!PROGRAMME) return { err: ['PROGRAMME absent de data.js (contenu/programme.js, puis le build)'], warn };
      PROGRAMME.notions.filter(k => !KEYS.includes(k)).forEach(k => err.push(`notion du programme « ${k} » absente de KEYS`));
      const cites = new Set(auteursDe(D, KEYS).map(({ a }) => a.n));
      const vus = new Set();
      PROGRAMME.auteurs.forEach(({ bo, fiches }) => fiches.forEach(nom => {
        if (vus.has(nom)) err.push(`« ${nom} » figure deux fois dans la liste officielle`);
        vus.add(nom);
        if (!AM[nom]) err.push(`${bo} : pas de fiche AUTEUR("${nom}")`);
        if (!cites.has(nom)) err.push(`${bo} : « ${nom} » n'a aucune idée dans une notion`);
      }));
      if (PROGRAMME.notions.length !== 17) warn.push(`${PROGRAMME.notions.length} notions au programme (le BO en compte 17)`);
      if (PROGRAMME.auteurs.length !== 84) warn.push(`${PROGRAMME.auteurs.length} auteurs au programme (le BO en compte 84)`);
      return { err, warn };
    } },
];

/* ── Les témoins : une faute par question, glissée dans une COPIE ────── */
const TEMOINS = {
  1: d => { d.KEYS.pop(); },
  2: d => { d.D[d.KEYS[0]].liens = ['notion-qui-n-existe-pas']; },
  3: d => { d.CONCEPTS.push(Object.assign({}, d.CONCEPTS[0])); },
  4: d => { d.CONCEPTS[0].relations = [{ to: 'concept-imaginaire', type: 'oppose', desc: '' }]; },
  5: d => { const r = d.CONCEPTS.find(c => c.cat === 'Repère'); r.relations = []; r.tensions = []; },
  6: d => { d.D[d.KEYS[0]].auteurs.push({ n: 'Auteur Fantôme', ideas: [{ w: '', i: 'x', citations: [] }] }); },
  7: d => { Object.values(d.AM)[0].dialogues = [{ dir: 'ignore', auteur: 'Kant', sujet: '', desc: '' }]; },
  8: d => { d.D[d.KEYS[0]].auteurs.push({ n: 'Kant', w: '', i: 'x', q: "'Une citation mal guillemetée'" }); },
  9: d => { d.D[d.KEYS[0]].auteurs[0].w = 'Une œuvre, 1900 (TEXTE 4)'; },
  10: d => { d.CONCEPTS[0].tensions = ['A ≠ B']; },
  11: d => { d.KEYS.forEach(k => { d.D[k].auteurs = d.D[k].auteurs.filter(a => a.n !== 'Montaigne'); }); },
};

function lancer(data) {
  const res = QUESTIONS.map(q => ({ q, ...q.f(data) }));
  return res;
}

function main() {
  const avecTemoins = process.argv.includes('--temoins');
  let data;
  try { data = charger(); }
  catch (e) {
    console.log('  0. data.js se charge ............ NON');
    console.log('\nÀ CORRIGER\n  - ' + e.message);
    process.exit(1);
  }
  console.log('  0. data.js se charge ............ ok');
  const res = lancer(data);
  let nErr = 0, nWarn = 0;
  res.forEach(({ q, err, warn }) => {
    nErr += err.length; nWarn += warn.length;
    const etat = err.length ? `${err.length} erreur(s)` : 'ok';
    console.log(`  ${q.n}. ${q.titre} ${'.'.repeat(Math.max(2, 72 - q.titre.length))} ${etat}${warn.length ? ` · ${warn.length} avertissement(s)` : ''}`);
  });

  // Témoins : chaque faute glissée doit faire réagir SA question.
  let temoinsRates = [];
  if (avecTemoins) {
    console.log('\nTémoins (une faute glissée par question) :');
    QUESTIONS.forEach(q => {
      const copie = charger();               // copie fraîche, indépendante
      TEMOINS[q.n](copie);
      const vu = q.f(copie).err.length > q.f(charger()).err.length;
      console.log(`  ${q.n}. ${vu ? 'vu' : 'PAS VU'}`);
      if (!vu) temoinsRates.push(q.n);
    });
  }

  if (nWarn) {
    console.log('\nAvertissements (ne bloquent pas) :');
    res.forEach(({ q, warn }) => warn.forEach(w => console.log(`  [${q.n}] ${w}`)));
  }
  if (nErr || temoinsRates.length) {
    console.log('\nÀ CORRIGER');
    res.forEach(({ q, err }) => err.forEach(e => console.log(`  [${q.n}] ${e}`)));
    temoinsRates.forEach(n => console.log(`  [témoin ${n}] la faute glissée n'a pas été vue : la question ${n} ne contrôle rien`));
    process.exit(1);
  }
  console.log('\ncohérent');
}

main();
