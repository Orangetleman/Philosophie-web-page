/* ════════════════════════════════════════════════════════════════════════
   admin/admin.js — la page /admin/ : connexion, boîte de réception, détail
   d'une boîte, tri, réponse (lot A2, docs/chantier-administration.md § 5).
   ────────────────────────────────────────────────────────────────────────
   Tout ce qui se calcule sans page est dans admin/modele.js (AdminModele) ;
   ici, l'état, le rendu et les gestes. Les données passent par l'objet API :
   les fonctions admin_* de Supabase, ou AdminEssai (fausses données) quand
   l'adresse contient ?essai.
   Rendu : la page entière est réécrite par rendre() depuis l'état ; les
   textes tapés et pas encore enregistrés vivent dans « brouillons ».
   ════════════════════════════════════════════════════════════════════════ */
'use strict';

// Les MÊMES valeurs publiques que le site (js/06-contribution.js).
const SUPABASE_URL = 'https://fipdatwirklhgdbujobz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7A5cSXlmufU1mDfjs1hIIA_PSHpXOdB';

/* ICONES_ADMIN / ico(nom) — icônes SVG au trait de la page d'administration,
   même dessin que js/00-icones.js (la page ne charge pas app.js). Règle de
   la charte : pas d'émoji dans l'interface (docs/charte-graphique.md). */
const ICONES_ADMIN = {
  dossier: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  ia: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4"/><circle cx="12" cy="3" r="1"/><path d="M9 13v1"/><path d="M15 13v1"/><path d="M2 13v2"/><path d="M22 13v2"/>',
  alerte: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  nuage: '<path d="M7 18a5 5 0 0 1-.6-10A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/>',
  exporter: '<path d="M12 15V3"/><path d="M7 8l5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>',
  flecheG: '<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>',
  externe: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  chevronH: '<path d="M6 15l6-6 6 6"/>',
  chevronB: '<path d="M6 9l6 6 6-6"/>',
  point: '<circle cx="12" cy="12" r="4" fill="currentColor"/>',
  importer: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>'
};
function ico(nom) {
  const c = ICONES_ADMIN[nom]; if (!c) return '';
  return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + c + '</svg>';
}

const M = window.AdminModele;
const ESSAI = new URLSearchParams(location.search).has('essai');
const SB = !ESSAI && window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

// Titres des notions, depuis data.js (D) : « travail » → « Le travail ».
const NOTIONS = {};
try { Object.keys(D).forEach(k => { NOTIONS[k] = D[k].l || k; }); } catch (e) { /* data.js absent : on garde les clés */ }
// Les noms des fiches d'auteurs (AM, data.js) : l'export y retrouve la fiche
// existante d'un auteur proposé sous une autre forme de nom.
let AUTEURS = [];
try { AUTEURS = Object.keys(AM); } catch (e) { /* data.js absent */ }

/* rpc(nom, args) — appelle une fonction de la base et rend ses données, ou
   lève l'erreur de Supabase (traduite plus haut par M.erreur). */
async function rpc(nom, args) {
  const { data, error } = await SB.rpc(nom, args);
  if (error) throw error;
  return data;
}
// L'API de la page : mêmes noms en vrai et en essai.
const API = ESSAI ? window.AdminEssai : {
  boites: () => rpc('admin_boites'),
  sujets: () => rpc('admin_sujets'),
  majBoite: (id, champs) => rpc('admin_maj_boite', { p_id: id, p_champs: champs }),
  supprimerBoite: id => rpc('admin_supprimer_boite', { p_id: id }),
  creerSujet: titre => rpc('admin_enregistrer_sujet', { p_id: null, p_champs: { titre } }),
  // Lot A3 : l'onglet Sujets.
  enregistrerSujet: (id, champs) => rpc('admin_enregistrer_sujet', { p_id: id, p_champs: champs }),
  supprimerSujet: id => rpc('admin_supprimer_sujet', { p_id: id }),
  // Lot A4 : la relecture par l'IA, fonction Supabase « relire »
  // (supabase/functions/relire). Une erreur renvoyée par la fonction
  // ({erreur: 'pas-admin'}…) devient le code « relire-pas-admin ».
  relire: async corps => {
    const { data, error } = await SB.functions.invoke('relire', { body: corps });
    if (!error) return data;
    let code = '';
    try { code = (await error.context.json()).erreur || ''; } catch (e) { /* pas de corps JSON */ }
    throw Object.assign(new Error(error.message), { code: code ? 'relire-' + code : (error.name === 'FunctionsHttpError' ? 'relire-http' : 'relire-absente'), status: error.context && error.context.status });
  },
  // Lot A5 : appliquer un compte rendu d'intégration (lignes cochées).
  importer: rapport => rpc('admin_importer_integration', { p_rapport: rapport }),
};

// Lot A5 : le site EN LIGNE, où l'on vérifie qu'un compte rendu est publié
// (/integrations/<fichier>, en-tête CORS posé par vercel.json).
const SITE_EN_LIGNE = 'https://philo.myprisme.fr';

// ── L'état ────────────────────────────────────────────────────────────────
const etat = {
  phase: 'chargement',      // chargement | connexion | pas-admin | boite
  onglet: 'boite',          // boite | sujets (lot A3) | integrer (lot A5)
  sujet: null,              // n° du sujet ouvert dans l'onglet Sujets
  filtreSujet: '',          // état des sujets montrés ('' = tous)
  email: '', uid: '',
  erreurConnexion: '',
  boites: [], sujets: [],
  filtres: Object.assign({}, M.FILTRES_DEFAUT),
  sel: null,                // n° de la boîte ouverte
  nouveauSujet: false,      // le champ « nouveau sujet » est ouvert
  occupe: false,
  apercu: null,             // lot A5 : {nom, rapport, lignes, enLigne} du compte rendu chargé
};
const brouillons = new Map();   // n° → {reponse, note} tapés, pas encore enregistrés
const racine = document.getElementById('racine');

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const boite = id => etat.boites.find(b => b.id === id) || null;
const visibles = () => M.filtrer(etat.boites, etat.filtres);
const etroit = () => window.matchMedia('(max-width: 760px)').matches;

/* dire(texte, mauvais) — le message en bas de l'écran, effacé après 4 s. */
let minuteur = null;
function dire(texte, mauvais) {
  const el = document.getElementById('message');
  el.textContent = texte;
  el.className = 'message on' + (mauvais ? ' mauvais' : '');
  clearTimeout(minuteur);
  minuteur = setTimeout(() => { el.className = 'message'; }, mauvais ? 7000 : 3500);
}
const echec = e => { console.error(e); dire(M.erreur(e), true); };

