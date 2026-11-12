/* ════════════════════════════════════════════════════════════════════
   pages.mjs — les PAGES STATIQUES du site (référencement, nov. 2026)
   ────────────────────────────────────────────────────────────────────
   Le site interactif (index.html + app.js) rend tout son texte en
   JavaScript : un robot qui n'exécute pas le JS (beaucoup d'assistants
   IA, les aperçus de liens) n'y voit qu'une coquille vide. On génère donc,
   au build, une page HTML complète par fiche (« génération statique ») :
     notions/<slug>/index.html   une par notion (programme et hors programme)
     auteurs/<slug>/index.html   une par fiche d'auteur
     fiches/index.html           le sommaire de toutes les fiches
     sitemap.xml, robots.txt, llms.txt
   Chaque page porte son <title>, sa description, ses balises Open Graph,
   son adresse canonique et ses données structurées (JSON-LD schema.org),
   et renvoie vers la même fiche dans le graphe interactif (#/notion/…).

   Fonction PURE : genererPages(donnees) → {chemin: texte}. construire.mjs
   écrit le résultat (ou le compare, en --controle). Aucune dépendance.
   ════════════════════════════════════════════════════════════════════ */

export const SITE = 'https://philo.myprisme.fr';
const NOM_SITE = 'Graphe Philosophie';

/* Slug « avec article » des notions : /notions/la-liberte/ se lit comme la
   requête qu'on tape (« la liberté philo »). Une notion absente de la table
   (ajoutée plus tard) retombe sur sa clé : rien ne casse. */
const SLUG_NOTION = {
  conscience: 'la-conscience', inconscient: 'l-inconscient', devoir: 'le-devoir',
  liberte: 'la-liberte', bonheur: 'le-bonheur', religion: 'la-religion',
  langage: 'le-langage', art: 'l-art', technique: 'la-technique', travail: 'le-travail',
  justice: 'la-justice', etat: 'l-etat', nature: 'la-nature', raison: 'la-raison',
  science: 'la-science', verite: 'la-verite', temps: 'le-temps', autrui: 'autrui',
  desir: 'le-desir', histoire: 'l-histoire', perception: 'la-perception',
  existence: 'l-existence', vivant: 'le-vivant', 'matiere-esprit': 'la-matiere-et-l-esprit',
  interpretation: 'l-interpretation', demonstration: 'la-demonstration', societe: 'la-societe',
};

/* Le nom « avec article » pour les titres : « La liberté », « L'État ». */
function nomAvecArticle(cle, l) {
  const s = SLUG_NOTION[cle] || '';
  if (s.startsWith('la-')) return 'La ' + minuscule(l);
  if (s.startsWith('le-')) return 'Le ' + minuscule(l);
  if (s.startsWith('l-')) return 'L’' + minuscule(l);
  return l;
}
// « État » garde sa majuscule (nom propre au sens politique) ; les autres non.
const minuscule = l => (l === 'État' ? l : l.charAt(0).toLowerCase() + l.slice(1));

/* slug(texte) — minuscules, sans accents ni ponctuation : « Simone de Beauvoir » → simone-de-beauvoir. */
export function slug(t) {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/œ/g, 'oe').replace(/æ/g, 'ae')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
export const slugNotion = cle => SLUG_NOTION[cle] || slug(cle);

