// outils/indexnow.mjs — signale toutes les adresses du site à IndexNow
// (Bing, Yandex, Seznam, Naver… se partagent les envois).
//
// Usage, APRÈS le déploiement (la clé doit être en ligne) :
//   node outils/indexnow.mjs            envoie les adresses de sitemap.xml
//   node outils/indexnow.mjs --essai    affiche ce qui serait envoyé, sans rien envoyer
//   node outils/indexnow.mjs --depuis <commit>
//                                       n'envoie que les pages changées depuis ce commit
//                                       (utilisé par .github/workflows/indexnow.yml après
//                                       chaque déploiement de production)
//
// La preuve de propriété est le fichier <CLE>.txt à la racine du site, qui
// contient la clé elle-même. Ne pas le supprimer ni changer la clé sans
// renommer le fichier.

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const HOTE = 'philo.myprisme.fr';
const CLE = 'e436288fafc29c1dab57e96cefce8fe8';

/** Lit les <loc> de sitemap.xml (déjà généré par le build). */
function adressesDuSitemap() {
  const xml = readFileSync(join(RACINE, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
}

/**
 * Garde, parmi les adresses du sitemap, celles dont le fichier a changé
 * depuis le commit `ref` (pages statiques, accueil). Le sitemap reste la
 * liste de référence : une page supprimée n'est pas renvoyée.
 */
function adressesChangees(urlList, ref) {
  const fichiers = execFileSync('git', ['diff', '--name-only', ref, 'HEAD'], { cwd: RACINE, encoding: 'utf8' })
    .split('\n').map(f => f.trim()).filter(Boolean);
  // Repère : notions/la-liberte/index.html → https://hote/notions/la-liberte/
  const chemins = new Set(fichiers.filter(f => f.endsWith('index.html')).map(f => '/' + f.replace(/index\.html$/, '')));
  return urlList.filter(u => chemins.has(new URL(u).pathname));
}

/** Vérifie que la clé publiée en ligne est la bonne, puis envoie la liste. */
async function main() {
  let urlList = adressesDuSitemap();
  const i = process.argv.indexOf('--depuis');
  if (i > 0) urlList = adressesChangees(urlList, process.argv[i + 1]);
  const keyLocation = `https://${HOTE}/${CLE}.txt`;
  console.log(`${urlList.length} adresses à envoyer`);
  if (!urlList.length) { console.log('Aucune page changée : rien à envoyer.'); return; }
  if (process.argv.includes('--essai')) { console.log(urlList.join('\n')); return; }

  // Repère : sans clé en ligne, IndexNow répond 403 ; on le dit plus clairement.
  const enLigne = await fetch(keyLocation).then(r => r.ok ? r.text() : '').catch(() => '');
  if (enLigne.trim() !== CLE) {
    console.error(`ÉCHEC : ${keyLocation} ne contient pas la clé (site pas encore déployé ?)`);
    process.exit(1);
  }

  const r = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOTE, key: CLE, keyLocation, urlList }),
  });
  // 200 = reçu, 202 = reçu, clé en cours de validation ; le reste est une erreur.
  console.log(`IndexNow : HTTP ${r.status} ${await r.text()}`);
  if (r.status !== 200 && r.status !== 202) process.exit(1);
}

main();
