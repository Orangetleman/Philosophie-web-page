/* ════════════════════════════════════════════════════════════════════════
   admin/essai.js — de fausses données pour /admin/?essai (lot A2).
   ────────────────────────────────────────────────────────────────────────
   Le même contrat que les fonctions admin_* de 2026_administration.sql
   (mêmes noms de colonnes, mêmes règles : « lue » date lue_le, une réponse
   date repondu_le, supprimer la dernière boîte supprime la proposition),
   mais en mémoire : rien ne part sur le réseau, tout se perd au
   rechargement. Sert à essayer la page et à la vérifier sans compte.
   Les textes sont inventés pour l'exemple ; aucune citation n'est réelle.
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const il_y_a = h => new Date(Date.now() - h * 3600000).toISOString();
  const C = (categorie, cible, type, fields) => ({ categorie, cible, type, fields });

  // Une proposition = {contribution, pseudo, a_compte, a_suivi, cree_le, boîtes[]}
  const PROPOSITIONS = [
    { c: 'c19', pseudo: 'Malo', a_compte: true, h: 0.05, boites: [
      { contenu: C('auteur', 'auteur-citation', 'ajout', { nom: 'Sartre', notion: 'liberte', oeuvre: "L'Être et le Néant", citation: 'Une phrase sur la mauvaise foi, donnée sans page ni édition.' }),
        ia_verdict: 'douteux', ia_avis: 'Citation introuvable telle quelle. Le sens correspond au chapitre sur la mauvaise foi : à garder comme reformulation, sans guillemets.' } ] },
    { c: 'c18', pseudo: null, a_compte: false, a_suivi: true, h: 1, boites: [
      { contenu: C('site', 'site-bug', 'remarque', { bugou: 'le quiz', bugdesc: "Sur téléphone, le quiz se ferme quand je tourne l'écran.", bugappareil: 'Android, Chrome' }) } ] },
    { c: 'c17', pseudo: 'Léa', a_compte: true, h: 2, boites: [
      { contenu: C('auteur', 'auteur', 'ajout', { nom: 'Simone Weil', ideas: [{ notion: 'travail', oeuvre: 'La Condition ouvrière', date: '1951', idee: "L'usine use l'attention de l'ouvrier jusqu'à lui ôter la possibilité de penser ce qu'il fait." }] }),
        ia_verdict: 'valide', ia_avis: 'Reformulation fidèle. Simone Weil n’a pas encore de fiche.', sujet: 1 },
      { contenu: C('notion', 'exemple', 'ajout', { notion: 'travail', excat: 'Actualité / Société', extitre: "Les livreurs à vélo et l'algorithme", excorps: "Un travail sans patron visible, où la cadence est fixée par une application." }),
        statut: 'validee', lue: true, ia_verdict: 'valide', ia_avis: 'Exemple clair et actuel.' },
      { contenu: C('notion', 'accroche', 'ajout', { notion: 'travail', acctype: 'Paradoxe', acctexte: 'On dit « gagner sa vie » : on la perdait donc ?' }),
        statut: 'integree', lue: true, integration: { commit: '3f2a9c1', resultat: 'integree' }, reponse: 'Ajoutée, merci !' } ] },
    { c: 'c16', pseudo: null, a_compte: false, a_suivi: false, h: 26, boites: [
      { contenu: C('notion', 'accroche', 'ajout', { notion: 'temps', acctype: 'Proverbe', acctexte: "« Le temps c'est de l'argent » comme amorce." }),
        lue: true, ia_verdict: 'rejet', ia_avis: 'Proverbe sans lien direct avec la notion telle que le programme la pose.' } ] },
    { c: 'c15', pseudo: 'Inès', a_compte: true, h: 50, boites: [
      { contenu: C('concept', 'concept-relation', 'ajout', { cterme: 'aliénation', reltype: 'complete', relcible: 'travail', reldesc: 'Deux manières de penser ce que le travail fait à celui qui travaille.' }), lue: true },
      { contenu: C('notion', 'plan', 'ajout', { notion: 'travail', plan_q: 'Le travail libère-t-il ?', plan_a1t: 'Le travail transforme la nature et l’homme', plan_a1c: 'Arguments…', plan_a2t: 'Mais il peut aliéner', plan_a2c: 'Arguments…' }), lue: true } ] },
    { c: 'c14', pseudo: 'Tom', a_compte: true, h: 200, boites: [
      { contenu: C('site', 'site-fonction', 'remarque', { fonctitre: 'Un mode sombre plus contrasté', foncdesc: 'Le gris sur gris est difficile à lire le soir.' }), lue: true, sujet: 2, statut: 'validee' } ] },
    // Lot A4 : un doublon probable de la n° 43 (« Weil » ⊂ « Simone Weil »).
    { c: 'c13', pseudo: null, a_compte: false, a_suivi: true, h: 500, boites: [
      { contenu: C('auteur', 'auteur-bio', 'ajout', { nom: 'Weil', a_courant: 'Philosophie politique et morale', a_periode: 'XXe siècle' }), lue: true } ] },
  ];

  let n = 40;
  const boites = [];
  PROPOSITIONS.forEach(p => p.boites.forEach((b, rang) => boites.push({
    id: ++n, contribution: p.c, rang, nb_boites: p.boites.length,
    statut: b.statut || 'en_attente', lue_le: b.lue ? il_y_a(p.h - 0.01) : null,
    note: null, reponse: b.reponse || null, repondu_le: b.reponse ? il_y_a(1) : null,
    sujet: b.sujet || null, ia_verdict: b.ia_verdict || null, ia_avis: b.ia_avis || null,
    ia_le: b.ia_verdict ? il_y_a(p.h - 0.02) : null, integration: b.integration || null,
    cree_le: il_y_a(p.h), maj_le: il_y_a(p.h),
    contenu: b.contenu, pseudo: p.pseudo, a_compte: p.a_compte, a_suivi: !!p.a_suivi,
  })));
  boites.sort((a, b) => (a.cree_le < b.cree_le ? 1 : a.cree_le > b.cree_le ? -1 : a.rang - b.rang));

  const sujets = [
    { id: 1, titre: 'Ajouter Simone Weil au travail et à la justice', etat: 'prevu', publie: true, pour: 5, contre: 0 },
    { id: 2, titre: 'Un mode sombre plus contrasté', etat: 'propose', publie: true, pour: 3, contre: 1 },
  ];
  const copie = x => JSON.parse(JSON.stringify(x));
  const attendre = () => new Promise(r => setTimeout(r, 120));   // un peu de latence, comme le réseau

  window.AdminEssai = {
    async boites() { await attendre(); return copie(boites); },
    async sujets() {
      await attendre();
      return sujets.map(s => {
        const demandes = boites.filter(b => b.sujet === s.id).length;
        return Object.assign(copie(s), { demandes, score: demandes + s.pour - s.contre });
      }).sort((a, b) => b.score - a.score);
    },
    async majBoite(id, champs) {
      await attendre();
      const b = boites.find(x => x.id === id);
      if (!b) throw new Error('boîte inconnue : ' + id);
      if ('statut' in champs) {
        if (!['en_attente', 'validee', 'integree', 'refusee'].includes(champs.statut)) throw new Error('statut invalide');
        b.statut = champs.statut;
      }
      if ('note' in champs) b.note = champs.note || null;
      if ('reponse' in champs) { b.reponse = champs.reponse || null; b.repondu_le = b.reponse ? new Date().toISOString() : null; }
      if ('sujet' in champs) b.sujet = champs.sujet;
      if ('lue' in champs) b.lue_le = champs.lue ? b.lue_le || new Date().toISOString() : null;
      b.maj_le = new Date().toISOString();
    },
    async supprimerBoite(id) {
      await attendre();
      const i = boites.findIndex(x => x.id === id);
      if (i >= 0) boites.splice(i, 1);
    },
    async enregistrerSujet(id, champs) {
      await attendre();
      const s = sujets.find(x => x.id === id);
      if (!s) throw new Error('sujet inconnu : ' + id);
      ['titre', 'description', 'etat', 'publie', 'reponse'].forEach(k => { if (k in champs) s[k] = champs[k]; });
      if (!String(s.titre || '').trim()) throw new Error('titre vide');
      return id;
    },
    async supprimerSujet(id) {
      await attendre();
      const i = sujets.findIndex(x => x.id === id);
      if (i >= 0) sujets.splice(i, 1);
      boites.forEach(b => { if (b.sujet === id) b.sujet = null; });
    },
    // Lot A4 : une fausse relecture (aucun appel à Gemini).
    async relire(corps) {
      await attendre();
      const choisies = corps.ids ? boites.filter(b => corps.ids.includes(b.id))
        : boites.filter(b => b.statut === 'en_attente' && !b.ia_verdict && b.contenu.categorie !== 'site').slice(0, corps.limite || 8);
      choisies.forEach((b, i) => {
        b.ia_verdict = i % 2 ? 'douteux' : 'valide';
        b.ia_avis = 'Avis d’essai : aucune IA n’a été appelée.';
        b.ia_le = new Date().toISOString();
      });
      return { relues: choisies.map(b => ({ id: b.id, verdict: b.ia_verdict })), erreurs: [], arret: null };
    },
    async creerSujet(titre) {
      await attendre();
      const id = Math.max(0, ...sujets.map(s => s.id)) + 1;
      sujets.push({ id, titre, etat: 'propose', publie: false, pour: 0, contre: 0 });
      return id;
    },
  };
})();
