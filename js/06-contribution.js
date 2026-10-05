/* js/06-contribution.js — morceau du script du site. Le build (outils/construire.mjs)
   recolle js/*.js dans l'ORDRE des noms en UN SEUL script, app.js : les
   fonctions restent visibles d'un morceau à l'autre comme avant, et le code
   « de premier niveau » s'exécute dans cet ordre. */
/* ── J. INTERFACE DE CONTRIBUTION ────────────────────────────────────
   Modale permettant à un visiteur de proposer du contenu, qui sera
   transmis au propriétaire du site.

   MODÈLE — une soumission = une ou plusieurs « boîtes » empilées.
   Chaque boîte a deux menus : un TYPE de proposition et une CIBLE.
     · type  : 'ajout' | 'correction' | 'remarque'
     · cible : 'notion' | 'auteur' | 'texte' | 'plan' | 'exemple'
               | 'dissertation' | 'concept'
   Les champs propres à chaque (type × cible) seront ajoutés à l'étape 1c
   dans le conteneur .pbox-fields.

   CAS PARTICULIER — RETOURS SUR LE SITE (catégorie 'site') : sous-cibles
   'site-bug' (signaler une erreur) et 'site-fonction' (proposer une
   fonctionnalité). Ces retours ne portent PAS sur le contenu philosophique
   mais sur l'outil. Le 3e menu « Type d'action » n'a alors aucun sens : il
   est masqué et le type est fixé en interne sur 'remarque' (valeur déjà
   connue de la pipeline d'agrégation, donc rien de neuf à propager côté
   base de données). La cible suffit à les distinguer.

   ÉTAT
     proposalBoxes — tableau des boîtes : { id, type, cible }
     proposalSeq   — compteur d'id uniques
   RENDU
     renderProposal() — reconstruit le corps de la modale
   ACTIONS
     openProposal / closeProposal — affiche / masque la modale
     addProposalBox / removeProposalBox — ajoute / retire une boîte (min. 1)
     setProposalField — change type/cible d'une boîte puis re-rend          */

// Adresse de réception des propositions — repli si l'envoi en ligne échoue.
const PROPOSAL_EMAIL='compte.secondaire.toi@gmail.com';

// new (comptes) : configuration Supabase (BaaS = Backend-as-a-Service —
// base PostgreSQL + authentification hébergées en ligne). Ces deux valeurs
// sont PUBLIQUES par conception :
//   • SUPABASE_URL      : l'adresse du projet.
//   • SUPABASE_ANON_KEY : la clé « anon/publishable », prévue pour vivre
//     dans le navigateur. Elle n'autorise QUE ce que les règles RLS (Row
//     Level Security — permissions ligne par ligne, côté base) permettent.
// La clé SECRÈTE (service_role) ne figure JAMAIS ici : elle reste sur le PC.
const SUPABASE_URL='https://fipdatwirklhgdbujobz.supabase.co';
const SUPABASE_ANON_KEY='sb_publishable_7A5cSXlmufU1mDfjs1hIIA_PSHpXOdB';
// Client unique, nommé SB pour ne pas masquer le global « supabase » du CDN.
// Si le CDN n'a pas pu se charger (hors-ligne) ou si l'URL manque, SB reste
// null et toute la couche compte se désactive proprement (repli mail/local).
const SB=(window.supabase&&SUPABASE_URL)?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;

// new (mot de passe oublié) : le lien reçu par e-mail ramène sur le site avec
// « type=recovery » dans l'URL. supabase-js consomme ce jeton puis NETTOIE
// l'URL très tôt — souvent AVANT qu'initAuth ne s'abonne à onAuthStateChange
// (initAuth est async : il attend getSession). L'évènement PASSWORD_RECOVERY
// peut donc passer inaperçu, et l'utilisateur se retrouve « juste connecté »
// sans écran de réinitialisation. On capture donc le drapeau ICI, de façon
// SYNCHRONE (même tick que createClient, avant tout nettoyage), pour pouvoir
// forcer l'écran « nouveau mot de passe » dans initAuth, quelle que soit la
// course d'évènements. (Cherché dans le hash ET la query selon le flow.)
const AUTH_RECOVERY_IN_URL=/type=recovery/.test(location.hash)||/type=recovery/.test(location.search);

// Libellés des deux menus déroulants
const PROPOSAL_TYPES=[
  {v:'ajout',      l:'Ajout'},
  {v:'correction', l:'Correction / modification'},
  {v:'remarque',   l:'Remarque'}
];
/* Menu à 2 niveaux : Catégorie principale (niveau 1) → Sous-cible (niveau 2).
   La sous-cible reste stockée dans box.cible (clé de dispatch dans tout le
   code) ; categorie sert au regroupement de l'UI et de l'agrégateur.      */
const PROPOSAL_CATS=[
  {v:'notion', l:'Notion'},
  {v:'auteur', l:'Auteur'},
  {v:'concept',l:'Concept'},
  // new: 4e catégorie — retours sur le site lui-même (pas sur le contenu philo).
  {v:'site',   l:'Le site / l’appli'}
];
const PROPOSAL_SOUSCIBLES={
  notion:[
    {v:'notion',      l:'Définition / approfondissement'},
    {v:'texte',       l:'Texte / extrait'},
    {v:'plan',        l:'Plan de dissertation'},
    {v:'dissertation',l:'Sujet de dissertation'},
    {v:'exemple',     l:'Exemple'},
    {v:'accroche',    l:'Accroche (amorce de dissertation)'}
  ],
  auteur:[
    {v:'auteur',         l:'Idée / œuvre'},
    {v:'auteur-citation',l:'Citation'},
    {v:'auteur-dialogue',l:'Dialogue'},
    {v:'auteur-bio',     l:'Biographie / métadonnées'}
  ],
  concept:[
    {v:'concept',         l:'Définition'},
    {v:'concept-relation',l:'Relation'}
  ],
  // new: retours sur l'outil. Pas de « type d'action » associé (voir
  // renderProposal/setProposalField : le 3e menu est masqué et le type
  // est fixé en interne sur 'remarque', valeur déjà connue de la pipeline).
  site:[
    {v:'site-bug',     l:'Signaler une erreur / un bug'},
    {v:'site-fonction',l:'Proposer une fonctionnalité'}
  ]
};
// Catégorie d'une sous-cible (dispatch + rétro-compat des anciennes cibles).
const CIBLE_CAT={
  notion:'notion',texte:'notion',plan:'notion',dissertation:'notion',exemple:'notion',accroche:'notion',
  auteur:'auteur','auteur-citation':'auteur','auteur-dialogue':'auteur','auteur-bio':'auteur',
  concept:'concept','concept-relation':'concept',
  // new: cibles de retour sur le site.
  'site-bug':'site','site-fonction':'site'
};
function cibleCat(cible){return CIBLE_CAT[cible]||'notion';}
/* Libellés lisibles d'un type / d'une catégorie / d'une sous-cible. */
function proposalTypeLabel(v){const o=PROPOSAL_TYPES.find(x=>x.v===v);return o?o.l:v;}
function proposalCatLabel(v){const o=PROPOSAL_CATS.find(x=>x.v===v);return o?o.l:v;}
function proposalCibleLabel(v){
  for(const cat in PROPOSAL_SOUSCIBLES){
    const o=PROPOSAL_SOUSCIBLES[cat].find(x=>x.v===v);
    if(o) return o.l;
  }
  return v;
}

let proposalBoxes=[];        // boîtes de la soumission en cours
let proposalSeq=0;           // compteur d'id uniques
let proposalContributor='';  // nom/pseudo du contributeur (facultatif)
let proposalView='edit';     // vue de la modale : 'edit' | 'preview' | 'mine'

// new : ÉDITION d'une proposition DÉJÀ ENVOYÉE (statut « en attente »). Quand on
// rouvre une proposition depuis « Mes propositions » pour la corriger, on retient
// ici l'id de la ligne Supabase (null = nouvelle proposition → insert classique).
// Pendant l'édition, le BROUILLON local en cours est mis de côté dans
// editDraftBackup et restauré en sortie (on n'écrase jamais une saisie non envoyée).
let editingContribId=null;   // id de la ligne en cours d'édition, ou null
let editDraftBackup=null;    // brouillon local sauvegardé le temps de l'édition
let myContribCache=[];       // dernières propositions chargées (retrouver un payload par id)

/* new (Phase 3) : BROUILLON de proposition — persistant + synchronisé.
   Les boîtes en cours de saisie n'étaient qu'en mémoire : perdues au
   rechargement et jamais reportées sur le compte. On les sauvegarde en
   localStorage ('philo-drafts') et on les fait voyager dans le bloc
   « préférences » synchronisé (pas de nouvelle table à créer). */
function proposalOpen(){
  const o=document.getElementById('proposal-overlay');
  return !!(o && o.classList.contains('open'));
}
function draftsBlobForSync(){
  return { boxes:proposalBoxes, contributor:proposalContributor, seq:proposalSeq };
}
function saveDrafts(){
  try{ localStorage.setItem('philo-drafts', JSON.stringify(draftsBlobForSync())); }catch(e){}
}
/* draftChanged — à appeler après CHAQUE modification du brouillon : on
   persiste localement, puis on programme un envoi (différé) vers le compte.
   Exception : pendant l'ÉDITION d'une proposition déjà envoyée (editingContribId),
   on ne touche PAS au brouillon (ni disque, ni sync) — il est mis de côté et
   sera restauré en sortie, donc les modifications en cours ne doivent pas
   l'écraser. */
function draftChanged(){
  if(editingContribId) return;   // édition d'un envoi : brouillon local préservé
  saveDrafts(); if(typeof syncOnPrefsChange==='function') syncOnPrefsChange();
}
/* applyDraftsBlob — recharge un brouillon (depuis le stockage ou le compte)
   dans l'état d'exécution. Par défaut on NE touche à rien si la modale est
   ouverte, pour ne pas effacer une saisie en cours sous les doigts du
   contributeur. `force` lève ce garde-fou (cf. adoptRemoteDrafts : la modale
   est ouverte MAIS rien n'est saisi localement → on peut adopter sans risque). */
function applyDraftsBlob(d, force){
  if(!d || (proposalOpen() && !force)) return;
  if(Array.isArray(d.boxes)) proposalBoxes=d.boxes;
  proposalContributor=d.contributor||'';
  let maxId=0; proposalBoxes.forEach(b=>{ if(b && b.id>maxId) maxId=b.id; });
  proposalSeq=Math.max(d.seq||0, maxId);   // jamais réutiliser un id déjà pris
}
/* restoreDraftsFromStorage — au démarrage : recharge le brouillon local. */
function restoreDraftsFromStorage(){
  try{ applyDraftsBlob(JSON.parse(localStorage.getItem('philo-drafts')||'null')); }catch(e){}
}
/* draftIsEmpty — vrai si le brouillon ne contient rien de saisi. Sert à
   décider, à la 1re connexion, si l'on peut adopter le brouillon du compte
   sans rien écraser. */
function draftIsEmpty(){
  if((proposalContributor||'').trim()) return false;
  if(!proposalBoxes.length) return true;
  if(proposalBoxes.length>1) return false;
  const f=(proposalBoxes[0]||{}).f||{};
  return !Object.keys(f).some(k=>{
    const v=f[k];
    if(Array.isArray(v)) return v.some(it=> it && (typeof it==='object'
      ? Object.keys(it).some(ik=>String(it[ik]==null?'':it[ik]).trim())
      : String(it).trim()));
    return String(v==null?'':v).trim();
  });
}
/* clearDrafts — vide le brouillon après un envoi en ligne réussi : une boîte
   neuve, le NOM du contributeur conservé (réutilisable). On persiste et on
   synchronise, mais on NE re-rend PAS (pour garder le message « Envoyé » à
   l'écran) : la prochaine ouverture repartira sur une boîte vierge. */
function clearDrafts(){
  proposalBoxes=[{id:++proposalSeq,categorie:'auteur',type:'ajout',cible:'auteur',f:{ideas:[{}]}}];
  draftChanged();
}
/* setProposalContributor — écrit le nom du contributeur + persiste le brouillon. */
function setProposalContributor(v){ proposalContributor=v; draftChanged(); }

