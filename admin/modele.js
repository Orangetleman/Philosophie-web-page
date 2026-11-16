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
    // Lot A4 : la fonction Supabase « relire » (supabase/functions/relire).
    if (code === 'relire-gemini-absent') return "La clé Gemini n'est pas réglée : ajoute le secret GEMINI_API_KEY à la fonction « relire » dans Supabase.";
    if (code === 'relire-pas-admin') return "La fonction « relire » ne reconnaît pas ce compte comme administrateur (table app_admins).";
    if (code === 'relire-non-connecte') return 'La session a expiré : reconnecte-toi.';
    if (code === 'relire-absente' || (code === 'relire-http' && e.status === 404))
      return "La fonction « relire » n'est pas encore déployée sur Supabase (supabase functions deploy relire).";
    if (code === 'relire-base' || code === 'relire-http') return 'La relecture a échoué côté Supabase. Réessaie ; si ça dure, regarde les journaux de la fonction « relire ».';
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

  // ── Doublons (lot A4) ─────────────────────────────────────────────────
  // Repris de l'agrégateur (ingest.compute_key_term, view.cmd_dupes) :
  //  1. même SIGNATURE : même type, même cible, même notion, même
  //     discriminant (nom, titre, terme…), sans accents ni casse ;
  //  2. même NOM à une inclusion près (« sartre » ⊂ « jean-paul sartre »,
  //     4 lettres au moins) ;
  //  3. textes PROCHES : ratio de Ratcliff et Obershelp (celui de
  //     difflib.SequenceMatcher) sur « discriminant | texte » ≥ 0,8.
  // On ne compare que des boîtes de la même catégorie.

  /* cleDe(b) — le discriminant lisible d'une boîte (compute_key_term). */
  function cleDe(b) {
    const c = (b && b.contenu) || {}, f = c.fields || {};
    const coupe = s => { s = String(s || '').trim(); return s.length > 60 ? s.slice(0, 60) + '…' : s; };
    if (c.cible === 'site-bug') return coupe(f.bugou || f.bugdesc);
    if (c.cible === 'site-fonction') return String(f.fonctitre || '').trim();
    if (c.type === 'correction') return String(f.cibleref || '').trim();
    if (c.type === 'remarque') return String(f.remelement || '').trim();
    switch (c.cible) {
      case 'notion': return String(f.notion || '').trim();
      case 'auteur': case 'auteur-citation': case 'auteur-dialogue': case 'auteur-bio': return String(f.nom || '').trim();
      case 'texte': return String(f.titre || '').trim();
      case 'plan': return String(f.plan_q || '').trim();
      case 'exemple': return String(f.extitre || f.excat || '').trim();
      case 'accroche': return coupe(f.acctexte || f.acctype);
      case 'dissertation': return coupe(f.question);
      case 'concept': case 'concept-relation': return String(f.cterme || '').trim();
    }
    return '';
  }

  const norme = s => sansAccents(s).replace(/\s+/g, ' ').trim();

  /* signature(b) — l'identité d'une boîte pour le rapprochement exact. */
  function signature(b) {
    const c = (b && b.contenu) || {};
    return [c.type || '', c.cible || '', notionDe(b) || '', norme(cleDe(b))].join('|');
  }

  /* ressemblance(a, b) — ratio de Ratcliff et Obershelp entre deux
     chaînes, de 0 à 1 : 2 × (caractères en commun par plus longs blocs
     communs) / (longueur totale). Même définition que difflib. */
  function ressemblance(a, b) {
    if (!a.length && !b.length) return 1;
    const communs = (a0, a1, b0, b1) => {
      if (a0 >= a1 || b0 >= b1) return 0;
      // le plus long bloc commun dans a[a0:a1], b[b0:b1]
      let meilleur = 0, ia = a0, ib = b0, prec = new Array(b1 - b0 + 1).fill(0);
      for (let i = a0; i < a1; i++) {
        const cour = new Array(b1 - b0 + 1).fill(0);
        for (let j = b0; j < b1; j++) {
          if (a[i] === b[j]) {
            const l = prec[j - b0] + 1;
            cour[j - b0 + 1] = l;
            if (l > meilleur) { meilleur = l; ia = i - l + 1; ib = j - l + 1; }
          }
        }
        prec = cour;
      }
      if (!meilleur) return 0;
      return meilleur + communs(a0, ia, b0, ib) + communs(ia + meilleur, a1, ib + meilleur, b1);
    };
    return (2 * communs(0, a.length, 0, b.length)) / (a.length + b.length);
  }

  /* doublons(b, liste, seuil) — les boîtes de la liste qui ressemblent à
     b, du plus sûr au moins sûr : [{id, statut, raison, score}]. raison :
     « identique », « même nom » ou « texte proche à 87 % ». rapide=vrai
     saute la comparaison des textes (assez pour la pastille de la liste). */
  function doublons(b, liste, seuil, rapide) {
    seuil = seuil == null ? 0.8 : seuil;
    const cat = categorieDe(b), sig = signature(b), cle = norme(cleDe(b));
    const texte = x => norme(cleDe(x) + ' | ' + resume(x)).slice(0, 300);
    const tb = rapide ? '' : texte(b);
    const out = [];
    liste.forEach(x => {
      if (x.id === b.id || categorieDe(x) !== cat) return;
      if (signature(x) === sig && cle) return out.push({ id: x.id, statut: x.statut, raison: 'identique', score: 2 });
      const k = norme(cleDe(x));
      if (cle.length >= 4 && k.length >= 4 && k !== cle && (k.includes(cle) || cle.includes(k)))
        return out.push({ id: x.id, statut: x.statut, raison: 'même nom', score: 1.5 });
      if (rapide) return;
      const r = ressemblance(tb, texte(x));
      if (r >= seuil) out.push({ id: x.id, statut: x.statut, raison: `texte proche à ${Math.round(r * 100)} %`, score: r });
    });
    return out.sort((p, q) => q.score - p.score);
  }

  // ── L'aller-retour d'intégration (lot A5, cadrage § 9) ───────────────
  // Aller : export philo-export/v1 des boîtes validées, SANS donnée
  // personnelle (ni pseudo, ni compte, ni réponse). Retour : compte rendu
  // philo-integration/v1 écrit par Claude (docs/protocole-integration.md),
  // relu ici ligne par ligne avant d'être appliqué par la base
  // (admin_importer_integration).

  const FORMAT_EXPORT = 'philo-export/v1';
  const FORMAT_RETOUR = 'philo-integration/v1';
  const RESULTATS = { integree: 'Intégrée telle quelle', retouchee: 'Intégrée avec retouches', non_integree: 'Non intégrée' };

  /* slug(t) — comme outils/lib/pages.mjs : « Simone Weil » → simone-weil. */
  const slug = t => sansAccents(t).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  /* fichierCible(b) — le fichier de contenu/ que la boîte touche, pour
     regrouper l'onglet « À intégrer » : notion → contenu/notions/<clé>.js,
     auteur → contenu/auteurs/<nom>.js (nom à vérifier : alias possibles),
     concept → contenu/concepts.js, retour sur le site → « le code du site ». */
  function fichierCible(b) {
    const cat = categorieDe(b), f = (b && b.contenu && b.contenu.fields) || {};
    if (cat === 'site') return 'le code du site (js/, css/)';
    if (cat === 'concept') return 'contenu/concepts.js';
    if (cat === 'auteur' && f.nom) return 'contenu/auteurs/' + slug(f.nom) + '.js';
    const n = notionDe(b);
    return n ? 'contenu/notions/' + n + '.js' : '(fichier à trouver)';
  }

  /* jourDe(date) — « AAAA-MM-JJ » à l'heure locale. */
  function jourDe(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  /* exporter(boites, maintenant) — {nom, json} : le fichier de l'aller.
     Seulement les boîtes « validee », triées par fichier puis n°. Champs
     gardés : n°, proposition, catégorie, cible, type, notion, fichier,
     contenu, avis de l'IA, note interne (consignes de l'admin à Claude),
     doublons (n° seulement). Jamais : pseudo, compte, suivi, réponse. */
  function exporter(boites, maintenant) {
    const quand = maintenant == null ? new Date() : new Date(maintenant);
    const val = boites.filter(b => b.statut === 'validee')
      .map(b => ({ b, fichier: fichierCible(b) }))
      .sort((p, q) => (p.fichier < q.fichier ? -1 : p.fichier > q.fichier ? 1 : p.b.id - q.b.id));
    const json = {
      format: FORMAT_EXPORT,
      cree_le: quand.toISOString(),
      boites: val.map(({ b, fichier }) => ({
        id: b.id, contribution: b.contribution,
        categorie: categorieDe(b), cible: (b.contenu || {}).cible || null, type: (b.contenu || {}).type || 'ajout',
        notion: notionDe(b), fichier,
        contenu: (b.contenu || {}).fields || {},
        avis_ia: b.ia_verdict ? { verdict: b.ia_verdict, avis: b.ia_avis || '' } : null,
        note_interne: b.note || null,
        doublons: doublons(b, boites, null, true).map(d => d.id),
      })),
    };
    return { nom: `philo-export-${jourDe(quand)}.json`, json };
  }

  /* lireCompteRendu(texte, boites) — {rapport, lignes, erreur} : le fichier
     du retour, contrôlé, et une ligne d'aperçu par boîte :
     {id, resultat, detail, reponse, fichiers, etat, coche, resume}.
     etat : 'ok' (sera appliquée), 'deja' (même commit déjà appliqué),
     'inconnue' (n° absent), 'pas-validee' (n'est plus « Validée »),
     'resultat-inconnu'. Seules les lignes 'ok' sont cochées. */
  function lireCompteRendu(texte, boites) {
    let r;
    try { r = typeof texte === 'string' ? JSON.parse(texte) : texte; } catch (e) { return { erreur: 'Ce fichier n’est pas du JSON lisible.' }; }
    if (!r || r.format !== FORMAT_RETOUR) return { erreur: `Format inattendu (${JSON.stringify(r && r.format)}) : il faut un compte rendu ${FORMAT_RETOUR}.` };
    if (!r.commit || !String(r.commit).trim()) return { erreur: 'Le compte rendu ne donne pas de commit.' };
    if (!Array.isArray(r.boites) || !r.boites.length) return { erreur: 'Le compte rendu ne contient aucune boîte.' };
    const vues = new Set();
    const lignes = r.boites.map(x => {
      const id = Number(x && x.id), b = boites.find(y => y.id === id);
      let etat = 'ok';
      if (vues.has(id)) etat = 'double';
      else if (!b) etat = 'inconnue';
      else if (b.statut === 'integree' && b.integration && b.integration.commit === r.commit) etat = 'deja';
      else if (!RESULTATS[x.resultat]) etat = 'resultat-inconnu';
      else if (b.statut !== 'validee') etat = 'pas-validee';
      vues.add(id);
      return {
        id, resultat: x.resultat, detail: String(x.detail || ''), fichiers: Array.isArray(x.fichiers) ? x.fichiers : [],
        reponse: x.resultat === 'non_integree' ? '' : String(x.reponse_proposee || ''),
        etat, coche: etat === 'ok', resume: b ? resume(b) : '',
      };
    });
    return { rapport: r, lignes };
  }

  /* rapportAEnvoyer(rapport, lignes) — ce que la page passe à la base :
     les seules lignes cochées, avec la réponse telle que corrigée. */
  function rapportAEnvoyer(rapport, lignes) {
    return {
      format: FORMAT_RETOUR, commit: String(rapport.commit), fait_le: rapport.fait_le || null,
      boites: lignes.filter(l => l.coche && l.etat === 'ok')
        .map(l => ({ id: l.id, resultat: l.resultat, detail: l.detail, reponse: l.resultat === 'non_integree' ? '' : l.reponse })),
    };
  }

  const M = {
    STATUTS, ETATS_SUJET, CATEGORIES, CIBLES, TYPES, CHAMPS, VERDICTS, FILTRES_ETAT, FILTRES_IA, FILTRES_DEFAUT,
    categorieDe, filtrer, champsLisibles, resume, etiquette, notionDe, lienSite, vuContributeur, depuis, erreur,
    cleDe, signature, ressemblance, doublons,
    FORMAT_EXPORT, FORMAT_RETOUR, RESULTATS, fichierCible, exporter, lireCompteRendu, rapportAEnvoyer,
  };
  racine.AdminModele = M;
  if (typeof module !== 'undefined' && module.exports) module.exports = M;
})(typeof window !== 'undefined' ? window : globalThis);
