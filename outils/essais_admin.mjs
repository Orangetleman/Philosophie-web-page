/* ════════════════════════════════════════════════════════════════════
   essais_admin.mjs — essais de admin/modele.js (la logique de /admin/)
   ────────────────────────────────────────────────────────────────────
   Comme le banc Supabase : chaque essai passe sur le vrai fichier, puis
   sur un TÉMOIN (le même fichier avec une faute glissée exprès), où il
   DOIT échouer. Un essai qui passe aussi sur le témoin ne prouve rien.

     node outils/essais_admin.mjs

   Créé le 15 novembre 2026 (lot A2, docs/chantier-administration.md).
   ════════════════════════════════════════════════════════════════════ */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const RACINE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = fs.readFileSync(path.join(RACINE, 'admin', 'modele.js'), 'utf8');
const SITE = fs.readFileSync(path.join(RACINE, 'js', '06-contribution.js'), 'utf8');

/* charger(src) — exécute le fichier dans un bac à sable et rend AdminModele. */
function charger(src) {
  const bac = { globalThis: {} };
  bac.globalThis = bac;
  vm.runInNewContext(src, bac, { filename: 'admin/modele.js' });
  return bac.AdminModele;
}
const remplace = (a, b) => src => {
  if (!src.includes(a)) throw new Error(`témoin : « ${a.slice(0, 50)} » absent de admin/modele.js`);
  return src.replace(a, b);
};

const B = (id, statut, extra = {}) => Object.assign({ id, statut, lue_le: '2026-11-01', sujet: null, ia_verdict: null, pseudo: null,
  contenu: { categorie: 'notion', cible: 'exemple', type: 'ajout', fields: { notion: 'travail', extitre: 'Livreurs' } } }, extra);

