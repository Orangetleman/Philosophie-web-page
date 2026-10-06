/* js/05-liens-dynamiques.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ── H. MOTEUR DE LIENS DYNAMIQUES ──────────────────────────────────

   LINK_MAP : dictionnaire { terme_en_minuscules → {t, v} } construit au
   chargement à partir de trois sources, par ordre de priorité décroissant :
     · notions  → {t:'n', v:cléDeD}     pour chaque notion de D
     · concepts → {t:'c', v:idConcept}  pour CONCEPTS (hors entrées notion-*)
     · auteurs  → {t:'a', v:nomAuteur}  pour chaque clé de l'index AI
   La priorité notion > concept > auteur évite les collisions de termes
   (ex : « Conscience » pointe vers la notion, pas un concept homonyme).

   LINK_REGEX : regex globale, termes triés du plus long au plus court
   (ex : « William James » doit matcher avant « James »). Les bornes de mot
   utilisent des lookarounds qui reconnaissent les lettres ACCENTUÉES
   (À-ÿ) — \b échouait sur « Vérité », « État », « Épistémé », « Sacré »…

   linkTerms(html) : découpe la chaîne en balises + fragments de texte, et
   ne linkifie que le texte (y compris avant la 1re balise et après la
   dernière). Remplace chaque terme reconnu par un <span> cliquable dont
   la CLASSE code le type :
     .cterm (concept) → openConcept · .aterm (auteur) → openAuthor
     .nterm (notion, coloré) → openNotion
   Appelé sur toutes les zones de texte libre : définitions, idées,
   citations, biographies, thèmes, axes, exemples, dialogues.            */
const LINK_MAP={};
// 1. Notions (priorité haute) — libellé de chaque notion de D
KEYS.forEach(k=>{ LINK_MAP[D[k].l.toLowerCase()]={t:'n',v:k}; });
// 2. Concepts — hors entrées notion-* (déjà couvertes par les notions)
CONCEPTS.forEach(c=>{
  if(c.id.startsWith('notion-')) return;
  const key=c.term.toLowerCase();
  if(!LINK_MAP[key]) LINK_MAP[key]={t:'c',v:c.id};
});
// 3. Auteurs — clés de AI (garantit que openAuthor reconnaîtra le nom)
Object.keys(AI).forEach(name=>{
  const key=name.toLowerCase();
  if(!LINK_MAP[key]) LINK_MAP[key]={t:'a',v:name};
});
// 3 bis. Alias d'auteurs : variantes de nom (forme courte/longue) → nom
// canonique (clé AI), après fusion des doublons dans D. Permet que linkTerms
// lie AUSSI ces variantes en prose vers la BONNE fiche (sinon, une mention
// « Arendt » ou « Jonas » deviendrait du texte mort une fois la fiche unifiée).
const AUTHOR_ALIASES={
  // Doublons fusionnés dans D (cf. ci-dessus) :
  "Arendt":"Hannah Arendt",
  "Henry David Thoreau":"Thoreau",
  "Étienne de La Boétie":"La Boétie",
  "J.-S. Mill":"Mill",
  "Jonas":"Hans Jonas",
  // Formes courtes (nom de famille) d'auteurs déjà au nom complet dans D :
  // ces mentions en prose deviennent ainsi cliquables vers la bonne fiche.
  "James":"William James",
  "Breton":"André Breton",
  "Tzara":"Tristan Tzara",
  "Perec":"Georges Perec",
  // Bios d'AM rangées jusqu'en oct. 2026 sous la forme courte, alors que D
  // emploie le nom complet : clés d'AM renommées, formes courtes gardées ici.
  "Weil":"Simone Weil",
  "Nozick":"Robert Nozick",
  "Anders":"Gunther Anders",
  // Auteurs de la liste officielle ajoutés à l'étape 4 (oct. 2026) : graphies
  // du BO, formes courtes et noms d'origine, rendus cliquables vers la fiche.
  "Guillaume d'Occam":"Guillaume d'Ockham","Occam":"Guillaume d'Ockham","Ockham":"Guillaume d'Ockham",
  "Nagarjuna":"Nāgārjuna","Tchouang-tseu":"Zhuangzi","Marc-Aurèle":"Marc Aurèle",
  "Ibn Sina":"Avicenne","Ibn Rushd":"Averroès","Anselme de Cantorbéry":"Anselme",
  "Simone de Beauvoir":"Beauvoir","Lévinas":"Levinas","Benjamin":"Walter Benjamin",
  "Aron":"Raymond Aron","Hersch":"Jeanne Hersch","Murdoch":"Iris Murdoch","Smith":"Adam Smith"
};
Object.keys(AUTHOR_ALIASES).forEach(alias=>{
  const canon=AUTHOR_ALIASES[alias], key=alias.toLowerCase();
  if(AI[canon] && !LINK_MAP[key]) LINK_MAP[key]={t:'a',v:canon};
});
// Bornes "mot" accentuées : on refuse une lettre/chiffre juste avant ou après
const LINK_REGEX=new RegExp(
  '(?<![A-Za-zÀ-ÖØ-öø-ÿ0-9])('
  +Object.keys(LINK_MAP).sort((a,b)=>b.length-a.length)
     .map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')
  +')(?![A-Za-zÀ-ÖØ-öø-ÿ0-9])','gi');