/* prefillContributorFromAccount — préremplit le nom avec le pseudo du compte
   connecté SI le champ est encore vide (retour contributeur : une proposition
   envoyée connecté s'affichait « anonyme »). Ne touche pas à un nom déjà saisi. */
function prefillContributorFromAccount(){
  if(authUser && !(proposalContributor||'').trim()) proposalContributor=authLabel();
}

/* ensureIdeas — garantit que box.f.ideas existe (au moins une idée vide).
   Une boîte cible 'auteur' utilise box.f.ideas[] pour permettre N idées
   (œuvre / date / idée / citation / concepts) sous le même nom d'auteur. */
function ensureIdeas(box){
  const f=box.f||(box.f={});
  if(!Array.isArray(f.ideas)) f.ideas=[{}];
  if(f.ideas.length===0) f.ideas.push({});
}
/* Ajoute une boîte vierge (catégorie 'auteur' / sous-cible 'auteur' par
   défaut). Init box.f.ideas=[{}] car la sous-cible 'auteur' s'appuie dessus. */
function addProposalBox(){
  proposalBoxes.push({id:++proposalSeq,categorie:'auteur',type:'ajout',cible:'auteur',f:{ideas:[{}]}});
  renderProposal();
}
/* Supprime une boîte — on en conserve toujours au moins une. */
function removeProposalBox(id){
  if(proposalBoxes.length<=1) return;
  proposalBoxes=proposalBoxes.filter(b=>b.id!==id);
  renderProposal();
}
/* Change la catégorie, la sous-cible ou le type d'une boîte, puis re-rend.
   - categorie : on bascule cible sur la 1re sous-cible de la catégorie.
   - cible     : on en déduit la catégorie (cohérence du menu).
   Les champs texte, eux, écrivent via setBoxF/setIdeaF SANS re-rendre
   (pour ne pas perdre le focus). Si la cible devient 'auteur', f.ideas
   est garanti. */
function setProposalField(id,key,val){
  const b=proposalBoxes.find(x=>x.id===id);
  if(!b) return;
  if(key==='categorie'){
    b.categorie=val;
    const list=PROPOSAL_SOUSCIBLES[val];
    b.cible=(list&&list[0])?list[0].v:'notion';
    // Catégorie 'site' : le « type d'action » n'a pas de sens — on fixe une
    // valeur valide ('remarque') car le menu correspondant est masqué.
    if(val==='site') b.type='remarque';
  }else if(key==='cible'){
    b.cible=val;
    b.categorie=cibleCat(val);
  }else{
    b[key]=val;
  }
  if(b.cible==='auteur') ensureIdeas(b);
  renderProposal();
}

/* addProposalIdea — ajoute une idée vide à box.f.ideas et re-rend. */
function addProposalIdea(id){
  const b=proposalBoxes.find(x=>x.id===id); if(!b) return;
  ensureIdeas(b);
  b.f.ideas.push({});
  renderProposal();
}
/* removeProposalIdea — supprime l'idée d'index idx (au moins une reste). */
function removeProposalIdea(id,idx){
  const b=proposalBoxes.find(x=>x.id===id); if(!b||!Array.isArray(b.f.ideas)) return;
  if(b.f.ideas.length<=1) return;
  b.f.ideas.splice(idx,1);
  renderProposal();
}
/* setIdeaF — écrit une valeur de champ dans box.f.ideas[idx]. rerender=true
   seulement si le champ modifie la STRUCTURE du formulaire (ex. catégorie). */
function setIdeaF(id,idx,key,val,rerender){
  const b=proposalBoxes.find(x=>x.id===id); if(!b) return;
  ensureIdeas(b);
  const it=b.f.ideas[idx]||(b.f.ideas[idx]={});
  it[key]=val;
  draftChanged();              // new (Phase 3) : persiste + synchronise le brouillon
  if(rerender) renderProposal();
}
/* toggleIdeaRemove — (mode modif) marque une idée « à retirer » et révèle
   le champ justification. Re-rend pour afficher/masquer la justification. */
function toggleIdeaRemove(id,idx,on){
  const b=proposalBoxes.find(x=>x.id===id); if(!b) return;
  ensureIdeas(b);
  const it=b.f.ideas[idx]||(b.f.ideas[idx]={});
  it.remove=on;
  renderProposal();
}
/* Citations d'une idée — box.f.ideas[idx].citations[] (0..N). */
function addIdeaCitation(id,idx){
  const b=proposalBoxes.find(x=>x.id===id); if(!b) return;
  ensureIdeas(b);
  const it=b.f.ideas[idx]||(b.f.ideas[idx]={});
  if(!Array.isArray(it.citations)) it.citations=[];
  it.citations.push('');
  renderProposal();
}
function removeIdeaCitation(id,idx,ci){
  const b=proposalBoxes.find(x=>x.id===id); if(!b) return;
  const it=b.f.ideas[idx]; if(!it||!Array.isArray(it.citations)) return;
  it.citations.splice(ci,1);
  renderProposal();
}
/* setIdeaCitation — écrit une citation SANS re-rendu (préserve le focus). */
function setIdeaCitation(id,idx,ci,val){
  const b=proposalBoxes.find(x=>x.id===id); if(!b) return;
  const it=b.f.ideas[idx]; if(!it||!Array.isArray(it.citations)) return;
  it.citations[ci]=val;
  draftChanged();              // new (Phase 3) : persiste + synchronise le brouillon
}

/* ── Champs d'une boîte selon (type × cible) — étape 1c ──────────────
   · type 'ajout'      → champs de la cible (obligatoires / facultatifs)
   · type 'correction' → mêmes champs TOUS facultatifs + élément ciblé
   · type 'remarque'   → notion + élément concerné + texte libre
   Les valeurs sont stockées dans box.f. Les champs texte appellent
   setBoxF(...,false) : pas de re-rendu. Seuls les menus qui changent la
   STRUCTURE re-rendent (type, cible, catégorie d'exemple « Autre »).   */

// Champs propres à chaque sous-cible. t:'text'|'area'|'excat'|'dialdir'|'reltype'
// · r:requis (mode ajout). Les valeurs sont dans box.f (sauf cible 'auteur'
// idée/œuvre, dont les champs sont PAR IDÉE dans box.f.ideas[]).
const PROPOSAL_FIELDS={
  notion:[
    {k:"notiondef",l:"Définition / approfondissement proposé",t:"area",r:true,ph:"Le texte que vous proposez d'ajouter ou de préciser pour cette notion."}
  ],
  // 'auteur' (idée/œuvre) : champs PAR IDÉE (notion + citations gérées à part).
  auteur:[
    {k:"oeuvre",l:"Œuvre",t:"text",r:true,ph:"ex. Méditations métaphysiques"},
    {k:"date",l:"Date de l'œuvre",t:"text",r:false,ph:"ex. 1641"},
    {k:"idee",l:"Idée maîtresse (ce que l'auteur traite)",t:"area",r:true},
    {k:"concepts",l:"Termes à lier aux concepts",t:"text",r:false,ph:"termes séparés par des virgules"}
  ],
  // 'auteur-citation' : citation simple (notion + œuvre) ou rattachée.
  "auteur-citation":[
    {k:"oeuvre",l:"Œuvre",t:"text",r:false,ph:"ex. Méditations métaphysiques"},
    {k:"rattach",l:"Rattacher à une idée existante",t:"text",r:false,ph:"œuvre / idée déjà présente — vide = citation simple"},
    {k:"citation",l:"Citation",t:"area",r:true}
  ],
  // 'auteur-dialogue' : relation entre auteurs → AM[nom].dialogues[].
  "auteur-dialogue":[
    {k:"dialdir",l:"Type de relation",t:"dialdir",r:true},
    {k:"dialauteur",l:"Auteur en relation",t:"text",r:true,ph:"ex. Spinoza"},
    {k:"dialsujet",l:"Sujet de la relation",t:"text",r:true,ph:"ex. le déterminisme"},
    {k:"dialdesc",l:"Description",t:"area",r:true}
  ],
  // 'auteur-bio' : métadonnées de l'auteur → AM[nom].
  "auteur-bio":[
    {k:"a_bio",l:"Biographie",t:"area",r:false,ph:"dates, nationalité, apport principal"},
    {k:"a_courant",l:"Courant philosophique",t:"text",r:false,ph:"ex. Rationalisme"},
    {k:"a_periode",l:"Période / siècle",t:"text",r:false,ph:"ex. XVIIe siècle"},
    {k:"a_themes",l:"Thèmes clés",t:"text",r:false,ph:"séparés par des virgules"}
  ],
  texte:[
    {k:"titre",l:"Titre / source du texte",t:"text",r:true,ph:"ex. Descartes, Discours de la méthode"},
    {k:"contenu",l:"Contenu de l'extrait",t:"area",r:true}
  ],
  plan:[
    {k:"plan_q",l:"Sujet (question de dissertation)",t:"text",r:true,ph:"ex. La science et la religion s'opposent-elles ?"},
    {k:"plan_intro",l:"Problématisation (mise en tension)",t:"area",r:false,ph:"Pourquoi le sujet pose problème, en quelques phrases."},
    {k:"plan_pb",l:"Problématique",t:"area",r:false,ph:"La question reformulée après problématisation."},
    {k:"plan_a1t",l:"Axe I — titre",t:"text",r:true,ph:"Réponse évidente, argumentée"},
    {k:"plan_a1c",l:"Axe I — arguments / sous-parties",t:"area",r:true},
    {k:"plan_a1l",l:"Axe I — limite (transition vers II)",t:"text",r:false},
    {k:"plan_a2t",l:"Axe II — titre",t:"text",r:false,ph:"Réflexion plus profonde"},
    {k:"plan_a2c",l:"Axe II — arguments / sous-parties",t:"area",r:false},
    {k:"plan_a2l",l:"Axe II — limite (transition vers III)",t:"text",r:false},
    {k:"plan_a3t",l:"Axe III — titre",t:"text",r:false,ph:"Redéfinition / ouverture"},
    {k:"plan_a3c",l:"Axe III — arguments / sous-parties",t:"area",r:false},
    {k:"plan_a3l",l:"Axe III — limite / ouverture finale",t:"text",r:false}
  ],
  exemple:[
    {k:"excat",l:"Catégorie",t:"excat",r:true},
    {k:"extitre",l:"Titre de l'exemple",t:"text",r:true,ph:"ex. Auteur/idée — titre court"},
    {k:"excorps",l:"Description de l'exemple",t:"area",r:true},
    {k:"exlien",l:"Auteurs / idées associés",t:"text",r:false,ph:"ex. Descartes, doute méthodique"}
  ],
  // 'accroche' : amorce RÉDIGÉE prête à recopier pour ouvrir une dissertation
  // → D[notion].accroches[] = {type, t, src?, new:true}. La notion vient du
  // sélecteur (cible de catégorie 'notion'). acctype = tag court (Citation,
  // Paradoxe, Mythe, Actualité…) ; acctexte = la phrase d'ouverture ; accsrc =
  // source facultative.
  accroche:[
    {k:"acctype",l:"Type d'accroche",t:"text",r:true,ph:"ex. Citation, Paradoxe, Mythe, Actualité…"},
    {k:"acctexte",l:"Phrase d'accroche (rédigée, prête à recopier)",t:"area",r:true,ph:"Une amorce qui ouvre sur le problème du sujet."},
    {k:"accsrc",l:"Source (facultatif)",t:"text",r:false,ph:"ex. Pascal, Pensées"}
  ],
  dissertation:[
    {k:"question",l:"Question de dissertation",t:"text",r:true,ph:"ex. La liberté est-elle une illusion ?"}
  ],
  concept:[
    {k:"cterme",l:"Terme",t:"text",r:true,ph:"ex. Réminiscence"},
    {k:"ccat",l:"Catégorie",t:"text",r:false,ph:"ex. Métaphysique, Logique…"},
    {k:"cdef",l:"Définition",t:"area",r:true},
    {k:"clien",l:"Lien avec la / les notion(s) cochée(s)",t:"area",r:false,ph:"En quoi ce concept éclaire-t-il cette notion ? (affiché dans l'onglet Concepts)"}
  ],
  // 'concept-relation' : un lien (ou une distinction) entre concepts/termes.
  "concept-relation":[
    {k:"cterme",l:"Concept concerné",t:"text",r:true,ph:"ex. NOMA"},
    {k:"reltype",l:"Type de relation",t:"reltype",r:true},
    {k:"relcible",l:"Concept / terme en relation",t:"text",r:true,ph:"ex. concordisme (ou « A ≠ B » pour une distinction)"},
    {k:"reldesc",l:"Description du lien",t:"area",r:false}
  ],
  // new: 'site-bug' — signalement d'une erreur d'usage du site (pas du contenu).
  "site-bug":[
    {k:"bugou",     l:"Où, dans le site ?",t:"text",r:false,ph:"ex. la fiche Conscience, le quiz, le menu latéral…"},
    {k:"bugdesc",   l:"Décrivez le problème",t:"area",r:true,ph:"Ce qui ne va pas, et ce à quoi vous vous attendiez."},
    {k:"bugrepro",  l:"Comment le reproduire (étapes)",t:"area",r:false,ph:"1. … 2. … (si vous savez comment le refaire apparaître)"},
    {k:"bugappareil",l:"Appareil / navigateur",t:"text",r:false,ph:"ex. iPhone Safari, PC Chrome"}
  ],
  // new: 'site-fonction' — proposition d'une nouvelle fonctionnalité de l'outil.
  "site-fonction":[
    {k:"fonctitre",l:"L’idée en une phrase",t:"text",r:true,ph:"ex. Pouvoir surligner un passage d’une fiche"},
    {k:"foncdesc", l:"Décrivez la fonctionnalité",t:"area",r:true,ph:"Comment imaginez-vous que ça marche ?"},
    {k:"foncusage",l:"À quoi cela vous servirait-il ?",t:"area",r:false,ph:"Le besoin auquel ça répond (facultatif)."}
  ]
};

