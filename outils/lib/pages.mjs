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
const json = o => JSON.stringify(o).replace(/</g, '\\u003c');
// citerApp(c) — une citation dans une carte d'auteur pré-rendue (classe .aq
// de l'app) : exacte entre « », sinon reformulation annoncée comme telle.
const citerApp = c => /^«/.test(c) ? `<blockquote class="aq">${esc(c)}</blockquote>` : `<div class="aq">En substance : ${esc(c)}</div>`;

/* ── Pages d'ENTRÉE (nov. 2026) ──────────────────────────────────────
   Une page /notions/<slug>/ ou /auteurs/<slug>/ n'est plus une page à part :
   c'est index.html (l'app entière) avec ses propres <title>, description,
   canonical, Open Graph et JSON-LD, et la fiche PRÉ-RENDUE dans les zones
   de l'app (barre latérale, fil d'Ariane, onglets, contenu). Au démarrage,
   l'app lit <body data-entree="notion:<clé>|auteur:<nom>"> et ouvre cette
   fiche (entreeDePage, js/02-navigation.js) ; le reste de la navigation se
   fait sur place, sans recharger. <base href="/"> : les chemins relatifs
   d'index.html (app.css, data.js, sw.js, manifest.json…) visent la racine.

   remplacer(html, avant, apres) — remplacement exact et unique, sinon
   erreur de build (index.html a changé de forme : à adapter ici). */
function remplacer(html, motif, par) {
  const n = typeof motif === 'string' ? html.split(motif).length - 1 : (html.match(new RegExp(motif.source, 'g')) || []).length;
  if (n !== 1) throw new Error(`pages d'entrée : motif ${motif} trouvé ${n} fois dans index.html`);
  return html.replace(motif, () => par);
}
/* pageApp(gabarit, {...}) — la page d'entrée d'une fiche, faite à partir
   d'index.html (gabarit, déjà pré-rendu pour l'accueil). */
