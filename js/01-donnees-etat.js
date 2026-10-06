/* js/01-donnees-etat.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ══════════════════════════════════════════════════════════════════
   A. DONNÉES — chargées depuis data.js (script classique, globales)
   ──────────────────────────────────────────────────────────────────
   Les données vivent dans data.js (chargé AVANT ce script) : on les
   consomme ici directement comme variables globales.
     const D        → dictionnaire des 17 notions du programme (clé =
                      identifiant : "conscience", "nature", "bonheur"…).
     const KEYS     → Object.keys(D) (ordre d'affichage des notions).
     const AM       → métadonnées des auteurs (bio, courant, période,
                      thèmes, dialogues).
     const CONCEPTS → glossaire des concepts clés.
     const CC       → couleurs par courant philosophique (resté ici).

   Forme d'une notion D[k] (champs principaux) :
     c   → couleur hex (badge, pills, graphe…)   l → label lisible
     s   → sous-titre / question d'accroche       def → définition HTML
     auteurs → [{n, ideas:[{w, i, citations:[…], new?, modified?}]}]
               (multi-idées + multi-citations ; ancien {n,w,i,q} migré)
     textes  → [{n, t}]  ·  exemples → [{tag, tit, body, lien}]
     plans   → plans de dissertation [{q, intro, pb, axes:[…]}]
               (les anciens « axes » y sont convertis par le build,
                migrated:true)
     liens   → noms d'autres notions liées (navigables)
     diss    → sujets de dissertation (string ou {q, new?})

   Les données arrivent déjà canoniques (build : outils/construire.mjs) ;
   buildAI() construit l'index AI des auteurs.
   ══════════════════════════════════════════════════════════════════ */


/* ── B. ÉTAT GLOBAL DE L'AFFICHAGE ───────────────────────────────────
   Ces variables mémorisent ce qui est affiché à l'écran. Toute
   modification doit être suivie d'un appel à renderSB() et/ou
   renderContent() / renderAuthorContent() pour mettre à jour l'UI.
   (Déclarées dans data.js jusqu'en oct. 2026 ; data.js ne garde plus que
   les données. KEYS, l'ordre des notions, y reste.) */
let cur=KEYS[0];             // notion active (ex: "conscience")
let curTab='auteurs';        // onglet actif dans la vue notion
let curConceptSubTab='concepts'; // sous-onglet de l'onglet Concepts : 'concepts' | 'liens'
let curExempleSubTab='exemples';  // sous-onglet de l'onglet Exemples : 'exemples' | 'accroches'
let sbMode='notions';        // mode sidebar : 'notions' | 'auteurs' | 'concepts' | 'reperes' | 'methodo'
let curAuthor=null;          // auteur actif (chaîne = nom exact dans AM/AI)
let curAuthorTab='idees';    // onglet actif dans la fiche auteur

/* ── Concept state ───────────────────────────────────────────── */
let curConcept=null;
let conceptSearch='';
let conceptFilter=new Set(); // empty = all notions
let conceptFilterOpen=false;
let conceptFilterMode='or'; // 'or' = au moins une notion ; 'and' = toutes les notions cochées
// new (Repères) : recherche de l'onglet « Repères » (sbMode='reperes').
// Les repères (cat:'Repère') sont des CONCEPTS comme les autres, mais
// rangés à part : on les liste ici et on les EXCLUT du glossaire général.
// La fiche affichée reste la même (renderConceptContent + curConcept).
// NB : l'onglet « Méthodo » (sbMode='methodo') est, lui, un GUIDE de
// méthodologie distinct (renderMethodoContent) — à ne pas confondre.
let repereSearch='';
// Méthodo (guide) : parcours courant affiché par renderMethodoContent().
//   'dissertation' | 'explication'. METHODO_TOPICS pilote la liste de la
//   sidebar et le fil d'Ariane (défini plus bas, près de METHODO_GUIDE).
let methodoTopic='dissertation';
let explorerTopic='frise';   // étape 6 : sujet du mode Explorer (frise | graphe)
// REPERES() / vrais concepts : helpers de partition du tableau CONCEPTS.
//   isRepere(c)    → ce concept est-il un repère méthodologique ?
//   REPERES()      → liste des repères (onglet Repères)
//   realConcepts() → glossaire « Concepts » (tout SAUF les repères)
function isRepere(c){return c&&c.cat==='Repère';}
function REPERES(){return CONCEPTS.filter(isRepere);}
function realConcepts(){return CONCEPTS.filter(c=>!isRepere(c));}
/* ── E. FORMAT DES DONNÉES ────────────────────────────────────────────
   data.js arrive DÉJÀ au format canonique : auteurs {n, ideas:[{w, i,
   citations:[…]}]}, plans de dissertation dans D[k].plans (les anciens axes
   y sont convertis, migrated:true), relations de concepts unifiées (les
   anciennes tensions sont des relations de type 'distinction').
   Jusqu'en oct. 2026, ces conversions étaient refaites ici à CHAQUE
   chargement (normalizeAuthor, migrateAxeToPlan, normalizeD,
   normalizeConcepts). Elles vivent désormais dans outils/lib/formats.mjs,
   appliquées une fois par le build (outils/construire.mjs), qui écrit
   data.js à partir des sources de contenu/.                             */

