/* outils/lib/legal.mjs — la notice légale (contenu/legal.js) mise en page
   (chantier RGPD du 15 nov. 2026, docs/protocole-donnees.md, A1 et A2).

   Deux usages :
   - empreinteLegal(LEGAL) : l'empreinte du contenu de la notice, hors
     `historique`. Le vérificateur (question 15) la compare à celle de la
     dernière entrée de l'historique : un changement de la notice sans
     nouvelle version datée fait échouer le build (protocole § 2.2).
   - pageLegale(LEGAL) : la page /informations-legales/, une page simple qui
     défile (et non l'app), lisible sans script. Elle est libre d'accès : on
     ne peut pas demander d'accepter ce qu'on ne peut pas lire d'abord. */
import crypto from 'crypto';

/* empreinteLegal(L) — sha256 (12 caractères) du JSON de la notice sans son
   historique. Stable : JSON.stringify suit l'ordre des clés du fichier. */
export function empreinteLegal(L) {
  const { historique, ...corps } = L;
  return crypto.createHash('sha256').update(JSON.stringify(corps)).digest('hex').slice(0, 12);
}

/* versionLegale(L) — la version en vigueur : la date de la dernière entrée. */
export function versionLegale(L) {
  const h = L.historique || [];
  return h.length ? h[h.length - 1].version : '';
}

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/* dateFr('2026-11-15') → « 15 novembre 2026 ». */
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
export const dateFr = d => { const [a, m, j] = d.split('-').map(Number); return `${j === 1 ? '1er' : j} ${MOIS[m - 1]} ${a}`; };