// Catégories d'exemples : liste consolidée [valeur, description]
const EXEMPLE_CATEGORIES=[
  ["Histoire","événement ou fait historique"],
  ["Science","découverte, théorie ou fait scientifique"],
  ["Histoire des sciences","épisode de l'histoire scientifique"],
  ["Sociologie","fait social, étude sociologique"],
  ["Psychologie / Psychanalyse","cas clinique, mécanisme psychique"],
  ["Politique / Droit","institution, loi, fait politique"],
  ["Littérature","œuvre ou personnage littéraire"],
  ["Arts","cinéma, peinture, musique, art contemporain"],
  ["Philosophie","thèse, expérience de pensée, doctrine"],
  ["Épistémologie / Logique","méthode, raisonnement, argumentation"],
  ["Éthique / Morale","dilemme ou principe moral"],
  ["Anthropologie","pratique ou trait culturel humain"],
  ["Mythe","récit mythologique ou religieux"],
  ["Actualité / Société","fait contemporain, débat de société"],
  ["Écologie","environnement, climat, nature"],
  ["Œuvres clés","repère bibliographique"],
  ["Technique","objet technique, innovation"],
  ["Autre","catégorie non listée"]
];

/* Échappe une valeur pour l'insérer dans du HTML (attribut ou texte). */
function pEsc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");}
/* Marqueur visuel obligatoire / facultatif. */
function reqMark(req){return req?'<span class="preq">obligatoire</span>':'<span class="popt">facultatif</span>';}

/* setBoxF — écrit une valeur de champ dans box.f. rerender=true seulement
   si le champ modifie la STRUCTURE du formulaire (ex. catégorie « Autre »). */
function setBoxF(id,key,val,rerender){
  const b=proposalBoxes.find(x=>x.id===id);
  if(!b) return;
  (b.f||(b.f={}))[key]=val;
  draftChanged();              // new (Phase 3) : persiste + synchronise le brouillon
  if(rerender) renderProposal();
}
/* Coche / décoche une notion liée (cible « concept »). Sans re-rendu. */
function toggleBoxNotion(id,k,on){
  const b=proposalBoxes.find(x=>x.id===id); if(!b) return;
  const arr=b.f.cnotions||(b.f.cnotions=[]);
  const i=arr.indexOf(k);
  if(on&&i<0) arr.push(k); else if(!on&&i>=0) arr.splice(i,1);
  draftChanged();              // new (Phase 3) : persiste + synchronise le brouillon
}

/* pField — rend un champ générique (input texte ou textarea). */
function pField(boxId,def,value,required){
  const ph=def.ph?` placeholder="${pEsc(def.ph)}"`:"";
  const v=pEsc(value||"");
  const ctrl=def.t==="area"
    ? `<textarea class="ptext" rows="3"${ph} oninput="setBoxF(${boxId},'${def.k}',this.value,false)">${v}</textarea>`
    : `<input class="pinput" type="text" value="${v}"${ph} oninput="setBoxF(${boxId},'${def.k}',this.value,false)">`;
  return `<div class="pfield"><label class="plabel">${def.l} ${reqMark(required)}</label>${ctrl}</div>`;
}

/* pIdeaField — variante de pField pour les champs d'une idée d'auteur :
   écrit dans box.f.ideas[ideaIdx][def.k] au lieu de box.f[def.k]. */
function pIdeaField(boxId,ideaIdx,def,value,required){
  const ph=def.ph?` placeholder="${pEsc(def.ph)}"`:"";
  const v=pEsc(value||"");
  const ctrl=def.t==="area"
    ? `<textarea class="ptext" rows="3"${ph} oninput="setIdeaF(${boxId},${ideaIdx},'${def.k}',this.value,false)">${v}</textarea>`
    : `<input class="pinput" type="text" value="${v}"${ph} oninput="setIdeaF(${boxId},${ideaIdx},'${def.k}',this.value,false)">`;
  return `<div class="pfield"><label class="plabel">${def.l} ${reqMark(required)}</label>${ctrl}</div>`;
}

/* notionSelectHTML — menu de la notion de rattachement de la boîte. */
function notionSelectHTML(box,required){
  const cur=box.f.notion||"";
  const lbl=box.cible==="notion"?"Notion concernée":"Notion de rattachement";
  const opts='<option value="">— choisir une notion —</option>'
    +KEYS.map(k=>`<option value="${k}"${cur===k?" selected":""}>${D[k].l}</option>`).join("");
  return `<div class="pfield"><label class="plabel">${lbl} ${reqMark(required)}</label>
    <select class="psel" onchange="setBoxF(${box.id},'notion',this.value,false)">${opts}</select></div>`;
}

/* notionsMultiHTML — cases à cocher des notions liées (cible « concept »). */
function notionsMultiHTML(box){
  const sel=box.f.cnotions||[];
  const items=KEYS.map(k=>`<label class="pchk"><input type="checkbox"${sel.indexOf(k)>=0?" checked":""} onchange="toggleBoxNotion(${box.id},'${k}',this.checked)"> ${D[k].l}</label>`).join("");
  return `<div class="pfield"><label class="plabel">Notions liées ${reqMark(false)}</label>
    <div class="pchk-grid">${items}</div></div>`;
}

/* excatFieldHTML — menu des catégories d'exemple (+ champ libre si « Autre »). */
function excatFieldHTML(box,required){
  const cur=box.f.excat||"";
  const opts='<option value="">— choisir une catégorie —</option>'
    +EXEMPLE_CATEGORIES.map(c=>`<option value="${pEsc(c[0])}"${cur===c[0]?" selected":""}>${pEsc(c[0])} — ${pEsc(c[1])}</option>`).join("");
  let html=`<div class="pfield"><label class="plabel">Catégorie ${reqMark(required)}</label>
    <select class="psel" onchange="setBoxF(${box.id},'excat',this.value,true)">${opts}</select></div>`;
  if(cur==="Autre")
    html+=pField(box.id,{k:"excatautre",l:"Catégorie personnalisée",t:"text",ph:"votre catégorie"},box.f.excatautre,required);
  return html;
}

/* findKnownAuthor — cherche si un nom saisi correspond à un auteur connu
   (recherche tolérante : inclusion dans un sens ou dans l'autre). */
function findKnownAuthor(name){
  const q=(name||"").trim().toLowerCase();
  if(q.length<2) return null;
  return Object.keys(AI).find(k=>{
    const a=k.toLowerCase();
    return a===q||a.indexOf(q)>=0||q.indexOf(a)>=0;
  })||null;
}
/* authorStatusHTML — message sous le champ nom (auteur connu / nouveau). */
function authorStatusHTML(val,known){
  if(!val.trim()) return "";
  return known
    ? '<div class="pauth-ok">✓ Auteur déjà présent : <strong>'+pEsc(known)+"</strong></div>"
    : '<div class="pauth-newmsg">Auteur non répertorié — vous pouvez compléter sa fiche ci-dessous (facultatif).</div>';
}
/* onAuthorName — saisie du nom : met à jour le statut et affiche/masque le
   sous-formulaire « nouvel auteur » SANS re-rendu (le focus est conservé). */
function onAuthorName(id,val){
  const b=proposalBoxes.find(x=>x.id===id); if(!b) return;
  b.f.nom=val;
  const known=findKnownAuthor(val);
  const status=document.getElementById("pauth-status-"+id);
  const sub=document.getElementById("pauth-new-"+id);
  if(status) status.innerHTML=authorStatusHTML(val,known);
  if(sub) sub.style.display=(!val.trim()||known)?"none":"";
}
/* authorNameHTML — champ nom + statut + sous-formulaire « nouvel auteur ». */
function authorNameHTML(box,required){
  const nom=box.f.nom||"";
  const known=findKnownAuthor(nom);
  const hidden=(!nom.trim()||known)?' style="display:none"':"";
  return `<div class="pfield">
      <label class="plabel">Nom de l'auteur ${reqMark(required)}</label>
      <input class="pinput" type="text" value="${pEsc(nom)}" placeholder="ex. Descartes" oninput="onAuthorName(${box.id},this.value)">
      <div id="pauth-status-${box.id}">${authorStatusHTML(nom,known)}</div>
    </div>
    <div class="pauth-new" id="pauth-new-${box.id}"${hidden}>
      <div class="phint" style="margin-bottom:8px">Nouvel auteur — ces informations aideront à créer sa fiche :</div>
      ${pField(box.id,{k:"a_bio",l:"Biographie courte",t:"area",ph:"dates, nationalité, apport principal"},box.f.a_bio,false)}
      ${pField(box.id,{k:"a_courant",l:"Courant philosophique",t:"text",ph:"ex. Rationalisme"},box.f.a_courant,false)}
      ${pField(box.id,{k:"a_periode",l:"Période / siècle",t:"text",ph:"ex. XVIIe siècle"},box.f.a_periode,false)}
      ${pField(box.id,{k:"a_themes",l:"Thèmes clés",t:"text",ph:"séparés par des virgules"},box.f.a_themes,false)}
    </div>`;
}

/* authorNameSimpleHTML — champ nom + statut, SANS sous-formulaire bio
   (sous-cibles citation / dialogue / bio : la bio y est hors-sujet ou bien
   c'est le contenu principal). */
function authorNameSimpleHTML(box,required){
  const nom=box.f.nom||"";
  const known=findKnownAuthor(nom);
  return `<div class="pfield">
      <label class="plabel">Nom de l'auteur ${reqMark(required)}</label>
      <input class="pinput" type="text" value="${pEsc(nom)}" placeholder="ex. Descartes" oninput="onAuthorName(${box.id},this.value)">
      <div id="pauth-status-${box.id}">${authorStatusHTML(nom,known)}</div>
    </div>`;
}
/* selectFieldHTML — champ <select> générique (types dialdir / reltype).
   opts = tableau de paires [valeur, libellé]. */
function selectFieldHTML(box,def,opts,required){
  const cur=box.f[def.k]||'';
  const o='<option value="">— choisir —</option>'
    +opts.map(p=>`<option value="${p[0]}"${cur===p[0]?' selected':''}>${pEsc(p[1])}</option>`).join('');
  return `<div class="pfield"><label class="plabel">${def.l} ${reqMark(required)}</label>
    <select class="psel" onchange="setBoxF(${box.id},'${def.k}',this.value,false)">${o}</select></div>`;
}
/* ideaCitationsFormHTML — liste des citations d'une idée (box.f.ideas[idx]) :
   0..N citations, chacune supprimable, + bouton « Ajouter une citation ». */