/* buildAI() — construit l'index auteurs à partir de D (déjà normalisé).
   Parcourt toutes les notions et regroupe chaque auteur avec :
     · notions  : liste des clés de notion où il apparaît
     · entries  : { clé_notion → objet auteur normalisé {n, ideas:[…]} }
   Si un auteur apparaît plusieurs fois dans D[k].auteurs[] (cas rare
   mais autorisé), les idées sont concaténées — on ne perd aucune idée.
   Résultat stocké dans const AI, utilisé par la sidebar Auteurs
   et la fiche auteur (renderAuthorContent).                          */
function buildAI(){
  const idx={};
  KEYS.forEach(k=>{
    (D[k].auteurs||[]).forEach(a=>{
      const name=a.n;
      if(!idx[name]) idx[name]={notions:[],entries:{}};
      if(!idx[name].entries[k]){
        idx[name].notions.push(k);
        // COPIE (n + NOUVEAU tableau d'idées) : ne jamais référencer l'objet
        // de D tel quel, sinon la fusion ci-dessous (push) muterait
        // D[k].auteurs[] — la notion afficherait alors des idées dupliquées
        // et une carte « is-modified » fantôme (mélange neuve/ancienne).
        idx[name].entries[k]={n:a.n, ideas:a.ideas.slice()};
      }else{
        // Doublon du même auteur dans la même notion : fusion des idées
        // (dans la COPIE de l'index, jamais dans D).
        idx[name].entries[k].ideas.push(...a.ideas);
      }
    });
  });
  return idx;
}
const AI=buildAI();

/* authorsSorted() — renvoie la liste des noms d'auteurs triée :
   d'abord par nombre de notions couvertes (décroissant),
   puis alphabétiquement en cas d'égalité.                           */
function authorsSorted(){
  return Object.keys(AI).sort((a,b)=>{
    const d=AI[b].notions.length-AI[a].notions.length;
    return d!==0?d:a.localeCompare(b,'fr');
  });
}

/* ── Tri des cartes auteur par « popularité » ────────────────────────────
   Sert à ordonner les cartes d'auteur d'une notion (onglet « Auteurs »).
   Trois critères en cascade :
     1. PRINCIPAL — nombre de notions où l'auteur est référencé
        (AI[nom].notions.length) : un auteur transversal « pèse » plus.
     2. DÉPARTAGE — score « importance bac » = mesure AUTOMATIQUE du corpus
        (combien l'auteur est développé partout : idées + dialogues + citations)
        + un COUP DE POUCE manuel (BAC_BONUS) pour les incontournables du
        programme, afin qu'une figure majeure peu développée ne tombe pas trop.
     3. ALPHABÉTIQUE — pour un ordre stable et lisible à score égal.            */