// ── Entrer ────────────────────────────────────────────────────────────────

/* charger() — lit boîtes et sujets ; règle la phase selon la réponse de la
   base (pas admin, migration absente, ou la boîte de réception). */
async function charger() {
  try {
    const [boites, sujets] = await Promise.all([API.boites(), API.sujets()]);
    etat.boites = boites || [];
    etat.sujets = sujets || [];
    etat.phase = 'boite';
    suivreAdresse();
  } catch (e) {
    if ((e && e.code) === '42501') { etat.phase = 'pas-admin'; }
    else { etat.phase = 'connexion'; etat.erreurConnexion = M.erreur(e); }
  }
  rendre();
}

/* entrer(session) — après une connexion (ou une session gardée). */
async function entrer(session) {
  if (!session) { etat.phase = 'connexion'; rendre(); return; }
  etat.email = session.user.email || '';
  etat.uid = session.user.id;
  await charger();
}

async function connexionEmail(email, mdp) {
  etat.erreurConnexion = '';
  const { data, error } = await SB.auth.signInWithPassword({ email, password: mdp });
  if (error) { etat.erreurConnexion = M.erreur(error); rendre(); return; }
  await entrer(data.session);
}
async function connexionGoogle() {
  // En local, l'adresse localhost doit figurer dans les « Redirect URLs » de
  // Supabase (Authentication › URL Configuration), sinon Google renvoie sur le site.
  const { error } = await SB.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + '/admin/' } });
  if (error) { etat.erreurConnexion = M.erreur(error); rendre(); }
}
async function sortir() {
  if (SB) await SB.auth.signOut();
  location.hash = '';
  location.reload();
}

// ── Rendu ─────────────────────────────────────────────────────────────────

/* rendre(focus) — réécrit la page depuis l'état, puis remet le focus sur
   l'élément voulu (sélecteur) ou sur celui qui l'avait. */
function rendre(focus) {
  const actif = document.activeElement;
  const garde = focus || (actif && actif.id ? '#' + actif.id : null);
  racine.innerHTML =
    etat.phase === 'chargement' ? `<p class="vide">Chargement…</p>` :
    etat.phase === 'connexion' ? pageConnexion() :
    etat.phase === 'pas-admin' ? pagePasAdmin() :
    entete() + (etat.onglet === 'sujets' ? ongletSujets() : etat.onglet === 'integrer' ? ongletIntegrer() : boiteDeReception());
  if (garde) {
    const el = racine.querySelector(garde);
    if (el) {
      el.focus({ preventScroll: !focus });
      // Le champ de recherche est recréé à chaque lettre : curseur remis en fin.
      if (el.id === 'f-q') el.setSelectionRange(el.value.length, el.value.length);
    }
  }
}

function pageConnexion() {
  return `<main class="login">
    <h1>${ico('dossier')} Administration</h1>
    <p class="hint">Le tri des propositions de Graphe Philo. Connecte-toi avec ton compte administrateur.</p>
    ${etat.erreurConnexion ? `<div class="err">${esc(etat.erreurConnexion)}</div>` : ''}
    <button type="button" data-act="google">Continuer avec Google</button>
    <div class="sep">ou</div>
    <form id="form-connexion">
      <input type="email" id="c-email" autocomplete="username" placeholder="adresse e-mail" required>
      <input type="password" id="c-mdp" autocomplete="current-password" placeholder="mot de passe" required>
      <button class="primary" type="submit">Se connecter</button>
    </form>
    <p class="hint"><a href="?essai">Essayer sur de fausses données</a>, sans compte.</p>
  </main>`;
}

function pagePasAdmin() {
  return `<main class="login">
    <h1>${ico('dossier')} Administration</h1>
    <div class="info">
      <b>Ce compte n'est pas administrateur.</b>
      <span>Connecté en tant que ${esc(etat.email)}. Pour l'autoriser, colle son identifiant dans l'éditeur SQL de Supabase :</span>
      <code>insert into public.app_admins (user_id) values ('${esc(etat.uid)}');</code>
      <div class="acts"><button type="button" data-act="copier-uid">Copier l'identifiant</button><button type="button" data-act="sortir">Se déconnecter</button></div>
    </div>
  </main>`;
}

function entete() {
  const nouvelles = etat.boites.filter(b => !b.lue_le).length;
  const mode = ESSAI ? `<span class="mode essai" title="Rien n'est enregistré : les données sont fausses et se perdent au rechargement.">essai · fausses données</span>`
    : `<span class="mode">${LOCAL ? 'local · vraie base' : 'en ligne'}</span>`;
  // Lot A4 : combien de boîtes l'IA peut relire (en attente, jamais relues,
  // hors retours sur le site) ; la fonction en prend 8 par appel.
  const aRelire = etat.boites.filter(b => b.statut === 'en_attente' && !b.ia_verdict && M.categorieDe(b) !== 'site').length;
  const onglet = (k, label) => `<button type="button" role="tab" id="onglet-${k}" data-onglet="${k}" aria-selected="${etat.onglet === k}" tabindex="${etat.onglet === k ? 0 : -1}">${label}</button>`;
  return `<header class="head">
    <h1>${ico('dossier')}</h1>
    <div class="tabs" role="tablist" aria-label="Parties de l'administration">
      ${onglet('boite', `Boîte de réception${nouvelles ? `<span class="chip" title="jamais ouvertes">${nouvelles}</span>` : ''}`)}
      ${onglet('sujets', `Sujets (${etat.sujets.length})`)}
      ${onglet('integrer', `À intégrer (${etat.boites.filter(b => b.statut === 'validee').length})`)}
    </div>
    <span class="right">${etat.relecture ? `<span class="relecture" role="status"><span class="toupie" aria-hidden="true"></span>L'IA relit ${etat.relecture.n} boîte${etat.relecture.n > 1 ? 's' : ''}… <span id="relecture-temps">${Math.round((Date.now() - etat.relecture.debut) / 1000)} s</span> <span class="hint">(≈ ${etat.relecture.n * 5} s)</span></span>`
      : `<button type="button" data-act="relire"${aRelire && !etat.occupe ? '' : ' disabled'} title="Gemini donne un avis sur les boîtes en attente jamais relues (8 au plus par clic). Il ne reçoit que leur texte.">${ico('ia')} Relire avec l'IA${aRelire ? ` (${aRelire})` : ''}</button>`}${mode}${etat.email ? `<span>${esc(etat.email)}</span>` : ''}
      <button type="button" class="link" data-act="actualiser">Actualiser</button>
      ${ESSAI ? '<a href="/admin/">Quitter l\'essai</a>' : '<button type="button" class="link" data-act="sortir">Se déconnecter</button>'}</span>
  </header>`;
}

function filtresHtml() {
  const f = etat.filtres;
  const opt = (v, l, sel) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(l)}</option>`;
  return `<div class="filters">
    <select id="f-cat" aria-label="Catégorie">${opt('', 'Toutes catégories', f.cat)}${Object.entries(M.CATEGORIES).map(([k, v]) => opt(k, v, f.cat)).join('')}</select>
    <select id="f-etat" aria-label="État">${Object.entries(M.FILTRES_ETAT).map(([k, v]) => opt(k, v, f.etat)).join('')}</select>
    <select id="f-ia" aria-label="Avis IA">${Object.entries(M.FILTRES_IA).map(([k, v]) => opt(k, v, f.ia)).join('')}</select>
    <input type="search" id="f-q" aria-label="Chercher" placeholder="Chercher (touche /)" value="${esc(f.q)}">
  </div>`;
}