/* ── Échappement et nettoyage du texte ───────────────────────────── */
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Texte brut d'un champ qui peut contenir du HTML (def, définitions de concepts).
const brut = s => String(s || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
// Description courte (≤ 155 caractères, coupée sur un mot) pour <meta description>.
function court(s, max = 155) {
  s = brut(s);
  if (s.length <= max) return s;
  return s.slice(0, s.lastIndexOf(' ', max - 1)).replace(/[ ,;:–—-]+$/, '') + '…';
}
/* html(s) — garde le HTML simple du contenu (strong, em, span.kw, details…)
   mais retire tout gestionnaire d'événement et tout <script>, par prudence. */
const html = s => String(s || '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, '');
/* citer(c) — une citation exacte (entre « ») en <blockquote> ; une
   reformulation (sans guillemets, cf. docs/protocole-contenu.md) dite comme telle. */
const citer = c => /^«/.test(c) ? `<blockquote>${esc(c)}</blockquote>` : `<p class="reform">En substance : ${esc(c)}</p>`;
const json = o => JSON.stringify(o).replace(/</g, '\\u003c');

/* ── Gabarit commun ──────────────────────────────────────────────── */
/* page({chemin, titre, description, h1, corps, jsonld, profondeur, type})
   — une page complète. `chemin` est l'adresse publique (« notions/la-liberte/ »),
   `profondeur` le nombre de dossiers à remonter vers la racine (liens relatifs :
   le site marche aussi ouvert en fichier local). */
function page({ chemin, titre, description, corps, jsonld, profondeur, type = 'article' }) {
  const r = '../'.repeat(profondeur);
  const url = SITE + '/' + chemin;
  return `<!DOCTYPE html>
<!-- GÉNÉRÉ par outils/construire.mjs (outils/lib/pages.mjs) à partir de contenu/. NE PAS ÉDITER. -->
<html lang="fr"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(titre)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${NOM_SITE}">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${esc(titre)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#121212">
<link rel="icon" href="${r}icon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${r}fiche.css">
<script type="application/ld+json">${json(jsonld)}</script>
</head>
<body>
<header class="fh"><a class="fh-site" href="${r}">🏛️ ${NOM_SITE} <span>Terminale</span></a>
<nav aria-label="Rubriques"><a href="${r}fiches/">Toutes les fiches</a></nav></header>
${corps}
<footer class="ff"><p>${NOM_SITE} : fiches de révision de philosophie pour le bac (programme de Terminale, BO n° 8 du 25 juillet 2019). Projet collaboratif, relu et enrichi régulièrement : une erreur ou une idée se signalent depuis l’outil. <a href="${r}">Ouvrir l’outil interactif</a> (graphe, quiz, méthodologie).</p></footer>
</body></html>
`;
}

// Fil d'Ariane : visible ET en JSON-LD (BreadcrumbList).
function ariane(items, r) {
  const vis = items.map((it, i) => i < items.length - 1 ? `<a href="${r}${it.chemin}">${esc(it.nom)}</a>` : `<span aria-current="page">${esc(it.nom)}</span>`).join(' › ');
  const ld = { '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.nom, item: SITE + '/' + it.chemin })) };
  return { vis: `<nav class="fa" aria-label="Fil d’Ariane">${vis}</nav>`, ld };
}

const EDITEUR = { '@type': 'Organization', name: NOM_SITE, url: SITE + '/' };
const AUDIENCE = { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: 'Élèves de Terminale (baccalauréat)' };

/* ── Index des auteurs : nom → [{cle, idees}] ─────────────────────── */
function indexAuteurs(D, KEYS) {
  const ai = {};
  KEYS.forEach(k => D[k].auteurs.forEach(a => { (ai[a.n] = ai[a.n] || []).push({ cle: k, ideas: a.ideas }); }));
  return ai;
}

/* ── Page d'une notion ───────────────────────────────────────────── */
function pageNotion(k, d, ctx) {
  const n = d.D[k];
  const hp = !d.PROGRAMME.notions.includes(k);
  const nom = nomAvecArticle(k, n.l);
  const chemin = `notions/${slugNotion(k)}/`;
  const r = '../../';
  const titre = `${nom} : fiche de révision bac philo | ${NOM_SITE}`;
  const auteurs = n.auteurs.map(a => a.n);
  const description = court(`Fiche sur ${minuscule(nom)} (philosophie Terminale) : ${n.s} Définitions, ${auteurs.slice(0, 4).join(', ')}, citations, plans de dissertation et exemples.`);
  const concepts = d.CONCEPTS.filter(c => c.cat !== 'Repère' && (c.notions || []).includes(k));
  const sujets = d.SUJETS_BAC.sujets.filter(s => s.notions.includes(k));
  const fa = ariane([{ nom: 'Accueil', chemin: '' }, { nom: 'Fiches', chemin: 'fiches/' }, { nom: n.l, chemin }], r);
  const lienAuteur = nm => ctx.am[nm] ? `<a href="${r}auteurs/${slug(nm)}/">${esc(nm)}</a>` : esc(nm);

  const sec = [];
  sec.push(`<section id="definition"><h2>Définition et enjeux</h2><div class="def">${html(n.def)}</div></section>`);
  sec.push(`<section id="auteurs"><h2>Les auteurs à connaître sur ${esc(minuscule(nom))}</h2>` + n.auteurs.map(a =>
    `<article class="aut"><h3>${lienAuteur(a.n)}</h3>` + a.ideas.map(i =>
      `<div class="idee">${i.w ? `<p class="oeuvre"><cite>${esc(i.w)}</cite></p>` : ''}<p>${html(i.i)}</p>` +
      (i.citations || []).map(citer).join('') + '</div>').join('') +
    '</article>').join('') + '</section>');
  if (n.textes && n.textes.length) sec.push(`<section id="textes"><h2>Textes et arguments clés</h2>` + n.textes.map(t => `<article><h3>${esc(t.n)}</h3><p>${html(t.t)}</p></article>`).join('') + '</section>');
  if (concepts.length) sec.push(`<section id="concepts"><h2>Concepts</h2><dl>` + concepts.map(c => `<dt>${esc(c.term)}${c.auteur ? ` <small>(${esc(c.auteur)})</small>` : ''}</dt><dd>${esc(court(c.def, 400))}</dd>`).join('') + '</dl></section>');
  if (n.plans && n.plans.length) sec.push(`<section id="plans"><h2>Plans de dissertation</h2>` + n.plans.map(p =>
    `<article class="plan"><h3>${esc(p.q)}</h3>${p.pb && p.pb !== p.q ? `<p><strong>Problématique :</strong> ${esc(p.pb)}</p>` : ''}<ol>` +
    (p.axes || []).map(ax => `<li>${ax.t ? `<strong>${esc(ax.t)}</strong>` : ''}` + (ax.sps || []).map(sp =>
      `<p>${sp.t ? `<strong>${esc(sp.t)}.</strong> ` : ''}${esc(sp.args)}${sp.ref ? ` <em>(${esc(sp.ref)})</em>` : ''}</p>`).join('') + '</li>').join('') +
    '</ol></article>').join('') + '</section>');
  const diss = (n.diss || []).map(x => typeof x === 'string' ? x : x.q);
  if (diss.length || sujets.length) sec.push(`<section id="sujets"><h2>Sujets de dissertation</h2>` +
    (sujets.length ? `<h3>Tombés au bac</h3><ul>` + sujets.map(s => `<li>${s.type === 'dissertation' ? esc(s.q) : `Explication de texte : ${esc(s.auteur)}, <cite>${esc(s.oeuvre)}</cite>`} <small>(${s.annee}, voie ${esc(s.voie)})</small></li>`).join('') + '</ul>' : '') +
    (diss.length ? `<h3>Pour s’entraîner</h3><ul>` + diss.map(q => `<li>${esc(q)}</li>`).join('') + '</ul>' : '') + '</section>');
  if (n.exemples && n.exemples.length) sec.push(`<section id="exemples"><h2>Exemples pour illustrer</h2>` + n.exemples.map(e => `<article><h3>${esc(e.tit)} <small>${esc(e.tag)}</small></h3><p>${esc(e.body)}</p>${e.lien ? `<p class="lien">${esc(e.lien)}</p>` : ''}</article>`).join('') + '</section>');
  if (n.accroches && n.accroches.length) sec.push(`<section id="accroches"><h2>Accroches d’introduction</h2><ul>` + n.accroches.map(a => `<li>${esc(a.t)}${a.src ? ` <small>(${esc(a.src)})</small>` : ''}</li>`).join('') + '</ul></section>');
  const voisines = (n.liens || []).map(l => d.KEYS.find(k2 => d.D[k2].l === l)).filter(Boolean);
  if (voisines.length) sec.push(`<section id="liens"><h2>Notions liées</h2><ul class="tags">` + voisines.map(k2 => `<li><a href="${r}notions/${slugNotion(k2)}/">${esc(d.D[k2].l)}</a></li>`).join('') + '</ul></section>');

  const corps = `<main class="fm">${fa.vis}
<article class="fiche">
<header><p class="sur">Fiche de révision · Philosophie Terminale${hp ? ' · <span class="hp">hors programme</span>' : ''}</p>
<h1>${esc(nom)}</h1><p class="ques">${esc(n.s)}</p>
<p><a class="btn" href="${r}#/notion/${encodeURIComponent(k)}">Ouvrir dans le graphe interactif</a></p>
<nav class="som" aria-label="Sommaire"><a href="#definition">Définition</a> <a href="#auteurs">Auteurs</a>${n.plans && n.plans.length ? ' <a href="#plans">Plans</a>' : ''} <a href="#sujets">Sujets</a>${n.exemples && n.exemples.length ? ' <a href="#exemples">Exemples</a>' : ''}</nav></header>
${sec.join('\n')}
</article></main>`;

  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': ['LearningResource', 'Article'], '@id': SITE + '/' + chemin + '#fiche', headline: `${nom} : fiche de révision de philosophie`,
      name: `${nom} (philosophie Terminale)`, description, inLanguage: 'fr', url: SITE + '/' + chemin,
      learningResourceType: 'Fiche de révision', educationalLevel: 'Terminale (lycée, baccalauréat)',
      isAccessibleForFree: true, audience: AUDIENCE, publisher: EDITEUR, author: EDITEUR, dateModified: ctx.date,
      about: [{ '@type': 'DefinedTerm', name: n.l, description: n.s, inDefinedTermSet: 'Programme de philosophie de Terminale' }]
        .concat(concepts.slice(0, 20).map(c => ({ '@type': 'DefinedTerm', name: c.term }))),
      mentions: auteurs.map(a => ({ '@type': 'Person', name: a, ...(ctx.am[a] ? { url: `${SITE}/auteurs/${slug(a)}/` } : {}) })),
      teaches: n.s, isPartOf: { '@type': 'WebSite', name: NOM_SITE, url: SITE + '/' } },
    fa.ld] };
  return [chemin + 'index.html', page({ chemin, titre, description, corps, jsonld, profondeur: 2 })];
}