function ideaCitationsFormHTML(boxId,idx,it){
  const cites=Array.isArray(it.citations)?it.citations:[];
  let h=`<div class="pcites"><label class="plabel">Citations <span class="popt">facultatif</span></label>`;
  cites.forEach((c,ci)=>{
    h+=`<div class="pcite-row">
      <textarea class="ptext" rows="2" placeholder="citation" oninput="setIdeaCitation(${boxId},${idx},${ci},this.value)">${pEsc(c||'')}</textarea>
      <button class="pidea-del" title="Supprimer cette citation" onclick="removeIdeaCitation(${boxId},${idx},${ci})">×</button>
    </div>`;
  });
  h+=`<button class="pidea-addbtn" onclick="addIdeaCitation(${boxId},${idx})">+ Ajouter une citation</button></div>`;
  return h;
}
/* authorIdeaBlocksHTML — blocs d'idée multi-notions de la sous-cible 'auteur'.
   Chaque bloc : notion (sélecteur) + œuvre/date/idée/concepts + citations[]
   (+ retrait justifié en mode correction). Bouton « + Ajouter une idée ». */
function authorIdeaBlocksHTML(box){
  ensureIdeas(box);
  const isAjout=box.type==='ajout';
  const multi=box.f.ideas.length>1;
  let h='';
  box.f.ideas.forEach((it,idx)=>{
    const del=multi?` <button class="pidea-del" title="Supprimer ce bloc" onclick="removeProposalIdea(${box.id},${idx})">×</button>`:'';
    h+=`<div class="pidea"><div class="pidea-head">Idée ${idx+1}${del}</div>`;
    // Notion PAR idée (plusieurs idées possibles, sur notions identiques ou non)
    const curN=it.notion||'';
    const opts='<option value="">— choisir une notion —</option>'
      +KEYS.map(k=>`<option value="${k}"${curN===k?' selected':''}>${D[k].l}</option>`).join('');
    h+=`<div class="pfield"><label class="plabel">Notion ${reqMark(isAjout)}</label>
      <select class="psel" onchange="setIdeaF(${box.id},${idx},'notion',this.value,false)">${opts}</select></div>`;
    PROPOSAL_FIELDS.auteur.forEach(d=>{ h+=pIdeaField(box.id,idx,d,it[d.k],isAjout&&d.r); });
    h+=ideaCitationsFormHTML(box.id,idx,it);
    if(box.type==='correction'){
      h+=`<label class="pchk" style="margin-top:8px"><input type="checkbox"${it.remove?' checked':''} onchange="toggleIdeaRemove(${box.id},${idx},this.checked)"> Retirer cette idée / cette notion</label>`;
      if(it.remove) h+=pIdeaField(box.id,idx,{k:'justif',l:'Justification du retrait',t:'area',ph:'Pourquoi retirer cette idée / notion ?'},it.justif,true);
    }
    h+='</div>';
  });
  h+=`<div class="pidea-add"><button class="pidea-addbtn" onclick="addProposalIdea(${box.id})">+ Ajouter une idée (et sa notion)</button></div>`;
  return h;
}

/* renderBoxFields — formulaire selon (catégorie × sous-cible × type).
   - remarque   : ciblage adapté (notion / auteur / concept) + texte libre.
   - ajout/corr : rattachement notion adéquat, puis champs de la sous-cible. */
function renderBoxFields(box){
  const f=box.f||(box.f={});
  const cat=box.categorie||cibleCat(box.cible);
  const isAjout=box.type==='ajout';

  // ── RETOUR SUR LE SITE (catégorie 'site') ──
  // Pas de notion, pas d'auteur, pas de menu « type » : juste les champs
  // libres de la sous-cible (bug / fonctionnalité). Le caractère
  // obligatoire vient directement de d.r (le type est figé sur 'remarque').
  if(cat==='site'){
    let h='';
    (PROPOSAL_FIELDS[box.cible]||[]).forEach(d=>{ h+=pField(box.id,d,f[d.k],d.r); });
    return h;
  }

  // ── REMARQUE : ciblage selon la catégorie + texte libre ──
  if(box.type==="remarque"){
    let h='';
    if(cat==='notion') h+=notionSelectHTML(box,false);
    else if(cat==='auteur') h+=authorNameSimpleHTML(box,false);
    else if(cat==='concept') h+=pField(box.id,{k:'cterme',l:'Concept concerné',t:'text',ph:'ex. NOMA (vide si remarque générale)'},f.cterme,false);
    h+=pField(box.id,{k:"remelement",l:"Élément concerné",t:"text",ph:"titre, citation, zone précise… (facultatif)"},f.remelement,false);
    h+=pField(box.id,{k:"remtexte",l:"Votre remarque",t:"area",ph:"Décrivez le passage concerné et ce que vous suggérez."},f.remtexte,true);
    return h;
  }

  // ── AJOUT / CORRECTION ──
  let html='';
  // Rattachement notion selon la sous-cible.
  if(box.cible==='concept') html+=notionsMultiHTML(box);                       // concept : notions liées
  else if(cat==='notion') html+=notionSelectHTML(box,isAjout);                 // notion def/texte/plan/sujet/exemple
  else if(box.cible==='auteur-citation') html+=notionSelectHTML(box,isAjout);  // citation simple : notion requise

  // Correction : référence de l'élément ciblé.
  if(box.type==="correction"){
    html+=pField(box.id,{k:"cibleref",l:"Élément précis à corriger",t:"text",ph:"ex. la citation de Sartre, le titre de l'axe 2…"},f.cibleref,true);
    html+='<div class="phint" style="margin:-3px 0 9px">Ne remplissez ci-dessous que les champs à modifier.</div>';
  }

  // Sous-cible 'auteur' (idée/œuvre) : nom + bio-si-nouveau + blocs multi-notions.
  if(box.cible==='auteur'){
    html+=authorNameHTML(box,isAjout);
    html+=authorIdeaBlocksHTML(box);
    return html;
  }
  // Autres sous-cibles auteur (citation / dialogue / bio) : nom simple.
  if(cat==='auteur') html+=authorNameSimpleHTML(box,isAjout);

  // Champs propres à la sous-cible.
  (PROPOSAL_FIELDS[box.cible]||[]).forEach(d=>{
    const req=isAjout&&d.r;
    if(d.t==='excat') html+=excatFieldHTML(box,req);
    else if(d.t==='dialdir') html+=selectFieldHTML(box,d,[['oppose',"s'oppose à"],['prolonge','prolonge'],['repond','répond à']],req);
    else if(d.t==='reltype') html+=selectFieldHTML(box,d,[['oppose',"s'oppose à"],['prolonge','prolonge'],['complete','complète'],['repond','répond à'],['distinction','se distingue de'],['implique','implique']],req);
    else html+=pField(box.id,d,f[d.k],req);
  });
  return html;
}

/* ── Génération du texte de la proposition (étape 2) ────────────────
   generateProposalText() assemble un texte structuré : en-tête lisible
   + bloc « prêt à coller » (objet JS) pour les ajouts, description champ
   par champ pour les corrections, texte libre pour les remarques.
   Seuls les champs effectivement remplis figurent dans la sortie.      */

/* Valeur d'un champ, nettoyée (chaîne sans espaces de bord). */
function gv(f,k){return String(f&&f[k]!=null?f[k]:'').trim();}
/* Encadre une valeur en chaîne JS (échappe \, " et sauts de ligne). */
function jsStr(v){
  return '"'+String(v==null?'':v).replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\r?\n/g,'\\n')+'"';
}
/* Construit un littéral d'objet JS depuis des paires [clé,valeur,raw].
   Ignore les valeurs vides. raw=true → la valeur est insérée telle quelle. */
function jsObj(pairs,withNew){
  const parts=withNew?['new:true']:[];
  pairs.forEach(p=>{
    const k=p[0],v=p[1],raw=p[2];
    if(raw){ if(v!=null&&v!=='') parts.push(k+':'+v); }
    else if(v!=null&&String(v).trim()!=='') parts.push(k+':'+jsStr(v));
  });
  return '{'+parts.join(', ')+'}';
}
/* Transforme un terme en identifiant (id de concept). */
function slugify(s){
  return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'a-definir';
}

/* Corps généré pour une boîte en mode 'ajout', selon la cible. */
function generateAjout(b,f){
  const nk=f.notion||'?';
  if(b.cible==='notion')
    return 'Texte proposé pour la définition / l\'approfondissement :\n'+(gv(f,'notiondef')||'(vide)')+'\n';
  if(b.cible==='auteur'){
    // Idées groupées PAR NOTION → une insertion D[notion].auteurs[] par notion.
    // Chaque idée : {w, i, citations:[…]}. On ignore les idées vides.
    const byNotion={};
    (f.ideas||[]).forEach(it=>{
      const hasCite=(it.citations||[]).some(c=>String(c).trim());
      if(!(gv(it,'oeuvre')||gv(it,'idee')||hasCite)) return;
      const k=gv(it,'notion')||'?';
      (byNotion[k]||(byNotion[k]=[])).push(it);
    });
    let s='';
    Object.keys(byNotion).forEach(k=>{
      const ideaLits=byNotion[k].map(it=>{
        const w=[gv(it,'oeuvre'),gv(it,'date')].filter(Boolean).join(', ');
        const cites='['+(it.citations||[]).map(c=>String(c).trim()).filter(Boolean).map(jsStr).join(', ')+']';
        return jsObj([['w',w],['i',gv(it,'idee')],['citations',cites,true]],true);
      });
      s+='À insérer dans D.'+k+'.auteurs[] :\n'+jsObj([['n',gv(f,'nom')],['ideas','['+ideaLits.join(', ')+']',true]],true)+'\n\n';
    });
    const conceptsAll=(f.ideas||[]).map(it=>gv(it,'concepts')).filter(Boolean).join(', ');
    if(conceptsAll) s+='Termes à lier au glossaire : '+conceptsAll+'\n';
    if(gv(f,'a_bio')||gv(f,'a_courant')||gv(f,'a_periode')||gv(f,'a_themes')){
      const themes='['+gv(f,'a_themes').split(',').map(x=>x.trim()).filter(Boolean).map(jsStr).join(',')+']';
      s+='\nNouvel auteur — entrée AM['+jsStr(gv(f,'nom'))+'] :\n'
        +jsObj([['bio',gv(f,'a_bio')],['courant',gv(f,'a_courant')],['periode',gv(f,'a_periode')],['themes',themes,true],['dialogues','[]',true]],false)+'\n';
    }
    return s||'(aucune idée renseignée)\n';
  }
  if(b.cible==='auteur-citation'){
    // Citation simple/rattachée : une idée minimale portée par sa citation.
    const w=gv(f,'oeuvre'), cite=gv(f,'citation');
    const idea=jsObj([['w',w],['citations','['+(cite?jsStr(cite):'')+']',true]],true);
    let s='À insérer dans D.'+nk+'.auteurs[] (auteur '+jsStr(gv(f,'nom'))+') :\n'+idea+'\n';
    if(gv(f,'rattach')) s+='\n(De préférence : ajouter cette citation aux citations[] de l\'idée existante « '+gv(f,'rattach')+' »)\n';
    return s;
  }
  if(b.cible==='auteur-dialogue')
    return 'À insérer dans AM['+jsStr(gv(f,'nom'))+'].dialogues[] :\n'
      +jsObj([['dir',gv(f,'dialdir')],['auteur',gv(f,'dialauteur')],['sujet',gv(f,'dialsujet')],['desc',gv(f,'dialdesc')]],false)+'\n';
  if(b.cible==='auteur-bio'){
    const themes='['+gv(f,'a_themes').split(',').map(x=>x.trim()).filter(Boolean).map(jsStr).join(',')+']';
    return 'À insérer / compléter dans AM['+jsStr(gv(f,'nom'))+'] :\n'
      +jsObj([['bio',gv(f,'a_bio')],['courant',gv(f,'a_courant')],['periode',gv(f,'a_periode')],['themes',themes,true]],false)+'\n';
  }
  if(b.cible==='texte')
    return 'À insérer dans D.'+nk+'.textes[] :\n'+jsObj([['n',gv(f,'titre')],['t',gv(f,'contenu')]],true)+'\n';
  if(b.cible==='plan'){
    // Construit un littéral de plan {q, intro, pb, axes:[{t, sps:[{args}], limite}]}.
    // Le formulaire visiteur ne saisit qu'un contenu par axe (pas de
    // sous-parties imbriquées) : il est placé dans une seule sous-partie
    // {args:…}, à découper ensuite à la main si besoin.
    const axes=[];
    ['1','2','3'].forEach(n=>{
      const t=gv(f,'plan_a'+n+'t'), cc=gv(f,'plan_a'+n+'c'), li=gv(f,'plan_a'+n+'l');
      if(t||cc||li){
        const sps=cc?'[{args:'+jsStr(cc)+'}]':'[]';
        axes.push('{t:'+jsStr(t)+', sps:'+sps+', limite:'+jsStr(li)+'}');
      }
    });
    return 'À insérer dans D.'+nk+'.plans[] :\n'
      +jsObj([['q',gv(f,'plan_q')],['intro',gv(f,'plan_intro')],['pb',gv(f,'plan_pb')],['axes','['+axes.join(', ')+']',true]],true)+'\n';
  }
  if(b.cible==='exemple'){
    const tag=gv(f,'excat')==='Autre'?gv(f,'excatautre'):gv(f,'excat');
    return 'À insérer dans D.'+nk+'.exemples[] :\n'
      +jsObj([['tag',tag],['tit',gv(f,'extitre')],['body',gv(f,'excorps')],['lien',gv(f,'exlien')]],true)+'\n';
  }
  if(b.cible==='accroche')
    return 'À insérer dans D.'+nk+'.accroches[] :\n'
      +jsObj([['type',gv(f,'acctype')],['t',gv(f,'acctexte')],['src',gv(f,'accsrc')]],true)+'\n';
  if(b.cible==='dissertation')
    return 'À insérer dans D.'+nk+'.diss[] :\n'+jsObj([['q',gv(f,'question')]],true)+'\n';
  if(b.cible==='concept'){
    const notions='['+(f.cnotions||[]).map(jsStr).join(',')+']';
    // liens : l'explication du lien (clien) est rattachée à CHAQUE notion
    // cochée (même texte) — à ajuster ensuite si les notions diffèrent.
    const clien=gv(f,'clien');
    const liensLit=clien?'{'+(f.cnotions||[]).map(k=>jsStr(k)+':'+jsStr(clien)).join(', ')+'}':'';
    const pairs=[['id',jsStr(slugify(gv(f,'cterme'))),true],['term',gv(f,'cterme')],['cat',gv(f,'ccat')||'À préciser'],
                 ['def',gv(f,'cdef')],['notions',notions,true]];
    if(liensLit) pairs.push(['liens',liensLit,true]);
    return 'À insérer dans le tableau CONCEPTS[] :\n'+jsObj(pairs,true)+'\n';
  }
  if(b.cible==='concept-relation'){
    // Relation unifiée {to|term, type, desc} à ajouter aux relations[] du
    // concept source. Si la cible est un concept fiché, remplacer term par to.
    const cibleTerm=gv(f,'relcible');
    const rel=jsObj([['term',cibleTerm],['type',gv(f,'reltype')],['desc',gv(f,'reldesc')]],false);
    return 'À ajouter dans CONCEPTS[« '+gv(f,'cterme')+' »].relations[] :\n'+rel
      +'\n(si « '+cibleTerm+' » est un concept fiché, remplacer term:"…" par to:"<id-concept>")\n';
  }
  return '(cible inconnue)\n';
}