/* aDoublon(id) — la boîte a-t-elle un doublon sûr (même signature ou même
   nom) ? Calculé une fois par liste de boîtes (M.doublons, mode rapide) :
   sert à la pastille « doublon ? » de la liste. */
const memoDoublons = { ref: null, ids: new Set() };
function aDoublon(id) {
  if (memoDoublons.ref !== etat.boites) {
    memoDoublons.ref = etat.boites;
    memoDoublons.ids = new Set(etat.boites.filter(b => b.statut !== 'refusee' && M.doublons(b, etat.boites, null, true).length).map(b => b.id));
  }
  return memoDoublons.ids.has(id);
}

function pilleIA(b) {
  const v = M.VERDICTS[b.ia_verdict];
  return v ? `<span class="pill ${v[0]}">${esc(v[1])}</span>` : '';
}

function ligne(b) {
  const h = [
    b.lue_le ? '' : '<span class="new">'+ico('point')+' nouvelle</span>',
    'n° ' + b.id,
    esc(M.etiquette(b)),
    M.notionDe(b) ? esc(NOTIONS[M.notionDe(b)] || M.notionDe(b)) : '',
    esc(b.pseudo || 'anonyme'),
    esc(M.depuis(b.cree_le)),
    b.statut !== 'en_attente' ? esc(M.STATUTS[b.statut]) : '',
    b.reponse ? 'répondue' : '',
    pilleIA(b),
    aDoublon(b.id) ? '<span class="pill warn">doublon ?</span>' : '',
  ].filter(Boolean);
  return `<li><button type="button" class="${b.id === etat.sel ? 'sel' : ''}" data-boite="${b.id}" aria-current="${b.id === etat.sel}">
    <span class="h">${h.join(' · ')}</span><span class="t">${esc(M.resume(b, NOTIONS))}</span></button></li>`;
}

function boiteDeReception() {
  const liste = visibles();
  const b = boite(etat.sel);
  return `<div class="tb${b ? ' a-choix' : ''}">
    <nav class="tb-list" aria-label="Boîtes">${filtresHtml()}
      <div class="compte">${liste.length} boîte${liste.length > 1 ? 's' : ''} sur ${etat.boites.length}</div>
      ${liste.length ? `<ul class="it">${liste.map(ligne).join('')}</ul>` : `<p class="vide">Rien ici. ${etat.filtres.etat === 'a-traiter' ? 'Tout est trié.' : ''}</p>`}
    </nav>
    ${b ? detail(b) : `<section class="det rien"><p>Choisis une boîte dans la liste.</p></section>`}
  </div>`;
}

/* fiche(b) — le contenu de la boîte, champ par champ (M.champsLisibles). */
function fiche(b) {
  const champs = M.champsLisibles(b.contenu, NOTIONS);
  if (!champs.length) return `<div class="fiche"><span class="hint">(boîte vide)</span></div>`;
  const dl = l => `<dl>${l.map(c => `<dt>${esc(c.label)}</dt><dd>${esc(c.valeur)}</dd>`).join('')}</dl>`;
  const simples = champs.filter(c => !c.idee), idees = champs.filter(c => c.idee);
  return `<div class="fiche">${simples.length ? dl(simples) : ''}
    ${idees.map(c => `<div class="idee"><b>${esc(c.label)}</b>${dl(c.idee)}</div>`).join('')}</div>`;
}