const ESSAIS = [
  { nom: '« À traiter » ne montre que les boîtes en attente',
    temoin: remplace("case 'a-traiter': if (b.statut !== 'en_attente') return false; break;", "case 'a-traiter': break;"),
    f: M => M.filtrer([B(1, 'en_attente'), B(2, 'validee'), B(3, 'refusee')], {}).map(b => b.id).join() === '1' },
  { nom: '« Nouvelles » = jamais ouvertes',
    temoin: remplace("case 'nouvelles': if (b.lue_le) return false; break;", "case 'nouvelles': break;"),
    f: M => M.filtrer([B(1, 'en_attente', { lue_le: null }), B(2, 'en_attente')], { etat: 'nouvelles' }).map(b => b.id).join() === '1' },
  { nom: 'la recherche ignore accents et casse',
    temoin: remplace("return String(s).normalize('NFD').replace(/\\p{Mn}/gu, '').toLowerCase();", 'return String(s);'),
    f: M => M.filtrer([B(1, 'en_attente', { contenu: { cible: 'auteur', fields: { nom: 'Lévinas' } } })], { q: 'LEVINAS' }).length === 1 },
  { nom: 'filtre IA « Pas relue »',
    temoin: remplace("if (f.ia === 'aucun' ? !!b.ia_verdict : f.ia && b.ia_verdict !== f.ia) return false;", 'if (f.ia && b.ia_verdict !== f.ia) return false;'),
    f: M => M.filtrer([B(1, 'en_attente', { ia_verdict: 'valide' }), B(2, 'en_attente')], { ia: 'aucun' }).map(b => b.id).join() === '2' },
  { nom: 'ce que voit le contributeur : « 1 sur 3 validée »',
    temoin: remplace("const integ = c('integree'), ok = c('validee') + integ;", "const integ = c('integree'), ok = c('validee');"),
    f: M => M.vuContributeur(['integree', 'en_attente', 'en_attente']) === '1 sur 3 validée'
      && M.vuContributeur(['integree', 'refusee']) === '1 sur 2 intégrée au site'
      && M.vuContributeur(['en_attente']) === 'En attente de relecture' },
  { nom: 'les notions s’affichent par leur titre, champs d’en-tête en premier',
    temoin: remplace("if (k === 'notion') return n(v);", ''),
    f: M => {
      const c = M.champsLisibles({ fields: { extitre: 'Livreurs', notion: 'travail' } }, { travail: 'Le travail' });
      return c[0].k === 'notion' && c[0].valeur === 'Le travail' && c[1].label === 'Titre';
    } },
  { nom: 'une idée d’auteur se détaille champ par champ',
    temoin: remplace("if (lignes.length) out.push({ k: 'ideas', label: 'Idée ' + (i + 1), idee: lignes });", ''),
    f: M => {
      const c = M.champsLisibles({ fields: { nom: 'Weil', ideas: [{ notion: 'travail', oeuvre: 'La Condition ouvrière', citations: ['a', 'b'] }] } }, {});
      const i = c.find(x => x.k === 'ideas');
      return !!i && i.idee.find(x => x.k === 'citations').valeur === 'a · b';
    } },
  { nom: 'le lien vers la fiche : auteur d’abord, sinon notion',
    temoin: remplace("if (f.nom) return '/#/auteur/' + encodeURIComponent(f.nom);", ''),
    f: M => M.lienSite({ contenu: { fields: { nom: 'Simone Weil', notion: 'travail' } } }) === '/#/auteur/Simone%20Weil' },
  { nom: 'une erreur de droits devient une phrase, pas un code',
    temoin: remplace("if (code === '42501' || /non administrateur/i.test(msg))", 'if (false)'),
    f: M => /pas administrateur/.test(M.erreur({ code: '42501', message: 'Accès refusé' })) },
  { nom: 'migration absente : on le dit',
    temoin: remplace("if (code === 'PGRST202' || /could not find the function/i.test(msg))", 'if (false)'),
    f: M => /2026_administration\.sql/.test(M.erreur({ code: 'PGRST202', message: 'Could not find the function public.admin_boites' })) },
  { nom: 'dates : « il y a 3 h », « hier », « le 05/11 »',
    temoin: remplace("if (jour(m) - jour(t) === 1) return 'hier';", ''),
    f: M => M.depuis('2026-11-15T09:00:00', '2026-11-15T12:00:00') === 'il y a 3 h'
      && M.depuis('2026-11-14T10:00:00', '2026-11-15T12:00:00') === 'hier'
      && M.depuis('2026-11-05T10:00:00', '2026-11-15T12:00:00') === 'le 05/11' },
  { nom: 'chaque champ du formulaire du site a un libellé dans /admin/',
    temoin: remplace("acctype: 'Type d’accroche', ", ''),
    f: M => {
      const cles = new Set([...SITE.matchAll(/\bk:\s*["']([a-z_0-9]+)["']/g)].map(m => m[1]));
      const manquent = [...cles].filter(k => !M.CHAMPS[k]);
      if (manquent.length) console.log('   champs sans libellé : ' + manquent.join(', '));
      return cles.size > 30 && !manquent.length;
    } },
  /* Lot A4 : doublons. Les ratios de référence viennent de Python
     (difflib.SequenceMatcher(None, a, b, autojunk=False).ratio()). */
  { nom: 'ressemblance : mêmes chiffres que difflib',
    temoin: remplace('return (2 * communs(0, a.length, 0, b.length)) / (a.length + b.length);', 'return communs(0, a.length, 0, b.length) / (a.length + b.length);'),
    f: M => [['sartre | la mauvaise foi', 'sartre | mauvaise foi chez sartre', 0.7368], ['abcd', 'bcda', 0.75], ['le travail libere', 'le travail aliene', 0.8824]]
      .every(([a, b, r]) => Math.abs(M.ressemblance(a, b) - r) < 0.0005) },
  { nom: 'doublons : identique, même nom, texte proche ; jamais une autre catégorie',
    temoin: remplace("if (cle.length >= 4 && k.length >= 4 && k !== cle && (k.includes(cle) || cle.includes(k)))", 'if (false)'),
    f: M => {
      const A = (id, cible, fields, cat) => B(id, 'en_attente', { contenu: { categorie: cat || 'auteur', cible, type: 'ajout', fields } });
      const b = A(1, 'auteur-citation', { nom: 'Sartre', notion: 'liberte', citation: 'La mauvaise foi' });
      const liste = [b,
        A(2, 'auteur-citation', { nom: 'SARTRE', notion: 'liberte', citation: 'Autre chose' }),
        A(3, 'auteur-citation', { nom: 'Jean-Paul Sartre', notion: 'liberte', citation: 'x' }),
        A(4, 'exemple', { nom: 'Sartre', notion: 'liberte' }, 'notion'),
        A(5, 'auteur-citation', { nom: 'Kant', notion: 'devoir', citation: 'y' })];
      const d = M.doublons(b, liste);
      return d.map(x => x.id + ':' + x.raison).join() === '2:identique,3:même nom';
    } },
  /* Lot A3 : le site (« Mes propositions », js/06-contribution.js) et /admin/
     (« le contributeur voit … ») doivent dire la même chose. On extrait du
     site etatBoitesLabel et le format du numéro de suivi. */
  { nom: 'le site et /admin/ annoncent le même état au contributeur',
    temoin: remplace("if (c('refusee') === n) return 'Non retenue';", ''),
    f: (M, S) => {
      const etats = ['en_attente', 'validee', 'integree', 'refusee'];
      const combis = [[]];
      for (let n = 0; n < 3; n++) combis.push(...combis.filter(c => c.length === n).flatMap(c => etats.map(e => [...c, e])));
      return combis.filter(c => c.length).every(c => S.etatBoitesLabel(c).txt === M.vuContributeur(c));
    } },
  { nom: 'numéro de suivi : saisi en minuscules ou avec tirets, c’est le même',
    // Ce cas ne dépend que du site : le témoin y glisse la faute (temoinSite).
    temoinSite: src => src.replace(".toUpperCase().replace(/[^0-9A-Z]/g,'')", '.toUpperCase()'),
    f: (M, S) => S.normaliserSuivi('k7q-4md 2xa-b3c') === 'K7Q4MD2XAB3C' && S.formaterSuivi('k7q4md2xab3c') === 'K7Q-4MD-2XA-B3C' },
  // Lot A5 : l'aller-retour d'intégration (cadrage § 9).
  { nom: 'export : seulement les validées, sans pseudo ni réponse',
    temoin: remplace("const val = boites.filter(b => b.statut === 'validee')", 'const val = boites.filter(b => b)'),
    f: M => {
      const e = M.exporter([B(1, 'validee', { pseudo: 'Léa', reponse: 'merci', note: 'garder sans guillemets' }), B(2, 'en_attente')], '2026-11-16T10:00:00Z');
      const t = JSON.stringify(e.json);
      return e.json.format === 'philo-export/v1' && e.json.boites.length === 1 && e.json.boites[0].fichier === 'contenu/notions/travail.js'
        && e.json.boites[0].note_interne === 'garder sans guillemets' && !/Léa|merci/.test(t) && /^philo-export-2026-11-1\d\.json$/.test(e.nom);
    } },
  { nom: 'compte rendu : boîte inconnue, plus validée ou déjà appliquée → décochée',
    temoin: remplace("else if (b.statut !== 'validee') etat = 'pas-validee';", ''),
    f: M => {
      const boites = [B(1, 'validee'), B(2, 'refusee'), B(3, 'integree', { integration: { commit: 'abc' } })];
      const r = M.lireCompteRendu(JSON.stringify({ format: 'philo-integration/v1', commit: 'abc', boites: [
        { id: 1, resultat: 'integree', reponse_proposee: 'Ajoutée !' }, { id: 2, resultat: 'integree' }, { id: 3, resultat: 'integree' }, { id: 9, resultat: 'integree' }] }), boites);
      return r.lignes.map(l => l.etat).join() === 'ok,pas-validee,deja,inconnue' && r.lignes.filter(l => l.coche).length === 1;
    } },
  { nom: 'compte rendu : seules les lignes cochées partent, sans réponse si non intégrée',
    temoin: remplace("boites: lignes.filter(l => l.coche && l.etat === 'ok')", 'boites: lignes.filter(l => l)'),
    f: M => {
      const r = M.lireCompteRendu({ format: 'philo-integration/v1', commit: 'c1', boites: [
        { id: 1, resultat: 'non_integree', detail: 'citation introuvable', reponse_proposee: 'x' }, { id: 2, resultat: 'retouchee' }] }, [B(1, 'validee'), B(2, 'validee')]);
      r.lignes[1].coche = false;
      const a = M.rapportAEnvoyer(r.rapport, r.lignes);
      return a.boites.length === 1 && a.boites[0].id === 1 && a.boites[0].reponse === '' && a.commit === 'c1'
        && M.lireCompteRendu('{"format":"autre"}', []).erreur && M.lireCompteRendu('pas du json', []).erreur;
    } },
  { nom: 'export : l’auteur retrouve sa fiche existante, l’idée va dans la notion',
    temoin: remplace("const proches = auteurs.filter(a => { const k = norme(a); return k.length >= 4 && (n.includes(k) || k.includes(n)); });", 'const proches = [];'),
    f: M => {
      const AUT = ['Jankélévitch', 'Weil', 'Simone Weil'];
      const bio = B(1, 'validee', { contenu: { categorie: 'auteur', cible: 'auteur-bio', fields: { nom: 'Vladimir Jankélévitch' } } });
      const cit = B(2, 'validee', { contenu: { categorie: 'auteur', cible: 'auteur-citation', fields: { nom: 'Vladimir Jankélévitch', notion: 'temps' } } });
      const nouv = B(3, 'validee', { contenu: { categorie: 'auteur', cible: 'auteur-bio', fields: { nom: 'Hannah Inconnue' } } });
      return M.fichierCible(bio, AUT) === 'contenu/auteurs/jankelevitch.js' && M.fichierCible(cit, AUT) === 'contenu/notions/temps.js'
        && /nouvelle fiche/.test(M.fichierCible(nouv, AUT)) && M.auteurConnu('simone weil', AUT) === 'Simone Weil'
        && M.exporter([cit], null, AUT).json.boites[0].auteur === 'Jankélévitch';
    } },
];

/* site() — les fonctions du site utiles aux essais, extraites de
   js/06-contribution.js et exécutées seules. */
function site(src = SITE) {
  const morceau = (de, a) => { const i = src.indexOf(de), j = src.indexOf(a, i); if (i < 0 || j < 0) throw new Error('site : « ' + de + ' » introuvable'); return src.slice(i, j); };
  const bac = {};
  vm.runInNewContext(morceau('const ETAT_BOITE=', 'function boitesSuiviHTML') + morceau('function normaliserSuivi', 'async function empreinteSuivi')
    + ';this.etatBoitesLabel=etatBoitesLabel;this.normaliserSuivi=normaliserSuivi;this.formaterSuivi=formaterSuivi;', bac);
  return bac;
}

let ko = 0;
for (const e of ESSAIS) {
  // Un essai a un témoin dans modele.js (temoin) ou dans le site (temoinSite).
  const ok = (() => { try { return e.f(charger(SOURCE), site()); } catch (err) { console.log('   erreur : ' + err.message); return false; } })();
  const vu = (() => {
    try {
      if (e.temoinSite) { const t = e.temoinSite(SITE); if (t === SITE) return false; return !e.f(charger(SOURCE), site(t)); }
      return !e.f(charger(e.temoin(SOURCE)), site());
    } catch (err) { return !/témoin/.test(err.message); }
  })();
  console.log(`${ok ? 'ok ' : 'KO '} ${e.nom}  ·  témoin ${vu ? 'vu' : 'PAS VU'}`);
  if (!ok || !vu) ko++;
}
console.log(ko ? '\nÀ CORRIGER' : '\ncohérent');
process.exit(ko ? 1 : 0);