/* generateSiteBody — corps lisible d'un retour sur le site (catégorie
   'site'). Pas de notion ni d'auteur : on liste simplement les champs
   renseignés de la sous-cible (bug / fonctionnalité). */
function generateSiteBody(b,f){
  if(b.cible==='site-bug'){
    let s='Type de retour : bug / erreur d\'usage du site\n';
    if(gv(f,'bugou'))       s+='Où : '+gv(f,'bugou')+'\n';
    s+='\nProblème :\n'+(gv(f,'bugdesc')||'(vide)')+'\n';
    if(gv(f,'bugrepro'))    s+='\nÉtapes pour reproduire :\n'+gv(f,'bugrepro')+'\n';
    if(gv(f,'bugappareil')) s+='\nAppareil / navigateur : '+gv(f,'bugappareil')+'\n';
    return s;
  }
  // site-fonction
  let s='Type de retour : proposition de fonctionnalité\n';
  s+='\nIdée : '+(gv(f,'fonctitre')||'(vide)')+'\n';
  s+='\nDescription :\n'+(gv(f,'foncdesc')||'(vide)')+'\n';
  if(gv(f,'foncusage')) s+='\nBesoin / usage :\n'+gv(f,'foncusage')+'\n';
  return s;
}

/* Corps généré pour une boîte (remarque / correction / ajout). */
function generateBoxBody(b){
  const f=b.f||{};
  // Retour sur le site : corps dédié, sans ligne « Notion » (hors-sujet).
  if((b.categorie||cibleCat(b.cible))==='site') return generateSiteBody(b,f);
  // Ligne « notion » adaptée à la catégorie / sous-cible :
  //  · concept def → notions liées (f.cnotions) ;
  //  · auteur idée → notions DISTINCTES des idées (f.ideas[].notion) ;
  //  · dialogue / bio / relation → aucune notion ;
  //  · autres → notion de rattachement (f.notion).
  let notionLine='';
  if(b.cible==='concept'){
    const ks=(f.cnotions||[]).filter(k=>D[k]);
    notionLine='Notions liées : '+(ks.length?ks.map(k=>D[k].l).join(', '):'—');
  }else if(b.cible==='auteur'){
    const ks=[...new Set((f.ideas||[]).map(it=>gv(it,'notion')).filter(Boolean))];
    notionLine='Notions : '+(ks.length?ks.map(k=>D[k]?D[k].l:k).join(', '):'—');
  }else if(b.cible==='auteur-dialogue'||b.cible==='auteur-bio'||b.cible==='concept-relation'){
    notionLine='';
  }else{
    notionLine='Notion : '+(f.notion&&D[f.notion]?D[f.notion].l:'—');
  }
  const nlPrefix=notionLine?notionLine+'\n':'';
  if(b.type==='remarque')
    return nlPrefix
      +'Élément concerné : '+(gv(f,'remelement')||'—')+'\n\n'
      +'Remarque :\n'+(gv(f,'remtexte')||'(vide)')+'\n';
  if(b.type==='correction'){
    const head=nlPrefix+'Élément ciblé : '+(gv(f,'cibleref')||'—')+'\n\nModifications proposées :\n';
    const lines=[];
    // Nom d'auteur pour toutes les sous-cibles auteur.
    if(cibleCat(b.cible)==='auteur'&&gv(f,'nom')) lines.push('  - Nom de l\'auteur : '+gv(f,'nom'));
    if(b.cible==='auteur'){
      // Cible auteur (idée/œuvre) : champs PAR IDÉE (notion + œuvre/idée +
      // citations[] + retrait justifié).
      const ideas=f.ideas||[];
      const multi=ideas.length>1;
      ideas.forEach((it,idx)=>{
        const lbl=multi?(' (idée '+(idx+1)+')'):'';
        if(gv(it,'notion')) lines.push('  - Notion'+lbl+' : '+(D[gv(it,'notion')]?D[gv(it,'notion')].l:gv(it,'notion')));
        if(it.remove) lines.push('  - ⚠ RETRAIT'+lbl+' : '+(gv(it,'justif')||'(sans justification)'));
        (PROPOSAL_FIELDS.auteur).forEach(d=>{ if(gv(it,d.k)) lines.push('  - '+d.l+lbl+' : '+gv(it,d.k)); });
        (it.citations||[]).forEach(c=>{ if(String(c).trim()) lines.push('  - Citation'+lbl+' : '+String(c).trim()); });
      });
    }else{
      (PROPOSAL_FIELDS[b.cible]||[]).forEach(d=>{ if(gv(f,d.k)) lines.push('  - '+d.l+' : '+gv(f,d.k)); });
    }
    return head+(lines.length?lines.join('\n'):'  (aucun champ rempli)')+'\n';
  }
  return nlPrefix+(notionLine?'\n':'')+generateAjout(b,f);
}

/* cleanFields — copie de box.f sans les valeurs vides (pour le bloc JSON).
   Cas particulier : f.ideas est un tableau d'objets. Chaque idée est
   nettoyée de ses champs vides ; les idées entièrement vides sont
   retirées. */
function cleanFields(f){
  const o={};
  Object.keys(f||{}).forEach(k=>{
    const v=f[k];
    if(k==='ideas'&&Array.isArray(v)){
      const cleaned=v.map(it=>{
        const out={};
        Object.keys(it||{}).forEach(ik=>{
          const iv=it[ik];
          if(Array.isArray(iv)){                 // citations[] : on garde les non vides
            const arr=iv.map(x=>String(x).trim()).filter(Boolean);
            if(arr.length) out[ik]=arr;
          }else if(iv!=null&&String(iv).trim()!=='') out[ik]=String(iv).trim();
        });
        return out;
      }).filter(it=>Object.keys(it).length>0);
      if(cleaned.length) o[k]=cleaned;
    }
    else if(Array.isArray(v)){ if(v.length) o[k]=v.slice(); }
    else if(v!=null&&String(v).trim()!=='') o[k]=String(v).trim();
  });
  return o;
}
/* generateProposalJSON — objet structuré de la proposition, destiné au
   programme d'agrégation externe (schéma « philo-proposal/v3 »).
   v3 : chaque boîte porte categorie (notion/auteur/concept) + cible
        (sous-cible) + type. Pour cible 'auteur', fields.ideas[] est un
        tableau { notion, oeuvre, date, idee, citations:[…], concepts }.
   v2/v1 : sans categorie, cible à plat. L'agrégateur lit les trois.     */
function generateProposalJSON(){
  return {
    schema:'philo-proposal/v3',
    date:new Date().toISOString(),
    contributor:(proposalContributor||'').trim()||'anonyme',
    boxes:proposalBoxes.map(b=>({categorie:b.categorie||cibleCat(b.cible),cible:b.cible,type:b.type,fields:cleanFields(b.f)}))
  };
}
/* Assemble le texte complet : une partie LISIBLE (relecture humaine) puis
   un bloc DONNÉES JSON délimité, lu tel quel par le programme d'agrégation
   (entre [PHILO-PROPOSAL-JSON-START] et [PHILO-PROPOSAL-JSON-END]).        */
function generateProposalText(){
  const name=(proposalContributor||'').trim()||'anonyme';
  let out='══════════════════════════════════════════\n'
    +' PROPOSITION — GRAPHE PHILOSOPHIE TERMINALE\n'
    +'══════════════════════════════════════════\n'
    +'Contributeur : '+name+'\n'
    +'Nombre de boîtes : '+proposalBoxes.length+'\n';
  proposalBoxes.forEach((b,i)=>{
    const cat=b.categorie||cibleCat(b.cible);
    // Pour un retour sur le site, le « type d'action » est masqué dans l'UI
    // et figé en interne : on n'affiche donc pas la ligne « Action ».
    const actionLine=cat==='site' ? '' : 'Action    : '+proposalTypeLabel(b.type)+'\n';
    out+='\n──────────  BOÎTE '+(i+1)+'  ──────────\n'
      +'Catégorie : '+proposalCatLabel(cat)+'\n'
      +'Préciser  : '+proposalCibleLabel(b.cible)+'\n'
      +actionLine+'\n'
      +generateBoxBody(b);
  });
  out+='\n══════════════════════════════════════════\n';
  // Bloc machine : NE PAS MODIFIER — extrait et analysé par le programme d'agrégation.
  out+='\n[PHILO-PROPOSAL-JSON-START]\n'
    +JSON.stringify(generateProposalJSON(),null,2)
    +'\n[PHILO-PROPOSAL-JSON-END]\n';
  return out;
}

/* Bascule édition / aperçu. */
function showProposalPreview(){ proposalView='preview'; renderProposal(); }
function showProposalEdit(){ proposalView='edit'; renderProposal(); }
/* new : depuis « Mes propositions », « ← Nouvelle proposition » revient à
   l'édition d'une NOUVELLE proposition. Si on corrigeait un envoi, on en sort
   proprement (editingContribId effacé, brouillon local restauré). */