function detail(b) {
  const br = brouillons.get(b.id) || {};
  const soeurs = etat.boites.filter(x => x.contribution === b.contribution).sort((x, y) => x.rang - y.rang);
  const seg = [['en_attente', 'En attente', 'A'], ['validee', 'Validée', 'V'], ['refusee', 'Refusée', 'R']]
    .map(([k, l, t]) => `<button type="button" data-statut="${k}" aria-pressed="${b.statut === k}"${etat.occupe ? ' disabled' : ''}>${l}<span class="kbd">${t}</span></button>`).join('');
  const notion = M.notionDe(b), lien = M.lienSite(b);
  const qui = b.a_compte ? `${ico('nuage')} compte : <b>${esc(b.pseudo || 'sans pseudo')}</b>`
    : b.a_suivi ? `sans compte${b.pseudo ? ' (' + esc(b.pseudo) + ')' : ''} · suivi par numéro` : `sans compte${b.pseudo ? ' (' + esc(b.pseudo) + ')' : ''} · pas de suivi`;
  const lecteur = b.a_compte ? 'le contributeur la lit dans « Mes propositions »'
    : b.a_suivi ? 'lue avec son numéro de suivi' : 'envoi sans compte ni numéro : personne ne la lira';
  const ia = b.ia_verdict
    ? `<details class="ia"${b.ia_verdict !== 'valide' ? ' open' : ''}><summary>${pilleIA(b)} Avis de l'IA${b.ia_le ? ` <span class="hint">${esc(M.depuis(b.ia_le))}</span>` : ''}</summary><div>${esc(b.ia_avis || '(pas de commentaire)')}</div></details>`
    : `<span class="hint">${M.categorieDe(b) === 'site' ? 'Retour sur le site : pas de relecture par l’IA.' : 'Pas encore relue par l’IA.'}</span>`;
  const relireUne = M.categorieDe(b) === 'site' ? '' : `<button type="button" class="link" data-act="relire-une"${etat.occupe ? ' disabled' : ''}>${ico('ia')} ${b.ia_verdict ? 'Relire à nouveau' : 'Relire cette boîte'}</button>`;
  // Lot A4 : les boîtes qui lui ressemblent (M.doublons), cliquables.
  const dbl = M.doublons(b, etat.boites).slice(0, 5);
  const doublonsHtml = dbl.length ? `<div class="dup"><b>${ico('alerte')} Ressemble à :</b> ${dbl.map(d => `<button type="button" class="link" data-boite="${d.id}">n° ${d.id}</button> <span class="hint">(${esc(d.raison)}, ${esc(M.STATUTS[d.statut] || d.statut)})</span>`).join(' · ')}</div>` : '';
  const integ = b.statut === 'integree'
    ? `<div class="info"><span><span class="pill ok">Intégrée</span> ${b.integration ? `commit <code>${esc(b.integration.commit)}</code>${b.integration.detail ? ' · ' + esc(b.integration.detail) : ''}` : 'à la main'}</span>
       <div class="acts"><button type="button" data-statut="validee">Remettre en « Validée »</button></div></div>` : '';
  const sujets = etat.sujets.map(s => `<option value="${s.id}"${b.sujet === s.id ? ' selected' : ''}>${esc(s.titre)} (${s.demandes})</option>`).join('');
  return `<section class="det" aria-labelledby="det-titre">
    <button type="button" class="back" data-act="liste">${ico('flecheG')} Liste</button>
    <div class="acts"><h2 id="det-titre" tabindex="-1">n° ${b.id} · ${esc(M.etiquette(b))}</h2>
      ${b.statut === 'integree' ? '' : `<span class="seg" role="group" aria-label="État de la boîte">${seg}</span>`}
      ${b.statut === 'validee' ? `<button type="button" data-act="integree" title="À la main, sans compte rendu (d'ordinaire : onglet « À intégrer », Importer un compte rendu)">Marquer intégrée</button>` : ''}</div>
    ${integ}
    <div class="ctx"><span>${qui}</span><span>reçue ${esc(M.depuis(b.cree_le))}</span>
      ${notion ? `<span>notion : ${esc(NOTIONS[notion] || notion)}</span>` : ''}
      ${lien ? `<a href="${esc(lien)}" target="_blank" rel="noopener">voir sur le site ${ico('externe')}</a>` : ''}</div>
    ${soeurs.length > 1 ? `<div class="contrib"><span>Envoyée avec :</span>${soeurs.map(s => `<button type="button" data-boite="${s.id}" aria-current="${s.id === b.id}" title="${esc(M.STATUTS[s.statut])}">n° ${s.id}</button>`).join('')}
      <span class="hint">le contributeur voit « ${esc(M.vuContributeur(soeurs.map(s => s.statut)))} »</span></div>` : ''}
    ${fiche(b)}
    <div class="acts">${ia}${relireUne}</div>
    ${doublonsHtml}
    <label class="blk">Ranger dans un sujet
      <select id="d-sujet"><option value="">— aucun —</option>${sujets}<option value="nouveau">+ Nouveau sujet…</option></select></label>
    ${etat.nouveauSujet ? `<div class="acts"><input type="text" id="d-nouveau" maxlength="300" placeholder="Titre du sujet (public s'il est publié)" style="flex:1"><button type="button" class="primary" data-act="creer-sujet">Créer</button><button type="button" data-act="annuler-sujet">Annuler</button></div>` : ''}
    <label class="blk">Répondre <span class="hint">${lecteur}</span>
      <textarea id="d-reponse" maxlength="2000"${!b.a_compte && !b.a_suivi ? ' disabled' : ''}>${esc(br.reponse != null ? br.reponse : b.reponse || '')}</textarea></label>
    <label class="blk">Note interne <span class="hint">jamais montrée au contributeur</span>
      <textarea id="d-note" rows="2" style="min-height:44px">${esc(br.note != null ? br.note : b.note || '')}</textarea></label>
    <div class="acts">
      <button type="button" class="primary" data-act="enregistrer"${etat.occupe ? ' disabled' : ''}>Enregistrer</button>
      <span class="hint">${brouillons.has(b.id) ? 'modifié, pas encore enregistré' : b.repondu_le ? 'réponse envoyée ' + esc(M.depuis(b.repondu_le)) : 'pas encore de réponse'}</span>
      <button type="button" class="danger del" data-act="supprimer">Supprimer (abus)…</button>
    </div>
  </section>`;
}

// ── Onglet Sujets (lot A3) ────────────────────────────────────────────────
// Un sujet regroupe des boîtes qui demandent la même chose ; publié, il
// paraît sur la page Propositions du site (Explorer), où les comptes votent.
// score = demandes (boîtes rangées) + votes pour − votes contre.

function ligneSujet(s) {
  return `<li><button type="button" class="${s.id === etat.sujet ? 'sel' : ''}" data-sujet="${s.id}" aria-current="${s.id === etat.sujet}">
    <span class="h"><b class="score">${s.score}</b> ${esc(M.ETATS_SUJET[s.etat] || s.etat)} · ${s.demandes} demande${s.demandes > 1 ? 's' : ''} · ${ico('chevronH')} ${s.pour} ${ico('chevronB')} ${s.contre} · ${s.publie ? 'publié' : '<i>non publié</i>'}</span>
    <span class="t">${esc(s.titre)}</span></button></li>`;
}

function ongletSujets() {
  const liste = etat.sujets.filter(s => !etat.filtreSujet || s.etat === etat.filtreSujet);
  const s = etat.sujets.find(x => x.id === etat.sujet) || null;
  const opt = (v, l) => `<option value="${v}"${v === etat.filtreSujet ? ' selected' : ''}>${esc(l)}</option>`;
  return `<div class="tb${s ? ' a-choix' : ''}" role="tabpanel" aria-labelledby="onglet-sujets">
    <nav class="tb-list" aria-label="Sujets">
      <div class="filters"><select id="f-sujet" aria-label="État des sujets">${opt('', 'Tous les états')}${Object.entries(M.ETATS_SUJET).map(([k, v]) => opt(k, v)).join('')}</select>
        <button type="button" data-act="sujet-nouveau">+ Nouveau sujet</button></div>
      <div class="compte">les plus demandés d'abord · score = demandes + pour − contre</div>
      ${liste.length ? `<ul class="it">${liste.map(ligneSujet).join('')}</ul>` : `<p class="vide">Aucun sujet. On en crée un depuis une boîte (« Ranger dans un sujet ») ou par « + Nouveau sujet ».</p>`}
    </nav>
    ${s ? detailSujet(s) : `<section class="det rien"><p>Choisis un sujet dans la liste.</p></section>`}
  </div>`;
}

