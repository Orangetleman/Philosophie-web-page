/* Les 31 repères du programme (cat:'Repère', id rep-…, au moins une relation de type distinction).
   Format : CLAUDE.md, « Concept (objet dans CONCEPTS) ». L'ORDRE compte : à
   terme égal, le premier concept gagne le lien automatique (linkTerms).
   Chaque id est unique (le quiz en fait sa clé). Tout ajout porte new:true. */
REPERE({
  new: true,
  id: "rep-absolu-relatif",
  term: "Absolu / Relatif",
  cat: "Repère",
  def: "<strong>Absolu</strong> : ce qui existe en soi et par soi, dont l'existence et la valeur ne dépendent de rien d'autre (étymologiquement « délié », sans relation). <strong>Relatif</strong> : ce dont l'existence ou la valeur sont conditionnées par un élément extérieur, qui dépend d'un point de vue. <br><em>Ex.</em> Dieu, conçu comme cause de soi, est absolu ; l'être humain, créé et dépendant, est relatif.",
  notions: ["verite", "religion", "liberte"],
  relations: [
    {
      type: "distinction",
      desc: "Absolu (en soi, inconditionné) ≠ Relatif (dépendant d'autre chose ou d'un point de vue).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-abstrait-concret",
  term: "Abstrait / Concret",
  cat: "Repère",
  def: "<strong>Abstrait</strong> : ce qui résulte d'une opération intellectuelle détachant par la pensée une propriété ou une relation de son support. <strong>Concret</strong> : ce qui concerne la réalité perçue par les sens, saisie dans sa globalité. <br><em>Ex.</em> la loi de la chute des corps est abstraite ; la douleur ressentie au pied est concrète.",
  notions: ["science", "raison", "art", "conscience"],
  relations: [
    {
      type: "distinction",
      desc: "Abstrait (propriété isolée par la pensée) ≠ Concret (réalité sensible globale).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-acte-puissance",
  term: "En acte / En puissance",
  cat: "Repère",
  def: "Distinction aristotélicienne. <strong>En acte</strong> : ce qui existe réellement, pleinement réalisé. <strong>En puissance</strong> : ce qui n'existe pas encore mais possède le potentiel de se réaliser. <br><em>Ex.</em> la maison construite existe en acte ; elle n'était qu'en puissance dans les plans de l'architecte.",
  notions: ["nature", "liberte", "technique"],
  relations: [
    {type: "distinction", desc: "En acte (réalisé) ≠ En puissance (réalisable, virtuel)."},
  ],
});

REPERE({
  new: true,
  id: "rep-analyse-synthese",
  term: "Analyse / Synthèse",
  cat: "Repère",
  def: "<strong>Analyse</strong> : décomposer un tout en ses éléments simples pour les examiner. <strong>Synthèse</strong> : recomposer le tout à partir de ses parties, du simple au complexe. <br><em>Ex.</em> Descartes (<em>Discours de la méthode</em>) recommande de diviser chaque difficulté (analyse), puis de conduire ses pensées par ordre du plus simple au plus composé (synthèse).",
  notions: ["raison", "science", "conscience", "demonstration"],
  relations: [
    {
      type: "distinction",
      desc: "Analyse (décomposer le tout en parties) ≠ Synthèse (recomposer le tout à partir des parties).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-objectif-subjectif",
  term: "Objectif / Subjectif / Intersubjectif",
  cat: "Repère",
  def: "<strong>Objectif</strong> : ce qui ne dépend que de l'objet, dont la validité est partageable par tous (domaine du savoir). <strong>Subjectif</strong> : ce qui dépend du sujet et varie d'une personne à l'autre (domaine de la croyance, du goût). <strong>Intersubjectif</strong> : accord construit entre plusieurs sujets par le dialogue. <br><em>Ex.</em> « la Terre tourne autour du Soleil » est objectif ; « ce plat est délicieux » est subjectif.",
  notions: ["verite", "science", "conscience", "perception"],
  relations: [
    {
      type: "distinction",
      desc: "Objectif (dépend de l'objet, universel) ≠ Subjectif (dépend du sujet, variable) ; l'intersubjectif est l'accord construit entre sujets.",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-obligation-contrainte",
  term: "Obligation / Contrainte",
  cat: "Repère",
  def: "<strong>Obligation</strong> : devoir face auquel la volonté reste libre d'adhérer ou non (contrainte morale, intérieure). <strong>Contrainte</strong> : ce qu'on est forcé de faire sous la pression d'une force extérieure à laquelle on ne peut résister. <br><em>Ex.</em> le panneau stop m'oblige (je peux désobéir et en répondre) ; un barrage de police me contraint physiquement.",
  notions: ["devoir", "liberte", "etat"],
  relations: [
    {
      type: "distinction",
      desc: "Obligation (devoir intérieur, la volonté reste libre) ≠ Contrainte (force extérieure qui supprime le choix).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-origine-fondement",
  term: "Origine / Fondement",
  cat: "Repère",
  def: "<strong>Origine</strong> : le commencement et la cause première dans le temps d'un événement (« d'où cela vient-il ? »). <strong>Fondement</strong> : ce qui rend raison d'une chose, ce qui la justifie en droit (« qu'est-ce qui la légitime ? »). <br><em>Ex.</em> la chute du mur de Berlin a une origine (faits, date) et des fondements (raisons économiques et politiques).",
  notions: ["etat", "justice", "religion", "science"],
  relations: [
    {
      type: "distinction",
      desc: "Origine (commencement de fait dans le temps) ≠ Fondement (justification en droit).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-persuader-convaincre",
  term: "Persuader / Convaincre",
  cat: "Repère",
  def: "<strong>Persuader</strong> : emporter l'adhésion en s'adressant aux sentiments et à l'imagination, par la rhétorique. <strong>Convaincre</strong> : emporter l'adhésion par des arguments rationnels et des preuves, valables pour tout esprit. <br><em>Ex.</em> l'orateur persuade une foule ; le mathématicien convainc par une démonstration.",
  notions: ["raison", "langage", "verite", "demonstration"],
  relations: [
    {
      type: "distinction",
      desc: "Persuader (par les sentiments, sans preuve) ≠ Convaincre (par la raison et la preuve).",
    },
    {
      to: "sophisme",
      type: "complete",
      desc: "La persuasion peut verser dans le sophisme : séduire sans prouver.",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-principe-cause-fin",
  term: "Principe / Cause / Fin",
  cat: "Repère",
  def: "<strong>Principe</strong> : proposition de départ d'où l'on déduit (point de départ logique). <strong>Cause</strong> : phénomène antérieur qui produit ou détermine un effet (explique). <strong>Fin</strong> : but en vue duquel une action est accomplie (justifie). <br><em>Ex.</em> dans une expérience, on distingue le principe théorique, la cause d'un phénomène et la fin poursuivie.",
  notions: ["science", "nature", "raison"],
  relations: [
    {
      type: "distinction",
      desc: "Principe (point de départ logique) ≠ Cause (antécédent qui explique) ≠ Fin (but qui justifie).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-public-prive",
  term: "Public / Privé",
  cat: "Repère",
  def: "<strong>Public</strong> : ce qui est exposé au regard de tous, ou ce qui relève de l'État et de l'intérêt commun. <strong>Privé</strong> : ce qui échappe au regard d'autrui, ou ce qui ne dépend pas de l'État (intérêts particuliers). <br><em>Ex.</em> la laïcité impose la neutralité du fonctionnaire dans l'espace public, non dans sa vie privée.",
  notions: ["etat", "justice", "liberte"],
  relations: [
    {
      type: "distinction",
      desc: "Public (exposé à tous / sphère de l'État) ≠ Privé (soustrait au regard / hors de l'État).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-ressemblance-analogie",
  term: "Ressemblance / Analogie",
  cat: "Repère",
  def: "<strong>Ressemblance</strong> : similarité directe entre deux choses comparables (mêmes traits). <strong>Analogie</strong> : égalité de rapports entre quatre termes pris deux à deux (A est à B ce que C est à D). <br><em>Ex.</em> Paul ressemble à son frère (ressemblance) ; 4 est à 8 ce que 1 est à 2 (analogie).",
  notions: ["raison", "langage", "science"],
  relations: [
    {
      type: "distinction",
      desc: "Ressemblance (similarité entre deux choses) ≠ Analogie (égalité de rapports entre quatre termes).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-theorie-pratique",
  term: "Théorie / Pratique",
  cat: "Repère",
  def: "<strong>Théorie</strong> : ensemble organisé d'hypothèses, de connaissances vérifiées et de règles logiques — sa validité est d'abord dans la pensée. <strong>Pratique</strong> : exercice concret d'une activité, mise à l'épreuve dans l'expérience. <br><em>Ex.</em> la théorie physique prévoit ; la pratique technique réalise et vérifie.",
  notions: ["science", "travail", "technique"],
  relations: [
    {
      type: "distinction",
      desc: "Théorie (savoir de pensée, contemplatif) ≠ Pratique (action effective dans l'expérience).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-impossible-possible",
  term: "Impossible / Possible",
  cat: "Repère",
  def: "<strong>Impossible</strong> : ce qui implique une contradiction et ne peut donc se produire. <strong>Possible</strong> : ce qui n'implique aucune contradiction et peut donc être ou ne pas être. <br><em>Ex.</em> un cercle carré est impossible ; un mort-vivant l'est aussi (sauf dans la fiction).",
  notions: ["liberte", "raison", "science"],
  relations: [
    {
      type: "distinction",
      desc: "Impossible (contradictoire) ≠ Possible (non contradictoire, peut être ou ne pas être).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-intuitif-discursif",
  term: "Intuitif / Discursif",
  cat: "Repère",
  def: "<strong>Intuitif</strong> : connu de manière immédiate, saisi d'un seul coup sans raisonnement. <strong>Discursif</strong> : connu par une démarche intellectuelle, un enchaînement d'étapes logiques que l'on peut expliciter. <br><em>Ex.</em> on saisit intuitivement que les points d'un cercle sont équidistants du centre ; on établit de façon discursive que la somme des angles d'un triangle vaut 180°.",
  notions: ["raison", "conscience", "verite"],
  relations: [
    {
      type: "distinction",
      desc: "Intuitif (saisi immédiatement) ≠ Discursif (établi par un enchaînement de raisonnements).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-legal-legitime",
  term: "Légal / Légitime",
  cat: "Repère",
  def: "<strong>Légal</strong> : conforme aux lois en vigueur (sa violation entraîne des sanctions juridiques). <strong>Légitime</strong> : conforme à un sentiment de justice ou à un droit supérieur (sa violation entraîne une désapprobation morale). <br><em>Ex.</em> aider un migrant, comme l'a fait Cédric Herrou, peut être jugé légitime tout en étant illégal.",
  notions: ["justice", "etat", "devoir"],
  relations: [
    {
      type: "distinction",
      desc: "Légal (conforme à la loi positive) ≠ Légitime (conforme à la justice ou à un droit supérieur).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-mediat-immediat",
  term: "Médiat / Immédiat",
  cat: "Repère",
  def: "<strong>Médiat</strong> : accessible seulement par l'intermédiaire d'un médiateur. <strong>Immédiat</strong> : accessible directement, sans intermédiaire. <br><em>Ex.</em> la pensée d'autrui ne m'est jamais immédiate : elle m'est médiatisée par le langage et les signes.",
  notions: ["conscience", "langage", "raison"],
  relations: [
    {type: "distinction", desc: "Médiat (par un intermédiaire) ≠ Immédiat (sans intermédiaire, direct)."},
  ],
});

REPERE({
  new: true,
  id: "rep-genre-espece-individu",
  term: "Genre / Espèce / Individu",
  cat: "Repère",
  def: "<strong>Genre</strong> : classe d'êtres réunis par des traits communs (la plus grande extension). <strong>Espèce</strong> : subdivision d'un genre, distinguée par une différence spécifique. <strong>Individu</strong> : être singulier appartenant à une espèce. <br><em>Ex.</em> l'animal (genre), le cachalot (espèce), Moby Dick (individu).",
  notions: ["nature", "raison", "science"],
  relations: [
    {
      type: "distinction",
      desc: "Genre (classe large) ⊃ Espèce (subdivision par différence) ⊃ Individu (être singulier).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-hypothese-consequence-conclusion",
  term: "Hypothèse / Conséquence / Conclusion",
  cat: "Repère",
  def: "<strong>Hypothèse</strong> : proposition avancée pour expliquer un problème, à vérifier. <strong>Conséquence</strong> : ce qui découle logiquement d'un principe ou d'une action. <strong>Conclusion</strong> : résultat final d'un raisonnement. <br><em>Ex.</em> Galilée formule l'hypothèse que tous les corps tombent à la même vitesse dans le vide, en tire des conséquences, puis conclut.",
  notions: ["science", "raison"],
  relations: [
    {
      type: "distinction",
      desc: "Hypothèse (point de départ supposé) ≠ Conséquence (ce qui en découle) ≠ Conclusion (résultat établi).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-ideal-reel",
  term: "Idéal / Réel",
  cat: "Repère",
  def: "<strong>Idéal</strong> : ce qui n'existe qu'en idée, modèle de perfection souvent inatteignable. <strong>Réel</strong> : ce qui existe effectivement et peut être objet d'expérience. <br><em>Ex.</em> le Bonaparte héroïsé au pont d'Arcole (idéalisé) contraste avec le réalisme de Courbet dans <em>Un enterrement à Ornans</em>.",
  notions: ["art", "bonheur", "conscience"],
  relations: [
    {
      type: "distinction",
      desc: "Idéal (modèle qui n'existe qu'en idée) ≠ Réel (ce qui existe effectivement).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-identite-egalite-difference",
  term: "Identité / Égalité / Différence",
  cat: "Repère",
  def: "<strong>Identité</strong> : équivalence complète entre des choses indiscernables (le même). <strong>Égalité</strong> : équivalence quantitative entre des choses pourtant différentes. <strong>Différence</strong> : rapport de distinction entre des êtres. <br><em>Ex.</em> l'égalité des citoyens devant la loi n'efface ni leurs différences ni n'en fait une seule identité.",
  notions: ["justice", "conscience", "etat"],
  relations: [
    {
      type: "distinction",
      desc: "Identité (le même) ≠ Égalité (équivalence quantitative entre choses différentes) ≠ Différence (distinction).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-concept-image-metaphore",
  term: "Concept / Image / Métaphore",
  cat: "Repère",
  def: "<strong>Concept</strong> : représentation mentale abstraite et générale (la classe « table »). <strong>Image</strong> : représentation concrète et perceptible (telle table vue ou imaginée). <strong>Métaphore</strong> : figure qui désigne une chose par une autre qui lui ressemble. <br><em>Ex.</em> « mettre les points sur les i » est une métaphore.",
  notions: ["langage", "art", "raison"],
  relations: [
    {
      type: "distinction",
      desc: "Concept (abstrait, général) ≠ Image (concrète, singulière) ≠ Métaphore (transfert de sens par ressemblance).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-contingent-necessaire",
  term: "Contingent / Nécessaire",
  cat: "Repère",
  def: "<strong>Contingent</strong> : ce qui peut ne pas être, ou être autrement qu'il n'est. <strong>Nécessaire</strong> : ce qui ne peut pas ne pas être. <br><em>Ex.</em> il est nécessaire de dormir, mais contingent de dormir jusqu'à midi.",
  notions: ["liberte", "nature", "religion"],
  relations: [
    {
      type: "distinction",
      desc: "Contingent (peut ne pas être ou être autrement) ≠ Nécessaire (ne peut pas ne pas être).",
    },
    {
      to: "determinisme",
      type: "complete",
      desc: "Le déterminisme tient tout événement pour nécessaire, enchaîné à ses causes.",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-croire-savoir",
  term: "Croire / Savoir",
  cat: "Repère",
  def: "<strong>Croire</strong> : tenir pour vrai sans démonstration ni preuve suffisante (adhésion subjective). <strong>Savoir</strong> : disposer de connaissances rigoureuses fondées sur la démonstration ou l'expérimentation. <br><em>Ex.</em> je crois qu'il existe une vie extraterrestre ; je sais que ma côte est fêlée après la radiographie.",
  notions: ["religion", "science", "verite", "raison"],
  relations: [
    {type: "distinction", desc: "Croire (adhésion sans preuve) ≠ Savoir (connaissance fondée et démontrée)."},
    {to: "doxa", type: "complete", desc: "Croire relève de la doxa, l'opinion non fondée."},
    {
      to: "foi",
      type: "complete",
      desc: "La foi est une croyance qui s'assume comme telle, sans prétendre au savoir.",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-essentiel-accidentel",
  term: "Essentiel / Accidentel",
  cat: "Repère",
  def: "<strong>Essentiel</strong> : ce qui relève de l'essence, qualités permanentes sans lesquelles la chose ne serait plus ce qu'elle est. <strong>Accidentel</strong> : ce qui peut être modifié ou supprimé sans que l'essence change. <br><em>Ex.</em> la rationalité est essentielle à l'homme ; sa couleur de cheveux est accidentelle.",
  notions: ["nature", "verite", "conscience"],
  relations: [
    {
      type: "distinction",
      desc: "Essentiel (constitue l'essence, permanent) ≠ Accidentel (peut changer sans toucher l'essence).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-exemple-preuve",
  term: "Exemple / Preuve",
  cat: "Repère",
  def: "<strong>Exemple</strong> : cas particulier qui illustre, éclaire ou fait comprendre une idée. <strong>Preuve</strong> : fait, résultat ou témoignage qui établit la vérité d'une affirmation. <br><em>Ex.</em> des parents donnent l'exemple à leurs enfants — mais un exemple n'est jamais une preuve.",
  notions: ["verite", "science", "raison", "demonstration"],
  relations: [
    {
      type: "distinction",
      desc: "Exemple (cas qui illustre, ne démontre pas) ≠ Preuve (ce qui établit la vérité).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-expliquer-comprendre",
  term: "Expliquer / Comprendre",
  cat: "Repère",
  def: "<strong>Expliquer</strong> : identifier les causes, dégager une loi à partir des faits (modèle des sciences de la nature). <strong>Comprendre</strong> : saisir le sens, se représenter de l'intérieur une signification (modèle des sciences humaines). <br><em>Ex.</em> la psychanalyse explique un rêve par ses causes ; on comprend une œuvre d'art en en saisissant le sens.",
  notions: ["science", "conscience", "art", "interpretation"],
  relations: [
    {
      type: "distinction",
      desc: "Expliquer (par les causes et les lois) ≠ Comprendre (par le sens et la signification).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-fait-droit",
  term: "En fait / En droit",
  cat: "Repère",
  def: "<strong>En fait</strong> : ce qui existe réellement, tel qu'on peut l'observer. <strong>En droit</strong> : ce qui devrait être selon une norme ou un principe. <br><em>Ex.</em> les hommes naissent égaux en droit, mais des inégalités subsistent en fait.",
  notions: ["justice", "etat", "devoir"],
  relations: [
    {
      type: "distinction",
      desc: "En fait (ce qui est observé) ≠ En droit (ce qui devrait être selon une norme).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-formel-materiel",
  term: "Formel / Matériel",
  cat: "Repère",
  def: "<strong>Formel</strong> : qui concerne la forme abstraite, indépendamment du contenu. <strong>Matériel</strong> : qui concerne la matière, le contenu concret qui remplit la forme. <br><em>Ex.</em> l'égalité formelle devant la loi (juridique) se distingue de l'égalité matérielle (accès réel aux ressources).",
  notions: ["justice", "etat", "raison"],
  relations: [
    {
      type: "distinction",
      desc: "Formel (forme abstraite, sans contenu) ≠ Matériel (contenu concret qui remplit la forme).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-transcendant-immanent",
  term: "Transcendant / Immanent",
  cat: "Repère",
  def: "<strong>Transcendant</strong> : qui appartient à un ordre de réalité radicalement supérieur et n'est pas directement accessible. <strong>Immanent</strong> : qui se tient dans le même ordre de réalité, présent et accessible. <br><em>Ex.</em> une justice transcendante (Dieu, idéal) se distingue d'une justice immanente (les lois et institutions humaines).",
  notions: ["religion", "nature", "etat"],
  relations: [
    {
      type: "distinction",
      desc: "Transcendant (ordre supérieur, au-delà) ≠ Immanent (présent dans le même ordre de réalité).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-universel-singulier",
  term: "Universel / Général / Particulier / Singulier",
  cat: "Repère",
  def: "<strong>Universel</strong> : vaut pour tous les individus d'une catégorie, sans aucune exception. <strong>Général</strong> : vaut pour la plupart, en admettant quelques exceptions. <strong>Particulier</strong> : vaut pour quelques cas seulement. <strong>Singulier</strong> : vaut pour un seul cas. <br><em>Ex.</em> la loi de l'attraction est universelle ; « l'eau bout à 100 °C » est générale (exception en altitude).",
  notions: ["raison", "science", "justice", "etat"],
  relations: [
    {
      type: "distinction",
      desc: "Universel (tous, sans exception) ≠ Général (la plupart, avec exceptions) ≠ Particulier (quelques cas) ≠ Singulier (un seul cas).",
    },
  ],
});

REPERE({
  new: true,
  id: "rep-vrai-probable-certain",
  term: "Vrai / Probable / Certain",
  cat: "Repère",
  def: "<strong>Vrai</strong> : ce qui correspond exactement à la réalité (vérité de fait) ou ce qui n'implique pas de contradiction (vérité de raison). <strong>Probable</strong> : ce qui est plus vraisemblable que son contraire. <strong>Certain</strong> : ce qui résiste au doute et offre toutes les garanties de fiabilité — mais reste subjectif. <br><em>Ex.</em> il est vrai que le réchauffement climatique est accéléré par l'activité humaine ; il est probable qu'il s'amplifie ; je suis certain qu'il préoccupera les générations futures.",
  notions: ["verite", "science", "raison"],
  relations: [
    {
      type: "distinction",
      desc: "Vrai (conforme au réel, objectif) ≠ Certain (subjectif, résiste au doute) ≠ Probable (seulement vraisemblable).",
    },
    {
      to: "falsifiabilite",
      type: "complete",
      desc: "Une vérité scientifique se distingue par sa réfutabilité, non par la simple certitude subjective.",
    },
  ],
});