/* new: inkOnDark(hex) — éclaircit une couleur de notion pour qu'elle reste
   LISIBLE quand on l'emploie comme couleur de TEXTE sur le fond sombre des
   cartes. Les couleurs de notion (ex. Conscience #534AB7, Langage #6B4FA0)
   sont volontairement foncées ; utilisées telles quelles en texte sur un
   fond ~#1e1e1e, leur contraste tombe sous le seuil WCAG 2 AA (4.5:1), ce
   que signalait l'audit d'accessibilité. On mélange donc la couleur vers le
   blanc, par petits paliers, JUSQU'À atteindre un contraste sûr — sans
   changer sa teinte : l'identité colorée de la notion est préservée, juste
   un peu plus claire. Renvoie une chaîne « #rrggbb ».
   On vise le seuil contre la surface la PLUS CLAIRE où ces liens
   apparaissent (#2a2a2a, ex. .cit-card) : le contraste est alors garanti
   sur toutes les cartes plus sombres. La fonction est pure (sans effet de
   bord) et mémoïse ses résultats, car linkTerms l'appelle très souvent. */
const _inkCache={};
function inkOnDark(hex){
  if(_inkCache[hex]) return _inkCache[hex];
  // Normaliser « #abc » ou « #aabbcc » en composantes 0..255.
  let h=hex.replace('#','');
  if(h.length===3) h=h.split('').map(x=>x+x).join('');
  let r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16);
  // Luminance relative WCAG (linéarisation sRGB d'un canal, puis pondération).
  const lin=v=>{ v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); };
  const lum=(r,g,b)=>0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
  const BG=lum(0x2a,0x2a,0x2a);                       // surface claire de référence
  const ratio=l=>(Math.max(l,BG)+0.05)/(Math.min(l,BG)+0.05);
  // Éclaircir vers le blanc (+8 % par palier) jusqu'au seuil 4.5:1, ou blanc.
  for(let i=0; i<14 && ratio(lum(r,g,b))<4.5; i++){
    r=Math.round(r+(255-r)*0.08);
    g=Math.round(g+(255-g)*0.08);
    b=Math.round(b+(255-b)*0.08);
  }
  const hx=v=>v.toString(16).padStart(2,'0');
  return _inkCache[hex]='#'+hx(r)+hx(g)+hx(b);
}

/* linkTerms(html) — cf. section H ci-dessus : rend cliquables les notions,
   concepts et auteurs détectés dans un fragment HTML. */
function linkTerms(html){
  // Découpe la chaîne en BALISES (<...>) et FRAGMENTS DE TEXTE, puis ne
  // linkifie que le texte. Indispensable : une version antérieure ne
  // traitait que le texte ENTRE > et < — le texte avant la 1re balise et
  // surtout APRÈS la dernière (fréquent : la plupart des def finissent en
  // texte brut) n'était jamais lié, d'où des auteurs/concepts non cliquables.
  return html.replace(/<[^>]+>|[^<]+/g,(chunk)=>{
    if(chunk[0]==='<') return chunk; // c'est une balise : on n'y touche pas
    return chunk.replace(LINK_REGEX,(m)=>{
      const e=LINK_MAP[m.toLowerCase()];
      if(!e) return m;
      if(e.t==='n'){ // lien notion — coloré avec la couleur (éclaircie) de la notion
        // inkOnDark : version assez claire de la couleur de notion pour rester
        // lisible en texte sur fond sombre (WCAG AA). On l'applique au texte ET
        // au soulignement, qui restent ainsi de la même teinte que la notion.
        const col=inkOnDark(D[e.v].c);
        return `<span class="nterm" style="color:${col};border-color:${col}" onclick="openNotion('${e.v}')" title="Voir la notion : ${D[e.v].l}">${m}</span>`;
      }
      if(e.t==='a'){ // lien auteur
        const safe=e.v.replace(/'/g,"\\'");
        return `<span class="aterm" onclick="openAuthor('${safe}')" title="Voir l'auteur : ${e.v}">${m}</span>`;
      }
      // lien concept
      return `<span class="cterm" onclick="openConcept('${e.v}')" title="Voir définition : ${m}">${m}</span>`;
    });
  });
}