function detailSujet(s) {
  const rangees = etat.boites.filter(b => b.sujet === s.id);
  const seg = Object.entries(M.ETATS_SUJET).map(([k, l]) => `<button type="button" data-etat-sujet="${k}" aria-pressed="${s.etat === k}"${etat.occupe ? ' disabled' : ''}>${esc(l)}</button>`).join('');
  const sansReponse = rangees.filter(b => !b.reponse && (b.a_compte || b.a_suivi)).length;
  return `<section class="det" aria-labelledby="sujet-titre">
    <button type="button" class="back" data-act="liste">${ico('flecheG')} Liste</button>
    <div class="acts"><h2 id="sujet-titre" tabindex="-1">Sujet · score ${s.score}</h2><span class="seg" role="group" aria-label="État du sujet">${seg}</span></div>
    <span class="hint">${s.demandes} demande${s.demandes > 1 ? 's' : ''} + ${s.pour} ${ico('chevronH')} − ${s.contre} ${ico('chevronB')}${s.publie ? ' · visible sur la page Propositions' : ' · pas publié : personne ne le voit'}</span>
    <label class="blk">Titre <span class="hint">public s'il est publié</span><input type="text" id="s-titre" maxlength="300" value="${esc(s.titre)}"></label>
    <label class="blk">Description <span class="hint">facultative, publique</span><textarea id="s-description" maxlength="2000" rows="2" style="min-height:48px">${esc(s.description || '')}</textarea></label>
    <label class="blk">Réponse publique <span class="hint">affichée sous le sujet, sur la page Propositions</span><textarea id="s-reponse" maxlength="2000">${esc(s.reponse || '')}</textarea></label>
    ${sansReponse ? `<label class="acts"><input type="checkbox" id="s-copier"> Envoyer aussi cette réponse aux ${sansReponse} boîte${sansReponse > 1 ? 's' : ''} rangée${sansReponse > 1 ? 's' : ''} ici qui n'en ont pas</label>` : ''}
    <div class="acts"><label><input type="checkbox" id="s-publie"${s.publie ? ' checked' : ''}> Publier sur la page Propositions</label>
      <button type="button" class="primary" data-act="sujet-enregistrer" style="margin-left:auto"${etat.occupe ? ' disabled' : ''}>Enregistrer</button></div>
    <div><b>Demandes rangées ici</b>
      ${rangees.length ? `<ul class="it">${rangees.map(ligne).join('')}</ul>` : '<p class="hint">Aucune boîte : le score ne vient que des votes.</p>'}</div>
    <div class="acts"><button type="button" class="danger del" data-act="sujet-supprimer">Supprimer le sujet…</button></div>
  </section>`;
}

/* rechargerSujets() — relit sujets et boîtes après un changement. */
async function rechargerSujets() {
  const [sujets, boites] = await Promise.all([API.sujets(), API.boites()]);
  etat.sujets = sujets || []; etat.boites = boites || etat.boites;
}

/* enregistrerSujet() — titre, description, réponse, publication ; et, si la
   case est cochée, la réponse copiée dans les boîtes rangées sans réponse
   (le contributeur la lit alors dans « Mes propositions »). */
async function enregistrerSujet() {
  const s = etat.sujets.find(x => x.id === etat.sujet); if (!s) return;
  const v = id => document.getElementById(id).value.trim();
  const champs = { titre: v('s-titre'), description: v('s-description'), reponse: v('s-reponse'), publie: document.getElementById('s-publie').checked };
  if (!champs.titre) return dire('Il faut un titre.', true);
  const copier = document.getElementById('s-copier');
  etat.occupe = true; rendre();
  try {
    await API.enregistrerSujet(s.id, champs);
    let n = 0;
    if (copier && copier.checked && champs.reponse) {
      for (const b of etat.boites.filter(b => b.sujet === s.id && !b.reponse && (b.a_compte || b.a_suivi))) {
        await API.majBoite(b.id, { reponse: champs.reponse }); n++;
      }
    }
    await rechargerSujets();
    dire('Sujet enregistré' + (n ? `, réponse envoyée à ${n} boîte${n > 1 ? 's' : ''}.` : '.'));
  } catch (e) { echec(e); }
  etat.occupe = false; rendre();
}

async function changerEtatSujet(k) {
  etat.occupe = true; rendre();
  try { await API.enregistrerSujet(etat.sujet, { etat: k }); await rechargerSujets(); dire('Sujet : ' + M.ETATS_SUJET[k] + '.'); }
  catch (e) { echec(e); }
  etat.occupe = false; rendre();
}

async function nouveauSujet() {
  try {
    const id = await API.creerSujet('Nouveau sujet');
    await rechargerSujets();
    etat.sujet = id; rendre('#s-titre');
    const t = document.getElementById('s-titre'); if (t) t.select();
  } catch (e) { echec(e); }
}

async function supprimerSujet() {
  const s = etat.sujets.find(x => x.id === etat.sujet); if (!s) return;
  const ok = await confirmer(`Supprimer le sujet « ${s.titre} » ?`,
    `Ses ${s.demandes} boîte${s.demandes > 1 ? 's' : ''} restent, simplement retirées du sujet. Ses votes sont effacés. C'est définitif.`, 'Supprimer le sujet');
  if (!ok) return;
  try { await API.supprimerSujet(s.id); etat.sujet = null; await rechargerSujets(); dire('Sujet supprimé.'); }
  catch (e) { echec(e); }
  rendre();
}

// ── Onglet À intégrer (lot A5, cadrage § 9) ───────────────────────────────
// Les boîtes « Validée » groupées par fichier de contenu/ ; l'export
// philo-export/v1 part vers Claude (docs/protocole-integration.md), le
// compte rendu philo-integration/v1 revient, relu ici avant d'être appliqué.

function ongletIntegrer() {
  const val = etat.boites.filter(b => b.statut === 'validee');
  const groupes = new Map();
  val.forEach(b => { const f = M.fichierCible(b, AUTEURS); if (!groupes.has(f)) groupes.set(f, []); groupes.get(f).push(b); });
  const cles = [...groupes.keys()].sort();
  return `<div class="integ" role="tabpanel" aria-labelledby="onglet-integrer">
    <div class="acts">
      <button type="button" class="primary" data-act="exporter"${val.length ? '' : ' disabled'}>${ico('exporter')} Exporter les validées (${val.length})</button>
      <label class="bouton">${ico('importer')} Importer un compte rendu<input type="file" id="i-fichier" accept=".json,application/json" hidden></label>
      <span class="hint">L'export ne contient ni pseudo ni compte. Mode d'emploi : docs/protocole-integration.md.</span>
    </div>
    ${etat.apercu ? apercuHtml() : ''}
    ${val.length ? cles.map(f => `<section class="groupe"><h3><code>${esc(f)}</code> <span class="hint">${groupes.get(f).length}</span></h3>
      <ul class="it">${groupes.get(f).map(ligne).join('')}</ul></section>`).join('')
      : '<p class="vide">Aucune boîte validée : rien à intégrer.</p>'}
  </div>`;
}

