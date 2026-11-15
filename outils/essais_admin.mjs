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
];

let ko = 0;
for (const e of ESSAIS) {
  const ok = (() => { try { return e.f(charger(SOURCE)); } catch (err) { console.log('   erreur : ' + err.message); return false; } })();
  const vu = (() => { try { return !e.f(charger(e.temoin(SOURCE))); } catch (err) { return !/témoin/.test(err.message); } })();
  console.log(`${ok ? 'ok ' : 'KO '} ${e.nom}  ·  témoin ${vu ? 'vu' : 'PAS VU'}`);
  if (!ok || !vu) ko++;
}
console.log(ko ? '\nÀ CORRIGER' : '\ncohérent');
process.exit(ko ? 1 : 0);
