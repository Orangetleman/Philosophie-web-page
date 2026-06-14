#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════
   verifie.mjs — détecteur de « drift » de la carte (aucune dépendance).

   Usage :  node docs/carte/verifie.mjs

   Pour chaque symbole de carte.data.js (symbols[].{name, ref}) :
     1. parse `ref` = "fichier:ligne" ;
     2. lit le fichier cité (relatif à la racine du dépôt) ;
     3. vérifie que `name` y EXISTE encore (recherche texte) ;
        - OK       : `name` présent ET sur la ligne citée ;
        - DÉPLACÉ  : `name` présent mais plus à la ligne citée (info) ;
        - PÉRIMÉ   : `name` absent du fichier  → DRIFT (code de sortie ≠ 0) ;
        - FICHIER? : fichier introuvable        → DRIFT.
   ════════════════════════════════════════════════════════════════════ */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));   // docs/carte
const repoRoot = path.resolve(here, '..', '..');             // racine du dépôt

/* ── Charger window.CARTE sans navigateur (le fichier est le nôtre) ── */
const dataPath = path.join(here, 'carte.data.js');
const src = readFileSync(dataPath, 'utf8');
const win = {};
try { new Function('window', src)(win); }
catch (e) { console.error('Impossible d\'évaluer carte.data.js :', e.message); process.exit(2); }
const CARTE = win.CARTE;
if (!CARTE || !Array.isArray(CARTE.nodes)) { console.error('window.CARTE.nodes absent.'); process.exit(2); }

/* ── Cache de lecture des fichiers source cités ── */
const cache = new Map();
function readFile(rel) {
  if (cache.has(rel)) return cache.get(rel);
  let res = null;
  try { res = readFileSync(path.join(repoRoot, rel), 'utf8'); }
  catch { res = null; }
  cache.set(rel, res);
  return res;
}

const rows = [];               // {status, name, ref, detail}
let stale = 0, moved = 0, ok = 0;

for (const n of CARTE.nodes) {
  for (const s of (n.symbols || [])) {
    const m = /^(.*):(\d+)$/.exec(s.ref || '');
    if (!m) { rows.push({ status: 'REF?', name: s.name, ref: s.ref, detail: 'ref mal formée' }); stale++; continue; }
    const file = m[1], line = parseInt(m[2], 10);
    const content = readFile(file);
    if (content === null) { rows.push({ status: 'FICHIER?', name: s.name, ref: s.ref, detail: 'fichier introuvable' }); stale++; continue; }
    const lines = content.split(/\r?\n/);
    const present = content.includes(s.name);
    if (!present) { rows.push({ status: 'PÉRIMÉ', name: s.name, ref: s.ref, detail: 'nom absent du fichier' }); stale++; continue; }
    const onLine = (lines[line - 1] || '').includes(s.name);
    if (onLine) { ok++; }
    else {
      // retrouver une ligne où le nom apparaît, pour aider à corriger
      const idx = lines.findIndex(l => l.includes(s.name));
      rows.push({ status: 'DÉPLACÉ', name: s.name, ref: s.ref, detail: 'maintenant vers ' + file + ':' + (idx + 1) });
      moved++;
    }
  }
}

/* ── Rapport ── */
const pad = (s, n) => String(s).padEnd(n);
console.log('Carte — vérification anti-drift');
console.log('Dépôt : ' + repoRoot);
console.log('—'.repeat(60));
if (rows.length === 0) {
  console.log('Tous les symboles sont OK et à la bonne ligne.');
} else {
  for (const r of rows) console.log(pad(r.status, 9) + ' ' + pad(r.name, 26) + ' ' + pad(r.ref, 34) + ' ' + r.detail);
}
console.log('—'.repeat(60));
const total = ok + moved + stale;
console.log(`${total} symboles · ${ok} OK · ${moved} déplacés (info) · ${stale} périmés (drift)`);

if (stale > 0) { console.log('\n❌ DRIFT : ' + stale + ' symbole(s) périmé(s). Mettre à jour carte.data.js (voir MAJ.md).'); process.exit(1); }
if (moved > 0) { console.log('\n⚠️  ' + moved + ' ligne(s) ont bougé : mettre à jour les `ref` quand pratique (non bloquant).'); }
console.log('\n✅ Aucun drift.');
process.exit(0);