/* ── Page d'un auteur ────────────────────────────────────────────── */
function pageAuteur(nm, d, ctx) {
  const a = d.AM[nm];
  const chemin = `auteurs/${slug(nm)}/`;
  const r = '../../';
  const auProgramme = d.PROGRAMME.auteurs.some(x => x.fiches.includes(nm));
  const notions = ctx.ai[nm] || [];
  const dates = a.naissance != null ? ` (${an(a.naissance)}${a.mort != null ? ' – ' + an(a.mort) : ''})` : '';
  const titre = `${nm} : idées, citations et notions | Bac philo – ${NOM_SITE}`;
  const description = court(`${nm}${dates}, ${a.courant || 'philosophe'}. ${brut(a.bio)} Ses idées pour ${notions.map(x => d.D[x.cle].l.toLowerCase()).slice(0, 4).join(', ')}.`);
  const fa = ariane([{ nom: 'Accueil', chemin: '' }, { nom: 'Fiches', chemin: 'fiches/' }, { nom: nm, chemin }], r);
  const citations = notions.flatMap(x => x.ideas.flatMap(i => i.citations || [])).filter(c => /^«/.test(c));
  const corps = `<main class="fm">${fa.vis}
<article class="fiche">
<header><p class="sur">Fiche auteur · Philosophie Terminale · ${auProgramme ? 'au programme' : 'hors liste officielle'}</p>
<h1>${esc(nm)}${esc(dates)}</h1><p class="ques">${esc(a.courant || '')}${a.periode ? ' · ' + esc(a.periode) : ''}</p>
<p><a class="btn" href="${r}#/auteur/${encodeURIComponent(nm)}">Ouvrir dans le graphe interactif</a></p></header>
<section><h2>Biographie</h2><p>${html(a.bio)}</p>${(a.themes || []).length ? `<p><strong>Thèmes :</strong> ${a.themes.map(esc).join(', ')}.</p>` : ''}</section>
<section><h2>Ses idées, notion par notion</h2>` + notions.map(x => `<article><h3><a href="${r}notions/${slugNotion(x.cle)}/">${esc(d.D[x.cle].l)}</a></h3>` +
    x.ideas.map(i => `<div class="idee">${i.w ? `<p class="oeuvre"><cite>${esc(i.w)}</cite></p>` : ''}<p>${html(i.i)}</p>${(i.citations || []).map(citer).join('')}</div>`).join('') + '</article>').join('') + `</section>
${(a.dialogues || []).length ? `<section><h2>En dialogue avec</h2><ul>` + a.dialogues.map(g => `<li><strong>${ctx.am[g.auteur] ? `<a href="${r}auteurs/${slug(g.auteur)}/">${esc(g.auteur)}</a>` : esc(g.auteur)}</strong> (${esc(g.sujet)}) : ${esc(g.desc)}</li>`).join('') + '</ul></section>' : ''}
</article></main>`;
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'ProfilePage', '@id': SITE + '/' + chemin, url: SITE + '/' + chemin, name: titre, description, inLanguage: 'fr', dateModified: ctx.date,
      isPartOf: { '@type': 'WebSite', name: NOM_SITE, url: SITE + '/' },
      mainEntity: { '@type': 'Person', name: nm, description: brut(a.bio),
        ...(a.naissance != null && !a.datesApprox ? { birthDate: String(a.naissance) } : {}),
        ...(a.mort != null && !a.datesApprox ? { deathDate: String(a.mort) } : {}),
        knowsAbout: notions.map(x => d.D[x.cle].l).concat(a.themes || []) } },
    { '@type': 'LearningResource', name: `${nm} : fiche de révision bac philo`, learningResourceType: 'Fiche de révision',
      educationalLevel: 'Terminale (lycée, baccalauréat)', inLanguage: 'fr', isAccessibleForFree: true, audience: AUDIENCE, publisher: EDITEUR,
      ...(citations.length ? { citation: citations.slice(0, 10) } : {}) },
    fa.ld] };
  return [chemin + 'index.html', page({ chemin, titre, description, corps, jsonld, profondeur: 2, type: 'profile' })];
}
const an = y => (y < 0 ? -y + ' av. J.-C.' : String(y));

