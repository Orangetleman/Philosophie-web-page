#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════
   construire.mjs — le BUILD léger du site (étape 3, octobre 2026)
   ────────────────────────────────────────────────────────────────────
   Le contenu s'écrit dans contenu/ (un fichier par notion, par auteur, un
   pour les concepts, un pour les repères, un pour l'ordre des notions).
   Ce script :
     1. charge ces sources (des appels NOTION(…), AUTEUR(…), CONCEPT(…),
        REPERE(…), ORDRE(…) exécutés dans un bac à sable) ;
     2. les convertit au format canonique (outils/lib/formats.mjs : anciens
        formats d'auteur, axes → plans, tensions → relations) ;
     3. écrit data.js (le fichier que le site charge : GÉNÉRÉ, ne pas l'éditer) ;
     4. recalcule la version du cache du service worker (sw.js) à partir du
        contenu des fichiers précachés : plus besoin d'incrémenter philo-vN
        à la main, et un fichier changé change forcément la version ;
     5. lance outils/verifier_contenu.mjs : un contenu incohérent fait
        échouer le build (sortie 1).

     node outils/construire.mjs              construire
     node outils/construire.mjs --controle   ne rien écrire : sortie 1 si
                                             data.js ou sw.js ne sont pas à
                                             jour (utilisé par le hook de commit)

   Comme pour Fiches BUT, la sortie (data.js, sw.js) est VERSIONNÉE : Vercel
   n'a rien à construire, et ouvrir index.html par double-clic marche encore.
   Node seul, aucune dépendance.
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
export const PRECACHE = ['./', './index.html', './data.js', './manifest.json', './icon.svg'];

const echec = m => { console.error('ÉCHEC : ' + m); process.exit(1); };
const lireTexte = f => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');

/* chargerSources() — exécute chaque fichier de contenu/ avec des collecteurs
   et renvoie {ordre, notions:{cle→objet}, auteurs:{nom→objet}, concepts:[], reperes:[]}. */
export function chargerSources() {
  const s = { ordre: null, notions: {}, auteurs: {}, concepts: [], reperes: [] };
  const fichierDe = {};
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
      .forEach(f => { jouer(path.join(CONTENU, dossier, f)); fichierDe[f] = dossier; });
  }
  jouer(path.join(CONTENU, 'concepts.js'));
  jouer(path.join(CONTENU, 'reperes.js'));
  if (!s.ordre) echec('contenu/ordre.js ne déclare pas ORDRE([...])');
  const cles = Object.keys(s.notions);
  cles.filter(k => !s.ordre.includes(k)).forEach(k => echec(`notion « ${k} » absente de ORDRE (contenu/ordre.js)`));
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
    '   Chargé en <script src> AVANT le script principal : D, KEYS, AM, CONCEPTS',
    '   deviennent des globales, déjà au format canonique (cf. CLAUDE.md). */',
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

/* versionCache(fichiers) — empreinte (sha256, 10 caractères) du contenu des
   fichiers précachés : la version du cache change dès qu'un d'eux change. */
function versionCache(contenus) {
  const h = crypto.createHash('sha256');
  contenus.forEach(([nom, txt]) => { h.update(nom + '\0'); h.update(txt); h.update('\0'); });
  return 'philo-' + h.digest('hex').slice(0, 10);
}

/* ecrireSw(sw, dataTxt) — sw.js avec PRECACHE et CACHE à jour. */
function ecrireSw(sw, dataTxt) {
  const contenus = PRECACHE.filter(f => f !== './').map(f => {
    const nom = f.replace(/^\.\//, '');
    return [nom, nom === 'data.js' ? dataTxt : lireTexte(path.join(RACINE, nom))];
  });
  const cache = versionCache(contenus);
  if (!/^const CACHE = '[^']*';$/m.test(sw) || !/^const PRECACHE = \[[^\n]*\];$/m.test(sw))
    echec('sw.js : lignes « const CACHE = … » / « const PRECACHE = … » introuvables');
  return sw
    .replace(/^const CACHE = '[^']*';$/m, `const CACHE = '${cache}';   // version calculée par outils/construire.mjs : ne pas éditer`)
    .replace(/^const PRECACHE = \[[^\n]*\];$/m, 'const PRECACHE = [' + PRECACHE.map(f => `'${f}'`).join(', ') + '];');
}

function main() {
  const dataTxt = ecrireData(assembler(chargerSources()));
  const swTxt = ecrireSw(lireTexte(path.join(RACINE, 'sw.js')).replace(/\s*\/\/ version calculée[^\n]*/, ''), dataTxt);
  const fData = path.join(RACINE, 'data.js'), fSw = path.join(RACINE, 'sw.js');

  if (CONTROLE) {
    const ok = lireTexte(fData) === dataTxt && lireTexte(fSw) === swTxt;
    if (!ok) { console.error('data.js ou sw.js ne sont pas à jour : lancer « node outils/construire.mjs ».'); process.exit(1); }
    console.log('data.js et sw.js sont à jour.');
    return;
  }
  fs.writeFileSync(fData, dataTxt);
  fs.writeFileSync(fSw, swTxt);
  console.log(`data.js écrit (${Math.round(dataTxt.length / 1024)} Ko) ; sw.js : ${swTxt.match(/const CACHE = '([^']*)'/)[1]}`);

  const v = spawnSync(process.execPath, [path.join(RACINE, 'outils', 'verifier_contenu.mjs')], { encoding: 'utf8' });
  process.stdout.write(v.stdout); process.stderr.write(v.stderr || '');
  if (v.status !== 0) { console.error('\nLe contenu n\'est pas cohérent : build en échec.'); process.exit(1); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