// Coup de pouce manuel : poids ajouté aux auteurs les plus attendus au bac.
// Le score AUTO suffit pour la masse ; ceci ne sert qu'à départager / remonter
// un auteur majeur. Barème à 4 paliers (12 / 9 / 6 / 3). MODIFIABLE à volonté.
// (Variantes de nom incluses quand un même auteur apparaît sous plusieurs clés.)
const BAC_BONUS={
  // Palier S — fondateurs, quasi omniprésents au bac
  "Platon":12,"Aristote":12,"Descartes":12,"Kant":12,
  // Palier A — incontournables
  "Hegel":9,"Rousseau":9,"Nietzsche":9,"Marx":9,"Freud":9,"Sartre":9,
  "Hume":9,"Spinoza":9,"Pascal":9,"Bergson":9,"Hannah Arendt":9,"Arendt":9,
  // Palier B — très fréquents
  "Hobbes":6,"Locke":6,"Épicure":6,"Mill":6,"J.-S. Mill":6,"Merleau-Ponty":6,
  "Heidegger":6,"Épictète":6,"Schopenhauer":6,"Leibniz":6,"Tocqueville":6,
  "Comte":6,"Bachelard":6,"Popper":6,"Weber":6,"Rawls":6,"Bourdieu":6,"Durkheim":6,
  // Palier C — classiques secondaires fréquemment cités
  "Augustin":3,"Thomas d'Aquin":3,"Kierkegaard":3,"Sénèque":3,"Russell":3,
  "La Boétie":3,"Étienne de La Boétie":3,"Thoreau":3,"Henry David Thoreau":3,
  "Simondon":3,"Jonas":3,"Hans Jonas":3,"Simone Weil":3,"Engels":3,"Camus":3
};

/* authorPopularity(name) — critère 1 : nb de notions couvertes. */
function authorPopularity(name){ return AI[name]?AI[name].notions.length:0; }

/* authorBacScore(name) — critère 2 : score « importance bac » (auto + bonus).
   Idées et dialogues pèsent double (densité de traitement), citations simple. */
function authorBacScore(name){
  const e=AI[name]; let ideas=0, cites=0;
  if(e) Object.keys(e.entries).forEach(k=>{
    const en=e.entries[k]; ideas+=(en.ideas||[]).length;
    (en.ideas||[]).forEach(it=>{ cites+=(it.citations||[]).length; });
  });
  const dlg=(AM[name]&&AM[name].dialogues)?AM[name].dialogues.length:0;
  return ideas*2 + dlg*2 + cites + (BAC_BONUS[name]||0);
}

/* compareAuthors(an, bn) — comparateur de tri (popularité ↓, bac ↓, A→Z). */
function compareAuthors(an, bn){
  return authorPopularity(bn)-authorPopularity(an)
      || authorBacScore(bn)-authorBacScore(an)
      || an.localeCompare(bn,'fr');
}

/* ── Programme officiel (étape 4, oct. 2026) ─────────────────────────────
   PROGRAMME (data.js, tiré de contenu/programme.js) donne les 84 auteurs de
   la liste officielle. PROG_AUTEURS[nom de fiche] = {bo, periode} : seuls
   ces auteurs peuvent tomber à l'explication de texte ; en dissertation, on
   peut citer qui on veut. Sert à l'étiquette « Au programme ».            */
const PROG_AUTEURS={};
PROGRAMME.auteurs.forEach(a=>a.fiches.forEach(nom=>{ PROG_AUTEURS[nom]={bo:a.bo, periode:a.periode}; }));

/* progBadgeHTML(nom, court) — l'étiquette « Au programme » d'un auteur de la
   liste officielle, '' pour les autres. court=true : version compacte
   (« Programme ») pour les cartes d'auteur d'une notion. Le title dit à
   l'élève ce que l'étiquette change pour lui. */
function progBadgeHTML(nom, court){
  const p=PROG_AUTEURS[nom]; if(!p) return '';
  const bo=p.bo!==nom?', sous le nom « '+p.bo+' »':'';
  const t=`Liste officielle des auteurs (${p.periode}${bo}) : un texte de cet auteur peut tomber à l'explication de texte.`;
  return `<span class="prog-badge${court?' prog-badge-court':''}" title="${t}">${court?'Programme':'Au programme'}</span>`;
}

/* ── Les trois statuts (étape 5, oct. 2026) ──────────────────────────────
   CALCULÉS, jamais écrits à la main (docs/protocole-contenu.md, § 3) :
   · notion  : 'programme' si sa clé est dans PROGRAMME.notions, sinon
               'hors-programme' ;
   · auteur  : 'programme' s'il est sur la liste officielle (PROG_AUTEURS),
               'hors-liste' s'il apparaît dans au moins une notion du
               programme (citable en dissertation, pas à l'explication de
               texte), 'hors-programme' s'il n'apparaît que sous des notions
               hors programme ;
   · concept : 'hors-programme' si TOUTES ses notions le sont (un repère est
               toujours au programme), sinon 'programme'.
   Réglage « philo-hp » (localStorage) : '0' masque tout le hors programme.
   Visible par défaut (décision de l'auteur du 5 octobre 2026) ; le site
   propose de le masquer à la première visite (hpInviterSiBesoin).        */