/* ── Sommaire de toutes les fiches ───────────────────────────────── */
function pageSommaire(d, ctx) {
  const chemin = 'fiches/';
  const r = '../';
  const prog = d.KEYS.filter(k => d.PROGRAMME.notions.includes(k)), hp = d.KEYS.filter(k => !d.PROGRAMME.notions.includes(k));
  const li = k => `<li><a href="${r}notions/${slugNotion(k)}/">${esc(nomAvecArticle(k, d.D[k].l))}</a> <small>${esc(d.D[k].s)}</small></li>`;
  const auteurs = Object.keys(d.AM).filter(nm => ctx.ai[nm]);
  const titre = `Fiches de révision bac philo : les 17 notions et ${auteurs.length} auteurs | ${NOM_SITE}`;
  const description = `Toutes les fiches de révision de philosophie de Terminale : les 17 notions du programme, des notions complémentaires et ${auteurs.length} fiches d’auteurs, avec citations, plans et exemples.`;
  const fa = ariane([{ nom: 'Accueil', chemin: '' }, { nom: 'Fiches', chemin }], r);
  const corps = `<main class="fm">${fa.vis}
<article class="fiche"><header><h1>Fiches de révision de philosophie (Terminale)</h1>
<p class="ques">Chaque fiche réunit la définition de la notion, les auteurs et leurs citations, des plans de dissertation, des sujets tombés au bac et des exemples. <a href="${r}">Ouvrir le graphe interactif et le quiz</a>.</p></header>
<section><h2>Les ${prog.length} notions du programme</h2><ul class="liste">${prog.map(li).join('')}</ul></section>
${hp.length ? `<section><h2>Notions complémentaires (hors programme)</h2><ul class="liste">${hp.map(li).join('')}</ul></section>` : ''}
<section><h2>Les auteurs</h2><ul class="tags">${auteurs.map(nm => `<li><a href="${r}auteurs/${slug(nm)}/">${esc(nm)}</a></li>`).join('')}</ul></section>
</article></main>`;
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', url: SITE + '/' + chemin, name: titre, description, inLanguage: 'fr', isPartOf: { '@type': 'WebSite', name: NOM_SITE, url: SITE + '/' },
      mainEntity: { '@type': 'ItemList', itemListElement: d.KEYS.map((k, i) => ({ '@type': 'ListItem', position: i + 1, name: d.D[k].l, url: `${SITE}/notions/${slugNotion(k)}/` })) } },
    fa.ld] };
  return ['fiches/index.html', page({ chemin, titre, description, corps, jsonld, profondeur: 1, type: 'website' })];
}