function pageApp(gabarit, { chemin, titre, description, jsonld, type = 'article', entree, actif, ariane, tabs, main }) {
  const url = SITE + '/' + chemin;
  let h = gabarit;
  h = remplacer(h, '<!DOCTYPE html>', `<!DOCTYPE html>\n<!-- GÉNÉRÉ par outils/construire.mjs (outils/lib/pages.mjs) à partir d'index.html et de contenu/. NE PAS ÉDITER. -->`);
  h = remplacer(h, '<meta charset="UTF-8">', '<meta charset="UTF-8">\n<base href="/">');
  h = remplacer(h, /<title>[^<]*<\/title>/, `<title>${esc(titre)}</title>`);
  h = remplacer(h, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(description)}">`);
  h = remplacer(h, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  h = remplacer(h, /<meta property="og:type" content="[^"]*">/, `<meta property="og:type" content="${type}">`);
  h = remplacer(h, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(titre)}">`);
  h = remplacer(h, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(description)}">`);
  h = remplacer(h, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  h = remplacer(h, /<script type="application\/ld\+json">[^\n]*<\/script>/, `<script type="application/ld+json">${json(jsonld)}</script>`);
  h = remplacer(h, /<\/head>\s*<body>/, `</head>\n<body data-entree="${esc(entree)}">`);
  h = remplacer(h, /<!--PRERENDU:sb-->[\s\S]*<!--\/PRERENDU:sb-->/, `<!--PRERENDU:sb-->${sbPrerendu(ctxPages.d, actif)}<!--/PRERENDU:sb-->`);
  h = remplacer(h, /<!--PRERENDU:main-->[\s\S]*<!--\/PRERENDU:main-->/, `<!--PRERENDU:main-->${main}<!--/PRERENDU:main-->`);
  h = remplacer(h, '<div class="crumbs" id="crumbs"></div>', `<div class="crumbs" id="crumbs">${ariane}</div>`);
  h = remplacer(h, '<div class="tabs"></div>', `<div class="tabs">${tabs}</div>`);
  return h;
}
const ctxPages = { d: null };   // les données, pour sbPrerendu (posé par genererPages)

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
  const r = '/';   // page d'entrée : chemins absolus depuis la racine du site
  const titre = `${nom} : fiche de révision bac philo | ${NOM_SITE}`;
  const auteurs = n.auteurs.map(a => a.n);
  const description = court(`Fiche sur ${minuscule(nom)} (philosophie Terminale) : ${n.s} Définitions, ${auteurs.slice(0, 4).join(', ')}, citations, plans de dissertation et exemples.`);
  const concepts = d.CONCEPTS.filter(c => c.cat !== 'Repère' && (c.notions || []).includes(k));
  const sujets = d.SUJETS_BAC.sujets.filter(s => s.notions.includes(k));
  const fa = ariane([{ nom: 'Accueil', chemin: '' }, { nom: 'Fiches', chemin: 'fiches/' }, { nom: n.l, chemin }], r);
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
  // Page d'ENTRÉE (nov. 2026) : l'app elle-même, ouverte sur cette notion.
  // Le HTML montre exactement ce que l'app affiche à l'ouverture (onglet
  // Auteurs : en-tête, définition, cartes d'auteurs, avec les classes de
  // l'app) : un miroir, rien de plus ni de caché. Les autres onglets se
  // lisent dans l'app, d'un clic, comme pour tout visiteur.
  const parAuteur = [];
  n.auteurs.forEach(a => { const x = parAuteur.find(y => y.n === a.n); if (x) x.ideas.push(...a.ideas); else parAuteur.push({ n: a.n, ideas: a.ideas.slice() }); });
  const main = `<div class="notion-head"><div class="nbadge" style="background:${n.c}"></div><div><h1 class="ntitle">${esc(n.l)}${hp ? ' <span class="hp-badge">hors programme</span>' : ''}</h1><div class="nsub">${esc(n.s)}</div></div></div>
<div class="def-box">${html(n.def)}</div>
<h2 class="slabel">Auteurs et idées clés (${parAuteur.length} auteurs)</h2><div class="ag">` + parAuteur.map(a =>
    `<div class="ac${a.ideas.length > 1 ? ' ac-multi' : ''}"><h3 class="an">${ctx.am[a.n] ? `<a class="an-link" href="/auteurs/${slug(a.n)}/">${esc(a.n)}</a>` : esc(a.n)}</h3><div class="a-ideas">` +
    a.ideas.map(i => `<div class="a-idea"><div class="aw">${esc(i.w || '')}</div>${i.i ? `<div class="ai">${html(i.i)}</div>` : ''}${(i.citations || []).map(citerApp).join('')}</div>`).join('') +
    '</div></div>').join('') + `</div>`;
  const tabs = ['Auteurs', 'Textes', 'Concepts', 'Dissertations', 'Exemples'].map((t, i) => `<div class="tab${i ? '' : ' active'}">${t}</div>`).join('');
  return [chemin + 'index.html', pageApp(ctx.gabarit, { chemin, titre, description, jsonld, entree: 'notion:' + k, actif: k, ariane: fa.vis, tabs, main })];
}

/* ── Page d'un auteur ────────────────────────────────────────────── */
function pageAuteur(nm, d, ctx) {
  const a = d.AM[nm];
  const chemin = `auteurs/${slug(nm)}/`;
  const r = '/';   // page d'entrée : chemins absolus depuis la racine du site
  const auProgramme = d.PROGRAMME.auteurs.some(x => x.fiches.includes(nm));
  const notions = ctx.ai[nm] || [];
  const dates = a.naissance != null ? ` (${an(a.naissance)}${a.mort != null ? ' – ' + an(a.mort) : ''})` : '';
  const titre = `${nm} : idées, citations et notions | Bac philo – ${NOM_SITE}`;
  const description = court(`${nm}${dates}, ${a.courant || 'philosophe'}. ${brut(a.bio)} Ses idées pour ${notions.map(x => d.D[x.cle].l.toLowerCase()).slice(0, 4).join(', ')}.`);
  const fa = ariane([{ nom: 'Accueil', chemin: '' }, { nom: 'Fiches', chemin: 'fiches/' }, { nom: nm, chemin }], r);
  const citations = notions.flatMap(x => x.ideas.flatMap(i => i.citations || [])).filter(c => /^«/.test(c));
  // Page d'ENTRÉE : l'app ouverte sur la fiche de l'auteur (cf. pageNotion).
  const main = `<div class="notion-head"><div><h1 class="author-title">${esc(nm)}${esc(dates)}</h1><div class="nsub">${esc(a.courant || '')}${a.periode ? ' · ' + esc(a.periode) : ''} · ${auProgramme ? 'au programme' : 'hors liste officielle'}</div></div></div>
<div class="author-def-box">${html(a.bio)}${(a.themes || []).length ? `<p><strong>Thèmes :</strong> ${a.themes.map(esc).join(', ')}.</p>` : ''}</div>
<h2 class="slabel">Idées de ${esc(nm)} par notion</h2>` + notions.map(x => `<div class="ac"><h3 class="an"><a class="an-link" href="/notions/${slugNotion(x.cle)}/">${esc(d.D[x.cle].l)}</a></h3><div class="a-ideas">` +
    x.ideas.map(i => `<div class="a-idea"><div class="aw">${esc(i.w || '')}</div><div class="ai">${html(i.i)}</div>${(i.citations || []).map(citerApp).join('')}</div>`).join('') + '</div></div>').join('');
  const tabs = ['Idées', 'Citations', 'Œuvres', 'Dialogues'].map((t, i) => `<div class="tab${i ? '' : ' active'}">${t}</div>`).join('');
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
  return [chemin + 'index.html', pageApp(ctx.gabarit, { chemin, titre, description, jsonld, type: 'profile', entree: 'auteur:' + nm, ariane: fa.vis, tabs, main })];
}
const an = y => (y < 0 ? -y + ' av. J.-C.' : String(y));

/* ── Sommaire de toutes les fiches ───────────────────────────────── */
function pageSommaire(d, ctx) {
  const chemin = 'fiches/';
  const r = '/';
  const prog = d.KEYS.filter(k => d.PROGRAMME.notions.includes(k)), hp = d.KEYS.filter(k => !d.PROGRAMME.notions.includes(k));
  const auteurs = Object.keys(d.AM).filter(nm => ctx.ai[nm]);
  const titre = `Fiches de révision bac philo : les 17 notions et ${auteurs.length} auteurs | ${NOM_SITE}`;
  const description = `Toutes les fiches de révision de philosophie de Terminale : les 17 notions du programme, des notions complémentaires et ${auteurs.length} fiches d’auteurs, avec citations, plans et exemples.`;
  const fa = ariane([{ nom: 'Accueil', chemin: '' }, { nom: 'Fiches', chemin }], r);
  // Page d'entrée de l'app (data-entree="fiches"), dans le style de l'app.
  const carte = k => `<a class="ac" href="/notions/${slugNotion(k)}/"><h3 class="an"><span class="dot" style="background:${d.D[k].c}"></span> ${esc(nomAvecArticle(k, d.D[k].l))}</h3><div class="nsub">${esc(d.D[k].s)}</div></a>`;
  const main = `<div class="notion-head"><div><h1 class="ntitle">Fiches de révision de philosophie (Terminale)</h1><div class="nsub">Chaque fiche réunit la définition de la notion, les auteurs et leurs citations, des plans de dissertation, des sujets tombés au bac et des exemples.</div></div></div>
<h2 class="slabel">Les ${prog.length} notions du programme</h2><div class="sommaire-liste">${prog.map(carte).join('')}</div>
${hp.length ? `<h2 class="slabel">Notions complémentaires (hors programme)</h2><div class="sommaire-liste">${hp.map(carte).join('')}</div>` : ''}
<h2 class="slabel">Les auteurs</h2><nav class="sommaire-auteurs" aria-label="Les auteurs">${auteurs.map(nm => `<a href="/auteurs/${slug(nm)}/">${esc(nm)}</a>`).join('')}</nav>`;
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', url: SITE + '/' + chemin, name: titre, description, inLanguage: 'fr', isPartOf: { '@type': 'WebSite', name: NOM_SITE, url: SITE + '/' },
      mainEntity: { '@type': 'ItemList', itemListElement: d.KEYS.map((k, i) => ({ '@type': 'ListItem', position: i + 1, name: d.D[k].l, url: `${SITE}/notions/${slugNotion(k)}/` })) } },
    fa.ld] };
  return ['fiches/index.html', pageApp(ctx.gabarit, { chemin, titre, description, jsonld, type: 'website', entree: 'fiches', ariane: fa.vis, tabs: '', main })];
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
const PRIVE = ['/admin/', '/triage/', '/outils/', '/philo-aggregator/', '/philo-mailbox/', '/cours_manuscrits/'];
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

