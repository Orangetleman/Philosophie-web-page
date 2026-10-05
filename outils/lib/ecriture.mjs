/* ════════════════════════════════════════════════════════════════════
   ecriture.mjs — écrit une valeur JavaScript sous forme de littéral LISIBLE
   (pour les sources de contenu/, éditées à la main) : clés sans guillemets
   quand c'est possible, chaînes entre guillemets doubles, un élément de
   liste par ligne dès que la valeur est longue, virgule finale partout (on
   ajoute une ligne sans toucher à la précédente). Les chaînes ne sont jamais
   coupées : une longue définition tient sur sa ligne.
   ════════════════════════════════════════════════════════════════════ */

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const LARGEUR = 110;   // au-delà, un objet ou une liste passe sur plusieurs lignes

const cle = k => (IDENT.test(k) ? k : JSON.stringify(k));
const simple = v => v === null || typeof v !== 'object';

/* enLigne(v) — la valeur sur une seule ligne. */
function enLigne(v) {
  if (simple(v)) return v === undefined ? 'undefined' : JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(enLigne).join(', ') + ']';
  return '{' + Object.keys(v).map(k => cle(k) + ': ' + enLigne(v[k])).join(', ') + '}';
}

/* ecrire(v, retrait) — la valeur, sur une ou plusieurs lignes selon sa taille.
   Un objet n'est écrit en ligne que s'il ne contient ni objet ni liste
   d'objets ET tient dans LARGEUR caractères. */
export function ecrire(v, retrait = '') {
  if (simple(v)) return enLigne(v);
  const ligne = enLigne(v);
  const plat = Array.isArray(v) ? v.every(simple) : Object.values(v).every(x => simple(x) || (Array.isArray(x) && x.every(simple)));
  if (plat && ligne.length + retrait.length <= LARGEUR) return ligne;
  const r = retrait + '  ';
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    return '[\n' + v.map(x => r + ecrire(x, r) + ',').join('\n') + '\n' + retrait + ']';
  }
  const ks = Object.keys(v);
  if (!ks.length) return '{}';
  return '{\n' + ks.map(k => r + cle(k) + ': ' + ecrire(v[k], r) + ',').join('\n') + '\n' + retrait + '}';
}