const PROG_NOTIONS=new Set(PROGRAMME.notions);
function estHP(k){ return !!D[k] && !PROG_NOTIONS.has(k); }
const KEYS_HP=KEYS.filter(estHP);                // les notions hors programme, dans l'ordre
function voirHP(){ try{ return localStorage.getItem('philo-hp')!=='0'; }catch(e){ return true; } }
function notionVisible(k){ return !estHP(k)||voirHP(); }
function notionsVisibles(){ return KEYS.filter(notionVisible); }
function statutAuteur(nom){
  if(PROG_AUTEURS[nom]) return 'programme';
  const e=AI[nom];
  return (e&&e.notions.length&&e.notions.every(estHP))?'hors-programme':'hors-liste';
}
function auteurVisible(nom){ return voirHP()||statutAuteur(nom)!=='hors-programme'; }
function statutConcept(c){
  if(!c||isRepere(c)) return 'programme';
  const ns=(c.notions||[]).filter(k=>D[k]);
  return (ns.length&&ns.every(estHP))?'hors-programme':'programme';
}
function conceptVisible(c){ return voirHP()||statutConcept(c)!=='hors-programme'; }

/* hpBadgeHTML(court) — badge « Hors programme » (notion, concept, auteur qui
   n'apparaît que hors programme). court=true : version compacte (listes). */
function hpBadgeHTML(court){
  return `<span class="hp-badge${court?' hp-badge-court':''}" title="Pas au programme de terminale : pour aller plus loin. Masquable dans les Réglages.">${court?'HP':'Hors programme'}</span>`;
}
/* statutAuteurHTML(nom) — l'étiquette de statut d'un auteur, pour l'en-tête
   de sa fiche : « Au programme », « Hors liste » ou « Hors programme ». */
function statutAuteurHTML(nom){
  const s=statutAuteur(nom);
  if(s==='programme') return progBadgeHTML(nom);
  if(s==='hors-programme') return hpBadgeHTML();
  return `<span class="hl-badge" title="Absent de la liste officielle des auteurs : citable en dissertation, mais un texte de lui ne tombera pas à l'explication de texte.">Hors liste</span>`;
}