/* prerenduAccueil(d) — le contenu PRÉ-RENDU de index.html (nov. 2026) :
   {sb, main}. Les robots qui ne lancent pas le JavaScript lisent ainsi,
   dans le HTML brut, un <h1>, une présentation et de vrais liens vers les
   pages statiques. `sb` va DANS #sb (renderSB le vide à son premier appel),
   `main` DANS .main-content (chaque rendu de fiche le remplace) : une fois
   l'app démarrée, il n'en reste rien, donc rien en double. Les classes
   reprennent celles de l'app (.nb, .ntitle, .nsub) : même aspect pendant
   l'instant où la page s'affiche avant le script. */
export function prerenduAccueil(d) {
  const prog = d.KEYS.filter(k => d.PROGRAMME.notions.includes(k));
  const sb = sbPrerendu(d, null);
  const main = `<div class="prerendu-intro">\n<h1 class="ntitle">Fiches de révision de philosophie : les 17 notions du programme de Terminale</h1>\n<p class="nsub">Pour chaque notion du bac de philo : définitions, auteurs et citations, plans de dissertation, sujets tombés au bac et exemples, reliés en graphe interactif, avec un quiz pour réviser. Gratuit, utilisable hors ligne.</p>\n<p class="nsub">Les notions : ${prog.map(k => `<a href="notions/${slugNotion(k)}/">${esc(d.D[k].l)}</a>`).join(', ')}. Et aussi <a href="fiches/">toutes les fiches d’auteurs</a>.</p>\n</div>`;
  return { sb, main };
}