/* apercuHtml() — le compte rendu chargé, une ligne par boîte : résultat,
   détail, réponse modifiable, case à cocher ; rien n'est appliqué avant
   « Appliquer ». */
const ETATS_CR = { ok: '', deja: 'déjà appliquée', inconnue: 'n° inconnu', 'pas-validee': 'n’est plus « Validée »', 'resultat-inconnu': 'résultat inconnu', double: 'en double' };
function apercuHtml() {
  const a = etat.apercu;
  const n = a.lignes.filter(l => l.coche && l.etat === 'ok').length;
  const enLigne = a.enLigne === true ? '<span class="pill ok">en ligne</span>'
    : a.enLigne === 'essai' ? '<span class="pill">essai : pas de vérification</span>'
    : a.enLigne === false ? `<span class="pill bad">pas encore en ligne</span> <span class="hint">${esc(SITE_EN_LIGNE)}/integrations/${esc(a.nom)} ne répond pas avec ce commit : fusionne, attends le déploiement, puis réimporte.</span>`
    : '<span class="hint">vérification de la mise en ligne…</span>';
  const peut = n && (a.enLigne === true || a.enLigne === 'essai') && !etat.occupe;
  return `<section class="apercu" aria-label="Compte rendu à appliquer">
    <h3>Compte rendu <code>${esc(a.nom)}</code> · commit <code>${esc(a.rapport.commit)}</code> ${enLigne}</h3>
    <ul class="it">${a.lignes.map((l, i) => `<li class="ligne-cr${l.etat === 'ok' ? '' : ' ecartee'}">
      <label><input type="checkbox" data-cr="${i}"${l.coche ? ' checked' : ''}${l.etat === 'ok' ? '' : ' disabled'}> <b>n° ${l.id}</b>
        · ${esc(M.RESULTATS[l.resultat] || l.resultat)}${l.etat !== 'ok' ? ` · <i>${esc(ETATS_CR[l.etat])}, ignorée</i>` : ''}</label>
      ${l.resume ? `<span class="hint">${esc(l.resume.slice(0, 120))}</span>` : ''}
      ${l.detail ? `<div>${esc(l.detail)}</div>` : ''}
      ${l.fichiers.length ? `<div class="hint">${l.fichiers.map(esc).join(' · ')}</div>` : ''}
      ${l.etat === 'ok' && l.resultat !== 'non_integree' ? `<textarea data-cr-reponse="${i}" maxlength="2000" rows="2" aria-label="Réponse au contributeur, n° ${l.id}">${esc(l.reponse)}</textarea>`
        : l.etat === 'ok' ? '<span class="hint">repasse « En attente », la raison va dans la note interne</span>' : ''}
    </li>`).join('')}</ul>
    <div class="acts"><button type="button" class="primary" data-act="appliquer"${peut ? '' : ' disabled'}>Appliquer (${n})</button>
      <button type="button" data-act="fermer-apercu">Fermer</button></div>
  </section>`;
}

/* exporterValidees() — télécharge philo-export-AAAA-MM-JJ.json. */
function exporterValidees() {
  const { nom, json } = M.exporter(etat.boites, undefined, AUTEURS);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' }));
  a.download = nom; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  dire(`${json.boites.length} boîte${json.boites.length > 1 ? 's' : ''} exportée${json.boites.length > 1 ? 's' : ''} : ${nom}.`);
}

/* chargerCompteRendu(fichier) — lit le fichier choisi, prépare l'aperçu,
   puis vérifie que le même fichier (même commit) est servi par le site en
   ligne ; sinon l'intégration n'est pas publiée et « Appliquer » reste grisé. */
async function chargerCompteRendu(fichier) {
  const r = M.lireCompteRendu(await fichier.text(), etat.boites);
  if (r.erreur) return dire(r.erreur, true);
  etat.apercu = { nom: fichier.name, rapport: r.rapport, lignes: r.lignes, enLigne: ESSAI ? 'essai' : null };
  rendre();
  if (ESSAI) return;
  let enLigne = false;
  try {
    const rep = await fetch(`${SITE_EN_LIGNE}/integrations/${encodeURIComponent(fichier.name)}`, { cache: 'no-store' });
    enLigne = rep.ok && (await rep.json().catch(() => ({}))).commit === r.rapport.commit;
  } catch (e) { /* réseau ou CORS : considéré comme pas en ligne */ }
  if (etat.apercu && etat.apercu.rapport === r.rapport) { etat.apercu.enLigne = enLigne; rendre(); }
}

/* appliquer() — envoie les lignes cochées à admin_importer_integration,
   puis dit ce que la base a fait (integree, non_integree, deja…). */
async function appliquer() {
  const a = etat.apercu; if (!a) return;
  etat.occupe = true; rendre();
  try {
    const res = (await API.importer(M.rapportAEnvoyer(a.rapport, a.lignes))) || [];
    etat.boites = (await API.boites()) || etat.boites;
    const c = k => res.filter(x => x.resultat === k).length;
    const integ = c('integree') + c('retouchee'), non = c('non_integree'), autres = res.length - integ - non;
    dire(`${integ} intégrée${integ > 1 ? 's' : ''}, ${non} remise${non > 1 ? 's' : ''} en attente${autres ? `, ${autres} ignorée${autres > 1 ? 's' : ''}` : ''}.`);
    etat.apercu = null;
  } catch (e) { echec(e); }
  etat.occupe = false; rendre();
}

// ── Relecture par l'IA (lot A4) ───────────────────────────────────────────

/* relire(corps) — appelle la fonction Supabase « relire » ({limite} ou
   {ids}), puis relit les boîtes et dit ce qui s'est passé. Compter ~5 s
   par boîte (Gemini, plus une pause pour son quota gratuit). */