/* ── sitemap.xml, robots.txt, llms.txt ───────────────────────────── */
function sitemap(chemins, date) {
  const u = (c, prio) => `  <url><loc>${SITE}/${c}</loc><lastmod>${date}</lastmod><priority>${prio}</priority></url>`;
  return '<?xml version="1.0" encoding="UTF-8"?>\n<!-- GÉNÉRÉ par outils/construire.mjs. NE PAS ÉDITER. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    [u('', '1.0'), u('fiches/', '0.9')].concat(chemins.map(c => u(c, c.startsWith('notions/') ? '0.8' : '0.6'))).join('\n') + '\n</urlset>\n';
}
// Robots des moteurs ET des assistants IA nommés explicitement (certains
// hébergeurs bloquent par défaut les robots d'IA qui ne sont pas cités).
const ROBOTS_IA = ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'DuckAssistBot', 'MistralAI-User', 'CCBot'];
const PRIVE = ['/triage/', '/outils/', '/philo-aggregator/', '/philo-mailbox/', '/cours_manuscrits/'];
function robots() {
  const bloc = ua => `User-agent: ${ua}\nAllow: /\n` + PRIVE.map(p => `Disallow: ${p}`).join('\n');
  return '# GÉNÉRÉ par outils/construire.mjs. NE PAS ÉDITER.\n# Tout le site est ouvert aux moteurs et aux assistants IA ; seuls les outils internes sont exclus.\n\n' +
    ['*'].concat(ROBOTS_IA).map(bloc).join('\n\n') + `\n\nSitemap: ${SITE}/sitemap.xml\n`;
}
/* llms.txt — un résumé du site en Markdown pour les assistants IA (proposition
   llmstxt.org) : ce qu'est le site et où sont les fiches. */
