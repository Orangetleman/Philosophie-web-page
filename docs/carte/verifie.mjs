#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════
   verifie.mjs — anti-dérive de la carte (aucune dépendance).

     node docs/carte/verifie.mjs              contrôle
     node docs/carte/verifie.mjs --corriger   réécrit les `ref` de carte.data.js
                                              là où les symboles se trouvent

   Pour chaque symbole de carte.data.js (symbols[].{kind, name, ref}), on
   cherche sa DÉFINITION dans le code (et non une simple mention) :
     fn    → « function nom( », « def nom( », « class nom », « create function nom » ;
     var   → « const/let/var nom », « nom = » (Python), sinon une mention ;
     table → « create table nom », « from('nom') », sinon une mention ;
     key, css, route → une mention (clé localStorage, sélecteur, route).
   On cherche d'abord dans le fichier cité par `ref`, puis dans tout le code
   (js/, css/, outils/, philo-aggregator/, triage/, sw.js, index.html…) :
   un symbole qui a changé de fichier est retrouvé.

   États :
     OK       défini à la ligne citée ;
     DÉPLACÉ  défini ailleurs (autre ligne ou autre fichier) : --corriger
              réécrit la ref ; sans --corriger, c'est un écart (sortie 1) ;
     PÉRIMÉ   introuvable : le symbole a disparu du code, la carte ment
              (sortie 1, même avec --corriger : un humain doit trancher).

   Avant octobre 2026, ce contrôle acceptait un nom trouvé N'IMPORTE OÙ dans
   le fichier, commentaires compris : une fonction supprimée mais encore
   citée dans un commentaire passait pour présente. Le build (outils/
   construire.mjs) lance désormais --corriger, et son mode --controle exige
   des refs exactes.
   ════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ici = path.dirname(fileURLToPath(import.meta.url));
const racine = path.resolve(ici, '..', '..');
const CORRIGER = process.argv.includes('--corriger');
const fCarte = path.join(ici, 'carte.data.js');

/* Le corpus de code où chercher un symbole déplacé. */
function corpus() {
  const out = [];
  const dossier = (d, ext) => { const p = path.join(racine, d); if (fs.existsSync(p)) fs.readdirSync(p).filter(f => ext.some(e => f.endsWith(e))).sort().forEach(f => out.push(d + '/' + f)); };
  dossier('js', ['.js']); dossier('css', ['.css']); dossier('outils', ['.mjs']); dossier('outils/lib', ['.mjs']); dossier('outils/banc', ['.mjs']);
  dossier('philo-aggregator', ['.py']); dossier('philo-aggregator/migrations', ['.sql']);
  dossier('triage', ['.html', '.js']); dossier('docs/carte', ['.mjs']);
  ['index.html', 'sw.js', 'data.js', 'manifest.json', 'robots.txt', 'sitemap.xml'].forEach(f => { if (fs.existsSync(path.join(racine, f))) out.push(f); });
  return out;
}
const cache = new Map();
const lignesDe = rel => {
  if (!cache.has(rel)) { let t = null; try { t = fs.readFileSync(path.join(racine, rel), 'utf8').split(/\r?\n/); } catch { } cache.set(rel, t); }
  return cache.get(rel);
};
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* Motifs de DÉFINITION par sorte ; `mention` = repli accepté pour cette sorte. */
function motifs(kind, nom) {
  const n = esc(nom);
  switch (kind) {
    case 'fn': return { def: [
      new RegExp(`^\\s*(export\\s+)?(async\\s+)?function\\s+${n}\\s*\\(`),
      new RegExp(`^\\s*\\(\\s*(async\\s+)?function\\s+${n}\\s*\\(`),   // appelée aussitôt : (function nom(){…})()
      new RegExp(`^\\s*(async\\s+)?def\\s+${n}\\s*\\(`),
      new RegExp(`^\\s*class\\s+${n}\\b`),
      new RegExp(`^\\s*(export\\s+)?(const|let|var)\\s+${n}\\s*=\\s*(async\\s*)?(\\(|function\\b|[A-Za-z_$]+\\s*=>)`),
      new RegExp(`create\\s+(or\\s+replace\\s+)?function\\s+(public\\.)?${n}\\b`, 'i'),
    ], mention: false };
    case 'var': return { def: [
      new RegExp(`^\\s*(export\\s+)?(const|let|var)\\s+${n}\\b`),
      new RegExp(`^${n}\\s*=`),
    ], mention: true };
    case 'table': return { def: [
      new RegExp(`create\\s+table\\s+(if\\s+not\\s+exists\\s+)?(public\\.|auth\\.)?${n}\\b`, 'i'),
      new RegExp(`from\\(['"]${n}['"]\\)`),
    ], mention: true };
    default: return { def: [], mention: true };   // key, css, route
  }
}

/* trouver(sym) — {fichier, ligne, def:bool} ou null. Cherche d'abord dans le
   fichier cité, puis dans tout le corpus ; une définition l'emporte sur une
   mention, et le fichier cité l'emporte à égalité. */
function trouver(s, fichierCite) {
  const { def, mention } = motifs(s.kind, s.name);
  const fichiers = [fichierCite, ...corpus().filter(f => f !== fichierCite)].filter(f => lignesDe(f));
  for (const f of fichiers) {
    const i = lignesDe(f).findIndex(l => def.some(r => r.test(l)));
    if (i >= 0) return { fichier: f, ligne: i + 1, def: true };
  }
  if (!mention) return null;
  for (const f of fichiers) {
    const i = lignesDe(f).findIndex(l => l.includes(s.name));
    if (i >= 0) return { fichier: f, ligne: i + 1, def: false };
  }
  return null;
}

/* ── Contrôle (et correction) ─────────────────────────────────────────── */
let texte = fs.readFileSync(fCarte, 'utf8');
const RE = /\{kind:"(\w+)",name:"([^"]*)",ref:"([^"]*)"/g;
let ok = 0, deplaces = 0, perimes = 0;
const lignesRapport = [];
texte = texte.replace(RE, (tout, kind, name, ref) => {
  const m = /^(.*):(\d+)$/.exec(ref);
  const t = trouver({ kind, name }, m ? m[1] : '');
  if (!t) { perimes++; lignesRapport.push(`PÉRIMÉ   ${name.padEnd(28)} ${ref}  (introuvable : ${kind === 'fn' ? 'aucune définition' : 'aucune mention'})`); return tout; }
  const nouvelle = `${t.fichier}:${t.ligne}`;
  if (nouvelle === ref) { ok++; return tout; }
  deplaces++;
  if (!CORRIGER) lignesRapport.push(`DÉPLACÉ  ${name.padEnd(28)} ${ref.padEnd(36)} → ${nouvelle}`);
  return CORRIGER ? `{kind:"${kind}",name:"${name}",ref:"${nouvelle}"` : tout;
});
if (CORRIGER && deplaces) fs.writeFileSync(fCarte, texte);

console.log('Carte — anti-dérive' + (CORRIGER ? ' (correction des refs)' : ''));
lignesRapport.forEach(l => console.log(l));
console.log(`${ok + deplaces + perimes} symboles · ${ok} à leur place · ${deplaces} ${CORRIGER ? 'refs corrigées' : 'déplacés'} · ${perimes} périmés`);
if (perimes) { console.log('\n❌ Des symboles n\'existent plus dans le code : corriger carte.data.js (voir MAJ.md).'); process.exit(1); }
if (deplaces && !CORRIGER) { console.log('\n❌ Des refs ne pointent plus sur la définition : lancer « node docs/carte/verifie.mjs --corriger » (ou le build).'); process.exit(1); }
console.log('\n✅ Carte à jour.');
