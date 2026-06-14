#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════
   frise.gen.mjs — génère docs/carte/frise.data.js depuis l'historique git.

   Usage :  node docs/carte/frise.gen.mjs

   Lit `git log` (aucune dépendance, pas besoin de GitHub) et écrit
   `window.FRISE = { genere_le, commits:[{hash, short, auteur, date, sujet,
   corps, tag}] }`. À relancer quand on veut rafraîchir la frise après de
   nouveaux commits. frise.html lit ce fichier (hors-ligne, par double-clic).
   ════════════════════════════════════════════════════════════════════ */
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));   // docs/carte
const out = path.join(here, 'frise.data.js');

// %x1f = séparateur de champ, %x1e = séparateur d'enregistrement
const FMT = '%H%x1f%an%x1f%ad%x1f%s%x1f%b%x1e';
let raw = '';
try {
  raw = execSync('git log --date=iso-strict --pretty=format:' + JSON.stringify(FMT), {
    cwd: here, maxBuffer: 64 * 1024 * 1024, encoding: 'utf8'
  });
} catch (e) {
  console.error('git log a échoué :', e.message); process.exit(2);
}

const commits = raw.split('\x1e').map(rec => rec.trim()).filter(Boolean).map(rec => {
  const [hash, auteur, date, sujet, corps = ''] = rec.split('\x1f');
  // tag = libellé avant le « : » du sujet (ex. « Carte projet ») — pour regrouper visuellement
  const m = /^([^:]{2,40}?)\s*:/.exec(sujet || '');
  return {
    hash, short: (hash || '').slice(0, 7),
    auteur: (auteur || '').trim(),
    date: (date || '').trim(),
    sujet: (sujet || '').trim(),
    corps: (corps || '').trim(),
    tag: m ? m[1].trim() : ''
  };
});

const banner = '/* GÉNÉRÉ par frise.gen.mjs — ne pas éditer à la main.\n' +
  '   Relancer : node docs/carte/frise.gen.mjs */\n';
writeFileSync(out, banner + 'window.FRISE = ' +
  JSON.stringify({ genere_le: new Date().toISOString(), commits }, null, 2) + ';\n', 'utf8');

console.log('frise.data.js écrit — ' + commits.length + ' commits.');