function llms(d, ctx) {
  const auteurs = Object.keys(d.AM).filter(nm => ctx.ai[nm]);
  return `# ${NOM_SITE} — Terminale\n\n> Site gratuit de révision de la philosophie au baccalauréat (programme français de Terminale, BO 2019) : une fiche par notion avec définitions, auteurs, citations, plans de dissertation, sujets tombés au bac et exemples ; une fiche par auteur ; un graphe interactif des notions, un quiz à répétition espacée et une méthodologie de la dissertation et de l'explication de texte.\n\nContenu rédigé par des élèves, relu mais pouvant contenir des erreurs. Les citations sont entre guillemets « » uniquement quand elles ont été vérifiées.\n\n## Notions du programme\n\n` +
    d.KEYS.filter(k => d.PROGRAMME.notions.includes(k)).map(k => `- [${nomAvecArticle(k, d.D[k].l)}](${SITE}/notions/${slugNotion(k)}/): ${d.D[k].s}`).join('\n') +
    `\n\n## Notions complémentaires\n\n` + d.KEYS.filter(k => !d.PROGRAMME.notions.includes(k)).map(k => `- [${nomAvecArticle(k, d.D[k].l)}](${SITE}/notions/${slugNotion(k)}/): ${d.D[k].s}`).join('\n') +
    `\n\n## Auteurs\n\n` + auteurs.map(nm => `- [${nm}](${SITE}/auteurs/${slug(nm)}/)`).join('\n') +
    `\n\n## Outil interactif\n\n- [Graphe, quiz et méthodologie](${SITE}/): application web (JavaScript), installable et utilisable hors ligne.\n`;
}

/* cheminsPages(d) — {notions:{clé→chemin}, auteurs:{nom→chemin}} : l'adresse
   de la page statique de chaque fiche (auteurs cités dans une notion
   seulement, comme genererPages). Écrit dans data.js (PAGES_STATIQUES) pour
   que l'app pose de VRAIS liens <a href> vers ces pages (maillage interne). */
export function cheminsPages(d) {
  const ai = indexAuteurs(d.D, d.KEYS);
  const notions = {}, auteurs = {};
  d.KEYS.forEach(k => { notions[k] = `notions/${slugNotion(k)}/`; });
  Object.keys(d.AM).filter(nm => ai[nm]).forEach(nm => { auteurs[nm] = `auteurs/${slug(nm)}/`; });
  return { notions, auteurs };
}

/* genererPages(d, date) — toutes les pages : {chemin relatif: texte}.
   `date` (AAAA-MM-JJ) sert au sitemap et à dateModified : on prend celle de
   la dernière entrée de NOUVEAUTES, pour que le build reste reproductible
   (même contenu → mêmes fichiers, ce qu'exige le contrôle du hook). */
export function genererPages(d) {
  const date = (d.NOUVEAUTES[0] && d.NOUVEAUTES[0].date) || '2026-01-01';
  const ctx = { date, am: d.AM, ai: indexAuteurs(d.D, d.KEYS) };
  const sorties = {};
  const ajout = ([c, t]) => { if (sorties[c]) throw new Error('page en double : ' + c); sorties[c] = t; };
  d.KEYS.forEach(k => ajout(pageNotion(k, d, ctx)));
  Object.keys(d.AM).filter(nm => ctx.ai[nm]).forEach(nm => ajout(pageAuteur(nm, d, ctx)));
  ajout(pageSommaire(d, ctx));
  const chemins = Object.keys(sorties).filter(c => c !== 'fiches/index.html').map(c => c.replace(/index\.html$/, ''));
  sorties['sitemap.xml'] = sitemap(chemins, date);
  sorties['robots.txt'] = robots();
  sorties['llms.txt'] = llms(d, ctx);
  return sorties;
}
