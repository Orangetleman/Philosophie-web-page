/* ════════════════════════════════════════════════════════════════════
   formats.mjs — conversions des anciens formats de contenu vers le format
   canonique. Reprises À L'IDENTIQUE des fonctions que index.html appliquait
   à chaque chargement (normalizeAuthor, migrateAxeToPlan, normalizeD,
   normalizeConcepts) : depuis l'étape 3 (oct. 2026), c'est le BUILD qui les
   applique, une fois, en écrivant data.js. Le site reçoit des données déjà
   canoniques et n'a plus rien à convertir.

   Les sources de contenu/ sont déjà au format canonique ; ces fonctions
   restent pour qu'un extrait collé dans l'ancien format (par exemple depuis
   un export de l'agrégateur) soit encore accepté, puis converti au build.
   ════════════════════════════════════════════════════════════════════ */

/* normaliserIdee(idea) — garantit citations:[] et migre l'ancien champ q
   (citation unique) en 1re citation. Ne garde que les champs connus. */
function normaliserIdee(idea) {
  const out = {};
  ['w', 'i', 'new', 'modified', 'fiche'].forEach(k => { if (idea[k] !== undefined) out[k] = idea[k]; });
  let cites = [];
  if (Array.isArray(idea.citations)) cites = idea.citations.slice();
  else if (idea.citations) cites = [idea.citations];
  if (idea.q) cites.unshift(idea.q);
  out.citations = cites.filter(c => c != null && String(c).trim() !== '');
  return out;
}

/* normaliserAuteur(a) — entrée d'auteur d'une notion → {n, ideas:[…]}.
   Ancien format à plat {n, w, i, q, …} → une seule idée. Une synthèse
   « fiche » posée au niveau de l'entrée se propage aux idées sans la leur. */
export function normaliserAuteur(a) {
  if (Array.isArray(a.ideas)) {
    const ideas = a.ideas.map(normaliserIdee);
    if (a.fiche) ideas.forEach(it => { if (it.fiche === undefined) it.fiche = a.fiche; });
    return { n: a.n, ideas };
  }
  return { n: a.n, ideas: [normaliserIdee(a)] };
}

/* axeEnPlan(axe) — ancien axe {t, pb, sps:[A,B,C]} → plan de dissertation
   dont A/B/C deviennent les 3 axes ; migrated:true (badge « à enrichir »). */
export function axeEnPlan(axe) {
  const sps = axe.sps || [];
  return {
    q: axe.pb || axe.t || '',
    theme: axe.t || '',
    intro: '',
    pb: axe.pb || '',
    axes: sps.map(sp => ({
      t: '',
      sps: [{ t: '', args: sp.c || '', auteurs: '', ref: sp.r || '', limite: '' }],
      limite: ''
    })),
    new: !!axe.new, modified: !!axe.modified, migrated: true
  };
}

/* normaliserNotion(n) — auteurs canoniques ; plans = plans rédigés puis
   anciens axes convertis ; le champ axes disparaît. Renvoie une copie. */
export function normaliserNotion(n) {
  const out = Object.assign({}, n);
  out.auteurs = (n.auteurs || []).map(normaliserAuteur);
  const manuels = Array.isArray(n.plans) ? n.plans : [];
  out.plans = manuels.concat((n.axes || []).map(axeEnPlan));
  delete out.axes;
  return out;
}

/* normaliserConcept(c) — les anciennes tensions[] (« A ≠ B ») deviennent des
   relations de type 'distinction' ; le champ tensions disparaît. Copie. */
export function normaliserConcept(c) {
  const out = Object.assign({}, c);
  const rels = Array.isArray(c.relations) ? c.relations.slice() : [];
  (c.tensions || []).forEach(t => { if (t && String(t).trim()) rels.push({ type: 'distinction', desc: String(t).trim() }); });
  out.relations = rels;
  delete out.tensions;
  return out;
}