async function relire(corps) {
  const n = corps.ids ? corps.ids.length : Math.min(8, etat.boites.filter(b => b.statut === 'en_attente' && !b.ia_verdict && M.categorieDe(b) !== 'site').length);
  // Témoin visible pendant toute l'attente (une seule requête, sans étapes
  // intermédiaires) : pastille animée dans l'en-tête avec le temps écoulé,
  // mis à jour chaque seconde sans redessiner la page (la saisie en cours
  // n'est pas perturbée).
  etat.relecture = { debut: Date.now(), n };
  etat.occupe = true; rendre();
  const minuteurRelecture = setInterval(() => {
    const el = document.getElementById('relecture-temps');
    if (el) el.textContent = Math.round((Date.now() - etat.relecture.debut) / 1000) + ' s';
  }, 1000);
  try {
    const r = await API.relire(corps);
    etat.boites = (await API.boites()) || etat.boites;
    const relues = (r && r.relues) || [];
    const bilan = [`${relues.length} boîte${relues.length > 1 ? 's' : ''} relue${relues.length > 1 ? 's' : ''}.`];
    if (r && r.arret) bilan.push(r.arret);
    if (r && r.erreurs && r.erreurs.length) bilan.push(r.erreurs.length + ' refus : ' + r.erreurs.slice(0, 2).join(' ; '));
    dire(bilan.join(' '), !!(r && (r.arret || (r.erreurs && r.erreurs.length))));
  } catch (e) { echec(e); }
  clearInterval(minuteurRelecture);
  etat.relecture = null;
  etat.occupe = false; rendre();
}

// ── Gestes ────────────────────────────────────────────────────────────────

/* ouvrir(id) — affiche la boîte et la marque lue (dans la base aussi). */
function ouvrir(id, focus) {
  const b = boite(id);
  if (!b) return;
  etat.sel = id;
  etat.onglet = 'boite';    // depuis un sujet, on passe à la boîte de réception
  etat.nouveauSujet = false;
  history.replaceState(null, '', '#' + id);
  if (!b.lue_le) {
    b.lue_le = new Date().toISOString();
    API.majBoite(id, { lue: true }).catch(echec);
  }
  rendre(focus || (etroit() ? '#det-titre' : `[data-boite="${id}"]`));
}

/* changer(id, champs, message) — écrit dans la base, puis met l'état local
   à jour avec ce que la base a accepté (on relit la boîte). */
async function changer(id, champs, message) {
  etat.occupe = true; rendre();
  try {
    await API.majBoite(id, champs);
    // On relit les boîtes, et les sujets si leur compte de demandes a bougé.
    const [fraiches, sujets] = await Promise.all([API.boites(), 'sujet' in champs ? API.sujets() : null]);
    etat.boites = fraiches || etat.boites;
    if (sujets) etat.sujets = sujets;
    if (message) dire(message);
    return true;
  } catch (e) { echec(e); return false; }
  finally { etat.occupe = false; rendre(); }
}

async function enregistrer() {
  const b = boite(etat.sel); if (!b) return;
  const champs = {
    reponse: document.getElementById('d-reponse').value.trim(),
    note: document.getElementById('d-note').value.trim(),
  };
  if (await changer(b.id, champs, 'Enregistré.')) brouillons.delete(b.id);
  rendre();
}

async function creerSujet() {
  const titre = (document.getElementById('d-nouveau').value || '').trim();
  if (!titre) { dire('Il faut un titre.', true); return; }
  try {
    const id = await API.creerSujet(titre);
    etat.sujets = await API.sujets();
    etat.nouveauSujet = false;
    await changer(etat.sel, { sujet: id }, 'Sujet créé, boîte rangée.');
  } catch (e) { echec(e); }
}

/* confirmer(titre, texte, bouton) — la boîte de dialogue ; vrai si « oui ». */
function confirmer(titre, texte, bouton) {
  const d = document.getElementById('confirmer');
  document.getElementById('confirmer-titre').textContent = titre;
  document.getElementById('confirmer-texte').textContent = texte;
  document.getElementById('confirmer-oui').textContent = bouton;
  // On écoute l'envoi du formulaire (bouton cliqué) et Échap (« cancel »)
  // plutôt que l'événement « close », qui n'arrive pas toujours (vu dans le
  // navigateur intégré de l'application quand la page n'est pas affichée).
  return new Promise(ok => {
    const form = d.querySelector('form');
    const fin = oui => { form.removeEventListener('submit', envoi); d.removeEventListener('cancel', annule); ok(oui); };
    const envoi = e => fin(!!e.submitter && e.submitter.value === 'oui');
    const annule = () => fin(false);
    form.addEventListener('submit', envoi);
    d.addEventListener('cancel', annule);
    d.showModal();
  });
}

async function supprimer() {
  const b = boite(etat.sel); if (!b) return;
  const ok = await confirmer(`Supprimer la boîte n° ${b.id} ?`,
    'Pour un abus seulement. C\'est définitif : la boîte disparaît de la base (et la proposition avec, si c\'était sa dernière boîte).',
    'Supprimer définitivement');
  if (!ok) return;
  try {
    await API.supprimerBoite(b.id);
    etat.boites = await API.boites();
    brouillons.delete(b.id);
    etat.sel = null;
    history.replaceState(null, '', location.pathname + location.search);
    dire(`Boîte n° ${b.id} supprimée.`);
  } catch (e) { echec(e); }
  rendre();
}

/* voisine(pas) — ouvre la boîte suivante (+1) ou précédente (−1) de la liste.
   Si la boîte ouverte vient d'en sortir (validée alors que le filtre est
   « À traiter »), on repart de sa place dans l'ordre complet : J mène bien
   à celle qui la suivait. */
function voisine(pas) {
  const l = visibles();
  const rang = id => etat.boites.findIndex(b => b.id === id);
  const ici = rang(etat.sel);
  const n = pas > 0 ? l.find(b => rang(b.id) > ici) : l.slice().reverse().find(b => rang(b.id) < ici);
  if (n) ouvrir(n.id);
  else if (etat.sel === null && l[0]) ouvrir(l[0].id);
}

/* suivreAdresse() — /admin/#47 ouvre la boîte n° 47 (lien du message
   Discord, lot A5), même si les filtres la cachaient. */
function suivreAdresse() {
  const n = Number(location.hash.slice(1));
  if (!Number.isSafeInteger(n) || n <= 0 || !boite(n)) return;
  if (!M.filtrer([boite(n)], etat.filtres).length) etat.filtres = Object.assign({}, M.FILTRES_DEFAUT, { etat: 'toutes' });
  ouvrir(n, '#det-titre');
}