function startNewProposal(){ if(editingContribId) exitEditContrib(); proposalView='edit'; renderProposal(); }
/* Copie le texte généré dans le presse-papier. */
function copyProposal(){
  const txt=generateProposalText();
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(function(){
      const btn=document.getElementById('pcopy-btn'); if(btn) btn.textContent='✓ Copié';
    },function(){});
  }
}
/* Ouvre l'application mail du contributeur, pré-remplie vers PROPOSAL_EMAIL,
   avec le texte de la proposition en corps de message (étape 3).
   Note : affecter window.location.href à une URL mailto: NE quitte PAS la
   page (le navigateur délègue au gestionnaire de courrier) ; la modale
   reste donc ouverte derrière. */
function sendProposal(){
  if(!proposalGuardOk()) return;   // même garde-fou pour l'envoi par email manuel
  const subject='Proposition — Graphe Philosophie Terminale';
  window.location.href='mailto:'+PROPOSAL_EMAIL
    +'?subject='+encodeURIComponent(subject)
    +'&body='+encodeURIComponent(generateProposalText());
}

/* new (Phase 5) : repli mailto AUTOMATIQUE et silencieux.
   Quand l'envoi en ligne échoue (hors-ligne, service endormi, RLS, etc.),
   on ne laisse plus l'utilisateur faire l'effort de cliquer : on bascule
   tout de suite sur son application mail (sendProposal), en l'annonçant
   d'une ligne. Le bouton « Envoyer par email » reste là, discret, pour
   relancer le mail à la main si le gestionnaire ne s'est pas ouvert.
   `reason` = message technique de l'échec (affiché entre parenthèses). */
function proposalMailtoFallback(reason){
  const btn=document.getElementById('psend-btn');
  const status=document.getElementById('psend-status');
  if(btn){ btn.disabled=false; btn.textContent='Réessayer en ligne'; }
  if(status){
    status.style.color='#e0c170';
    status.textContent='Envoi en ligne impossible ('+reason
      +'). On ouvre ton application mail en repli — il te reste à appuyer sur « Envoyer ».';
  }
  // Bascule effective vers le client mail (ne quitte pas la page).
  sendProposal();
}

/* new (Phase 3) : envoi de la proposition RATTACHÉE AU COMPTE.
   Quand l'utilisateur est connecté, « Envoyer en ligne » insère la
   proposition dans la table Supabase « contributions » (rattachée au
   compte). Avantage : on peut ensuite suivre son statut dans
   « Mes propositions ». La sécurité RLS impose user_id = auth.uid() : on le
   renseigne donc explicitement. Le statut prend sa valeur par défaut côté
   base ('en_attente'). En cas d'échec : on n'ouvre PAS l'email (cela
   quitterait la page) ; on invite à réessayer ou à utiliser « Envoyer par
   email », tout proche — la contribution n'est jamais perdue. */
function sendProposalToSupabase(){
  const btn=document.getElementById('psend-btn');
  const status=document.getElementById('psend-status');
  const setStatus=function(msg,color){ if(status){ status.textContent=msg; status.style.color=color||''; } };
  if(btn){ btn.disabled=true; btn.textContent='Envoi…'; }
  setStatus('Envoi en cours…','');
  SB.from('contributions').insert({
    user_id: authUser.id,            // exigé par la règle RLS (auth.uid() = user_id)
    payload: generateProposalJSON()  // ton JSON v3, stocké tel quel (colonne jsonb)
  }).then(function(res){
    if(res.error) throw res.error;
    if(btn){ btn.textContent='✓ Envoyé'; }   // reste désactivé : évite le double envoi
    setStatus('Merci ! Ta proposition est enregistrée sur ton compte. Suis son statut dans « Mes propositions ». 🎉','#2ecc71');
    clearDrafts();   // new (Phase 3) : la proposition étant soumise, on vide le brouillon
  }).catch(function(err){
    // new (Phase 5) : repli mailto automatique (plus de message « clique ici »).
    proposalMailtoFallback((err&&err.message)||err);
  });
}

/* Envoi ANONYME via Supabase (a remplacé la boîte PythonAnywhere, retirée).
   Insère la proposition avec user_id NULL (aucun compte) : une règle RLS dédiée
   (migration 2026_anon_contributions.sql) autorise le rôle « anon » à insérer
   une ligne non rattachée à un compte, au statut « en_attente ». Le pseudo
   saisi voyage dans payload.contributor (pas de suivi de statut, faute de
   compte). Repli mailto automatique en cas d'échec — la contribution n'est
   jamais perdue. */
function sendProposalAnonSupabase(){
  const btn=document.getElementById('psend-btn');
  const status=document.getElementById('psend-status');
  const setStatus=function(msg,color){ if(status){ status.textContent=msg; status.style.color=color||''; } };
  if(btn){ btn.disabled=true; btn.textContent='Envoi…'; }
  setStatus('Envoi en cours…','');
  SB.from('contributions').insert({
    user_id: null,                   // envoi anonyme : ligne non liée à un compte
    payload: generateProposalJSON()  // JSON v3 (le pseudo est dans payload.contributor)
  }).then(function(res){
    if(res.error) throw res.error;
    if(btn){ btn.textContent='✓ Envoyé'; }   // reste désactivé : évite le double envoi
    setStatus('Merci ! Ta proposition anonyme a bien été envoyée. 🎉','#2ecc71');
    clearDrafts();
  }).catch(function(err){
    proposalMailtoFallback((err&&err.message)||err);
  });
}

/* new (Phase 3) : aiguillage du bouton « Envoyer en ligne ».
   - Édition d'un envoi « en attente » (connecté) → UPDATE de la ligne Supabase.
   - Connecté (nouvelle proposition) → Supabase (suivi du statut possible).
   - Non connecté, Supabase dispo → Supabase anonyme (user_id NULL) — voie
     principale des anonymes.
   - Supabase indisponible (hors-ligne / CDN non chargé) → repli mailto direct
     (proposalMailtoFallback). L'ancienne boîte anonyme PythonAnywhere, éteinte,
     a été retirée en oct. 2026 (dossier philo-mailbox/ supprimé). */
/* ── Validation des champs obligatoires avant envoi ─────────────────────────
   Avant, on pouvait envoyer une proposition même si des champs obligatoires
   étaient vides (aucun avertissement). proposalMissing() reconstruit la liste
   des champs requis MANQUANTS en miroir des règles de renderBoxFields (selon
   catégorie × cible × type), et proposalGuardOk() bloque l'envoi en l'affichant. */
function proposalEmpty(v){ return !String(v==null?'':v).trim(); }
function proposalMissing(){
  const miss=[];
  proposalBoxes.forEach((b,bi)=>{
    const f=b.f||{}, cat=b.categorie||cibleCat(b.cible), isAjout=b.type==='ajout';
    const add=l=>miss.push('Boîte '+(bi+1)+' — '+l);
    if(cat==='site'){ (PROPOSAL_FIELDS[b.cible]||[]).forEach(d=>{ if(d.r&&proposalEmpty(f[d.k])) add(d.l); }); return; }
    if(b.type==='remarque'){ if(proposalEmpty(f.remtexte)) add('Votre remarque'); return; }
    // ajout / correction : rattachement notion requis (ajout) selon la cible
    if(isAjout && cat==='notion' && b.cible!=='concept' && proposalEmpty(f.notion)) add('Notion');
    if(isAjout && b.cible==='auteur-citation' && proposalEmpty(f.notion)) add('Notion');
    if(b.type==='correction' && proposalEmpty(f.cibleref)) add('Élément précis à corriger');
    if(b.cible==='auteur'){           // idée/œuvre : nom + (par idée) œuvre & idée
      if(isAjout && proposalEmpty(f.nom)) add('Nom de l\'auteur');
      if(isAjout) (f.ideas||[]).forEach((it,i)=>{ PROPOSAL_FIELDS.auteur.forEach(d=>{ if(d.r&&proposalEmpty(it&&it[d.k])) add('idée '+(i+1)+' : '+d.l); }); });
      return;
    }
    if(isAjout && cat==='auteur' && proposalEmpty(f.nom)) add('Nom de l\'auteur');  // citation/dialogue/bio
    (PROPOSAL_FIELDS[b.cible]||[]).forEach(d=>{ if(isAjout&&d.r&&proposalEmpty(f[d.k])) add(d.l); });
  });
  return miss;
}
/* proposalGuardOk() — true si tout est rempli ; sinon affiche la liste des
   manques (zone #psend-status) et renvoie false (l'appelant abandonne l'envoi). */
function proposalGuardOk(){
  const miss=proposalMissing();
  if(!miss.length) return true;
  const status=document.getElementById('psend-status');
  const msg='⚠ Champs obligatoires manquants — '+miss.slice(0,8).join(' ; ')+(miss.length>8?' …':'');
  if(status){ status.textContent=msg; status.style.color='#e74c3c'; try{ status.scrollIntoView({behavior:'smooth',block:'center'}); }catch(e){} }
  else alert(msg);
  return false;
}

function submitProposalOnline(){
  if(!proposalGuardOk()) return;   // bloque si des champs obligatoires sont vides
  if(SB && authUser && editingContribId) updateProposalInSupabase();
  else if(SB && authUser) sendProposalToSupabase();
  else if(SB) sendProposalAnonSupabase();   // anonyme → Supabase
  else proposalMailtoFallback('service en ligne indisponible');   // Supabase non chargé : repli mail
}

/* new : UPDATE d'une proposition « en attente » (édition, pas un nouvel insert).
   La règle RLS d'update n'autorise QUE ses propres lignes ENCORE « en_attente »
   (cf. SQL fourni au déploiement). On chaîne .select('id') pour SAVOIR si une
   ligne a vraiment été modifiée : si RLS bloque (statut changé entre-temps),
   l'update touche 0 ligne SANS erreur → data vide, qu'on traite comme un refus.
   Succès → on quitte l'édition (brouillon local restauré) et on revient à
   « Mes propositions ». Échec → message clair, PAS de repli mailto (un email
   ne mettrait rien à jour). */
function updateProposalInSupabase(){
  const btn=document.getElementById('psend-btn');
  const status=document.getElementById('psend-status');
  const setStatus=function(msg,color){ if(status){ status.textContent=msg; status.style.color=color||''; } };
  if(btn){ btn.disabled=true; btn.textContent='Enregistrement…'; }
  setStatus('Enregistrement en cours…','');
  SB.from('contributions')
    .update({ payload: generateProposalJSON() })   // remplace le contenu par la version corrigée
    .eq('id', editingContribId)
    .eq('user_id', authUser.id)                    // ceinture+bretelles avec la RLS
    .select('id')
    .then(function(res){
      if(res.error) throw res.error;
      if(!res.data || !res.data.length)
        throw new Error('Modification refusée — la proposition n\'est peut-être plus « en attente ».');
      exitEditContrib();        // restaure le brouillon local mis de côté
      proposalView='mine';
      renderProposal();         // recharge « Mes propositions » (version à jour)
    })
    .catch(function(err){
      if(btn){ btn.disabled=false; btn.textContent='Enregistrer les modifications'; }
      setStatus('Échec de l\'enregistrement : '+((err&&err.message)||err),'#e74c3c');
    });
}

/* new (Phase 3) : bascule vers la vue « Mes propositions ». */
function showProposalMine(){ proposalView='mine'; renderProposal(); }

/* new : reconstruit les boîtes RUNTIME (proposalBoxes) depuis un payload stocké
   (v1/v2/v3), afin de RÉ-ÉDITER une proposition envoyée. Chaque boîte stockée
   {categorie,cible,type,fields} redevient {id,categorie,cible,type,f}. La
   catégorie est déduite si absente (anciens payloads), f est une COPIE PROFONDE
   (jamais le payload d'origine) et f.ideas est garanti pour la cible 'auteur'. */
