/* ════════════════════════════════════════════════════════════════════════
   admin/modele.js — ce que la page /admin/ calcule sans toucher à la page
   (lot A2 du chantier Administration, docs/chantier-administration.md).
   ────────────────────────────────────────────────────────────────────────
   Filtres, libellés, mise en forme du contenu d'une boîte, ce que voit le
   contributeur, messages d'erreur en clair. Aucune dépendance au DOM ni à
   Supabase : la page (admin/admin.js) s'en sert, et outils/essais_admin.mjs
   l'éprouve dans Node (chaque règle avec un cas qui doit échouer).
   Modèle : src/tableau/modele.ts du planificateur Industrialist.
   ════════════════════════════════════════════════════════════════════════ */
(function (racine) {
  'use strict';

  // ── Vocabulaire ───────────────────────────────────────────────────────
  // Les quatre états d'une boîte (table boites, 2026_administration.sql).
  const STATUTS = { en_attente: 'En attente', validee: 'Validée', integree: 'Intégrée', refusee: 'Refusée' };
  // Les quatre états d'un sujet (table sujets ; lot A3). Mêmes mots sur la
  // page publique Propositions.
  const ETATS_SUJET = { propose: 'Proposé', prevu: 'Prévu', fait: 'Fait', refuse: 'Refusé' };

  // Catégories et sous-cibles : mêmes valeurs que PROPOSAL_CATS et
  // PROPOSAL_SOUSCIBLES (js/06-contribution.js), libellés courts pour la liste.
  const CATEGORIES = { notion: 'Notion', auteur: 'Auteur', concept: 'Concept', site: 'Le site' };
  const CIBLES = {
    notion: ['notion', 'Définition'], texte: ['notion', 'Texte'], plan: ['notion', 'Plan'],
    dissertation: ['notion', 'Sujet'], exemple: ['notion', 'Exemple'], accroche: ['notion', 'Accroche'],
    auteur: ['auteur', 'Idée'], 'auteur-citation': ['auteur', 'Citation'],
    'auteur-dialogue': ['auteur', 'Dialogue'], 'auteur-bio': ['auteur', 'Biographie'],
    concept: ['concept', 'Définition'], 'concept-relation': ['concept', 'Relation'],
    'site-bug': ['site', 'Bug'], 'site-fonction': ['site', 'Idée de fonction'],
  };
  const TYPES = { ajout: 'Ajout', correction: 'Correction', remarque: 'Remarque' };

  // Libellé de chaque champ d'une boîte. Les clés sont celles de
  // PROPOSAL_FIELDS et des champs ajoutés par renderBoxFields (js/06) ;
  // outils/essais_admin.mjs vérifie qu'aucune clé du site ne manque ici.
  const CHAMPS = {
    notion: 'Notion', cnotions: 'Notions liées', nom: 'Auteur', cibleref: 'Élément à corriger',
    remelement: 'Élément concerné', remtexte: 'Remarque', justif: 'Justification',
    notiondef: 'Définition / approfondissement',
    oeuvre: 'Œuvre', date: 'Date', idee: 'Idée', concepts: 'Termes à lier', citations: 'Citations',
    rattach: 'Rattacher à', citation: 'Citation',
    dialdir: 'Relation', dialauteur: 'Auteur en relation', dialsujet: 'Sujet', dialdesc: 'Description',
    a_bio: 'Biographie', a_courant: 'Courant', a_periode: 'Période', a_themes: 'Thèmes',
    titre: 'Titre / source', contenu: 'Extrait',
    plan_q: 'Sujet', plan_intro: 'Problématisation', plan_pb: 'Problématique',
    plan_a1t: 'I', plan_a1c: 'I, arguments', plan_a1l: 'I, limite',
    plan_a2t: 'II', plan_a2c: 'II, arguments', plan_a2l: 'II, limite',
    plan_a3t: 'III', plan_a3c: 'III, arguments', plan_a3l: 'III, ouverture',
    excat: 'Catégorie', excatautre: 'Autre catégorie', extitre: 'Titre', excorps: 'Description', exlien: 'Auteurs / idées',
    acctype: 'Type d’accroche', acctexte: 'Accroche', accsrc: 'Source',
    question: 'Question',
    cterme: 'Concept', ccat: 'Catégorie', cdef: 'Définition', clien: 'Lien avec la notion',
    reltype: 'Relation', relcible: 'En relation avec', reldesc: 'Description',
    bugou: 'Où', bugdesc: 'Problème', bugrepro: 'Pour le reproduire', bugappareil: 'Appareil',
    fonctitre: 'Idée', foncdesc: 'Description', foncusage: 'Usage',
  };
  // Valeurs codées de certains menus (dialdir, reltype : selectFieldHTML).
  const VALEURS = {
    oppose: "s'oppose à", prolonge: 'prolonge', repond: 'répond à',
    complete: 'complète', distinction: 'se distingue de', implique: 'implique',
  };
  // Les champs montrés en tête, dans cet ordre ; le reste suit.
  const EN_TETE = ['nom', 'notion', 'cnotions', 'cterme', 'cibleref', 'remelement'];

  // Avis de l'IA (review.py : valide | douteux | rejet).
  const VERDICTS = {
    valide: ['ok', 'Plutôt bon'],
    douteux: ['warn', 'À vérifier'],
    rejet: ['bad', 'À écarter ?'],
  };

  // ── Filtres de la boîte de réception ─────────────────────────────────
  // « À traiter » (par défaut) : les boîtes en attente. Les validées vont
  // dans « À intégrer » (lot A5) ; on les retrouve ici par « Validées ».
  const FILTRES_ETAT = {
    'a-traiter': 'À traiter', nouvelles: 'Nouvelles', validee: 'Validées',
    integree: 'Intégrées', refusee: 'Refusées', 'non-rangees': 'Non rangées', toutes: 'Toutes',
  };
  const FILTRES_IA = { '': 'Tous avis IA', douteux: 'À vérifier', valide: 'Plutôt bon', rejet: 'À écarter ?', aucun: 'Pas relue' };
  const FILTRES_DEFAUT = { cat: '', etat: 'a-traiter', ia: '', q: '' };

  /* categorieDe(b) — la catégorie d'une boîte : celle du contenu, sinon
     celle que donne sa sous-cible (anciennes propositions v1/v2). */
  function categorieDe(b) {
    const c = (b && b.contenu) || {};
    return c.categorie || (CIBLES[c.cible] || [])[0] || 'notion';
  }

  /* filtrer(liste, f) — les boîtes que montrent les filtres f
     ({cat, etat, ia, q}). q cherche sans tenir compte des accents ni de la
     casse, dans le contenu, le pseudo et le n°. */
  function filtrer(liste, f) {
    f = Object.assign({}, FILTRES_DEFAUT, f || {});
    const q = sansAccents(f.q || '').trim();
    return liste.filter(b => {
      if (f.cat && categorieDe(b) !== f.cat) return false;
      if (f.ia === 'aucun' ? !!b.ia_verdict : f.ia && b.ia_verdict !== f.ia) return false;
      switch (f.etat) {
        case 'a-traiter': if (b.statut !== 'en_attente') return false; break;
        case 'nouvelles': if (b.lue_le) return false; break;
        case 'non-rangees': if (b.sujet != null || b.statut === 'refusee') return false; break;
        case 'toutes': break;
        default: if (b.statut !== f.etat) return false;
      }
      if (q) {
        const meule = sansAccents(['n° ' + b.id, b.pseudo || '', JSON.stringify(b.contenu || {})].join(' '));
        if (!meule.includes(q)) return false;
      }
      return true;
    });
  }

  function sansAccents(s) {
    // Les diacritiques combinants (U+0300 à U+036F) après décomposition NFD.
    return String(s).normalize('NFD').replace(/\p{Mn}/gu, '').toLowerCase();
  }

  // ── Le contenu d'une boîte, lisible ──────────────────────────────────

  /* valeurLisible(k, v, notions) — une valeur de champ en texte : les
     notions par leur titre (notions = {clé: titre}, depuis data.js), les
     menus codés par leur libellé, les tableaux joints. */
  function valeurLisible(k, v, notions) {
    const n = x => (notions && notions[x]) || x;
    if (Array.isArray(v)) return v.map(x => (k === 'cnotions' ? n(x) : String(x))).join(' · ');
    if (k === 'notion') return n(v);
    if (k === 'dialdir' || k === 'reltype') return VALEURS[v] || v;
    return String(v);
  }

  /* champsLisibles(contenu, notions) — [{k, label, valeur, idee?}] dans
     l'ordre d'affichage : champs d'en-tête, puis les autres, puis une
     entrée par idée d'auteur (fields.ideas[], cible « auteur »). Les champs
     vides sont omis. */
  function champsLisibles(contenu, notions) {
    const f = (contenu && contenu.fields) || {};
    const cles = Object.keys(f).filter(k => k !== 'ideas');
    cles.sort((a, b) => rang(a) - rang(b));
    const out = [];
    cles.forEach(k => {
      const v = f[k];
      if (v == null || (Array.isArray(v) ? !v.length : String(v).trim() === '')) return;
      out.push({ k, label: CHAMPS[k] || k, valeur: valeurLisible(k, v, notions) });
    });
    (Array.isArray(f.ideas) ? f.ideas : []).forEach((it, i) => {
      const lignes = Object.keys(it || {}).filter(k => it[k] != null && String(it[k]).trim() !== '')
        .map(k => ({ k, label: CHAMPS[k] || k, valeur: valeurLisible(k, it[k], notions) }));
      if (lignes.length) out.push({ k: 'ideas', label: 'Idée ' + (i + 1), idee: lignes });
    });
    return out;
    function rang(k) { const i = EN_TETE.indexOf(k); return i < 0 ? EN_TETE.length : i; }
  }

  /* resume(b, notions) — une ligne de texte pour la liste : le champ le plus
     parlant de la boîte, sinon le premier champ rempli. */
  const PARLANTS = ['remtexte', 'acctexte', 'excorps', 'extitre', 'citation', 'notiondef', 'cdef', 'question',
    'plan_q', 'dialdesc', 'reldesc', 'bugdesc', 'fonctitre', 'contenu', 'a_bio'];
  function resume(b, notions) {
    const f = (b && b.contenu && b.contenu.fields) || {};
    const k = PARLANTS.find(x => f[x] && String(f[x]).trim());
    if (k) return String(f[k]).replace(/\s+/g, ' ').trim();
    if (Array.isArray(f.ideas) && f.ideas[0]) return [f.ideas[0].oeuvre, f.ideas[0].idee].filter(Boolean).join(' : ');
    const c = champsLisibles(b && b.contenu, notions).find(x => !x.idee);
    return c ? c.valeur : '(boîte vide)';
  }

  /* etiquette(b) — « Auteur · Citation », avec le type quand ce n'est pas
     un ajout (« Notion · Exemple · Correction »). */
  function etiquette(b) {
    const c = (b && b.contenu) || {};
    const cat = CATEGORIES[categorieDe(b)] || '';
    const cib = (CIBLES[c.cible] || [])[1] || c.cible || '';
    const typ = c.type && c.type !== 'ajout' && categorieDe(b) !== 'site' ? TYPES[c.type] || c.type : '';
    return [cat, cib, typ].filter(Boolean).join(' · ');
  }

  /* notionDe(b) — la clé de notion d'une boîte (champ notion, première
     notion liée, ou notion de la première idée), ou null. */
  function notionDe(b) {
    const f = (b && b.contenu && b.contenu.fields) || {};
    if (f.notion) return f.notion;
    if (Array.isArray(f.cnotions) && f.cnotions.length) return f.cnotions[0];
    if (Array.isArray(f.ideas)) { const it = f.ideas.find(x => x && x.notion); if (it) return it.notion; }
    return null;
  }

  /* lienSite(b) — l'adresse de la fiche concernée sur le site (#/notion/…,
     #/auteur/…), ou null. */
  function lienSite(b) {
    const f = (b && b.contenu && b.contenu.fields) || {};
    if (f.nom) return '/#/auteur/' + encodeURIComponent(f.nom);
    const n = notionDe(b);
    return n ? '/#/notion/' + encodeURIComponent(n) : null;
  }

  // ── Ce que voit le contributeur ───────────────────────────────────────

  /* vuContributeur(statuts) — la phrase de « Mes propositions » pour une
     proposition dont les boîtes ont ces statuts (même règle que
     contribution_recalculer, plus le détail « 1 sur 3 »). */
  function vuContributeur(statuts) {
    const n = statuts.length;
    const c = s => statuts.filter(x => x === s).length;
    if (!n || c('en_attente') === n) return 'En attente de relecture';
    if (c('refusee') === n) return 'Non retenue';
    const integ = c('integree'), ok = c('validee') + integ;
    if (integ + c('refusee') === n) return n === 1 ? 'Intégrée au site' : `${integ} sur ${n} intégrée${integ > 1 ? 's' : ''} au site`;
    return n === 1 ? 'Validée, intégration en cours' : `${ok} sur ${n} validée${ok > 1 ? 's' : ''}`;
  }

  // ── Dates ─────────────────────────────────────────────────────────────

  /* depuis(date, maintenant) — « à l'instant », « il y a 4 min »,
     « il y a 3 h », « hier », « le 21/10 ». */
  function depuis(date, maintenant) {
    const t = new Date(date).getTime(), m = maintenant == null ? Date.now() : new Date(maintenant).getTime();
    const min = Math.floor((m - t) / 60000);
    if (min < 1) return "à l'instant";
    if (min < 60) return `il y a ${min} min`;
    if (min < 24 * 60) return `il y a ${Math.floor(min / 60)} h`;
    const jour = x => { const d = new Date(x); return Math.floor((x - d.getTimezoneOffset() * 60000) / 86400000); };
    if (jour(m) - jour(t) === 1) return 'hier';
    const d = new Date(t);
    return `le ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  // ── Erreurs en clair ──────────────────────────────────────────────────

  /* erreur(e) — un message lisible pour une erreur de Supabase ou du
     réseau, jamais le texte brut de la base. */
  function erreur(e) {
    const code = (e && (e.code || e.status)) || '';
    const msg = String((e && e.message) || e || '');
    if (code === '42501' || /non administrateur/i.test(msg))
      return "Ce compte n'est pas administrateur. Ajoute son identifiant (UID) dans la table app_admins.";
    if (code === 'PGRST202' || /could not find the function/i.test(msg))
      return "La base n'a pas encore la migration 2026_administration.sql : passe-la dans l'éditeur SQL de Supabase.";
    if (/jwt|expired|session/i.test(msg) || code === 401)
      return 'La session a expiré : reconnecte-toi.';
    if (/fetch|network|Failed to|Load failed/i.test(msg))
      return 'Supabase ne répond pas (pas de réseau ?). Rien n’a été enregistré.';
    if (/invalid login|invalid credentials/i.test(msg)) return 'Adresse ou mot de passe incorrect.';
    if (/boîte inconnue/.test(msg)) return "Cette boîte n'existe plus (supprimée ailleurs ?). Actualise.";
    return 'Refusé par la base : ' + msg.slice(0, 160);
  }

  const M = {
    STATUTS, ETATS_SUJET, CATEGORIES, CIBLES, TYPES, CHAMPS, VERDICTS, FILTRES_ETAT, FILTRES_IA, FILTRES_DEFAUT,
    categorieDe, filtrer, champsLisibles, resume, etiquette, notionDe, lienSite, vuContributeur, depuis, erreur,
  };
  racine.AdminModele = M;
  if (typeof module !== 'undefined' && module.exports) module.exports = M;
})(typeof window !== 'undefined' ? window : globalThis);