racine.addEventListener('click', async e => {
  const t = e.target.closest('button');
  if (!t || t.disabled) return;
  if (t.dataset.boite) return ouvrir(Number(t.dataset.boite));
  if (t.dataset.onglet) { etat.onglet = t.dataset.onglet; return rendre('#onglet-' + etat.onglet); }
  if (t.dataset.sujet) { etat.sujet = Number(t.dataset.sujet); return rendre(etroit() ? '#sujet-titre' : `[data-sujet="${etat.sujet}"]`); }
  if (t.dataset.etatSujet) return changerEtatSujet(t.dataset.etatSujet);
  if (t.dataset.statut) return changer(etat.sel, { statut: t.dataset.statut }, `Boîte n° ${etat.sel} : ${M.STATUTS[t.dataset.statut]}.`);
  switch (t.dataset.act) {
    case 'google': return connexionGoogle();
    case 'sortir': return sortir();
    case 'copier-uid': navigator.clipboard && navigator.clipboard.writeText(etat.uid).then(() => dire('Identifiant copié.')); return;
    case 'actualiser': etat.phase = 'chargement'; rendre(); return charger();
    case 'liste':
      if (etat.onglet === 'sujets') { const id = etat.sujet; etat.sujet = null; return rendre(`[data-sujet="${id}"]`); }
      { const id = etat.sel; etat.sel = null; history.replaceState(null, '', location.pathname + location.search); return rendre(`[data-boite="${id}"]`); }
    case 'sujet-nouveau': return nouveauSujet();
    case 'relire': return relire({ limite: 8 });
    case 'relire-une': return relire({ ids: [etat.sel] });
    case 'sujet-enregistrer': return enregistrerSujet();
    case 'sujet-supprimer': return supprimerSujet();
    case 'enregistrer': return enregistrer();
    case 'integree': return changer(etat.sel, { statut: 'integree' }, `Boîte n° ${etat.sel} : intégrée.`);
    case 'supprimer': return supprimer();
    case 'creer-sujet': return creerSujet();
    case 'exporter': return exporterValidees();
    case 'appliquer': return appliquer();
    case 'fermer-apercu': etat.apercu = null; return rendre();
    case 'annuler-sujet': etat.nouveauSujet = false; return rendre('#d-sujet');
  }
});

racine.addEventListener('submit', e => {
  if (e.target.id !== 'form-connexion') return;
  e.preventDefault();
  connexionEmail(document.getElementById('c-email').value.trim(), document.getElementById('c-mdp').value);
});

racine.addEventListener('change', e => {
  const id = e.target.id;
  if (id === 'i-fichier') { const f = e.target.files[0]; e.target.value = ''; if (f) chargerCompteRendu(f); return; }
  if (e.target.dataset.cr != null) { etat.apercu.lignes[Number(e.target.dataset.cr)].coche = e.target.checked; return rendre(`[data-cr="${e.target.dataset.cr}"]`); }
  if (id === 'f-sujet') { etat.filtreSujet = e.target.value; return rendre('#f-sujet'); }
  if (id === 'f-cat' || id === 'f-etat' || id === 'f-ia') {
    etat.filtres[id.slice(2)] = e.target.value;
    return rendre('#' + id);
  }
  if (id === 'd-sujet') {
    if (e.target.value === 'nouveau') { etat.nouveauSujet = true; return rendre('#d-nouveau'); }
    return changer(etat.sel, { sujet: e.target.value ? Number(e.target.value) : null }, e.target.value ? 'Boîte rangée.' : 'Boîte retirée du sujet.');
  }
});

racine.addEventListener('input', e => {
  if (e.target.dataset.crReponse != null) { etat.apercu.lignes[Number(e.target.dataset.crReponse)].reponse = e.target.value; return; }
  if (e.target.id === 'f-q') { etat.filtres.q = e.target.value; return rendre('#f-q'); }
  if (e.target.id === 'd-reponse' || e.target.id === 'd-note') {
    const br = brouillons.get(etat.sel) || {};
    br[e.target.id === 'd-reponse' ? 'reponse' : 'note'] = e.target.value;
    brouillons.set(etat.sel, br);
  }
});

/* Clavier : V valider, R refuser, A en attente, J / K suivante / précédente,
   / chercher, Échap revenir à la liste. Pas pendant la saisie d'un texte. */
document.addEventListener('keydown', e => {
  if (etat.phase !== 'boite' || document.getElementById('confirmer').open) return;
  const saisie = e.target.matches('input, textarea, select');
  if (e.key === 'Escape') {
    if (saisie) return e.target.blur();
    if (etat.onglet === 'sujets') { if (etat.sujet !== null && etroit()) { const id = etat.sujet; etat.sujet = null; rendre(`[data-sujet="${id}"]`); } return; }
    if (etat.sel !== null) { const id = etat.sel; if (etroit()) { etat.sel = null; history.replaceState(null, '', location.pathname + location.search); } rendre(`[data-boite="${id}"]`); }
    return;
  }
  // Onglets au clavier : ← → (modèle des onglets ARIA).
  if (e.target.matches('[role=tab]') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    // Lot A5 : trois onglets, en boucle.
    const ordre = ['boite', 'sujets', 'integrer'], pas = e.key === 'ArrowRight' ? 1 : 2;
    e.preventDefault(); etat.onglet = ordre[(ordre.indexOf(etat.onglet) + pas) % 3]; return rendre('#onglet-' + etat.onglet);
  }
  if (saisie || e.ctrlKey || e.metaKey || e.altKey || etat.onglet !== 'boite') return;
  const k = e.key.toLowerCase();
  const statut = { v: 'validee', r: 'refusee', a: 'en_attente' }[k];
  if (statut && etat.sel !== null && boite(etat.sel).statut !== 'integree') {
    e.preventDefault();
    return changer(etat.sel, { statut }, `Boîte n° ${etat.sel} : ${M.STATUTS[statut]}.`);
  }
  if (k === 'j') { e.preventDefault(); return voisine(1); }
  if (k === 'k') { e.preventDefault(); return voisine(-1); }
  if (k === '/') { e.preventDefault(); const q = document.getElementById('f-q'); if (q) q.focus(); }
});

window.addEventListener('hashchange', () => { if (etat.phase === 'boite') suivreAdresse(); });

// Quitter avec une réponse ou une note tapée et pas enregistrée : on prévient.
window.addEventListener('beforeunload', e => { if (brouillons.size) { e.preventDefault(); e.returnValue = ''; } });

// ── Démarrage ─────────────────────────────────────────────────────────────
(async function demarrer() {
  if (ESSAI) { etat.email = ''; return charger(); }
  if (!SB) { etat.phase = 'connexion'; etat.erreurConnexion = 'La bibliothèque Supabase ne s’est pas chargée (pas de réseau ?).'; return rendre(); }
  rendre();
  const { data } = await SB.auth.getSession();
  await entrer(data && data.session);
  // Retour de Google (jeton dans l'adresse) : la session arrive par l'événement.
  SB.auth.onAuthStateChange((evt, session) => { if (evt === 'SIGNED_IN' && etat.phase !== 'boite') entrer(session); });
})();