function boxesFromPayload(payload){
  const src=(payload&&payload.boxes)||[];
  return src.map(function(b){
    const cible=b.cible||'notion';
    const box={ id:++proposalSeq,
      categorie:b.categorie||cibleCat(cible),
      cible:cible,
      type:b.type||(cibleCat(cible)==='site'?'remarque':'ajout'),
      f:JSON.parse(JSON.stringify(b.fields||{})) };   // copie profonde
    if(cible==='auteur') ensureIdeas(box);
    return box;
  });
}

/* new : rouvre une proposition « en attente » pour la corriger. On met le
   brouillon local de côté (editDraftBackup) afin de ne JAMAIS l'écraser, on
   reconstruit les boîtes depuis le payload stocké, puis on passe en vue édition
   (une bannière y rappelle qu'on modifie un envoi). L'envoi fera un UPDATE. */
function editMyContribution(id){
  const row=myContribCache.find(function(c){ return String(c.id)===String(id); });
  if(!row) return;
  // Sauvegarde du brouillon en cours (copie profonde) pour le restaurer ensuite.
  // Garde : si on édite DÉJÀ un envoi (on passe de la correction d'une proposition
  // à une autre), proposalBoxes contient l'autre envoi — surtout ne pas l'adopter
  // comme « brouillon » ; on conserve le backup d'origine (le vrai brouillon).
  if(!editingContribId)
    editDraftBackup={ boxes:JSON.parse(JSON.stringify(proposalBoxes)),
      contributor:proposalContributor, seq:proposalSeq };
  editingContribId=row.id;        // valeur d'origine (uuid ou bigint) → eq() correct
  proposalBoxes=boxesFromPayload(row.payload);
  if(!proposalBoxes.length)
    proposalBoxes=[{id:++proposalSeq,categorie:'auteur',type:'ajout',cible:'auteur',f:{ideas:[{}]}}];
  // Nom : on reprend celui du payload s'il était nommé, sinon le pseudo du compte.
  const who=(row.payload&&row.payload.contributor)||'';
  proposalContributor=(who&&who!=='anonyme')?who:(authUser?authLabel():'');
  proposalView='edit';
  renderProposal();
}

/* new : quitte le mode « édition d'un envoi » et RESTAURE le brouillon local
   mis de côté. Appelé après un enregistrement réussi ET sur annulation. */
function exitEditContrib(){
  editingContribId=null;
  if(editDraftBackup){
    proposalBoxes=Array.isArray(editDraftBackup.boxes)?editDraftBackup.boxes:[];
    proposalContributor=editDraftBackup.contributor||'';
    proposalSeq=Math.max(proposalSeq, editDraftBackup.seq||0);
    editDraftBackup=null;
  }
}

/* new : annule l'édition d'un envoi (sans rien enregistrer) et revient à la
   liste « Mes propositions ». Le brouillon local est restauré. */
function cancelEditContrib(){ exitEditContrib(); proposalView='mine'; renderProposal(); }

/* Étiquette + classe CSS de pastille pour un statut de contribution.
   Les quatre valeurs viennent de l'enum SQL contrib_status. */
function contribStatusLabel(s){
  switch(s){
    case 'validee_integree': return {txt:'Validée — intégrée au site', cls:'pst-ok'};
    case 'validee_en_cours': return {txt:'Validée — intégration en cours', cls:'pst-prog'};
    case 'refusee':          return {txt:'Non retenue', cls:'pst-no'};
    default:                 return {txt:'En attente de relecture', cls:'pst-wait'};   // 'en_attente'
  }
}

/* Résumé court d'une proposition à partir de son payload v3 (pour la liste). */
function contribSummary(payload){
  try{
    const boxes=(payload&&payload.boxes)||[];
    if(!boxes.length) return 'Proposition';
    const parts=boxes.slice(0,3).map(b=>proposalCibleLabel(b.cible)||b.cible||'boîte');
    let s=parts.join(', ');
    if(boxes.length>3) s+=' …';
    return s+' ('+boxes.length+' boîte'+(boxes.length>1?'s':'')+')';
  }catch(e){ return 'Proposition'; }
}

/* new : libellé lisible d'un champ d'une boîte, à partir de sa cible.
   On réutilise PROPOSAL_FIELDS (mêmes intitulés qu'au moment de la saisie) ;
   à défaut (champ méta ou inconnu), on retombe sur une petite table puis sur
   la clé brute. */
function contribFieldLabel(cible,key){
  const defs=PROPOSAL_FIELDS[cible]||[];
  const f=defs.find(x=>x.k===key);
  if(f) return f.l;
  // Champs transverses (méta de correction / remarque, notion d'attache…).
  const META={notion:"Notion",cnotions:"Notions liées",nom:"Nom de l'auteur",
    cibleref:"Élément ciblé",remelement:"Élément concerné",remtexte:"Remarque",
    justif:"Justification du retrait",citations:"Citations"};
  return META[key]||key;
}

/* new : rend le DÉTAIL d'une proposition (toutes ses boîtes et leurs champs)
   à partir du payload v3 stocké. Permet au contributeur de revoir, dans
   « Mes propositions », EXACTEMENT ce qu'il a proposé — et pas seulement le
   résumé d'une ligne. Tolérant aux payloads v1/v2 (champs à plat). */
function contribDetailHTML(payload){
  const boxes=(payload&&payload.boxes)||[];
  if(!boxes.length) return '';
  // Rend une paire libellé/valeur ; ignore les valeurs vides.
  const row=function(label,val){
    if(val==null||val==='') return '';
    return '<div class="pmine-f"><b>'+pEsc(label)+'</b> : '+pEsc(val)+'</div>';
  };
  const html=boxes.map(function(b){
    const cible=b.cible||'';
    const f=b.fields||{};
    let inner='';
    // En-tête de boîte : type + cible (ex. « Ajout — Idée d'auteur »).
    const head=proposalTypeLabel(b.type)+' — '+(proposalCibleLabel(cible)||cible||'boîte');
    // Cas auteur (idée) : les champs sont PAR IDÉE dans fields.ideas[].
    if(Array.isArray(f.ideas)){
      if(f.nom) inner+=row("Nom de l'auteur",f.nom);
      f.ideas.forEach(function(it,j){
        inner+='<div class="pmine-f" style="margin-top:5px"><b>Idée '+(j+1)+'</b></div>';
        ['notion','oeuvre','date','idee','concepts'].forEach(function(k){
          inner+=row(contribFieldLabel('auteur',k)||k,it[k]);
        });
        if(Array.isArray(it.citations)) it.citations.filter(Boolean).forEach(function(c){ inner+=row('Citation',c); });
        if(it.justif) inner+=row('Justification du retrait',it.justif);
      });
    } else {
      // Cas général : on parcourt les champs du formulaire.
      Object.keys(f).forEach(function(k){
        const v=f[k];
        if(Array.isArray(v)){ v.filter(Boolean).forEach(function(item){ inner+=row(contribFieldLabel(cible,k),item); }); }
        else inner+=row(contribFieldLabel(cible,k),v);
      });
    }
    return '<div class="pmine-box"><div class="pmine-box-h">'+pEsc(head)+'</div>'+inner+'</div>';
  }).join('');
  return '<details class="pmine-det"><summary>Voir le détail proposé</summary>'+html+'</details>';
}

/* new (Phase 3) : charge et affiche les propositions du compte connecté.
   La règle RLS contrib_select ne renvoie QUE les lignes de l'utilisateur ;
   on ajoute tout de même le filtre user_id par clarté. */
async function renderMyContributions(){
  const wrap=document.getElementById('pmine-list');
  if(!wrap) return;
  if(!SB || !authUser){ wrap.innerHTML='<div class="phint">Connecte-toi pour retrouver tes propositions ici.</div>'; return; }
  try{
    const {data,error}=await SB.from('contributions')
      .select('id,payload,statut,explication,avis_ia,created_at')   // id : requis pour l'édition
      .eq('user_id',authUser.id)
      .order('created_at',{ascending:false});
    if(error) throw error;
    if(!data || !data.length){ wrap.innerHTML='<div class="phint">Tu n\'as pas encore envoyé de proposition en ligne depuis ce compte.</div>'; return; }
    myContribCache=data;   // new : on retient les lignes pour retrouver un payload par id (édition)
    wrap.innerHTML=data.map(c=>{
      const st=contribStatusLabel(c.statut);
      const d=c.created_at?new Date(c.created_at).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}):'';
      // new : une proposition ENCORE « en attente » peut être corrigée par son
      // auteur (bouton ✎) — l'envoi fera un UPDATE de la ligne (cf. RLS).
      const canEdit=(c.statut||'en_attente')==='en_attente';
      const editBtn=canEdit
        ? '<div class="pmine-actions"><button class="pbtn pbtn-sm" onclick="editMyContribution(\''+pEsc(String(c.id))+'\')">✎ Modifier</button></div>'
        : '';
      // Explication = mot du RELECTEUR (humain), écrit lors du changement de
      // statut et renvoyé via Supabase. Présent seulement une fois trié.
      const expl=c.explication ? '<div class="pmine-expl">'+pEsc(c.explication)+'</div>' : '';
      // new : avis AUTOMATIQUE (IA) reformulé pour l'usager, renvoyé par
      // l'agrégateur dans la colonne avis_ia — DISTINCT de l'explication
      // ci-dessus. Affiché à part et étiqueté « indicatif » : c'est une aide,
      // un humain tranche ensuite.
      const avia=c.avis_ia ? '<div class="pmine-avia"><span class="pmine-avia-h">🤖 Avis automatique (indicatif)</span>'+pEsc(c.avis_ia)+'</div>' : '';
      // new : détail repliable du contenu proposé (toutes les boîtes).
      const detail=contribDetailHTML(c.payload);
      return '<div class="pmine-item">'
        +'<div class="pmine-top"><span class="pmine-sum">'+pEsc(contribSummary(c.payload))+'</span>'
        +'<span class="pst '+st.cls+'">'+pEsc(st.txt)+'</span></div>'
        +(d?'<div class="pmine-date">Envoyée le '+pEsc(d)+'</div>':'')
        +detail
        +avia
        +expl
        +editBtn
        +'</div>';
    }).join('');
  }catch(e){
    wrap.innerHTML='<div class="phint" style="color:#e74c3c">Impossible de charger tes propositions ('+pEsc((e&&e.message)||String(e))+').</div>';
  }
}

/* Reconstruit le corps de la modale : vue d'ÉDITION (boîtes + nom du
   contributeur + bouton Aperçu), vue d'APERÇU (texte généré) ou vue
   « MES PROPOSITIONS » (suivi des contributions du compte). */
