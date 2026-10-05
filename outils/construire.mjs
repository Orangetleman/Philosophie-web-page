#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════
   construire.mjs — le BUILD léger du site (étape 3, octobre 2026)
   ────────────────────────────────────────────────────────────────────
   Les sources :
     contenu/   le contenu (un fichier par notion, par auteur, concepts,
                repères, ordre des notions) ;
     js/, css/  le code du site, en morceaux numérotés.
   Ce script :
     1. charge contenu/ (des appels NOTION(…), AUTEUR(…), CONCEPT(…),
        REPERE(…), ORDRE(…) exécutés dans un bac à sable) ;
     2. le convertit au format canonique (outils/lib/formats.mjs : anciens
        formats d'auteur, axes → plans, tensions → relations) ;
     3. écrit data.js (le fichier de données que le site charge) ;
     4. recolle js/*.js en app.js et css/*.css en app.css, dans l'ordre des
        noms : UN seul script, comme l'ancien <script> d'index.html, donc
        les fonctions restent visibles d'un morceau à l'autre ; la syntaxe
        d'app.js est vérifiée (une faute arrête le build, avec le fichier
        source et sa ligne) ;
     5. recalcule CACHE et PRECACHE de sw.js : la version est une empreinte
        du contenu des fichiers précachés (plus de philo-vN à incrémenter) ;
     6. lance outils/verifier_contenu.mjs : un contenu incohérent fait
        échouer le build (sortie 1).

     node outils/construire.mjs              construire
     node outils/construire.mjs --controle   ne rien écrire ; sortie 1 si
                                             data.js, app.js, app.css ou sw.js
                                             ne sont pas à jour (hook de commit)
     node outils/construire.mjs --temoins    prouve que le contrôle de syntaxe
                                             voit une faute glissée exprès

   data.js, app.js, app.css et sw.js sont GÉNÉRÉS mais VERSIONNÉS (comme le
   site/ de Fiches BUT) : Vercel n'a rien à construire, et ouvrir index.html
   par double-clic marche encore. Node seul, aucune dépendance.
   ════════════════════════════════════════════════════════════════════ */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import crypto from 'crypto';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { normaliserNotion, normaliserConcept } from './lib/formats.mjs';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENU = path.join(RACINE, 'contenu');
const CONTROLE = process.argv.includes('--controle');

// Fichiers mis en cache par le service worker pour le hors-ligne. Ajouter ici
// toute ressource statique nouvelle : sw.js et sa version suivent tout seuls.
export const PRECACHE = ['./', './index.html', './app.css', './app.js', './data.js', './manifest.json', './icon.svg'];

const echec = m => { console.error('ÉCHEC : ' + m); process.exit(1); };
const lireTexte = f => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');

/* chargerSources() — exécute chaque fichier de contenu/ avec des collecteurs
   et renvoie {ordre, notions:{cle→objet}, auteurs:{nom→objet}, concepts:[], reperes:[]}. */
export function chargerSources() {
  const s = { ordre: null, notions: {}, auteurs: {}, concepts: [], reperes: [] };
  const bac = {
    ORDRE: cles => { if (s.ordre) echec('ORDRE déclaré deux fois'); s.ordre = cles; },
    NOTION: (cle, n) => { if (s.notions[cle]) echec(`notion « ${cle} » déclarée deux fois`); s.notions[cle] = n; },
    AUTEUR: (nom, a) => { if (s.auteurs[nom]) echec(`auteur « ${nom} » déclaré deux fois`); s.auteurs[nom] = a; },
    CONCEPT: c => s.concepts.push(c),
    REPERE: c => s.reperes.push(c),
  };
  vm.createContext(bac);
  const jouer = f => {
    try { vm.runInContext(lireTexte(f), bac, { filename: path.relative(RACINE, f) }); }
    catch (e) { echec(`${path.relative(RACINE, f)} ne s'exécute pas : ${e.message}`); }
  };
  jouer(path.join(CONTENU, 'ordre.js'));
  for (const dossier of ['notions', 'auteurs']) {
    fs.readdirSync(path.join(CONTENU, dossier)).filter(f => f.endsWith('.js')).sort()
      .forEach(f => jouer(path.join(CONTENU, dossier, f)));
  }
  jouer(path.join(CONTENU, 'concepts.js'));
  jouer(path.join(CONTENU, 'reperes.js'));
  if (!s.ordre) echec('contenu/ordre.js ne déclare pas ORDRE([...])');
  Object.keys(s.notions).filter(k => !s.ordre.includes(k)).forEach(k => echec(`notion « ${k} » absente de ORDRE (contenu/ordre.js)`));
  s.ordre.filter(k => !s.notions[k]).forEach(k => echec(`ORDRE cite « ${k} », sans fichier contenu/notions/${k}.js`));
  return s;
}

/* assembler(s) — les données canoniques, dans l'ordre attendu par le site. */
export function assembler(s) {
  const D = {};
  s.ordre.forEach(k => { D[k] = normaliserNotion(s.notions[k]); });
  const AM = {};
  Object.keys(s.auteurs).sort((a, b) => a.localeCompare(b, 'fr')).forEach(n => { AM[n] = s.auteurs[n]; });
  const CONCEPTS = s.concepts.concat(s.reperes).map(normaliserConcept);
  return { D, KEYS: s.ordre.slice(), AM, CONCEPTS };
}

/* ecrireData(d) — le texte de data.js : un élément par ligne (diffs lisibles). */
export function ecrireData({ D, KEYS, AM, CONCEPTS }) {
  const j = v => JSON.stringify(v);
  return [
    '/* data.js — GÉNÉRÉ par outils/construire.mjs à partir de contenu/. NE PAS ÉDITER :',
    '   modifier les fichiers de contenu/, puis lancer « node outils/construire.mjs ».',
    '   Chargé en <script src> AVANT app.js : D, KEYS, AM, CONCEPTS deviennent des',
    '   globales, déjà au format canonique (cf. CLAUDE.md). */',
    'const D={',
    KEYS.map(k => j(k) + ':' + j(D[k])).join(',\n'),
    '};',
    'const KEYS=' + j(KEYS) + ';',
    'const AM={',
    Object.keys(AM).map(n => j(n) + ':' + j(AM[n])).join(',\n'),
    '};',
    'const CONCEPTS=[',
    CONCEPTS.map(j).join(',\n'),
    '];',
    ''
  ].join('\n');
}

/* recoller(dossier, ext, entete) — les morceaux d'un dossier, dans l'ordre
   des noms, en un seul texte. Renvoie {texte, plan} ; plan = [[source,
   1re ligne du morceau dans le texte], …] pour retrouver la source d'une erreur. */
export function recoller(dossier, ext, entete) {
  const d = path.join(RACINE, dossier);
  const noms = fs.readdirSync(d).filter(f => f.endsWith(ext)).sort();
  if (!noms.length) echec(`aucun fichier ${ext} dans ${dossier}/`);
  let texte = entete;
  const plan = [];
  noms.forEach(n => {
    plan.push([dossier + '/' + n, texte.split('\n').length]);
    texte += lireTexte(path.join(d, n)).replace(/\n*$/, '\n');
  });
  return { texte, plan };
}

/* syntaxe(app) — compile app.js SANS l'exécuter (vm.Script). Renvoie null si
   tout va bien, sinon « js/fichier.js:ligne : message ». */
export function syntaxe(app) {
  try { new vm.Script(app.texte, { filename: 'app.js' }); return null; }
  catch (e) {
    const m = String(e.stack || '').match(/app\.js:(\d+)/);
    const ligne = m ? +m[1] : 0;
    const morceau = app.plan.filter(([, l]) => l <= ligne).pop() || ['app.js', 1];
    return `${morceau[0]}:${ligne - morceau[1] + 1} : ${e.message}`;
  }
}

/* versionCache(contenus) — empreinte (sha256, 10 caractères) du contenu des
   fichiers précachés : la version du cache change dès qu'un d'eux change. */
function versionCache(contenus) {
  const h = crypto.createHash('sha256');
  contenus.forEach(([nom, txt]) => { h.update(nom + '\0'); h.update(txt); h.update('\0'); });
  return 'philo-' + h.digest('hex').slice(0, 10);
}

/* ecrireSw(sw, produits) — sw.js avec PRECACHE et CACHE à jour ; les fichiers
   générés sont pris dans `produits` (leur nouvelle version), les autres sur disque. */
function ecrireSw(sw, produits) {
  const contenus = PRECACHE.filter(f => f !== './').map(f => {
    const nom = f.replace(/^\.\//, '');
    return [nom, produits[nom] !== undefined ? produits[nom] : lireTexte(path.join(RACINE, nom))];
  });
  if (!/^const CACHE = '[^']*';$/m.test(sw) || !/^const PRECACHE = \[[^\n]*\];$/m.test(sw))
    echec('sw.js : lignes « const CACHE = … » / « const PRECACHE = … » introuvables');
  return sw
    .replace(/^const CACHE = '[^']*';$/m, `const CACHE = '${versionCache(contenus)}';   // version calculée par outils/construire.mjs : ne pas éditer`)
    .replace(/^const PRECACHE = \[[^\n]*\];$/m, 'const PRECACHE = [' + PRECACHE.map(f => `'${f}'`).join(', ') + '];');
}

const ENTETE_JS = "/* app.js — GÉNÉRÉ par outils/construire.mjs : js/*.js recollés dans l'ordre des noms.\n   NE PAS ÉDITER : modifier js/, puis lancer « node outils/construire.mjs ». */\n";
const ENTETE_CSS = "/* app.css — GÉNÉRÉ par outils/construire.mjs : css/*.css recollés dans l'ordre des noms.\n   NE PAS ÉDITER : modifier css/, puis lancer « node outils/construire.mjs ». */\n";

function main() {
  const app = recoller('js', '.js', ENTETE_JS);
  if (process.argv.includes('--temoins')) {
    const vu = syntaxe({ texte: app.texte.replace('function ', 'function = '), plan: app.plan });
    console.log(vu ? 'témoin de syntaxe vu : ' + vu : 'témoin de syntaxe PAS VU');
    process.exit(vu ? 0 : 1);
  }
  const faute = syntaxe(app);
  if (faute) echec('erreur de syntaxe dans ' + faute);

  const produits = {
    'data.js': ecrireData(assembler(chargerSources())),
    'app.js': app.texte,
    'app.css': recoller('css', '.css', ENTETE_CSS).texte,
  };
  const fSw = path.join(RACINE, 'sw.js');
  produits['sw.js'] = ecrireSw(lireTexte(fSw).replace(/[ \t]*\/\/ version calculée[^\n]*/, ''), produits);

  // La carte du projet : ses refs « fichier:ligne » suivent le code (étape 3).
  const carte = args => spawnSync(process.execPath, [path.join(RACINE, 'docs', 'carte', 'verifie.mjs'), ...args], { encoding: 'utf8' });

  if (CONTROLE) {
    const perimes = Object.keys(produits).filter(n => !fs.existsSync(path.join(RACINE, n)) || lireTexte(path.join(RACINE, n)) !== produits[n]);
    if (carte([]).status !== 0) perimes.push('docs/carte/carte.data.js (refs)');
    if (perimes.length) { console.error(perimes.join(', ') + ' pas à jour : lancer « node outils/construire.mjs ».'); process.exit(1); }
    console.log('data.js, app.js, app.css, sw.js et la carte sont à jour.');
    return;
  }
  Object.entries(produits).forEach(([n, t]) => fs.writeFileSync(path.join(RACINE, n), t));
  const ko = n => Math.round(produits[n].length / 1024) + ' Ko';
  console.log(`écrits : data.js (${ko('data.js')}), app.js (${ko('app.js')}), app.css (${ko('app.css')}), sw.js (${produits['sw.js'].match(/const CACHE = '([^']*)'/)[1]})`);

  const c = carte(['--corriger']);
  console.log(c.stdout.trim().split('\n').filter(l => /symboles|PÉRIMÉ/.test(l)).join('\n'));
  if (c.status !== 0) { console.error('La carte cite des symboles qui n\'existent plus : build en échec (docs/carte/MAJ.md).'); process.exit(1); }

  const v = spawnSync(process.execPath, [path.join(RACINE, 'outils', 'verifier_contenu.mjs')], { encoding: 'utf8' });
  process.stdout.write(v.stdout); process.stderr.write(v.stderr || '');
  if (v.status !== 0) { console.error('\nLe contenu n\'est pas cohérent : build en échec.'); process.exit(1); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