/* sbPrerendu(d, actif) — la liste des notions du programme (liens vers leurs
   pages), la notion `actif` marquée comme dans l'app (.nb.active). Sert à
   l'accueil et aux pages d'entrée. */
function sbPrerendu(d, actif) {
  const prog = d.KEYS.filter(k => d.PROGRAMME.notions.includes(k));
  if (actif && !prog.includes(actif)) prog.push(actif);   // notion hors programme ouverte
  const lien = k => `<a class="nb${k === actif ? ' active' : ''}" href="notions/${slugNotion(k)}/"><span class="dot" style="background:${d.D[k].c}"></span>${esc(d.D[k].l)}</a>`;
  return `<nav class="prerendu-nav" aria-label="Les notions du programme">\n${prog.map(lien).join('\n')}\n<a class="nb" href="fiches/">Toutes les fiches et les auteurs</a>\n</nav>`;
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

/* genererPages(d, gabarit) — toutes les pages : {chemin relatif: texte}.
   `date` (AAAA-MM-JJ) sert au sitemap et à dateModified : on prend celle de
   la dernière entrée de NOUVEAUTES, pour que le build reste reproductible
   (même contenu → mêmes fichiers, ce qu'exige le contrôle du hook). */
export function genererPages(d, gabarit) {
  const date = (d.NOUVEAUTES[0] && d.NOUVEAUTES[0].date) || '2026-01-01';
  ctxPages.d = d;
  // gabarit : index.html déjà pré-rendu, d'où partent les pages d'entrée.
  const ctx = { date, am: d.AM, ai: indexAuteurs(d.D, d.KEYS), gabarit };
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