function renderProposal(){
  const body=document.getElementById('proposal-body');
  if(!body) return;
  const logged=!!(SB && authUser);
  // ── Vue MES PROPOSITIONS (compte connecté) ──
  if(proposalView==='mine'){
    body.innerHTML='<div class="ppreview-head">Mes propositions envoyées — leur statut et l\'explication.</div>'
      +'<div id="pmine-list" class="pmine-list">Chargement…</div>'
      +'<div class="pactions"><button class="pbtn" onclick="startNewProposal()">← Nouvelle proposition</button></div>';
    renderMyContributions();   // remplit #pmine-list de façon asynchrone
    return;
  }
  // ── Vue APERÇU ──
  if(proposalView==='preview'){
    // new : en mode ÉDITION d'un envoi (editingContribId), l'aperçu enregistre
    // une CORRECTION (UPDATE) au lieu d'un nouvel envoi → libellés et boutons
    // adaptés (pas d'email/copie : ces voies créeraient une nouvelle proposition).
    const editing=!!editingContribId;
    // Le message d'aide dépend du contexte : édition / connecté / anonyme.
    const onlineHint = editing
      ? 'Tu corriges une proposition déjà envoyée : « Enregistrer les modifications » remplace son contenu (elle reste « en attente »).'
      : (logged
        ? 'Connecté : « Envoyer en ligne » enregistre ta proposition sur ton compte — tu pourras suivre son statut dans « Mes propositions ».'
        : 'Astuce : connecte-toi avant d\'envoyer pour suivre le statut de ta proposition. Sinon, « Envoyer en ligne » la transmet de façon anonyme.');
    // Bouton « Mes propositions » réservé aux comptes connectés (masqué en édition).
    const mineBtn = (logged && !editing) ? '<button class="pbtn" onclick="showProposalMine()">Mes propositions</button>' : '';
    // En édition : pas de repli mailto/copie (un email n'updaterait pas la ligne).
    const fallbackBtns = editing ? ''
      : '<button class="pbtn" id="pcopy-btn" onclick="copyProposal()">Copier le texte</button>'
        // new (Phase 5) : « Envoyer par email » est un repli discret (pbtn-ghost).
        +'<button class="pbtn pbtn-ghost" onclick="sendProposal()">Envoyer par email</button>';
    // Note de repli mailto : sans objet en édition.
    const fallbackNote = editing ? '' : ' En cas de problème (hors-ligne, service indisponible), l\'envoi bascule automatiquement sur ton application mail.';
    const sendLabel = editing ? 'Enregistrer les modifications' : 'Envoyer en ligne';
    body.innerHTML='<div class="ppreview-head">Aperçu — ce texte sera transmis tel quel :</div>'
      +'<textarea class="ppreview" readonly>'+pEsc(generateProposalText())+'</textarea>'
      +'<div class="phint" style="margin-top:8px">'+onlineHint+fallbackNote+'</div>'
      // new: ligne de retour d'état de l'envoi en ligne (succès / erreur).
      +'<div id="psend-status" class="phint" style="margin-top:8px;min-height:1.1em"></div>'
      +'<div class="pactions">'
      +'<button class="pbtn" onclick="showProposalEdit()">← Modifier</button>'
      +fallbackBtns
      +mineBtn
      // new (Phase 3): voie principale — UPDATE si édition, sinon insertion Supabase.
      +'<button class="pbtn pbtn-primary" id="psend-btn" onclick="submitProposalOnline()">'+sendLabel+'</button>'
      +'</div>';
    return;
  }
  // ── Vue ÉDITION ──
  // new : bannière quand on CORRIGE une proposition déjà envoyée (« en attente »).
  // Elle rappelle l'enjeu (on remplace la version précédente) et offre une sortie
  // propre (cancelEditContrib restaure le brouillon local et revient à la liste).
  let html='';
  if(editingContribId){
    html+='<div class="pedit-banner">✎ Tu modifies une proposition <b>déjà envoyée</b> (en attente). '
      +'En l\'enregistrant, tu <b>remplaces</b> la version précédente. '
      +'<button class="pbtn pbtn-ghost pbtn-sm" onclick="cancelEditContrib()">Annuler</button></div>';
  }
  html+='<div class="phint" style="margin-bottom:12px">Chaque « boîte » décrit une proposition. '
    +'Empilez-en autant que nécessaire (ex. un auteur + un exemple).</div>';
  proposalBoxes.forEach((b,i)=>{
    // Menu en cascade : Catégorie → Préciser (sous-cible) → Type d'action.
    const cat=b.categorie||cibleCat(b.cible);
    const catOpts=PROPOSAL_CATS.map(o=>`<option value="${o.v}"${cat===o.v?' selected':''}>${o.l}</option>`).join('');
    const subOpts=(PROPOSAL_SOUSCIBLES[cat]||[]).map(o=>`<option value="${o.v}"${b.cible===o.v?' selected':''}>${o.l}</option>`).join('');
    const typeOpts=PROPOSAL_TYPES.map(o=>`<option value="${o.v}"${b.type===o.v?' selected':''}>${o.l}</option>`).join('');
    // Catégorie 'site' : un retour bug/fonctionnalité n'a pas de « type
    // d'action » — on masque ce 3e menu (le type est figé sur 'remarque').
    const typeField=cat==='site' ? '' : `<div class="pfield">
        <label class="plabel">Type d'action</label>
        <select class="psel" onchange="setProposalField(${b.id},'type',this.value)">${typeOpts}</select>
      </div>`;
    html+=`<div class="pbox" id="pbox-${b.id}">
      <div class="pbox-head">
        <span class="pbox-num">Boîte ${i+1}</span>
        <button class="pbox-del" title="Supprimer cette boîte"${proposalBoxes.length<=1?' disabled':''}
          onclick="removeProposalBox(${b.id})">✕</button>
      </div>
      <div class="pfield">
        <label class="plabel">Catégorie</label>
        <select class="psel" onchange="setProposalField(${b.id},'categorie',this.value)">${catOpts}</select>
      </div>
      <div class="pfield">
        <label class="plabel">Préciser</label>
        <select class="psel" onchange="setProposalField(${b.id},'cible',this.value)">${subOpts}</select>
      </div>
      ${typeField}
      <div class="pbox-fields">${renderBoxFields(b)}</div>
    </div>`;
  });
  html+=`<button class="pbox-add" onclick="addProposalBox()">+ Ajouter une boîte</button>`;
  html+=`<div class="pfield" style="margin-top:16px">
      <label class="plabel">Votre nom / pseudo <span class="popt">facultatif</span></label>
      <input class="pinput" type="text" value="${pEsc(proposalContributor)}" placeholder="ex : anonyme" oninput="setProposalContributor(this.value)">
    </div>`;
  // new (Phase 3) : accès « Mes propositions » depuis l'édition (connecté).
  const mineBtnEdit = logged ? `<button class="pbtn" onclick="showProposalMine()">Mes propositions</button>` : '';
  html+=`<div class="pactions">${mineBtnEdit}<button class="pbtn pbtn-primary" onclick="showProposalPreview()">Aperçu de la proposition</button></div>`;
  body.innerHTML=html;
  // new (Phase 3) : toute modification de structure passe par ce rendu — on en
  // profite pour persister/synchroniser le brouillon (les saisies de texte, qui
  // ne re-rendent pas, sont couvertes par setBoxF/setIdeaF).
  draftChanged();
}

/* ── « + » de proposition injectés dans les vues (étape 1d) ──────────
   pPlus    — petit bouton d'angle sur une carte (mode 'correction')
   pPlusCat — bouton de catégorie en bas de section (mode 'ajout')
   Chaque bouton porte sa cible dans des data-attributs (dont data-pa, le
   nom d'auteur, pour les « + » de la vue Auteur) ; un écouteur délégué
   (dans initProposalUI) les lit et ouvre la modale pré-remplie.        */
function pPlus(type,cible,notion,ref,author){
  const cleanRef=(ref||'').replace(/<[^>]+>/g,'');   // pas de balises dans le repère
  return `<button class="pplus" title="${type==='ajout'?'Proposer un ajout ici':'Proposer une correction'}"`
    +` data-pt="${type}" data-pc="${cible}" data-pn="${pEsc(notion||'')}" data-pr="${pEsc(cleanRef)}" data-pa="${pEsc(author||'')}">+</button>`;
}
function pPlusCat(cible,notion,label,author,ref){
  return `<div class="pplus-catwrap"><button class="pplus-cat" title="Proposer un ajout"`
    +` data-pt="ajout" data-pc="${cible}" data-pn="${pEsc(notion||'')}" data-pr="${pEsc(ref||'')}" data-pa="${pEsc(author||'')}">+ ${label}</button></div>`;
}
/* Une boîte est « vierge » si elle a ses valeurs par défaut et aucun champ
   rempli. Pour cible 'auteur', il faut aussi que toutes les idées soient
   vides (les ideas vides initialisées par défaut ne comptent pas). */
function isBoxPristine(b){
  if(b.type!=='ajout'||b.cible!=='auteur') return false;
  const f=b.f||{};
  return !Object.keys(f).some(k=>{
    const v=f[k];
    if(k==='ideas'&&Array.isArray(v)){
      // au moins une idée porte un champ non vide ?
      return v.some(it=>it&&Object.keys(it).some(ik=>String(it[ik]==null?'':it[ik]).trim()));
    }
    return Array.isArray(v)?v.length:String(v==null?'':v).trim();
  });
}
/* Ouvre la modale avec une boîte pré-remplie depuis un bouton « + ».
   Remplace l'unique boîte vierge le cas échéant, sinon empile une boîte. */
function openProposalFromPlus(type,cible,notion,ref,author){
  const box={id:++proposalSeq,categorie:cibleCat(cible),type:type,cible:cible,f:{}};
  if(notion){
    if(cible==='concept') box.f.cnotions=notion.split(',').filter(Boolean);
    else if(cibleCat(cible)!=='concept') box.f.notion=notion;   // pas de notion pour concept-relation
  }
  if(type==='correction'&&ref) box.f.cibleref=ref;
  else if(type==='ajout'&&cible==='concept-relation'&&ref) box.f.cterme=ref;  // concept source pré-rempli
  if(author) box.f.nom=author;   // « + » de la vue Auteur : nom pré-rempli
  if(cible==='auteur') ensureIdeas(box);   // cible auteur → init ideas[]
  if(proposalBoxes.length===0||(proposalBoxes.length===1&&isBoxPristine(proposalBoxes[0])))
    proposalBoxes=[box];
  else
    proposalBoxes.push(box);
  prefillContributorFromAccount();   // nom = pseudo du compte si vide (cf. helper)
  proposalView='edit';
  renderProposal();
  document.getElementById('proposal-overlay').classList.add('open');
  scrollToProposalBox(box.id);   // amène la boîte ciblée directement en vue
}
/* scrollToProposalBox — fait défiler la modale jusqu'à la boîte d'id donné
   et la met brièvement en surbrillance (repère visuel). requestAnimationFrame
   garantit que le DOM est rendu et l'overlay visible avant le scroll. */
function scrollToProposalBox(id){
  requestAnimationFrame(()=>{
    const el=document.getElementById('pbox-'+id);
    if(!el) return;
    el.scrollIntoView({behavior:'smooth',block:'start'});
    el.classList.add('pbox-flash');
    setTimeout(()=>el.classList.remove('pbox-flash'),1200);
  });
}

/* Ouvre la modale (en garantissant au moins une boîte). Le contenu
   saisi n'est PAS réinitialisé à la fermeture : on le conserve. */
function openProposal(){
  if(proposalBoxes.length===0) proposalBoxes.push({id:++proposalSeq,categorie:'auteur',type:'ajout',cible:'auteur',f:{ideas:[{}]}});
  // Préremplir le nom avec le pseudo du compte si connecté ET champ vide (retour
  // contributeur : sinon une proposition envoyée connecté s'affichait « anonyme »
  // dans le dashboard). On ne touche pas à une valeur déjà saisie à la main.
  if(authUser && !(proposalContributor||'').trim()) proposalContributor=authLabel();
  proposalView='edit';
  renderProposal();
  document.getElementById('proposal-overlay').classList.add('open');
}
/* new : ouvre la modale de contribution directement sur « Mes propositions »
   (déclencheur .topbar-mine de la barre d'en-tête, visible seulement connecté).
   renderProposal() en vue 'mine' charge la liste des contributions du compte. */
function openMyProposals(){
  proposalView='mine';
  renderProposal();
  document.getElementById('proposal-overlay').classList.add('open');
}
/* closeProposal() — masque la modale de contribution (la saisie est conservée). */
function closeProposal(){
  document.getElementById('proposal-overlay').classList.remove('open');
}
/* Câblage des événements de fermeture (exécuté une fois au chargement).
   Le bouton d'ouverture (.sb-propose) est câblé dans renderSB. */
(function initProposalUI(){
  document.getElementById('proposal-close').addEventListener('click',closeProposal);
  // Fermeture au clic sur le fond assombri : on ne ferme QUE si le clic
  // a COMMENCÉ et FINI sur le fond. Sinon, sélectionner du texte dans le
  // panneau puis relâcher la souris sur le fond fermerait la modale par erreur.
  const _ov=document.getElementById('proposal-overlay');
  let _downOnBackdrop=false;
  _ov.addEventListener('mousedown',e=>{ _downOnBackdrop=(e.target===_ov); });
  _ov.addEventListener('click',e=>{ if(e.target===_ov&&_downOnBackdrop) closeProposal(); });
  // touche Échap → ferme
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeProposal(); });
  // clic sur un bouton « + » injecté dans les vues → ouvre la modale pré-remplie
  document.addEventListener('click',e=>{
    const btn=e.target.closest?e.target.closest('.pplus,.pplus-cat'):null;
    if(btn) openProposalFromPlus(btn.dataset.pt,btn.dataset.pc,btn.dataset.pn,btn.dataset.pr||'',btn.dataset.pa||'');
  });
})();