/* pageLegale(L) — le HTML complet de informations-legales/index.html. */
export function pageLegale(L) {
  const v = versionLegale(L);
  const tiers = Object.fromEntries(L.tiers.map(t => [t.id, t]));
  const mail = `<a href="mailto:${esc(L.contact)}">${esc(L.contact)}</a>`;
  const sections = [
    ['mentions', 'Mentions légales', `
      <p>${esc(L.editeur)}</p>
      <p>${esc(L.directeur)} Contact : ${mail}.</p>
      <p><strong>Hébergeur</strong> : ${esc(L.hebergeur.nom)}, ${esc(L.hebergeur.adresse)} (<a href="${esc(L.hebergeur.site)}">${esc(L.hebergeur.site.replace(/^https:\/\//, ''))}</a>).</p>
      <p>${esc(L.propriete)}</p>`],
    ['donnees', 'Tes données personnelles', `
      <p><strong>Responsable du traitement</strong> : ${esc(L.responsable)} ${mail}.</p>
      <p>Le site ne fait ni publicité, ni statistiques de visite, ni profilage. Voici, une par une, les seules données qu'il traite.</p>
      ${L.traitements.map(t => `
      <div class="lg-carte" id="${esc(t.id)}">
        <h3>${esc(t.titre)}</h3>
        <dl>
          <dt>Quelles données</dt><dd><ul>${t.donnees.map(d => `<li>${esc(d)}</li>`).join('')}</ul></dd>
          <dt>Pour quoi</dt><dd>${esc(t.finalite)}</dd>
          <dt>Sur quelle base</dt><dd>${esc(t.base)}</dd>
          <dt>Combien de temps</dt><dd>${esc(t.duree)}</dd>
          <dt>Qui les reçoit</dt><dd>${t.tiers.map(id => esc(tiers[id].nom)).join(', ')}</dd>
        </dl>
      </div>`).join('')}
      <h3>Les services qui reçoivent ces données</h3>
      <p>Tous sont établis aux États-Unis : les transferts hors de l'Union européenne sont encadrés comme indiqué.</p>
      <ul class="lg-tiers">${L.tiers.map(t => `<li><strong>${esc(t.nom)}</strong> : ${esc(t.role)} <span class="lg-note">${esc(t.pays)}. ${esc(t.garanties)}</span></li>`).join('')}</ul>`],
    ['appareil', 'Ce qui reste sur ton appareil', `
      <p>Le site garde quelques informations dans ton navigateur (<em>localStorage</em>), pour se souvenir de tes réglages et de ta progression. Ce ne sont pas des traceurs : elles ne quittent ton appareil que si tu as un compte (synchronisation), et aucune bannière de consentement n'est donc nécessaire. Tu peux tout effacer dans Réglages › Mes données.</p>
      <table class="lg-table"><thead><tr><th>Clé</th><th>À quoi elle sert</th></tr></thead><tbody>
      ${L.stockage.map(s => `<tr><td><code>${esc(s.cle)}</code></td><td>${esc(s.role)}</td></tr>`).join('')}
      </tbody></table>`],
    ['droits', 'Tes droits', `
      <p>Tu as le droit d'accéder à tes données, de les corriger, de les effacer, de les emporter, de t'opposer à leur traitement ou de le limiter. La plupart se font en un clic :</p>
      <ul>${L.droits.map(d => `<li><strong>${esc(d.titre)}</strong> : ${esc(d.texte)}</li>`).join('')}</ul>
      <p>Pour tout le reste : ${mail}.</p>
      <p><strong>Si tu es mineur</strong> : ${esc(L.mineurs)}</p>`],
    ['cgu', "Conditions générales d'utilisation", L.cgu.map((c, i) => `
      <h3>${i + 1}. ${esc(c.titre)}</h3><p>${esc(c.texte)}</p>`).join('')],
    ['versions', 'Les versions de ce texte', `
      <ul>${L.historique.slice().reverse().map(h => `<li><strong>${esc(dateFr(h.version))}</strong> : ${esc(h.resume)}</li>`).join('')}</ul>`],
  ];
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<base href="/">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- GÉNÉRÉ par outils/construire.mjs (outils/lib/legal.mjs) depuis contenu/legal.js : NE PAS ÉDITER. -->
<title>Informations légales · Graphe Philosophie</title>
<meta name="description" content="Mentions légales, données personnelles et conditions d'utilisation du site de révision de philosophie.">
<meta name="robots" content="noindex">
<link rel="icon" href="icon.svg">
<script>try{document.documentElement.dataset.theme=localStorage.getItem('philo-theme')||'sombre';}catch(e){document.documentElement.dataset.theme='sombre';}</script>
<link rel="stylesheet" href="app.css">
<style>
  /* La page défile (app.css fige le corps pour l'app) et se lit en colonne. */
  html,body{height:auto;overflow:auto}
  body{padding:24px 16px 64px;color:var(--color-text-primary);line-height:1.6}
  .lg{max-width:760px;margin:0 auto}
  .lg a{color:var(--color-text-quiz)}
  .lg h1{font-size:26px;margin:12px 0 4px}
  .lg h2{font-size:19px;margin:36px 0 10px;padding-top:8px;border-top:1px solid var(--color-border-tertiary);scroll-margin-top:16px}
  .lg h3{font-size:15px;margin:18px 0 6px}
  .lg p,.lg li,.lg dd{color:var(--color-text-secondary);font-size:15px}
  .lg p{margin:0 0 10px}
  .lg ul{margin:0 0 10px;padding-left:20px}
  .lg-version{color:var(--color-text-tertiary);font-size:13px}
  .lg-retour{display:inline-block;font-size:14px;text-decoration:none}
  .lg-sommaire{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 0;padding:0;list-style:none}
  .lg-sommaire a{display:inline-block;padding:6px 12px;border:1px solid var(--color-border-secondary);border-radius:999px;font-size:13px;text-decoration:none;color:var(--color-text-primary)}
  .lg-carte{background:var(--color-background-primary);border:1px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:4px 16px 12px;margin:12px 0}
  .lg-carte dl{margin:0}
  .lg-carte dt{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--color-text-tertiary);margin-top:10px}
  .lg-carte dd{margin:2px 0 0}
  .lg-carte ul{margin:0;padding-left:18px}
  .lg-tiers li{margin-bottom:8px}
  .lg-note{display:block;font-size:13px;color:var(--color-text-tertiary)}
  .lg-table{width:100%;border-collapse:collapse;font-size:14px}
  .lg-table th,.lg-table td{text-align:left;padding:6px 8px;border-bottom:1px solid var(--color-border-tertiary);vertical-align:top;color:var(--color-text-secondary)}
  .lg-table code{font-size:12px;word-break:break-all}
</style>
</head>
<body>
<main class="lg">
  <a class="lg-retour" href="/">← Retour au site</a>
  <h1>Informations légales</h1>
  <p class="lg-version">Version du ${esc(dateFr(v))}. Site : ${esc(L.site.replace(/^https:\/\//, ''))}.</p>
  <nav aria-label="Sommaire"><ul class="lg-sommaire">${sections.map(([id, t]) => `<li><a href="informations-legales/#${id}">${esc(t)}</a></li>`).join('')}</ul></nav>
  ${sections.map(([id, t, h]) => `<section><h2 id="${id}">${esc(t)}</h2>${h}</section>`).join('\n  ')}
</main>
</body>
</html>
`;
}