/* ── Courant → color ─────────────────────────────────────────── */
const CC={
  'Rationalisme':'#185FA5','Empirisme / Libéralisme':'#3B6D11','Idéalisme allemand':'#534AB7',
  'Existentialisme / Phénoménologie':'#534AB7','Matérialisme historique':'#D85A30',
  'Phénoménologie / Philosophie politique':'#993556','Utilitarisme / Libéralisme':'#EF9F27',
  'Libéralisme égalitaire':'#EF9F27','Libertarianisme':'#5F5E5A','Sociologie critique':'#D4537E',
  'Épicurisme':'#1D9E75','Contractualisme / Absolutisme':'#D85A30','Empirisme antique / Aristotélisme':'#3B6D11',
  'Éthique de la responsabilité':'#185FA5','Ontologie / Phénoménologie existentiale':'#534AB7',
  'Philosophie de la technique':'#185FA5','Philosophie sociale / Mysticisme':'#D4537E',
  'Sociologie compréhensive':'#5F5E5A','Libéralisme politique':'#EF9F27',
  'Vitalisme / Philosophie de la durée':'#1D9E75','Empirisme / Scepticisme':'#3B6D11',
  'Phénoménologie du corps':'#534AB7','Matérialisme dialectique':'#D85A30',
  'Transcendantalisme / Anarchisme pacifiste':'#1D9E75','Humanisme de la Renaissance':'#EF9F27',
  'Rationalisme / Panthéisme':'#185FA5','Idéalisme transcendantal':'#534AB7',
  'Psychanalyse':'#993556','Lumières / Contractualisme':'#1D9E75',
  'Généalogie / Philosophie de la vie':'#993556','Idéalisme platonicien':'#534AB7',
  'Matérialisme / Athéisme des Lumières':'#3B6D11','Stoïcisme':'#1D9E75',
  'Socialisme / Critique du travail':'#D85A30','Philosophie de la culture / Postmodernisme':'#5F5E5A',
  'Herméneutique / Phénoménologie':'#534AB7','Rationalisme républicain':'#185FA5',
  'Augustinisme / Apologétique':'#EF9F27','Pessimisme / Volontarisme':'#5F5E5A',
  'Philosophie de la technique / Philosophie de l\'existence':'#185FA5',
  'Linguistique / Phénoménologie du langage':'#6B4FA0',
  'Structuralisme / Linguistique':'#6B4FA0',
  'Philosophie analytique du langage':'#6B4FA0',
  'Pragmatique de la communication / Psychologie systémique':'#6B4FA0',
  'Linguistique cognitive / Relativisme linguistique':'#6B4FA0',
  'Littérature politique / Socialisme démocratique':'#D85A30',
  'Philosophie du langage / Philologie':'#6B4FA0',
  'Épistémologie critique':'#2E86AB',
  'Histoire et philosophie des sciences':'#2E86AB',
  'Philosophie de l\'absurde':'#C2603A',
  'Scepticisme':'#6E7B8B',
  // Étape 4 (oct. 2026) : courants des auteurs de la liste officielle ajoutés.
  // Mêmes teintes que les familles existantes (antiques en vert d'eau,
  // empiristes en vert, phénoménologues en violet, langage en mauve…).
  'Présocratiques':'#1D9E75','Taoïsme':'#1D9E75','Éclectisme / Stoïcisme romain':'#1D9E75',
  'Bouddhisme Madhyamaka':'#6E7B8B','Néoplatonisme':'#534AB7',
  'Falsafa (aristotélisme arabe)':'#3B6D11','Scolastique / Augustinisme':'#EF9F27',
  'Philosophie juive médiévale':'#EF9F27','Nominalisme / Scolastique':'#6B4FA0',
  'Réalisme politique / Républicanisme':'#D85A30','Empirisme':'#3B6D11',
  'Cartésianisme / Occasionnalisme':'#185FA5','Philosophie de l\'histoire':'#993556',
  'Empirisme / Immatérialisme':'#3B6D11','Lumières / Libéralisme politique':'#EF9F27',
  'Empirisme / Sensualisme':'#3B6D11','Lumières écossaises / Économie politique classique':'#EF9F27',
  'Rationalisme critique / Philosophie des sciences':'#2E86AB','Phénoménologie':'#534AB7',
  'Sociologie durkheimienne / Anthropologie':'#D4537E','Philosophie de l\'existence':'#534AB7',
  'Théorie critique / Philosophie de la culture':'#5F5E5A',
  'Philosophie morale / Philosophie de la durée':'#1D9E75','Libéralisme politique / Sociologie':'#EF9F27',
  'Phénoménologie / Éthique':'#534AB7','Existentialisme / Féminisme':'#993556',
  'Structuralisme / Anthropologie':'#6B4FA0','Philosophie analytique / Éthique des vertus':'#185FA5',
  'Platonisme moral':'#534AB7','Archéologie du savoir / Généalogie':'#993556',
  'Philosophie analytique / Pragmatisme':'#6B4FA0',
  // Étape 6 : les courants restés sans couleur (barres grises de la frise).
  'Psychanalyse / Psychologie des médias':'#993556','Psychanalyse lacanienne / Philosophie clinique':'#993556',
  'Sociologie positiviste':'#D4537E','Action non violente':'#1D9E75','Patristique / Augustinisme':'#EF9F27',
  'Scolastique / Thomisme':'#EF9F27','Hégélianisme de gauche / Matérialisme anthropologique':'#D85A30',
  'Existentialisme chrétien':'#534AB7','Philosophie analytique / Empirisme logique':'#6B4FA0',
  'Physique théorique / Spinozisme moderne':'#2E86AB','Sociologie de la consommation / Hypermodernité':'#5F5E5A',
  'Positivisme':'#2E86AB','Dadaïsme':'#C2603A','Surréalisme':'#C2603A','OULIPO / Littérature à contraintes':'#C2603A',
  'Libéralisme égalitaire / Approche par les capabilités':'#EF9F27','Naturalisme évolutionniste':'#3B6D11',
  'Philosophie du droit / Éthique environnementale':'#1D9E75','Éthique environnementale':'#1D9E75',
  'Philosophie des sciences / Éthique environnementale':'#1D9E75','Écoféminisme / Éthique environnementale':'#1D9E75',
  'Épistémologie historique / Phénoménologie poétique':'#2E86AB','Pragmatisme':'#6B4FA0',
  'Structuralisme / Sémiologie':'#6B4FA0','Théorie critique / Sociologie':'#5F5E5A'
};
