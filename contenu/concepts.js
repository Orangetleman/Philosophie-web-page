/* Glossaire des concepts (hors repères).
   Format : CLAUDE.md, « Concept (objet dans CONCEPTS) ». L'ORDRE compte : à
   terme égal, le premier concept gagne le lien automatique (linkTerms).
   Chaque id est unique (le quiz en fait sa clé). Tout ajout porte new:true. */
CONCEPT({
  new: true,
  id: "antinomie",
  term: "Antinomie",
  cat: "Épistémologie",
  def: "Conflit entre deux propositions <strong>contradictoires</strong> qui semblent pourtant <em>également démontrables</em>. Chez <strong>Kant</strong>, les <em>antinomies de la raison pure</em> surgissent quand la raison, quittant le terrain de l'expérience possible, prétend connaître le <em>monde en soi</em> (a-t-il un commencement ou est-il éternel ? tout est-il déterminé ou y a-t-il une liberté ?) : thèse et antithèse paraissent alors aussi solides l'une que l'autre. L'antinomie révèle ainsi une <strong>limite</strong> de la raison, non une vérité sur le réel. <em>Ex.</em> « le monde a un commencement dans le temps » contre « le monde est éternel ».",
  auteur: "Kant",
  notions: ["raison", "verite"],
  relations: [
    {
      type: "distinction",
      desc: "Antinomie (deux thèses contraires également démontrables) ≠ sophisme (un raisonnement fautif, dont l'erreur peut être repérée).",
    },
  ],
});

CONCEPT({
  new: true,
  id: "arraisonnement",
  term: "Arraisonnement (de la nature)",
  cat: "Philosophie de la technique",
  def: "Traduction française du <em>Gestell</em> de <strong>Heidegger</strong> (<em>La Question de la technique</em>, 1954) : la technique moderne <em>somme</em> la nature de se livrer comme un simple <strong>fonds</strong> de ressources disponibles, mesurables et exploitables. La nature n'apparaît plus alors que comme matière à produire et à stocker — toute autre manière de la rencontrer (contemplation, habitation, sacré) est recouverte. <em>Ex.</em> un fleuve réduit à son potentiel hydroélectrique.",
  auteur: "Heidegger",
  notions: ["nature", "technique", "raison"],
  relations: [
    {
      type: "distinction",
      desc: "L'arraisonnement n'est pas un simple outil parmi d'autres : c'est une manière de dévoiler qui réduit d'avance toute la nature à un stock exploitable.",
    },
  ],
});

CONCEPT({
  new: true,
  id: "existentialisme",
  term: "Existentialisme",
  cat: "Ontologie",
  def: "Doctrine selon laquelle l'être humain n'est pas déterminé d'avance par une <strong>essence</strong>, mais <strong>libre et responsable</strong> de son existence : « l'<em>existence précède l'essence</em> » (Sartre). On distingue l'existentialisme <strong>chrétien</strong> (Jaspers, Gabriel Marcel) et l'existentialisme <strong>athée</strong> (Heidegger, Sartre) ; leur point commun est de faire de l'homme un projet qui se choisit lui-même. <em>Ex.</em> la « mauvaise foi » : se prendre pour une chose déterminée afin de fuir l'angoisse de la liberté.",
  auteur: "Sartre",
  notions: ["conscience", "liberte", "verite"],
  relations: [
    {
      to: "absurde",
      type: "prolonge",
      desc: "L'absurde de Camus prolonge le constat d'un monde sans essence ni sens donnés d'avance.",
    },
    {
      type: "distinction",
      desc: "« L'existence précède l'essence » ≠ essentialisme, pour qui une nature humaine serait fixée d'avance.",
    },
  ],
});

CONCEPT({
  new: true,
  id: "solipsisme",
  term: "Solipsisme",
  cat: "Métaphysique",
  def: "Thèse selon laquelle il n'y aurait, pour le sujet pensant, d'autre réalité que <strong>lui-même</strong> : le monde et autrui ne seraient que des représentations de ma propre conscience. Position limite née du <em>doute</em> et du primat du « je pense », elle rend l'existence d'autrui indémontrable. <em>Ex.</em> poussé à bout, le cogito risque d'enfermer le sujet en lui-même.",
  auteur: "",
  notions: ["conscience"],
  relations: [
    {
      to: "intersubjectivite",
      type: "distinction",
      desc: "Le monde se réduit à ma conscience individuelle ≠ intersubjectivité, où la réalité se constitue entre des consciences qui se reconnaissent.",
    },
  ],
});

CONCEPT({
  new: true,
  id: "absurde",
  term: "Absurde",
  cat: "Existentialisme",
  def: "Chez <strong>Camus</strong>, l'absurde n'est ni dans l'homme ni dans le monde, mais dans leur <em>rencontre</em> : le divorce entre l'exigence humaine de sens et le « silence déraisonnable du monde ». Il ne commande ni le suicide ni l'espérance d'un au-delà, mais la <strong>révolte</strong> — vivre lucidement, sans appel. <em>Ex.</em> Sisyphe, condamné à rouler éternellement son rocher : « Il faut imaginer Sisyphe heureux. »",
  auteur: "Camus",
  notions: ["temps", "bonheur"],
  relations: [],
});

CONCEPT({
  new: true,
  id: "scepticisme",
  term: "Scepticisme",
  cat: "Épistémologie",
  def: "Position selon laquelle aucune connaissance certaine n'est possible : « à tout argument s'oppose un argument de force égale » (<em>isosthénie</em>). Le scepticisme <strong>pyrrhonien</strong> (Pyrrhon, Sextus Empiricus) en tire la <strong>suspension du jugement</strong> (<em>épochè</em>), source de tranquillité de l'âme. Montaigne en reprend l'esprit dans sa devise « Que sais-je ? ». À distinguer du doute <em>méthodique</em> de Descartes, provisoire et orienté vers la certitude. <em>Ex.</em> les cinq tropes d'Agrippa.",
  auteur: "Sextus Empiricus",
  notions: ["raison", "verite", "science", "religion"],
  relations: [
    {to: "epoche", type: "implique", desc: "Le doute mène à la suspension du jugement."},
    {to: "dogme", type: "oppose", desc: "Le sceptique refuse toute affirmation dogmatique."},
    {to: "doxa", type: "prolonge", desc: "Faute de savoir certain, on en reste à l’opinion."},
  ],
});

CONCEPT({
  new: true,
  id: "dogmatisme",
  term: "Dogmatisme",
  cat: "Épistémologie",
  def: "Attitude qui pose des thèses comme certaines <strong>sans les examiner</strong> ni admettre la discussion ; le dogmatique « part de quelque chose qu'il n'établit pas » (Sextus). En ce sens, vouloir avoir raison à tout prix est dogmatique. À distinguer du <em>dogmatisme social</em> — ces croyances communes admises « sans les discuter » que Tocqueville juge nécessaires à toute vie collective. S'oppose à l'esprit critique.",
  auteur: "",
  notions: ["raison", "verite", "religion"],
  relations: [],
});

CONCEPT({
  new: true,
  id: "obstacle-epistemologique",
  term: "Obstacle épistémologique",
  cat: "Épistémologie",
  def: "Chez <strong>Bachelard</strong> (<em>La Formation de l'esprit scientifique</em>, 1938), ce qui, dans l'esprit même, freine la connaissance : opinions, images et intuitions premières séduisantes mais fausses. L'obstacle n'est pas l'inconnu mais le <em>déjà-connu</em> faussement. On ne connaît pas en s'ajoutant à un savoir vierge, mais « <strong>contre</strong> une connaissance antérieure », en la détruisant : d'où la nécessité d'une « psychanalyse de la raison » et d'une <strong>rupture épistémologique</strong> avec l'expérience première. <em>Ex.</em> l'intuition qui prête une « activité » au corps qui flotte.",
  auteur: "Bachelard",
  notions: ["raison", "science", "verite"],
  relations: [
    {type: "distinction", desc: "Obstacle épistémologique ≠ ignorance simple (c'est un faux savoir)"},
    {type: "distinction", desc: "Continuité empirique ≠ rupture scientifique"},
    {type: "distinction", desc: "Sens commun ≠ science"},
  ],
});

CONCEPT({
  new: true,
  id: "falsifiabilite",
  term: "Falsifiabilité (réfutabilité)",
  cat: "Épistémologie",
  def: "Critère de scientificité chez <strong>Popper</strong> : une théorie est scientifique non parce qu'elle est <em>vérifiable</em>, mais parce qu'elle est <strong>réfutable</strong> — elle interdit certains faits et s'expose donc à un test qui pourrait la démentir. Une thèse qu'aucune observation ne pourrait contredire (qu'on « immunise ») n'est pas scientifique : c'est le reproche que Popper adresse à la psychanalyse et au marxisme. La science avance par conjectures et réfutations. <em>Ex.</em> « Tous les corbeaux sont noirs » est réfutable : un seul corbeau blanc suffirait à l'infirmer.",
  auteur: "Popper",
  notions: ["science", "raison", "verite"],
  relations: [
    {type: "distinction", desc: "Falsifiable ≠ vrai (une théorie peut être falsifiable et fausse)"},
    {type: "distinction", desc: "Falsifiabilité ≠ vérifiabilité (positivisme logique)"},
  ],
});

CONCEPT({
  new: true,
  id: "sophisme",
  term: "Sophisme",
  cat: "Logique",
  def: "Raisonnement qui a l'<strong>apparence</strong> de la rigueur logique mais qui est trompeur — soit que ses prémisses soient fausses, soit par une faille cachée de l'inférence. Aristote l'appelle raisonnement <em>éristique</em>. La validité de la <em>forme</em> ne garantit jamais la vérité : on peut « bien » déduire à partir du faux. Au sens historique, le mot renvoie aux <strong>sophistes</strong> grecs (Protagoras, Gorgias) que Platon critique : maîtres de rhétorique qui enseignaient à faire triompher n'importe quelle thèse sans souci du vrai. <em>Ex.</em> « Tous les animaux sont des chiens… ».",
  auteur: "Aristote",
  notions: ["raison", "verite", "langage"],
  relations: [
    {type: "distinction", desc: "Raisonnement valide ≠ démonstration vraie"},
    {type: "distinction", desc: "Apparence (rhétorique) ≠ rigueur (logique)"},
    {type: "distinction", desc: "Persuasion ≠ argumentation honnête"},
  ],
});

CONCEPT({
  new: true,
  id: "syllogisme",
  term: "Syllogisme",
  cat: "Logique",
  def: "Raisonnement <strong>déductif</strong> formalisé par <strong>Aristote</strong> : « un discours dans lequel, certaines choses étant posées, une autre en résulte nécessairement ». Ex. « Tout homme est mortel ; or Socrate est un homme ; donc Socrate est mortel. » Il est <em>démonstratif</em> si ses prémisses sont vraies et premières, <em>dialectique</em> si elles sont seulement probables, <em>éristique</em> si elles ne le paraissent qu'en apparence.",
  auteur: "Aristote",
  notions: ["raison"],
  relations: [],
});

CONCEPT({
  id: "langue",
  term: "Langue",
  cat: "Linguistique",
  def: "Instrument de communication propre à une communauté humaine. Produit social de la faculté du langage — ensemble institué et stable de symboles verbaux ou écrits. Système de différences : chaque terme n'a de valeur que par rapport aux autres.",
  auteur: "Saussure",
  notions: ["langage"],
  relations: [
    {type: "distinction", desc: "Langue ≠ Parole (social vs individuel)"},
    {type: "distinction", desc: "Langue ≠ Langage (particulier vs général)"},
  ],
});

CONCEPT({
  id: "parole",
  term: "Parole",
  cat: "Linguistique",
  def: "Acte individuel par lequel s'exerce la fonction linguistique — appropriation d'une langue par un individu. Manière singulière dont chacun s'empare d'une langue commune. Fondement de la créativité linguistique (néologismes, style).",
  auteur: "Saussure",
  notions: ["langage", "art"],
  relations: [
    {type: "distinction", desc: "Parole ≠ Langue (individuel vs social)"},
    {type: "distinction", desc: "Parole créatrice ≠ code figé"},
  ],
});

CONCEPT({
  id: "signifiant-signifie",
  term: "Signifiant / Signifié",
  cat: "Linguistique",
  def: "Le <strong>signifiant</strong> est l'image acoustique (le son du mot). Le <strong>signifié</strong> est le concept mental associé. Lien <strong>arbitraire</strong> (pas de nécessité naturelle entre le son \"arbre\" et l'idée d'arbre) mais <strong>inséparable</strong> (comme recto/verso d'une feuille).",
  auteur: "Saussure",
  notions: ["langage"],
  relations: [
    {type: "distinction", desc: "Signifiant ≠ Référent (le mot ≠ la chose réelle)"},
    {type: "distinction", desc: "Lien arbitraire → mais il faut l'apprendre"},
  ],
});

CONCEPT({
  id: "referent",
  term: "Référent",
  cat: "Linguistique",
  def: "L'objet, phénomène ou être de la réalité objective que désigne le signe linguistique. La licorne : signifiant (le son) + signifié (le concept d'animal à corne unique) mais <em>référent absent</em> — preuve que le langage peut fonctionner sans ancrage réel.",
  auteur: "Saussure",
  notions: ["langage", "art"],
  relations: [
    {type: "distinction", desc: "Signe sans référent → le langage dépasse la pure utilité"},
    {type: "distinction", desc: "Référent imaginaire → fiction, mythe, abstraction"},
  ],
});

CONCEPT({
  id: "signal-symbole",
  term: "Signal / Symbole",
  cat: "Linguistique",
  def: "Le <strong>signal</strong> est un fait physique lié à un autre par rapport naturel ou conventionnel — l'animal y réagit par réflexe conditionné (Pavlov). Le <strong>symbole</strong> est institué par l'homme et doit être interprété : l'animal exprime ses émotions, il ne les dénomme pas.",
  auteur: "Benveniste",
  notions: ["langage", "nature", "conscience"],
  relations: [
    {type: "distinction", desc: "Animal = signal / Homme = signal ET symbole"},
    {type: "distinction", desc: "Expression (animal) ≠ dénomination (homme)"},
  ],
});

CONCEPT({
  id: "logos-phone",
  term: "Logos / Phone",
  cat: "Linguistique",
  def: "<strong>Phone</strong> : la voix, cri, expression sonore des émotions — partagée avec l'animal. <strong>Logos</strong> : parole rationnelle, discours structuré permettant de délibérer du juste et de l'injuste. Aristote : seul l'homme possède le logos, ce qui fait de lui un <em>animal politique</em>. Cassin : logos = à la fois raison ET discours (intraduisible).",
  auteur: "Aristote / Cassin",
  notions: ["langage", "raison", "etat"],
  relations: [
    {type: "distinction", desc: "Phone → expression / Logos → argumentation et délibération"},
    {type: "distinction", desc: "Logos ≠ raison pure (il est aussi rhétorique, persuasion)"},
  ],
});

CONCEPT({
  id: "double-articulation",
  term: "Double articulation",
  cat: "Linguistique",
  def: "Propriété distinctive du langage humain mise en évidence par le linguiste André <strong>Martinet</strong> (<em>Éléments de linguistique générale</em>, 1960) : (1) un énoncé s'articule d'abord en <strong>monèmes</strong>, unités minimales qui ont à la fois un son et un sens ; (2) chaque monème s'articule à son tour en <strong>phonèmes</strong>, unités sonores sans signification propre, en nombre fini (une quarantaine en français). Avec ces éléments finis, une langue produit un nombre illimité d'énoncés : c'est ce qui distingue le langage humain des codes animaux.",
  auteur: "Martinet",
  notions: ["langage"],
  relations: [
    {
      type: "distinction",
      desc: "Double articulation → richesse infinie ≠ code animal (nombre fini de messages)",
    },
    {type: "distinction", desc: "Signal ≠ Symbole (Benveniste)"},
    {type: "distinction", desc: "Langage (faculté générale) ≠ Langue (propre à une communauté)"},
  ],
});

CONCEPT({
  id: "performatif",
  term: "Performatif / Constatif",
  cat: "Philosophie du langage",
  def: "Austin : un énoncé <strong>constatif</strong> décrit et peut être vrai/faux (\"Il pleut\"). Un énoncé <strong>performatif</strong> <em>accomplit</em> ce qu'il énonce — dire c'est faire. \"Je vous déclare mari et femme\" : la réalité est modifiée par la parole. Conditions de félicité : statut du locuteur, reconnaissance institutionnelle.",
  auteur: "Austin",
  notions: ["langage", "travail", "etat"],
  relations: [
    {type: "distinction", desc: "Performatif ≠ Constatif (action vs description)"},
    {type: "distinction", desc: "Langage comme moyen ≠ Langage comme action constitutive du réel"},
  ],
});

CONCEPT({
  id: "novlangue",
  term: "Novlangue",
  cat: "Politique / Linguistique",
  def: "Dans <em>1984</em> d'Orwell : langue artificielle réduisant le vocabulaire pour réduire le pensable. Si un mot disparaît, la pensée correspondante disparaît. Exemple : \"crimepensée\" remplace toute idée hérétique — un seul mot empêche d'articuler une pensée complexe.",
  auteur: "Orwell",
  notions: ["langage", "liberte", "etat"],
  relations: [
    {type: "distinction", desc: "Novlangue → le langage peut supprimer la liberté de pensée"},
    {type: "distinction", desc: "Langue appauvrie ≠ langue enrichissante (Cassin)"},
  ],
});

CONCEPT({
  id: "fonctions-langage",
  term: "6 fonctions du langage",
  cat: "Linguistique",
  def: "Jakobson : <strong>émotive</strong> (je — interjections), <strong>conative</strong> (tu — impératif, persuasion), <strong>référentielle</strong> (il — décrire le contexte), <strong>phatique</strong> (maintenir le contact), <strong>métalinguistique</strong> (parler du code), <strong>poétique</strong> (le message pour lui-même — rythme, sonorités). Une phrase combine rarement une seule fonction.",
  auteur: "Jakobson",
  notions: ["langage", "art"],
  relations: [
    {type: "distinction", desc: "Communication ≠ seule fonction"},
    {type: "distinction", desc: "Fonction poétique → langage comme fin en soi ≠ moyen"},
  ],
});

CONCEPT({
  id: "injonction-paradoxale",
  term: "Injonction paradoxale",
  cat: "Pragmatique",
  def: "\"Soyez spontané !\" — contradiction performative : pour obéir, il faudrait être spontané par obéissance, donc sans spontanéité. Watzlawick : ces paradoxes sont au cœur de la communication pathologique (double bind de Bateson). Révèlent les limites structurelles de la communication.",
  auteur: "Watzlawick",
  notions: ["langage", "conscience"],
  relations: [
    {type: "distinction", desc: "Le langage peut se retourner contre sa fonction de communication"},
    {type: "distinction", desc: "Injonction paradoxale → souffrance psychique, névrose"},
  ],
});

CONCEPT({
  id: "cogito",
  term: "Cogito",
  cat: "Épistémologie",
  def: "<em>Cogito ergo sum</em> — \"je pense donc je suis\" (Descartes, <em>Méditations métaphysiques</em>, 1641). Première certitude après le doute hyperbolique. Fondement du rationalisme moderne. Critiques : Nietzsche (\"ça pense\"), Hume (pas de moi stable), Freud (l'inconscient contredit la transparence du cogito).",
  auteur: "Descartes",
  notions: ["conscience", "raison", "liberte", "langage"],
  relations: [
    {type: "distinction", desc: "Cogito → conscience transparente à elle-même"},
    {type: "distinction", desc: "Freud : le moi n'est pas maître en sa propre maison — cogito illusoire ?"},
  ],
});

CONCEPT({
  id: "mauvaise-foi",
  term: "Mauvaise foi",
  cat: "Existentialisme",
  def: "Sartre : attitude qui consiste à se croire déterminé comme une chose, à nier sa liberté radicale en \"jouant un rôle\". Exemple : le garçon de café qui \"joue\" à être garçon de café. ≠ mensonge (on se ment à soi-même conscient de sa liberté).",
  auteur: "Sartre",
  notions: ["conscience", "liberte"],
  relations: [
    {type: "distinction", desc: "Mauvaise foi ≠ mensonge (auto-illusion)"},
    {type: "distinction", desc: "Mauvaise foi ↔ authenticité (assumer sa liberté)"},
  ],
});

CONCEPT({
  id: "dialectique-maitre-esclave",
  term: "Dialectique Maître/Esclave",
  cat: "Idéalisme",
  def: "Hegel (<em>Phénoménologie de l'Esprit</em>, 1807) : la conscience de soi ne s'obtient que dans la <strong>reconnaissance</strong> par une autre conscience. Le maître exige la reconnaissance de l'esclave qu'il nie — reconnaissance creuse. L'esclave se réalise dans le travail et accède à une vraie conscience de soi.",
  auteur: "Hegel",
  notions: ["conscience", "liberte", "travail"],
  relations: [
    {type: "distinction", desc: "Domination → reconnaissance vide"},
    {type: "distinction", desc: "Travail de l'esclave → émancipation paradoxale"},
  ],
});

CONCEPT({
  id: "determinisme",
  term: "Déterminisme",
  cat: "Métaphysique",
  def: "Doctrine : tout événement, y compris les actes humains, est la conséquence nécessaire de causes antérieures. D'Holbach : l'homme est \"une machine\". Spinoza et Engels : compatibilisme — la liberté est la nécessité comprise. Différent du fatalisme (qui nie l'action).",
  auteur: "D'Holbach / Spinoza / Engels",
  notions: ["liberte", "conscience", "nature", "science"],
  relations: [
    {type: "distinction", desc: "Déterminisme strict ≠ libre arbitre"},
    {type: "distinction", desc: "Compatibilisme : déterminisme + liberté possible"},
  ],
});

CONCEPT({
  id: "libre-arbitre",
  term: "Libre arbitre",
  cat: "Métaphysique",
  def: "Capacité à choisir librement entre plusieurs possibles, indépendamment de toute détermination. Descartes : la liberté est \"la plus grande perfection de l'homme\". Sartre : \"nous sommes condamnés à être libres\". Remis en cause par le déterminisme et la psychanalyse (inconscient).",
  auteur: "Descartes / Sartre",
  notions: ["liberte", "conscience", "devoir"],
  relations: [
    {type: "distinction", desc: "Libre arbitre ≠ liberté spinoziste (nécessité comprise)"},
    {type: "distinction", desc: "Libre arbitre ≠ caprice / indéterminisme"},
  ],
});

CONCEPT({
  id: "alienation",
  term: "Aliénation",
  cat: "Philosophie sociale",
  def: "Marx : le travailleur est étranger à son produit (qui lui échappe), à son activité (imposée), à son espèce (déshumanisé), à ses semblables (concurrence). Hegel : l'esprit s'aliène dans le monde avant de se retrouver. Simondon : aliénation par méconnaissance des machines.",
  auteur: "Marx / Hegel / Simondon",
  notions: ["travail", "liberte", "conscience", "technique"],
  relations: [
    {type: "distinction", desc: "Aliénation économique (Marx) ≠ aliénation de l'Esprit (Hegel)"},
    {type: "distinction", desc: "Travail aliéné ≠ travail libre (créateur)"},
  ],
});

CONCEPT({
  id: "labor-work-action",
  term: "Labor / Work / Action",
  cat: "Philosophie politique",
  def: "Arendt (<em>Condition de l'homme moderne</em>, 1958) : <strong>Labor</strong> (cycle biologique, sans durée — corvée) ; <strong>Work/Œuvre</strong> (fabrication d'un monde durable — artisan, artiste) ; <strong>Action</strong> (activité politique libre entre égaux — seule vraiment humaine). La modernité réduit tout au labor.",
  auteur: "Arendt",
  notions: ["travail", "art", "liberte", "etat"],
  relations: [
    {type: "distinction", desc: "Labor (animal laborans) ≠ Work (homo faber) ≠ Action (politique)"},
    {type: "distinction", desc: "Modernité : tout devient labor — appauvrissement"},
  ],
});

CONCEPT({
  id: "plus-value",
  term: "Plus-value",
  cat: "Économie politique",
  def: "Marx : écart entre la valeur produite par le travailleur et le salaire reçu. Fondement de l'exploitation capitaliste. Journée divisée en <strong>temps nécessaire</strong> (reproduit le salaire) et <strong>surtravail</strong> (produit la plus-value pour le capitaliste).",
  auteur: "Marx",
  notions: ["travail", "justice"],
  relations: [
    {type: "distinction", desc: "Plus-value → le travail crée la valeur mais le travailleur ne la reçoit pas"},
    {type: "distinction", desc: "≠ profit (qui peut avoir d'autres sources)"},
  ],
});

CONCEPT({
  id: "contrat-social",
  term: "Contrat social",
  cat: "Philosophie politique",
  def: "Théorie de la légitimité politique par accord entre individus. <strong>Hobbes</strong> : abandon total des droits au souverain absolu pour la sécurité. <strong>Locke</strong> : contrat révocable si les droits naturels sont violés. <strong>Rousseau</strong> : aliénation à la volonté générale — \"en obéissant à la loi qu'on s'est prescrite, on est libre\".",
  auteur: "Hobbes / Locke / Rousseau",
  notions: ["etat", "liberte", "justice"],
  relations: [
    {type: "distinction", desc: "Sécurité (Hobbes) ≠ droits naturels (Locke) ≠ liberté civile (Rousseau)"},
    {type: "distinction", desc: "Contrat fictif ou historique ?"},
  ],
});

CONCEPT({
  id: "volonte-generale",
  term: "Volonté générale",
  cat: "Philosophie politique",
  def: "Rousseau : volonté du corps politique visant le bien commun. ≠ \"volonté de tous\" (somme des intérêts particuliers). Inaliénable et indivisible. Base de la souveraineté populaire. Peut légitimer la contrainte de l'individu au nom du bien commun.",
  auteur: "Rousseau",
  notions: ["etat", "liberte", "justice"],
  relations: [
    {type: "distinction", desc: "Volonté générale ≠ volonté de tous (arithmétique)"},
    {type: "distinction", desc: "Peut-elle justifier la tyrannie de la majorité ?"},
  ],
});

CONCEPT({
  id: "etat-de-nature",
  term: "État de nature",
  cat: "Philosophie politique",
  def: "Fiction philosophique : condition humaine avant tout ordre politique. <strong>Hobbes</strong> : guerre de tous contre tous (\"vie solitaire, pauvre, brutale et brève\"). <strong>Locke</strong> : état pacifique mais fragile. <strong>Rousseau</strong> : bonheur naturel, égalité, pas encore corrompu par la propriété.",
  auteur: "Hobbes / Locke / Rousseau",
  notions: ["etat", "nature", "liberte"],
  relations: [
    {type: "distinction", desc: "Violent (Hobbes) ≠ Pacifique (Locke) ≠ Heureux (Rousseau)"},
    {type: "distinction", desc: "Fiction conceptuelle ≠ fait historique"},
  ],
});

CONCEPT({
  id: "ataraxie",
  term: "Ataraxie",
  cat: "Éthique antique",
  def: "Terme épicurien : état de paix de l'âme, absence de trouble et d'inquiétude. Joint à l'<strong>aponie</strong> (absence de douleur corporelle), elle constitue le bonheur épicurien. S'obtient par le calcul des désirs : désirs naturels et nécessaires > naturels non nécessaires > vains.",
  auteur: "Épicure",
  notions: ["bonheur"],
  relations: [
    {type: "distinction", desc: "Ataraxie (paix, repos) ≠ eudaimonia (activité, vertu — Aristote)"},
    {type: "distinction", desc: "Ataraxie → bonheur passif ≠ bonheur actif"},
  ],
});

CONCEPT({
  id: "eudaimonia",
  term: "Eudaimonia",
  cat: "Éthique antique",
  def: "Terme aristotélicien traduit par « bonheur » ou « félicité ». Littéralement : « avoir un bon démon ». Pour Aristote, c'est l'<strong>activité de l'âme conforme à la vertu</strong> la plus haute. Ce n'est pas un état passif mais une <em>energeia</em> (actualisation de ses capacités). Elle exige les vertus morales <em>et</em> intellectuelles (<em>phronesis</em>, la prudence), ainsi qu'un minimum de biens extérieurs : c'est la fin ultime de l'existence humaine.",
  auteur: "Aristote",
  notions: ["bonheur", "travail"],
  relations: [
    {type: "distinction", desc: "Eudaimonia (activité) ≠ ataraxie (repos — Épicure)"},
    {type: "distinction", desc: "Eudaimonia ≠ hedone (plaisir sensoriel pur)"},
  ],
});

CONCEPT({
  id: "habitus",
  term: "Habitus",
  cat: "Sociologie",
  def: "Bourdieu : système de dispositions durables acquises dans la socialisation — façons d'agir, de penser, de percevoir incorporées. Génère des pratiques adaptées aux structures sociales sans calcul conscient. Le goût esthétique est un habitus de classe.",
  auteur: "Bourdieu",
  notions: ["bonheur", "art", "nature", "liberte"],
  relations: [
    {type: "distinction", desc: "Habitus → déterminisme social mais non absolu (il peut être transformé)"},
    {type: "distinction", desc: "Habitus ≠ habitude (structure profonde vs comportement répété)"},
  ],
});

CONCEPT({
  id: "imperatif-categorique",
  term: "Impératif catégorique",
  cat: "Éthique kantienne",
  def: "Kant : commandement moral qui s'impose inconditionnellement, sans égard aux conséquences ou aux désirs. Trois formulations : (1) <em>Universalisation</em> : \"Agis seulement selon la maxime qui peut devenir loi universelle\" ; (2) <em>Humanité comme fin</em> ; (3) <em>Législation universelle</em>.",
  auteur: "Kant",
  notions: ["devoir", "liberte", "justice"],
  relations: [
    {type: "distinction", desc: "Impératif catégorique ≠ hypothétique (\"si tu veux X, fais Y\")"},
    {
      type: "distinction",
      desc: "Devoir inconditionnel ≠ utilitarisme (Mill) — les conséquences ne comptent pas",
    },
  ],
});

CONCEPT({
  id: "banalite-du-mal",
  term: "Banalité du mal",
  cat: "Philosophie politique",
  def: "Arendt (<em>Eichmann à Jérusalem</em>, 1963) : le mal radical ne suppose pas de monstruosité mais l'<strong>absence de pensée</strong> — obéissance sans jugement. Eichmann exécutait des ordres sans réfléchir à leur sens moral. La pensée est une condition de résistance au mal.",
  auteur: "Arendt",
  notions: ["devoir", "etat", "conscience"],
  relations: [
    {type: "distinction", desc: "Mal banal (absence de pensée) ≠ mal radical (intentions diaboliques)"},
    {type: "distinction", desc: "Obéissance sans pensée ≠ devoir moral kantien (autonomie)"},
  ],
});

CONCEPT({
  id: "ready-made",
  term: "Ready-made",
  cat: "Art contemporain",
  def: "Duchamp (<em>La Fontaine</em>, 1917) : objet manufacturé ordinaire promu au statut d'œuvre d'art par désignation institutionnelle. Ce n'est pas le geste technique qui crée l'œuvre mais l'acte de désignation. O'Doherty : c'est l'espace de la galerie qui fait l'art.",
  auteur: "Duchamp",
  notions: ["art", "travail", "technique"],
  relations: [
    {type: "distinction", desc: "Ready-made → l'art ≠ maîtrise technique"},
    {type: "distinction", desc: "Valeur esthétique ≠ valeur commerciale"},
    {type: "distinction", desc: "Art institutionnel ≠ art comme expression singulière"},
  ],
});

CONCEPT({
  id: "genie",
  term: "Génie",
  cat: "Esthétique",
  def: "Kant (<em>Critique de la faculté de juger</em>, 1790) : talent de produire ce dont on ne peut donner de règle déterminée. L'originalité est sa première qualité. Ses productions doivent être exemplaires. Nietzsche critique le mythe du génie inné : c'est l'ignorance et la paresse qui font croire au \"don\".",
  auteur: "Kant / Nietzsche",
  notions: ["art", "travail", "liberte"],
  relations: [
    {type: "distinction", desc: "Génie inné (mythe romantique) ≠ travail acharné (Nietzsche)"},
    {type: "distinction", desc: "Génie ≠ simple habileté technique"},
  ],
});

CONCEPT({
  id: "beau-sans-concept",
  term: "Beau sans concept",
  cat: "Esthétique",
  def: "Kant : le jugement de goût (\"c'est beau\") est un <strong>universel sans concept</strong> — on attend l'accord universel sans pouvoir le justifier par une règle. Bourdieu critique : ce prétendu universel cache un habitus de classe. Le \"goût\" dominant est celui de la classe dominante.",
  auteur: "Kant / Bourdieu",
  notions: ["art", "bonheur"],
  relations: [
    {type: "distinction", desc: "Universalité esthétique (Kant) ≠ relativisme de classe (Bourdieu)"},
    {type: "distinction", desc: "Jugement de goût ≠ jugement moral ≠ jugement de connaissance"},
  ],
});

CONCEPT({
  id: "autonomie",
  term: "Autonomie",
  cat: "Éthique kantienne",
  def: "Kant : se donner sa propre loi (auto-nomos). L'<strong>autonomie</strong> morale est la capacité à agir selon des principes que l'on s'est soi-même donnés par la raison. ≠ hétéronomie (obéir à une loi extérieure). C'est le fondement de la dignité humaine.",
  auteur: "Kant",
  notions: ["devoir", "liberte", "conscience"],
  relations: [
    {type: "distinction", desc: "Autonomie ≠ hétéronomie (contrainte extérieure, désir, Dieu)"},
    {type: "distinction", desc: "Autonomie ≠ liberté arbitraire (c'est la raison qui légifère)"},
  ],
});

CONCEPT({
  id: "servitude-volontaire",
  term: "Servitude volontaire",
  cat: "Philosophie politique",
  def: "La Boétie (<em>Discours de la servitude volontaire</em>, ~1548) : mystère politique — pourquoi des millions d'hommes obéissent-ils librement à un seul tyran ? Par habitude, coutume, peur. La tyrannie repose non sur la force mais sur le consentement. Résistance = cesser d'obéir.",
  auteur: "La Boétie",
  notions: ["etat", "liberte", "devoir"],
  relations: [
    {type: "distinction", desc: "Servitude volontaire → complicité des dominés"},
    {type: "distinction", desc: "Résistance passive ≠ révolution armée"},
  ],
});

CONCEPT({
  id: "intersubjectivite",
  term: "Intersubjectivité",
  cat: "Phénoménologie",
  def: "Relation entre sujets par laquelle chacun reconnaît l'autre comme une autre conscience. Fondement du monde commun et de l'objectivité. Husserl : la réalité partagée se constitue par l'intersubjectivité. Sartre : \"l'enfer, c'est les autres\" — mais aussi la condition de la conscience de soi.",
  auteur: "Husserl / Sartre / Merleau-Ponty",
  notions: ["conscience", "langage", "etat"],
  relations: [
    {type: "distinction", desc: "Intersubjectivité → monde commun ≠ solipsisme"},
    {type: "distinction", desc: "Autrui comme menace (Sartre) ≠ autrui comme condition (Merleau-Ponty)"},
  ],
});

CONCEPT({
  id: "elan-vital",
  term: "Élan vital",
  cat: "Vitalisme",
  def: "Bergson (<em>L'Évolution créatrice</em>, 1907) : principe de la vie — force créatrice qui s'exprime à travers l'évolution des espèces. Imprévisible, créateur, non téléologique (≠ finalisme). L'homme est la pointe de cet élan vital grâce à l'intelligence et à l'intuition.",
  auteur: "Bergson",
  notions: ["nature", "temps", "liberte"],
  relations: [
    {type: "distinction", desc: "Élan vital ≠ mécanisme (déterministe)"},
    {type: "distinction", desc: "Élan vital ≠ finalisme (un but préétabli)"},
  ],
});

CONCEPT({
  id: "physis",
  term: "Physis",
  cat: "Philosophie antique",
  def: "Terme grec désignant la nature comme processus de croissance spontané (de <em>phuein</em> : pousser, naître). ≠ <em>nomos</em> (la loi, la convention humaine). La physis est ce qui s'engendre de soi-même sans artifice humain. Aristote : la physis a une finalité interne.",
  auteur: "Aristote / Héraclite",
  notions: ["nature", "technique", "art"],
  relations: [
    {type: "distinction", desc: "Physis ≠ tekhnê (nature ≠ art/technique)"},
    {type: "distinction", desc: "Physis ≠ nomos (nature ≠ loi humaine)"},
  ],
});

CONCEPT({
  id: "notion-conscience",
  term: "Conscience",
  cat: "Notion — Terminale",
  def: "La conscience est la présence à soi et au monde. On distingue la <strong>conscience immédiate</strong> (perception du monde) et la <strong>conscience réflexive</strong> (retour sur soi). La psychanalyse remet en cause sa transparence.",
  auteur: "Descartes / Freud / Sartre",
  notions: ["conscience"],
  relations: [
    {type: "distinction", desc: "Conscience immédiate ≠ conscience réflexive"},
    {type: "distinction", desc: "Conscience (Descartes) ≠ inconscient (Freud)"},
  ],
});

CONCEPT({
  id: "notion-liberté",
  term: "Liberté",
  cat: "Notion — Terminale",
  def: "La liberté est la capacité d'agir selon sa propre volonté, sans contrainte extérieure ni intérieure. On distingue la liberté naturelle, la liberté civile (Rousseau), la liberté morale (Kant) et la liberté existentielle (Sartre).",
  auteur: "Kant / Sartre / Rousseau",
  notions: ["liberte"],
  relations: [
    {type: "distinction", desc: "Liberté de faire ≠ liberté d'être"},
    {type: "distinction", desc: "Liberté (Sartre : absolue) ≠ liberté (Spinoza : nécessité comprise)"},
  ],
});

CONCEPT({
  id: "notion-justice",
  term: "Justice",
  cat: "Notion — Terminale",
  def: "La justice est le principe selon lequel chacun reçoit ce qui lui est dû. On distingue la justice commutative (égalité stricte) et la justice distributive (selon les mérites ou les besoins). Rawls : équité et voile d'ignorance.",
  auteur: "Aristote / Rawls / Marx",
  notions: ["justice"],
  relations: [
    {type: "distinction", desc: "Justice formelle ≠ justice réelle"},
    {type: "distinction", desc: "Mérite ≠ besoin comme critère de justice"},
  ],
});

CONCEPT({
  id: "notion-etat",
  term: "État",
  cat: "Notion — Terminale",
  def: "L'État est l'institution politique souveraine qui détient le monopole de la violence légitime (Weber) sur un territoire délimité. Il naît d'un contrat social (Hobbes, Locke, Rousseau) censé garantir la paix civile et les droits des citoyens.",
  auteur: "Weber / Hobbes / Rousseau",
  notions: ["etat"],
  relations: [
    {type: "distinction", desc: "État comme protecteur ≠ État comme oppresseur"},
    {type: "distinction", desc: "État libéral (Locke) ≠ État absolu (Hobbes)"},
  ],
});

CONCEPT({
  id: "notion-travail",
  term: "Travail",
  cat: "Notion — Terminale",
  def: "Le travail est l'activité par laquelle l'homme transforme la nature pour satisfaire ses besoins. Il peut aliéner (Marx) ou libérer (Hegel). Arendt distingue labor (biologique), work (création durable) et action (politique).",
  auteur: "Marx / Hegel / Arendt",
  notions: ["travail"],
  relations: [
    {type: "distinction", desc: "Travail aliénant (Marx) ≠ travail libérateur (Hegel)"},
    {type: "distinction", desc: "Labor (cyclique) ≠ Work (durable) ≠ Action (politique)"},
  ],
});

CONCEPT({
  id: "notion-technique",
  term: "Technique",
  cat: "Notion — Terminale",
  def: "La technique est l'ensemble des procédés rationnels visant à transformer la nature. Elle pose la question de la maîtrise : maîtrisons-nous la technique ou est-ce elle qui nous maîtrise ? Simondon propose une culture technique.",
  auteur: "Heidegger / Simondon / Descartes",
  notions: ["technique"],
  relations: [
    {
      type: "distinction",
      desc: "Technique comme libération (Descartes) ≠ technique comme domination (Heidegger)",
    },
    {type: "distinction", desc: "Technophobie ≠ culture technique (Simondon)"},
  ],
});

CONCEPT({
  id: "notion-nature",
  term: "Nature",
  cat: "Notion — Terminale",
  def: "La nature désigne l'ensemble du réel non produit par l'homme, mais aussi l'essence d'un être (sa nature profonde). Elle peut être modèle (Rousseau), objet de domination (Descartes) ou sujet de droits (Jonas, Stone).",
  auteur: "Rousseau / Jonas / Descartes",
  notions: ["nature"],
  relations: [
    {type: "distinction", desc: "Nature comme norme ≠ sophisme naturaliste"},
    {type: "distinction", desc: "Nature-objet ≠ nature-sujet de droits"},
  ],
});

CONCEPT({
  id: "notion-bonheur",
  term: "Bonheur",
  cat: "Notion — Terminale",
  def: "Le bonheur est un état durable de satisfaction complète, distinct du plaisir (fugace) et du contentement passager. Aristote : eudaimonia (activité vertueuse). Épicure : ataraxie + aponie. Kant : mériter d'être heureux.",
  auteur: "Aristote / Épicure / Kant",
  notions: ["bonheur"],
  relations: [
    {type: "distinction", desc: "Bonheur (durable) ≠ plaisir (fugace)"},
    {type: "distinction", desc: "Bonheur et morale : accord (Mill) ≠ séparation (Kant)"},
  ],
});

CONCEPT({
  id: "notion-art",
  term: "Art",
  cat: "Notion — Terminale",
  def: "L'art est une activité créatrice produisant des œuvres qui visent le beau ou l'expression. Platon : imitation (mimésis). Kant : beau sans concept, génie. Hegel : l'art incarne l'Esprit. Duchamp : le ready-made remet en cause la définition même de l'art.",
  auteur: "Platon / Kant / Hegel / Duchamp",
  notions: ["art"],
  relations: [
    {type: "distinction", desc: "Art comme imitation (Platon) ≠ art comme création libre (Kant)"},
    {type: "distinction", desc: "Art ≠ technique (finalité désintéressée)"},
  ],
});

CONCEPT({
  id: "notion-temps",
  term: "Temps",
  cat: "Notion — Terminale",
  def: "Le temps est la dimension dans laquelle se succèdent les événements du passé, présent et futur. Bergson oppose le temps vécu (durée) au temps spatialisé de la science. Heidegger : l'être-vers-la-mort comme horizon de toute temporalité.",
  auteur: "Bergson / Heidegger / Augustin",
  notions: ["temps"],
  relations: [
    {type: "distinction", desc: "Temps objectif (science) ≠ durée vécue (Bergson)"},
    {type: "distinction", desc: "Temps linéaire ≠ éternel retour (Nietzsche)"},
  ],
});

CONCEPT({
  id: "notion-langage",
  term: "Langage",
  cat: "Notion — Terminale",
  def: "Le langage est tout système de signes permettant la communication et la pensée. Il est propre à l'homme (logos vs phone). Saussure : langue/parole. Wittgenstein : les limites de mon langage sont les limites de mon monde.",
  auteur: "Saussure / Wittgenstein / Benveniste",
  notions: ["langage"],
  relations: [
    {type: "distinction", desc: "Langage comme outil ≠ langage comme constitutif de la pensée"},
    {type: "distinction", desc: "Langue commune ≠ parole individuelle"},
  ],
});

CONCEPT({
  id: "notion-raison",
  term: "Raison",
  cat: "Notion — Terminale",
  def: "La raison est la faculté humaine de penser de manière logique et d'établir des vérités. Kant distingue raison théorique (connaître) et raison pratique (agir moralement). Pascal : le cœur a ses raisons que la raison ne connaît point.",
  auteur: "Kant / Pascal / Descartes",
  notions: ["raison"],
  relations: [
    {type: "distinction", desc: "Raison théorique (connaître) ≠ raison pratique (agir)"},
    {type: "distinction", desc: "Raison ≠ passion / sentiment"},
  ],
});

CONCEPT({
  id: "notion-science",
  term: "Science",
  cat: "Notion — Terminale",
  def: "La science est un ensemble de connaissances méthodiques visant à expliquer le réel. Popper : une théorie est scientifique si elle est falsifiable. Kuhn : la science progresse par révolutions de paradigmes, non de façon linéaire.",
  auteur: "Popper / Kuhn / Bachelard",
  notions: ["raison"],
  relations: [
    {type: "distinction", desc: "Science (vérifiable) ≠ pseudoscience"},
    {type: "distinction", desc: "Progrès cumulatif (Popper) ≠ révolutions paradigmatiques (Kuhn)"},
  ],
});

CONCEPT({
  id: "notion-religion",
  term: "Religion",
  cat: "Notion — Terminale",
  def: "La religion est un ensemble de croyances et de pratiques relatives au sacré. Elle articule vision du monde, morale et rites. Freud : illusion. Marx : opium du peuple. Pascal : pari raisonnable face à l'infini.",
  auteur: "Freud / Marx / Pascal",
  notions: ["religion"],
  relations: [
    {type: "distinction", desc: "Foi ≠ raison (mais dialogue possible)"},
    {type: "distinction", desc: "Religion comme consolation ≠ religion comme vérité"},
  ],
});

CONCEPT({
  id: "notion-verite",
  term: "Vérité",
  cat: "Notion — Terminale",
  def: "La vérité est l'adéquation d'un énoncé à la réalité (conception classique). Descartes : certitude par le doute. Nietzsche : la vérité est une métaphore usée. Popper : on ne prouve pas la vérité, on réfute l'erreur.",
  auteur: "Descartes / Nietzsche / Popper",
  notions: ["verite"],
  relations: [
    {type: "distinction", desc: "Vérité objective ≠ vérité subjective"},
    {type: "distinction", desc: "Certitude ≠ vérité"},
  ],
});

CONCEPT({
  id: "notion-inconscient",
  term: "Inconscient",
  cat: "Notion — Terminale",
  def: "L'inconscient freudien désigne les représentations refoulées qui continuent d'agir sur le psychisme à notre insu. Topique : Ça / Moi / Surmoi. Il se manifeste dans les rêves, les actes manqués, les lapsus. Remet en cause la souveraineté du moi.",
  auteur: "Freud / Jung / Lacan",
  notions: ["inconscient"],
  relations: [
    {type: "distinction", desc: "Inconscient (Freud) ≠ conscience (Descartes)"},
    {type: "distinction", desc: "Inconscient ≠ simple méconnaissance (c'est du refoulé actif)"},
  ],
});

CONCEPT({
  id: "désir",
  term: "Désir",
  cat: "Anthropologie philosophique",
  def: "Mouvement vers ce qui manque, vers un objet qui n'est pas encore possédé. Platon (<em>Banquet</em>) : le désir est manque — Éros est fils de Pénia (pauvreté). Spinoza : le désir est l'essence même de l'homme (conatus). Freud : le désir naît du refoulement pulsionnel.",
  auteur: "Platon / Spinoza / Freud",
  notions: ["bonheur", "inconscient", "liberte"],
  relations: [
    {type: "distinction", desc: "Désir comme manque (Platon) ≠ désir comme puissance (Spinoza)"},
    {type: "distinction", desc: "Satisfaire le désir ≠ supprimer le désir"},
  ],
});

CONCEPT({
  id: "plaisir",
  term: "Plaisir",
  cat: "Éthique",
  def: "État affectif positif lié à la satisfaction d'un besoin ou d'un désir. Épicure distingue les plaisirs stables (katastématiques — ataraxie) et les plaisirs mobiles (en mouvement). Mill distingue plaisirs inférieurs (corporels) et supérieurs (intellectuels).",
  auteur: "Épicure / Mill / Aristote",
  notions: ["bonheur"],
  relations: [
    {type: "distinction", desc: "Plaisir (fugace) ≠ bonheur (durable)"},
    {type: "distinction", desc: "Plaisirs inférieurs ≠ plaisirs supérieurs (Mill)"},
  ],
});

CONCEPT({
  id: "refoulement",
  term: "Refoulement",
  cat: "Psychanalyse",
  def: "Freud : mécanisme par lequel le Moi repousse dans l'inconscient les représentations liées à des pulsions inacceptables. Le refoulé n'est pas détruit — il agit en retour sous forme de symptômes, rêves, actes manqués. Fondement de la névrose.",
  auteur: "Freud",
  notions: ["inconscient", "conscience", "liberte"],
  relations: [
    {type: "distinction", desc: "Refoulement ≠ simple oubli (le refoulé persiste et agit)"},
    {type: "distinction", desc: "Refoulement ≠ répression consciente"},
  ],
});

CONCEPT({
  id: "pulsion",
  term: "Pulsion",
  cat: "Psychanalyse",
  def: "Freud : force représentant une exigence de travail pour le psychisme, à la frontière du corporel et du psychique. Pulsions de vie (Éros) vs pulsions de mort (Thanatos). La pulsion est une poussée constante — ≠ instinct (réponse fixe à un stimulus).",
  auteur: "Freud",
  notions: ["inconscient", "nature"],
  relations: [
    {type: "distinction", desc: "Pulsion (psychique) ≠ instinct (biologique fixe)"},
    {type: "distinction", desc: "Éros (vie) ≠ Thanatos (mort, destruction)"},
  ],
});

CONCEPT({
  id: "catharsis",
  term: "Catharsis",
  cat: "Esthétique antique",
  def: "Aristote (<em>Poétique</em>) : la tragédie opère une purification des émotions (pitié et crainte) par leur représentation dramatique. Le spectateur ressent et décharge ses passions de manière sécurisée. Controversée : s'agit-il de purgation ou de purification morale ?",
  auteur: "Aristote",
  notions: ["art", "bonheur"],
  relations: [
    {type: "distinction", desc: "Catharsis (Aristote) ≠ mimésis dangereuse (Platon)"},
    {type: "distinction", desc: "Art thérapeutique ≠ art purement esthétique"},
  ],
});

CONCEPT({
  id: "mimesis",
  term: "Mimésis",
  cat: "Esthétique antique",
  def: "Imitation ou représentation du réel dans les arts. Platon (<em>République</em>) : la mimésis est une copie de copie — l'artiste imite un objet sensible qui lui-même imite une Idée. L'art est au troisième degré de la vérité et peut tromper. Aristote réhabilite la mimésis : elle est un apprentissage du réel.",
  auteur: "Platon / Aristote",
  notions: ["art"],
  relations: [
    {type: "distinction", desc: "Mimésis condamnée (Platon) ≠ mimésis réhabilitée (Aristote)"},
    {type: "distinction", desc: "Art comme copie ≠ art comme création"},
  ],
});

CONCEPT({
  id: "sublime",
  term: "Sublime",
  cat: "Esthétique",
  def: "Kant (<em>Critique de la faculté de juger</em>) : sentiment produit par ce qui dépasse notre faculté de représentation — la nature immense ou terrifiante. Différent du beau (harmonieux, fini). Le sublime mathématique (infini) et le sublime dynamique (puissance). Notre raison triomphe de l'écrasement.",
  auteur: "Kant / Burke / Longin",
  notions: ["art", "nature"],
  relations: [
    {type: "distinction", desc: "Sublime ≠ beau (dépasse la forme, effraie)"},
    {type: "distinction", desc: "Sublime naturel ≠ sublime artistique"},
  ],
});

CONCEPT({
  id: "volonte-puissance",
  term: "Volonté de puissance",
  cat: "Philosophie nietzschéenne",
  def: "Nietzsche : principe fondamental de la vie — non pas désir de dominer autrui mais force expansive, créatrice, qui cherche à se dépasser elle-même. Le surhomme (<em>Übermensch</em>) est celui qui assume sa volonté de puissance et crée de nouvelles valeurs après la mort de Dieu.",
  auteur: "Nietzsche",
  notions: ["liberte", "travail", "art"],
  relations: [
    {type: "distinction", desc: "Volonté de puissance (créer) ≠ volonté de domination"},
    {type: "distinction", desc: "Volonté de puissance ≠ ressentiment (morale des esclaves)"},
  ],
});

CONCEPT({
  id: "paradigme",
  term: "Paradigme",
  cat: "Épistémologie",
  def: "Kuhn (<em>La Structure des révolutions scientifiques</em>, 1962) : ensemble de présupposés, méthodes et exemples partagés par une communauté scientifique. La science normale travaille dans un paradigme. Une révolution scientifique est un changement de paradigme (ex : Copernic, Darwin, Einstein).",
  auteur: "Kuhn",
  notions: ["raison"],
  relations: [
    {type: "distinction", desc: "Paradigme dominant ≠ science alternative"},
    {type: "distinction", desc: "Science normale ≠ révolution scientifique"},
  ],
});

CONCEPT({
  id: "contrat-nature",
  term: "Contrat naturel",
  cat: "Philosophie de l'environnement",
  def: "Serres (<em>Le Contrat naturel</em>, 1990) : face au parasitisme humain sur la nature, étendre le contrat social à la nature. Le droit de symbiose remplace le droit de maîtrise : chacun doit à l'autre. La nature devient partenaire du contrat, non objet de domination.",
  auteur: "Serres",
  notions: ["nature", "etat", "devoir"],
  relations: [
    {type: "distinction", desc: "Contrat naturel ≠ contrat social classique (entre humains)"},
    {type: "distinction", desc: "Symbiose ≠ parasitisme"},
  ],
});

CONCEPT({
  id: "principe-responsabilite",
  term: "Principe responsabilité",
  cat: "Éthique",
  def: "Jonas (<em>Le Principe responsabilité</em>, 1979) : \"Agis de façon que les effets de ton action soient compatibles avec la permanence d'une vie authentiquement humaine sur Terre.\" La responsabilité s'étend aux générations futures et à la biosphère. L'heuristique de la peur : anticiper la catastrophe pour guider l'action.",
  auteur: "Jonas",
  notions: ["devoir", "nature", "technique"],
  relations: [
    {type: "distinction", desc: "Responsabilité future ≠ responsabilité rétrospective"},
    {type: "distinction", desc: "Précaution ≠ immobilisme"},
  ],
});

CONCEPT({
  id: "divertissement",
  term: "Divertissement",
  cat: "Anthropologie philosophique",
  def: "Pascal (<em>Pensées</em>) : l'homme fuit la pensée de sa condition (misère, finitude, mort) en se jetant dans l'action et le divertissement. Le roi chasseur préfère la chasse à la possession du lièvre. Le divertissement est l'anesthésie de l'angoisse existentielle.",
  auteur: "Pascal",
  notions: ["bonheur", "travail", "temps"],
  relations: [
    {type: "distinction", desc: "Divertissement ≠ repos (il est une fuite, non une pause)"},
    {type: "distinction", desc: "Occuper son esprit ≠ être heureux"},
  ],
});

CONCEPT({
  id: "heuristique-peur",
  term: "Heuristique de la peur",
  cat: "Éthique",
  def: "Jonas : face à l'incertitude des effets de la technique, donner la priorité aux prophéties de malheur sur celles de bonheur. Mieux vaut se tromper par excès de prudence que par optimisme. Principe de précaution étendu à la biosphère et aux générations futures.",
  auteur: "Jonas",
  notions: ["devoir", "technique", "nature"],
  relations: [
    {type: "distinction", desc: "Peur comme boussole ≠ peur comme paralysie"},
    {type: "distinction", desc: "Précaution ≠ refus du progrès"},
  ],
});

CONCEPT({
  id: "culture-technique",
  term: "Culture technique",
  cat: "Philosophie de la technique",
  def: "Simondon : dépasser la technophobie et l'enthousiasme naïf par la connaissance réelle du fonctionnement des machines. L'aliénation vient de la méconnaissance — comprendre les objets techniques, c'est les coordonner comme un chef d'orchestre. La culture doit intégrer la réalité humaine contenue dans les machines.",
  auteur: "Simondon",
  notions: ["technique", "travail", "art"],
  relations: [
    {type: "distinction", desc: "Technophobie (ignorance) ≠ technolatrie (enthousiasme aveugle)"},
    {type: "distinction", desc: "Culture technique ≠ simple utilisation"},
  ],
});

CONCEPT({
  id: "tabula-rasa",
  term: "Tabula rasa",
  cat: "Épistémologie empiriste",
  def: "Locke : l'esprit humain est à la naissance une \"table rase\" — il n'y a pas d'idées innées. Toute connaissance vient de l'expérience sensible. S'oppose à Descartes (idées innées) et à Leibniz (monades). Fondement de l'empirisme.",
  auteur: "Locke",
  notions: ["raison", "conscience"],
  relations: [
    {type: "distinction", desc: "Tabula rasa (tout vient de l'expérience) ≠ idées innées (Descartes, Platon)"},
  ],
});

CONCEPT({
  id: "duree",
  term: "Durée",
  cat: "Philosophie du temps",
  def: "Bergson : le temps vécu intérieurement, flux continu et qualitatif — ≠ temps de la physique (homogène, spatialisé, quantifiable). La conscience est durée : ses états se fondent les uns dans les autres. L'introspection révèle cette durée irréductible au chronomètre.",
  auteur: "Bergson",
  notions: ["temps", "conscience"],
  relations: [
    {type: "distinction", desc: "Durée (qualitatif, vécu) ≠ temps physique (quantitatif, mesurable)"},
    {type: "distinction", desc: "Durée ≠ instant"},
  ],
});

CONCEPT({
  id: "eternel-retour",
  term: "Éternel retour",
  cat: "Philosophie du temps",
  def: "Nietzsche (<em>Le Gai savoir</em>, §341, « Le plus grand poids ») : et si un démon t'annonçait que tu devras revivre ta vie une infinité de fois, à l'identique, jusqu'au moindre détail ? L'éternel retour n'est pas d'abord une thèse cosmologique mais une <strong>épreuve existentielle</strong> : aimes-tu assez ta vie pour en vouloir l'éternel recommencement ? Y répondre « oui », c'est l'<em>amor fati</em> — aimer son destin. Le temps cyclique de l'affirmation s'oppose au temps linéaire (création → salut) qui dévalue l'ici-bas au profit d'un arrière-monde.",
  auteur: "Nietzsche",
  relations: [
    {
      to: "volonte-puissance",
      type: "prolonge",
      desc: "L'éternel retour est l'épreuve suprême de la volonté de puissance : vouloir le retour de chaque instant, c'est créer de la valeur par pure affirmation, sans recours à un arrière-monde.",
    },
    {
      type: "distinction",
      desc: "Éternel retour (temps cyclique, affirmation de la vie) ≠ temps linéaire chrétien (création, jugement, salut).",
    },
    {
      term: "amor fati",
      type: "implique",
      desc: "L'éternel retour ne se supporte que comme amor fati : aimer son destin au point d'en vouloir la répétition infinie.",
    },
  ],
  notions: ["temps", "liberte", "bonheur"],
  new: true,
});

CONCEPT({
  id: "acceleration-resonance",
  term: "Accélération / Résonance",
  cat: "Philosophie du temps",
  def: "Hartmut Rosa : la <strong>modernité tardive</strong> est marquée par une <strong>accélération</strong> à trois niveaux — technique (transports, communication), du <em>changement social</em> (métiers, institutions, modes se renouvellent toujours plus vite) et du <em>rythme de vie</em> (on en fait toujours plus par unité de temps, alors même que la technique promettait d'en faire gagner : c'est le paradoxe). Cette fuite en avant engendre une nouvelle <strong>aliénation</strong> : un rapport muet et distant au monde. La <strong>résonance</strong> est le remède proposé — un rapport vibrant et réciproque (à une œuvre, à la nature, à autrui) où le monde nous « répond » au lieu de rester inerte.",
  auteur: "Hartmut Rosa",
  relations: [
    {
      type: "distinction",
      desc: "Accélération (rapport muet, aliéné, au monde) ≠ résonance (rapport vibrant et réciproque où le monde « répond »).",
    },
    {
      to: "alienation",
      type: "prolonge",
      desc: "Rosa déplace l'aliénation marxiste : ce n'est plus seulement le travail qui aliène, mais l'accélération généralisée, qui rend le monde étranger.",
    },
    {
      to: "duree",
      type: "complete",
      desc: "Là où Bergson oppose la durée vécue au temps mesuré, Rosa montre comment l'accélération sociale écrase la possibilité même d'une durée pleine et résonante.",
    },
  ],
  notions: ["temps", "travail", "bonheur"],
  new: true,
});

CONCEPT({
  id: "etre-vers-mort",
  term: "Être-vers-la-mort",
  cat: "Phénoménologie existentiale",
  def: "Heidegger : la mort est la possibilité la plus propre, inconditionnelle et certaine du Dasein (être-là). L'angoisse face à la mort révèle l'authenticité — elle arrache à la \"déchéance\" dans le \"on\" (das Man). Assumer sa finitude, c'est exister authentiquement.",
  auteur: "Heidegger",
  notions: ["temps", "conscience", "liberte"],
  relations: [
    {type: "distinction", desc: "Authenticité (assumer la mort) ≠ déchéance (fuir dans le \"on\")"},
    {type: "distinction", desc: "Être-vers-la-mort ≠ désir de mourir"},
  ],
});

CONCEPT({
  id: "fonds-disponible",
  term: "Fonds disponible",
  cat: "Philosophie de la technique",
  def: "Heidegger (<em>La Question de la technique</em>, 1954) : la technique moderne dévoile le réel comme un stock d'énergie exploitable (Bestand). Le Rhin devient \"centrale électrique\", non fleuve majestueux. Ce mode de dévoilement menace d'effacer tous les autres.",
  auteur: "Heidegger",
  notions: ["technique", "nature", "art"],
  relations: [
    {type: "distinction", desc: "Dévoilement technique (fonds) ≠ dévoilement artistique (poiêsis)"},
    {type: "distinction", desc: "Technique moderne ≠ technique artisanale"},
  ],
});

CONCEPT({
  id: "honte-prométhéenne",
  term: "Honte prométhéenne",
  cat: "Philosophie de la technique",
  def: "Anders : l'homme éprouve de la honte face à ses propres machines — sa fragilité biologique est humiliante comparée à leurs performances. Nous sommes devenus \"antiqués\" par rapport à nos productions. Conséquence : l'homme risque de se modéliser sur ses machines.",
  auteur: "Anders",
  notions: ["technique", "travail", "nature"],
  relations: [
    {type: "distinction", desc: "Honte prométhéenne → aliénation inverse (la machine domine le créateur)"},
    {type: "distinction", desc: "Anders ≠ Simondon (peur des machines ≠ culture technique)"},
  ],
});

CONCEPT({
  id: "desobeissance-civile",
  term: "Désobéissance civile",
  cat: "Philosophie politique",
  def: "Thoreau (<em>La Désobéissance civile</em>, 1849) : refus public, non-violent et assumé d'une loi injuste. Légitime lorsque la loi viole la conscience morale. Rawls la formalise : acte non-violent, public, adressé au sens de la justice de la majorité.",
  auteur: "Thoreau / Rawls / Gandhi",
  notions: ["justice", "etat", "devoir"],
  relations: [
    {type: "distinction", desc: "Désobéissance civile ≠ révolution armée"},
    {type: "distinction", desc: "Résistance individuelle ≠ résistance collective"},
  ],
});

CONCEPT({
  id: "identite-narrative",
  term: "Identité narrative",
  cat: "Herméneutique",
  def: "Ricœur : l'identité personnelle n'est ni substance fixe (idem) ni flux incohérent (Hume), mais <strong>ipse</strong> — identité narrative. C'est en racontant notre vie que nous nous constituons comme sujet. Les récits culturels que nous appliquons à notre vie font notre identité.",
  auteur: "Ricœur",
  notions: ["conscience", "temps", "langage"],
  relations: [
    {type: "distinction", desc: "Identité narrative (ipse) ≠ identité substantielle (idem)"},
    {type: "distinction", desc: "Narration de soi ≠ fiction de soi"},
  ],
});

CONCEPT({
  id: "jugement-reflexissant",
  term: "Jugement de goût",
  cat: "Esthétique kantienne",
  def: "Kant (<em>Critique de la faculté de juger</em>) : le jugement esthétique (\"c'est beau\") prétend à l'universalité sans se fonder sur un concept. Il est désintéressé (≠ agréable), libre (≠ parfait) et communicable. On postule l'accord universel sans pouvoir le prouver.",
  auteur: "Kant",
  notions: ["art", "bonheur"],
  relations: [
    {
      type: "distinction",
      desc: "Jugement de goût (universalité sans concept) ≠ jugement de connaissance (concept déterminant)",
    },
    {type: "distinction", desc: "Beau ≠ agréable (subjectif) ≠ parfait (conceptuel)"},
  ],
});

CONCEPT({
  id: "travail-hegel",
  term: "Travail et reconnaissance",
  cat: "Phénoménologie",
  def: "Hegel : l'esclave se libère par le travail. En transformant la matière, il s'y reconnaît et forme sa conscience de soi. Le maître, dépendant de l'esclave pour ses besoins, perd sa liberté. Le travail est le chemin de l'émancipation par la résistance de la matière.",
  auteur: "Hegel",
  notions: ["travail", "liberte", "conscience"],
  relations: [
    {type: "distinction", desc: "Travail de l'esclave → émancipation paradoxale"},
    {type: "distinction", desc: "Travail libre (expression de soi) ≠ travail forcé (aliénation)"},
  ],
});

CONCEPT({
  id: "foi",
  term: "Foi",
  cat: "Religion",
  def: "Du latin <em>fides</em>, « confiance ». <strong>Adhésion totale</strong> à des vérités tenues pour révélées, qui restent en partie un mystère pour la raison. Pour Descartes, la foi n'est pas un acte de l'intelligence mais un acte de la <strong>volonté</strong> ; pour Pascal, c'est le « cœur » qui croit, non la raison ; pour Kierkegaard, la foi est un <em>saut</em> dans l'angoisse, en l'absence de toute certitude rationnelle. Loin d'être une croyance naïve, elle peut se vivre dans l'angoisse et l'incertitude.",
  auteur: "Pascal / Descartes / Kierkegaard",
  notions: ["religion", "verite", "raison"],
  relations: [
    {type: "distinction", desc: "Foi (volonté, cœur) ≠ savoir (raison, démonstration)"},
    {type: "distinction", desc: "Foi tranquille ≠ saut dans l'angoisse (Kierkegaard)"},
    {type: "distinction", desc: "Foi ≠ croyance naïve (engage tout l'individu)"},
  ],
});

CONCEPT({
  id: "sacre",
  term: "Sacré",
  cat: "Religion / Sociologie",
  def: "Du latin <em>sacer</em>, « séparé, mis à part ». Catégorie qui qualifie ce qui relève d'un ordre supérieur — objets, êtres, lieux ou moments concentrant la signification du réel. Durkheim : la « forme élémentaire de la vie religieuse » est l'opposition <strong>sacré / profane</strong>. Le sacré est ambivalent : à la fois bénédiction et interdit, fascinant et terrible. Subsiste dans les sociétés laïcisées (drapeau, mémoriaux, fêtes nationales — sacré civique).",
  auteur: "Durkheim / Eliade",
  notions: ["religion", "etat", "art"],
  relations: [
    {type: "distinction", desc: "Sacré ≠ profane (Durkheim)"},
    {
      type: "distinction",
      desc: "Sacré comme réalité surnaturelle (croyant) ≠ projection collective (Durkheim)",
    },
    {type: "distinction", desc: "Sacré religieux ≠ sacré civique (laïcité)"},
  ],
});

CONCEPT({
  id: "profane",
  term: "Profane",
  cat: "Religion / Sociologie",
  def: "Du latin <em>pro-fanum</em>, « devant le temple, hors du temple ». Désigne la <strong>réalité ordinaire</strong>, insignifiante, qui ne se définit que par opposition au sacré. Durkheim : le profane est le quotidien banal, le sacré est ce qui le transcende. Toute religion établit cette frontière. Une société entièrement profane (sans aucun sacré) est sociologiquement peu probable — il y a toujours des résidus de sacralité.",
  auteur: "Durkheim",
  notions: ["religion", "etat"],
  relations: [
    {type: "distinction", desc: "Profane (ordinaire) ≠ sacré (extraordinaire)"},
    {type: "distinction", desc: "Profane ≠ profanation (transgression du sacré)"},
    {type: "distinction", desc: "Sécularisation ≠ disparition complète du sacré"},
  ],
});

CONCEPT({
  id: "transcendance",
  term: "Transcendance",
  cat: "Métaphysique / Religion",
  def: "Du latin <em>transcendere</em>, « passer au-delà ». Désigne ce qui <strong>dépasse l'ordre naturel ou sensible</strong> — Dieu pour les religions monothéistes, le « tout autre » de l'expérience du sacré. S'oppose à l'<em>immanence</em> (ce qui reste dans le monde). Augustin : l'expérience du sacré met l'homme face à un « tout autre, à la fois terrible et fascinant ». Spinoza renverse : Dieu = la Nature (<em>Deus sive Natura</em>) — il n'y a que de l'immanence absolue.",
  auteur: "Augustin / Spinoza / Kant",
  notions: ["religion", "conscience", "liberte"],
  relations: [
    {
      type: "distinction",
      desc: "Transcendance (Dieu au-delà du monde) ≠ immanence (Dieu dans le monde — Spinoza)",
    },
    {type: "distinction", desc: "Expérience de la finitude → ouverture à la transcendance"},
    {
      type: "distinction",
      desc: "Transcendance religieuse ≠ transcendantal kantien (conditions de l'expérience)",
    },
  ],
});

CONCEPT({
  id: "revelation",
  term: "Révélation",
  cat: "Religion",
  def: "Du latin <em>revelare</em>, « dévoiler, ôter le voile ». Communication directe d'une vérité divine aux hommes — par un prophète, une écriture sainte ou une expérience mystique. La <strong>religion révélée</strong> (judaïsme, christianisme, islam) repose sur une révélation historique. S'oppose à la <strong>religion naturelle</strong> (Lumières) qui prétend atteindre Dieu par la seule raison. Les vérités révélées (Trinité, Incarnation) excèdent la raison sans la contredire (Thomas d'Aquin).",
  auteur: "Thomas d'Aquin / Pascal",
  notions: ["religion", "verite", "raison"],
  relations: [
    {type: "distinction", desc: "Vérités révélées ≠ vérités démontrées (raison)"},
    {type: "distinction", desc: "Religion révélée ≠ religion naturelle (Lumières)"},
    {type: "distinction", desc: "Foi en la révélation ≠ déisme rationnel"},
  ],
});

CONCEPT({
  id: "anamnese",
  term: "Réminiscence",
  cat: "Épistémologie platonicienne",
  def: "Du grec <em>anamnêsis</em>, « ressouvenir ». Théorie platonicienne (<em>Ménon</em>, <em>Phédon</em>) : connaître, c'est <strong>re-connaître</strong> ce que l'âme a contemplé avant la naissance et qu'elle a oublié. Réponse au <strong>paradoxe sophistique de l'apprentissage</strong> : si l'on sait, il n'y a pas à chercher ; si l'on ignore, on ne saurait ce qu'on cherche. Démonstration : Socrate fait découvrir un théorème à un jeune esclave par les seules questions. Réinsère ignorance et connaissance dans un processus continu d'apprentissage.",
  auteur: "Platon",
  notions: ["verite", "conscience", "raison"],
  relations: [
    {type: "distinction", desc: "Réminiscence (savoir intérieur) ≠ tabula rasa (Locke — savoir extérieur)"},
    {type: "distinction", desc: "Connaissance comme découverte ≠ connaissance comme retrouvaille"},
    {type: "distinction", desc: "Apprendre ≠ recevoir un savoir extérieur"},
  ],
});

CONCEPT({
  id: "episteme",
  term: "Épistémé",
  cat: "Épistémologie antique",
  def: "Terme grec désignant la <strong>connaissance scientifique vraie</strong> — universelle, nécessaire, théorique. Pour les Grecs, l'<em>épistémé</em> s'oppose à la <em>doxa</em> (opinion, croyance non justifiée). C'est la « science suprême » que vise la philosophie. Foucault donnera au terme un sens élargi : l'<em>épistémé</em> d'une époque est l'ensemble des structures inconscientes qui rendent possible un savoir donné.",
  auteur: "Platon / Aristote / Foucault",
  notions: ["raison", "verite"],
  relations: [
    {type: "distinction", desc: "Épistémé (savoir vrai universel) ≠ doxa (opinion contingente)"},
    {type: "distinction", desc: "Épistémé (théorique) ≠ technê (savoir-faire pratique)"},
    {type: "distinction", desc: "Épistémé d'une époque (Foucault) ≠ idée intemporelle de la science"},
  ],
});

CONCEPT({
  id: "doxa",
  term: "Doxa",
  cat: "Épistémologie antique",
  def: "Terme grec : <strong>opinion</strong>, croyance non justifiée. S'oppose à l'<em>épistémé</em> (savoir vrai). La <em>doxa</em> peut être vraie par hasard, mais elle n'est pas un savoir car elle n'est pas justifiée par la raison (<em>logos</em>). Bachelard radicalise : « L'opinion pense mal ; elle ne pense pas : elle traduit des besoins en connaissances. » L'opinion est un obstacle épistémologique à détruire pour fonder la science.",
  auteur: "Platon / Bachelard",
  notions: ["verite", "raison"],
  relations: [
    {type: "distinction", desc: "Doxa (opinion) ≠ épistémé (savoir)"},
    {type: "distinction", desc: "Doxa = obstacle (Bachelard) ≠ point de départ (sens commun)"},
    {type: "distinction", desc: "Opinion vraie par hasard ≠ savoir justifié"},
  ],
});

CONCEPT({
  id: "rupture-epistemologique",
  term: "Rupture épistémologique",
  cat: "Épistémologie",
  def: "Bachelard : passage <strong>discontinu</strong> d'un mode de connaissance à un autre — par exemple de la chimie pré-lavoisienne (théorie du phlogistique) à la chimie moderne (théorie de l'oxygène). La science ne progresse pas par accumulation continue mais par <em>ruptures</em>. Anticipe Kuhn et ses <em>révolutions paradigmatiques</em>. Implique que la vérité scientifique n'est pas le prolongement raffiné du sens commun.",
  auteur: "Bachelard / Kuhn",
  notions: ["raison", "verite"],
  relations: [
    {type: "distinction", desc: "Rupture (discontinuité) ≠ continuité accumulative (positivisme)"},
    {type: "distinction", desc: "Science ≠ sens commun raffiné"},
    {type: "distinction", desc: "Ruptures locales (Bachelard) ≠ révolutions globales (Kuhn)"},
  ],
});

CONCEPT({
  id: "noma",
  term: "NOMA",
  cat: "Philosophie des sciences",
  def: "Stephen Jay Gould (<em>Et Dieu dit : « Que Darwin soit ! »</em>, 1999) : <em>Non-Overlapping Magisteria</em>. Science et religion sont deux <strong>magistères distincts qui ne se recouvrent pas</strong> : la science traite du <em>comment</em> (faits, mécanismes, lois empiriques) ; la religion traite du <em>pourquoi</em> (sens, valeurs, finalité ultime). Pas de conflit possible si chacun reste dans son domaine. Les conflits (créationnisme, scientisme) résultent de <em>transgressions de frontières</em>.",
  auteur: "Stephen Jay Gould",
  notions: ["religion", "verite", "raison"],
  liens: {
    religion: "Pour la notion Religion, NOMA est la thèse contemporaine de référence sur la coexistence : la religion garde un domaine propre (le sens, les valeurs) que la science n'a pas vocation à occuper. Elle s'oppose donc à la réduction de la religion à une illusion à éliminer.",
    science: "Pour la notion Science, NOMA fixe une limite à l'ambition explicative : la science répond au « comment », pas au « pourquoi » ultime. Refuser cette limite, c'est verser dans le scientisme (faire de la science la seule source de sens).",
  },
  relations: [
    {
      to: "illusion",
      type: "oppose",
      desc: "Gould refuse la réduction freudienne de la religion à une illusion : ce serait laisser la science déborder sur le magistère du sens, donc transgresser les frontières.",
    },
    {
      to: "verites-coeur",
      type: "prolonge",
      desc: "Les trois ordres de Pascal (corps / esprits / charité) anticipent la séparation des magistères : vouloir prouver Dieu comme un théorème, c'est se tromper d'ordre.",
    },
    {type: "distinction", desc: "NOMA (séparation) ≠ concordisme (recherche d'accords)"},
    {type: "distinction", desc: "NOMA (deux magistères) ≠ scientisme (un seul magistère = la science)"},
    {type: "distinction", desc: "Comment (science) ≠ pourquoi (religion)"},
  ],
  modified: true,
});

CONCEPT({
  id: "aletheia",
  term: "Alètheia",
  cat: "Philosophie de la vérité",
  def: "Terme grec souvent traduit par « vérité ». Étymologie : <em>a-lèthe</em>, « non-oubli, non-occultation ». Heidegger insiste sur ce sens originaire : la vérité comme <strong>dévoilement</strong> (<em>Unverborgenheit</em>) — l'être qui sort de la cachette pour se montrer. Plus ancien et plus fondamental que la vérité-adéquation (jugement/réalité). La science empirique opère une vérité <em>dérivée</em> qui présuppose une vérité originaire (alètheia) qu'elle ne thématise pas (« la science ne pense pas »).",
  auteur: "Heidegger",
  notions: ["verite", "langage"],
  relations: [
    {type: "distinction", desc: "Alètheia (dévoilement) ≠ vérité-adéquation (correspondance)"},
    {type: "distinction", desc: "Vérité comme événement ≠ vérité comme propriété d'un jugement"},
    {type: "distinction", desc: "Pensée philosophique ≠ savoir scientifique"},
  ],
});

CONCEPT({
  id: "aliénation-religieuse",
  term: "Aliénation religieuse",
  cat: "Critique de la religion",
  def: "Feuerbach (<em>L'Essence du christianisme</em>, 1842) : Dieu n'est rien d'autre que la <strong>projection</strong> hors de soi des aspirations humaines (puissance, sagesse, amour) que l'expérience de notre finitude borne. L'homme s'aliène en Dieu parce qu'en lui il se réalise dans un <em>autre imaginaire</em>. Marx prolonge : il faut analyser les conditions sociales (oppression, frustration) qui produisent cette projection. Critiquer la religion sans transformer la société = inutile.",
  auteur: "Feuerbach / Marx",
  notions: ["religion", "liberte", "conscience"],
  liens: {
    religion: "Pour la notion Religion, c'est la matrice de toute la critique moderne : la religion n'est pas jugée vraie ou fausse, elle est expliquée comme projection d'un manque humain. Feuerbach ouvre la voie à Marx (critique sociale) et à Freud (illusion du désir).",
  },
  modified: true,
  relations: [
    {type: "distinction", desc: "Aliénation religieuse (projection) ≠ révélation (Dieu comme réalité)"},
    {type: "distinction", desc: "Critique anthropologique (Feuerbach) ≠ critique sociale (Marx)"},
    {type: "distinction", desc: "Religion comme aliénation ≠ religion comme expérience authentique"},
  ],
});

CONCEPT({
  id: "religion-naturelle",
  term: "Religion naturelle",
  cat: "Religion",
  def: "Concept des Lumières du XVIIIe siècle : religion qui s'oppose à la fois aux religions <em>positives</em> (instituées) et aux religions <em>révélées</em>. Prône un rapport immédiat à Dieu sans intermédiaire ecclésiastique. Repère la divinité dans les <strong>lois de la nature</strong> (« le grand livre du monde ») plutôt que dans la Bible. <strong>Naturelle = aussi rationnelle</strong> (Kant, <em>La Religion dans les limites de la simple raison</em>, 1793). Voisin du <em>déisme</em>.",
  auteur: "Kant / Voltaire",
  notions: ["religion", "raison", "nature"],
  relations: [
    {type: "distinction", desc: "Religion naturelle ≠ religion révélée (Bible)"},
    {type: "distinction", desc: "Religion naturelle ≠ religion positive (instituée)"},
    {type: "distinction", desc: "Naturelle (rationnelle) ≠ surnaturelle (miracles)"},
  ],
});

CONCEPT({
  id: "religion-civile",
  term: "Religion civile",
  cat: "Philosophie politique / Religion",
  def: "Rousseau (<em>Du contrat social</em>, IV, 8) : religion instituée par le souverain dans l'État républicain pour conférer un caractère sacré aux institutions de convention. Comporte un petit nombre de <strong>dogmes positifs</strong> : croyance en une divinité bienveillante, châtiment pour les méchants, justice pour les meilleurs. <em>Tolère tous les cultes... sauf l'intolérance.</em> Modèle pour la laïcité républicaine et le sacré civique.",
  auteur: "Rousseau",
  notions: ["religion", "etat", "liberte"],
  relations: [
    {type: "distinction", desc: "Religion civile (instituée par l'État) ≠ religion révélée"},
    {type: "distinction", desc: "Tolérance générale ≠ tolérance de l'intolérance"},
    {type: "distinction", desc: "Sacré religieux ≠ sacré civique"},
  ],
});

CONCEPT({
  id: "theologie",
  term: "Théologie",
  cat: "Religion",
  def: "Du grec <em>theos</em> (Dieu) + <em>logos</em> (discours). <strong>Discours rationnel sur Dieu</strong> et les choses divines, à partir des données de la révélation. Thomas d'Aquin la place au sommet des savoirs : la philosophie est sa <em>servante</em> (<em>ancilla theologiae</em>). Se distingue de la <em>religion</em> (pratique, foi vécue) et de la <em>philosophie de la religion</em> (qui n'engage pas la foi). Feuerbach renverse : « la théologie est anthropologie ».",
  auteur: "Thomas d'Aquin / Feuerbach",
  notions: ["religion", "raison"],
  relations: [
    {type: "distinction", desc: "Théologie (discours rationnel) ≠ religion (pratique, foi vécue)"},
    {
      type: "distinction",
      desc: "Philosophia ancilla theologiae (Thomas) ≠ autonomie de la raison (Descartes)",
    },
    {type: "distinction", desc: "Théologie ≠ anthropologie (renversement de Feuerbach)"},
  ],
});

CONCEPT({
  id: "positivisme",
  term: "Positivisme",
  cat: "Philosophie des sciences",
  def: "Doctrine d'Auguste Comte (<em>Cours de philosophie positive</em>, 1830-1842) : seules les connaissances <strong>positives</strong> (vérifiables empiriquement) ont valeur scientifique. La métaphysique et la théologie sont des stades dépassés (loi des trois états : théologique, métaphysique, positif). Étendu aux sciences humaines (sociologie comme « physique sociale »). Critiqué par Bachelard (positivisme naïf, sans rupture épistémologique) et Popper (manque de critère de démarcation par la falsifiabilité).",
  auteur: "Comte",
  notions: ["raison", "verite"],
  relations: [
    {type: "distinction", desc: "Positivisme ≠ métaphysique (rejetée)"},
    {type: "distinction", desc: "Positivisme (cumulatif) ≠ ruptures épistémologiques (Bachelard)"},
    {type: "distinction", desc: "Sciences positives ≠ herméneutique (sciences de l'esprit, Dilthey)"},
  ],
});

CONCEPT({
  id: "hermeneutique",
  term: "Herméneutique",
  cat: "Philosophie",
  def: "Du grec <em>hermêneutikê</em>, « art d'interpréter ». Théorie de l'<strong>interprétation</strong> des textes (initialement les textes sacrés). Dilthey (<em>Introduction à l'étude des sciences humaines</em>, 1883) : les sciences humaines (histoire, sociologie, philosophie) ne procèdent pas par <em>explication</em> causale (comme les sciences de la nature) mais par <strong>compréhension</strong> (<em>Verstehen</em>) — interprétation des intentions humaines. Heidegger et Ricœur étendent l'herméneutique à toute compréhension de soi et du monde.",
  auteur: "Dilthey / Heidegger / Ricœur",
  notions: ["langage", "raison", "verite", "conscience"],
  relations: [
    {
      type: "distinction",
      desc: "Comprendre (Verstehen, herméneutique) ≠ expliquer (Erklären, sciences naturelles)",
    },
    {type: "distinction", desc: "Sciences de la nature ≠ sciences de l'esprit (Dilthey)"},
    {type: "distinction", desc: "Texte ≠ intentions (interprétation toujours partielle)"},
  ],
});

CONCEPT({
  id: "verites-coeur",
  term: "Vérités du cœur",
  cat: "Philosophie pascalienne",
  def: "Pascal (<em>Pensées</em>) : il existe des <strong>vérités du cœur</strong> que la raison seule ne peut atteindre — elles sont l'objet d'une révélation, non d'une démonstration. Pascal distingue trois <em>ordres</em> irréductibles : (1) ordre des corps (matière) ; (2) ordre des esprits (pensée, démonstration) ; (3) ordre de la <strong>charité</strong> (foi, amour de Dieu). Vouloir prouver Dieu comme un théorème = se tromper d'ordre. « Le cœur a ses raisons que la raison ne connaît point. »",
  auteur: "Pascal",
  notions: ["verite", "religion", "raison", "conscience"],
  relations: [
    {type: "distinction", desc: "Vérités du cœur (révélation) ≠ vérités de la raison (démonstration)"},
    {type: "distinction", desc: "Trois ordres irréductibles : corps ≠ esprits ≠ charité"},
    {type: "distinction", desc: "Cœur ≠ sentimentalité (le cœur a ses « raisons », sa logique propre)"},
  ],
});

CONCEPT({
  id: "angoisse",
  term: "Angoisse",
  cat: "Existentialisme / Religion",
  def: "Pour Kierkegaard (<em>Le Concept d'angoisse</em>, 1844 ; <em>Crainte et Tremblement</em>, 1843) : sentiment fondamental qui révèle la <strong>liberté humaine</strong> face au possible — non peur d'un objet précis, mais vertige devant l'indétermination de l'existence. L'angoisse est <em>formatrice</em> : elle met à nu nos illusions et ouvre à la foi authentique (« le saut »). Heidegger reprend : l'angoisse révèle l'<em>être-pour-la-mort</em>, condition de l'authenticité.",
  auteur: "Kierkegaard / Heidegger / Sartre",
  notions: ["religion", "liberte", "conscience", "temps"],
  relations: [
    {type: "distinction", desc: "Angoisse ≠ peur (sans objet déterminé)"},
    {type: "distinction", desc: "Angoisse formatrice (Kierkegaard) ≠ angoisse paralysante"},
    {type: "distinction", desc: "Angoisse comme épreuve spirituelle ≠ angoisse comme pathologie"},
  ],
});

CONCEPT({
  id: "pari-pascalien",
  term: "Pari pascalien",
  cat: "Philosophie de la religion",
  def: "Pascal (<em>Pensées</em>, fragment 233) : <strong>argument pragmatique</strong> en faveur de la croyance en Dieu, face à l'incertitude rationnelle. Calcul des gains/pertes : si Dieu existe et qu'on croit → gain infini ; si Dieu n'existe pas et qu'on croit → perte minime ; si Dieu existe et qu'on ne croit pas → perte infinie. Donc rationnellement il faut parier que Dieu existe. Critique : suppose qu'on choisit ses croyances, et qu'un Dieu accepterait une foi calculée.",
  auteur: "Pascal",
  notions: ["religion", "verite", "liberte"],
  relations: [
    {type: "distinction", desc: "Pari pragmatique (Pascal) ≠ démonstration rationnelle classique"},
    {type: "distinction", desc: "Foi calculée ≠ foi authentique (Kierkegaard)"},
    {type: "distinction", desc: "Rationalité (calcul) au service de la foi"},
  ],
});

CONCEPT({
  id: "illusion",
  term: "Illusion",
  cat: "Philosophie / Psychanalyse",
  def: "À distinguer de l'erreur (qu'on peut corriger) et du mensonge (intentionnel). Une <strong>illusion</strong> est une croyance fausse motivée par un <em>désir</em>. Freud (<em>L'Avenir d'une illusion</em>, 1927) : la religion est l'illusion universelle obsessionnelle de l'humanité — non nécessairement fausse, mais motivée par le désir infantile d'un père protecteur. Marx élargit : toute idéologie peut être une illusion qui exprime et compense un manque réel.",
  auteur: "Freud / Marx / Feuerbach",
  notions: ["religion", "conscience", "inconscient"],
  liens: {
    religion: "Pour la notion Religion, l'illusion est l'angle critique : la religion ne serait pas démontrée fausse, mais expliquée par le désir (un père protecteur). C'est exactement ce que refuse NOMA, qui interdit à la science de juger le magistère religieux.",
  },
  relations: [
    {
      to: "aliénation-religieuse",
      type: "prolonge",
      desc: "Feuerbach (Dieu = projection des aspirations humaines) puis Marx fournissent le socle critique que Freud reprend et déplace vers le désir inconscient.",
    },
    {type: "distinction", desc: "Illusion (motivée par le désir) ≠ erreur (corrigible)"},
    {type: "distinction", desc: "Illusion ≠ hallucination (pathologique)"},
    {type: "distinction", desc: "Critique de l'illusion ≠ destruction de l'expérience qui la motive"},
  ],
  modified: true,
});

CONCEPT({
  id: "lumieres",
  term: "Lumières",
  cat: "Histoire de la philosophie",
  def: "Mouvement philosophique européen du XVIIIe siècle (<em>Aufklärung</em>, <em>Enlightenment</em>) qui place la <strong>raison</strong> au cœur du progrès humain. « <em>Sapere aude !</em> Aie le courage de te servir de ton propre entendement » (Kant, <em>Qu'est-ce que les Lumières ?</em>, 1784). Critique de l'autorité (religieuse, politique), promotion de la science, de la tolérance, de l'éducation universelle. Côté religieux : développe le déisme et la religion naturelle, critique des dogmes révélés.",
  auteur: "Kant / Voltaire / Diderot",
  notions: ["raison", "liberte", "religion"],
  relations: [
    {type: "distinction", desc: "Lumières (raison) ≠ tradition (autorité)"},
    {type: "distinction", desc: "Religion naturelle des Lumières ≠ religion révélée"},
    {type: "distinction", desc: "Émancipation par la raison ≠ confiance dans l'autorité"},
  ],
});

CONCEPT({
  id: "theisme-deisme",
  term: "Théisme / Déisme",
  cat: "Religion",
  def: "<strong>Théisme</strong> : croyance en un Dieu personnel, créateur et providentiel, qui intervient dans le monde et entretient une relation avec les hommes (judaïsme, christianisme, islam). <strong>Déisme</strong> : croyance en un Dieu créateur qui ne se révèle pas, n'agit pas providentiellement, accessible par la seule raison (sans révélation). Le déisme est typique des Lumières (Voltaire). S'opposent à l'<em>athéisme</em> (négation de toute divinité) et à l'<em>agnosticisme</em> (suspension du jugement).",
  auteur: "Voltaire / Rousseau",
  notions: ["religion", "raison"],
  relations: [
    {type: "distinction", desc: "Théisme (Dieu personnel) ≠ déisme (Dieu impersonnel)"},
    {type: "distinction", desc: "Théisme/déisme (avec Dieu) ≠ athéisme (sans Dieu)"},
    {type: "distinction", desc: "Déisme (raison) ≠ révélation"},
  ],
});

CONCEPT({
  id: "dogme",
  term: "Dogme",
  cat: "Religion",
  def: "Du grec <em>dogma</em>, « opinion, décision ». Vérité fondamentale d'une religion ou d'une doctrine, présentée comme <strong>indiscutable</strong> et requérant l'assentiment du fidèle (Trinité, Incarnation pour le christianisme). Par extension, toute croyance imposée sans démonstration. Les Lumières (et Kant) critiquent les dogmes au nom de l'autonomie de la raison. Mais le dogme religieux n'est pas <em>nécessairement</em> irrationnel : il marque la limite que la raison atteint sans pouvoir la franchir.",
  auteur: "Thomas d'Aquin / Kant",
  notions: ["religion", "raison", "verite"],
  relations: [
    {type: "distinction", desc: "Dogme (donné, indiscutable) ≠ thèse philosophique (argumentée)"},
    {type: "distinction", desc: "Dogme ≠ vérité scientifique (toujours révisable, Popper)"},
    {type: "distinction", desc: "Dogmatisme ≠ scepticisme"},
  ],
});

CONCEPT({
  id: "experimentation",
  term: "Expérimentation",
  cat: "Méthodologie scientifique",
  def: "Procédure méthodique consistant à <strong>provoquer un phénomène</strong> dans des conditions contrôlées pour le mesurer et tester une hypothèse. Distincte de la simple <em>observation</em> (passive) : l'expérimentation construit son objet, isole les variables, vise la reproductibilité. Pour Popper, c'est le critère opérationnel de la science : une théorie est scientifique si l'on peut concevoir une expérimentation qui pourrait la <em>réfuter</em>. Bachelard : la nature étudiée par la science est une nature « <em>technicisée</em> », jamais brute.",
  auteur: "Bacon / Popper / Bachelard",
  notions: ["raison", "verite", "technique"],
  relations: [
    {type: "distinction", desc: "Expérimentation (construite) ≠ observation (passive)"},
    {type: "distinction", desc: "Sciences expérimentales ≠ sciences formelles (déduction pure)"},
    {type: "distinction", desc: "Reproductibilité ≠ témoignage unique"},
  ],
});

CONCEPT({
  id: "epistemologie",
  term: "Épistémologie",
  cat: "Philosophie des sciences",
  def: "Du grec <em>épistémé</em> (savoir) + <em>logos</em> (discours). <strong>Théorie de la connaissance scientifique</strong> : ses fondements, sa méthode, ses limites. Pose plusieurs problèmes : (1) la <em>démarcation</em> science / non-science (Popper : falsifiabilité) ; (2) l'<em>unité</em> de la science (une méthode, plusieurs objets) ; (3) la <em>classification</em> des sciences (Comte) ; (4) la <em>genèse</em> de la connaissance (Bachelard, Kuhn). Distincte de la gnoséologie (théorie générale de la connaissance, incluant la connaissance commune).",
  auteur: "Comte / Popper / Bachelard / Kuhn",
  notions: ["raison", "verite"],
  relations: [
    {type: "distinction", desc: "Épistémologie (sciences) ≠ gnoséologie (connaissance en général)"},
    {type: "distinction", desc: "Épistémologie continue (positivisme) ≠ discontinue (Bachelard, Kuhn)"},
    {type: "distinction", desc: "Théorie de la science ≠ pratique scientifique"},
  ],
});

CONCEPT({
  id: "induction",
  term: "Induction",
  cat: "Logique / Épistémologie",
  def: "Forme de <strong>raisonnement</strong> consistant à se baser sur un ensemble d'expériences <em>particulières</em> pour aboutir à une conclusion <em>générale</em>. Exemple : « il a fait beau les jours précédents, donc il fera beau demain. » Caractéristique des sciences expérimentales. <strong>Problème de l'induction</strong> (Hume, Russell) : aucune accumulation finie d'observations ne prouve une loi universelle — la conclusion reste seulement <em>probable</em>. Popper en déduira la falsifiabilité comme critère de scientificité.",
  auteur: "Aristote / Hume / Russell / Popper",
  notions: ["raison", "verite", "science"],
  relations: [
    {type: "distinction", desc: "Induction (particulier → général) ≠ déduction (général → particulier)"},
    {type: "distinction", desc: "Vérité conjecturale (probable) ≠ démonstration nécessaire"},
    {type: "distinction", desc: "Sciences empiriques (induction) ≠ sciences formelles (déduction)"},
  ],
});

CONCEPT({
  id: "deduction",
  term: "Déduction",
  cat: "Logique",
  def: "Forme de raisonnement consistant à faire <em>découler</em> d'une théorie ou d'un principe général des conclusions particulières. Exemple : « Tous les nombres divisibles par 2 sont pairs ; 4 est divisible par 2 ; donc 4 est pair. » Caractéristique des <strong>mathématiques</strong> et de la logique formelle. La validité déductive ne garantit pas la vérité matérielle des conclusions : si les prémisses sont fausses, le raisonnement reste valide mais ne <em>démontre</em> rien (sophisme).",
  auteur: "Aristote",
  notions: ["raison", "verite"],
  relations: [
    {
      type: "distinction",
      desc: "Déduction (du général au particulier) ≠ induction (du particulier au général)",
    },
    {type: "distinction", desc: "Validité formelle ≠ vérité matérielle"},
    {type: "distinction", desc: "Démonstration ≠ raisonnement"},
  ],
});

CONCEPT({
  id: "rationnel-raisonnable",
  term: "Rationnel / Raisonnable",
  cat: "Théorie de la raison",
  def: "Distinction classique. Le <strong>rationnel</strong> renvoie au rôle de la raison dans la <em>connaissance</em> : se conformer aux principes de la logique (non-contradiction) pour produire des raisonnements valides et congruents. Le <strong>raisonnable</strong> renvoie à l'ordre de l'<em>action</em> : être conforme aux normes socio-culturelles, paraître sensé. On peut être logiquement rationnel sans être moralement raisonnable, et inversement.",
  auteur: "Kant",
  notions: ["raison", "devoir"],
  relations: [
    {type: "distinction", desc: "Rationnel (logique) ≠ raisonnable (sage)"},
    {type: "distinction", desc: "Raison théorique (connaître) ≠ raison pratique (agir)"},
    {type: "distinction", desc: "Universalité logique ≠ universalité normative"},
  ],
});

CONCEPT({
  id: "raison-instrumentale",
  term: "Raison instrumentale",
  cat: "Critique de la raison",
  def: "Raison qui calcule les <strong>moyens efficaces</strong> pour atteindre des fins sans s'interroger sur les fins elles-mêmes. Caractéristique de la modernité technique. Critiquée par <strong>Hans Jonas</strong> (<em>Le Principe responsabilité</em>) : son pouvoir d'agir excède notre capacité morale. <strong>Günther Anders</strong> (<em>L'Obsolescence de l'homme</em>) : « honte prométhéenne » — la bombe atomique excède notre imagination morale. <strong>Aimé Césaire</strong> (<em>Discours sur le colonialisme</em>) : le colonialisme comme raison instrumentale appliquée à des humains.",
  auteur: "Jonas / Anders / Césaire",
  notions: ["raison", "technique", "devoir"],
  relations: [
    {type: "distinction", desc: "Raison instrumentale (moyens) ≠ raison essentielle (fins)"},
    {type: "distinction", desc: "Efficacité technique ≠ légitimité morale"},
    {type: "distinction", desc: "Pouvoir d'agir ≠ pouvoir de prévoir et de répondre"},
  ],
});

CONCEPT({
  id: "metriopathie",
  term: "Métriopathie",
  cat: "Éthique antique",
  def: "Du grec <em>metrios</em> (mesuré) + <em>pathos</em> (affection). Pour Épicure (<em>Lettre à Ménécée</em>) : <strong>calcul rationnel des plaisirs et des peines</strong> qui permet de hiérarchiser les désirs (naturels et nécessaires > naturels non nécessaires > vains) et d'atteindre l'<em>ataraxie</em>. La raison y joue un rôle essentiel : on n'est pas heureux par accumulation de plaisirs mais par leur juste mesure. Distincte de l'<em>apatheia</em> stoïcienne (absence totale de passion) : la métriopathie modère les passions, ne les supprime pas.",
  auteur: "Épicure",
  notions: ["bonheur", "raison"],
  relations: [
    {
      type: "distinction",
      desc: "Métriopathie (mesure des passions) ≠ apatheia (suppression des passions, stoïcisme)",
    },
    {type: "distinction", desc: "Calcul rationnel ≠ ascétisme"},
    {type: "distinction", desc: "Bonheur quantitatif ≠ qualitatif"},
  ],
});

CONCEPT({
  id: "tetrapharmakon",
  term: "Tetrapharmakon",
  cat: "Éthique antique",
  def: "Du grec <em>tettara</em> (quatre) + <em>pharmakon</em> (remède). <strong>Quadruple remède</strong> épicurien contre les quatre grandes peurs qui troublent l'âme : (1) <em>les dieux ne s'occupent pas de nous</em> (donc inutile de les craindre) ; (2) <em>la mort n'est rien pour nous</em> (quand elle est, nous ne sommes plus) ; (3) <em>le plaisir est facile à obtenir</em> (par des désirs naturels et nécessaires) ; (4) <em>la douleur est facile à supporter</em> (intense = brève ; longue = supportable). La raison thérapeutique libère l'âme par <em>argumentation</em>, non par mystique.",
  auteur: "Épicure / Philodème",
  notions: ["bonheur", "raison"],
  relations: [
    {type: "distinction", desc: "Tetrapharmakon (raison guérissante) ≠ révélation religieuse"},
    {type: "distinction", desc: "Philosophie comme médecine ≠ contemplation pure"},
  ],
});

CONCEPT({
  id: "idee-rude",
  term: "Idée rude (représentation)",
  cat: "Stoïcisme",
  def: "Pour les Stoïciens (Épictète, <em>Manuel</em>) : <strong>représentation immédiate</strong> et non examinée qui s'impose à l'esprit (« cet homme m'a insulté », « la mort est un mal »). Elle saisit l'âme avant tout jugement rationnel. La raison doit <em>tester</em> cette représentation par la <em>prosochè</em> (attention) : suspendre l'assentiment, distinguer ce qui dépend de nous (notre jugement) de ce qui n'en dépend pas (les événements), corriger la représentation si elle est erronée. Exercice rationnel constant qui rend le sage invulnérable au trouble.",
  auteur: "Épictète",
  notions: ["raison", "bonheur", "conscience"],
  relations: [
    {type: "distinction", desc: "Idée rude (immédiate) ≠ idée examinée (raison)"},
    {type: "distinction", desc: "Assentiment immédiat ≠ assentiment réfléchi"},
    {type: "distinction", desc: "Stoïcisme (correction par la raison) ≠ scepticisme (suspension permanente)"},
  ],
});

CONCEPT({
  id: "principe-non-contradiction",
  term: "Principe de non-contradiction",
  cat: "Logique",
  def: "Principe fondamental de la logique (Aristote, <em>Métaphysique</em>, livre Γ) : <strong>il est impossible que le même attribut appartienne et n'appartienne pas en même temps au même sujet et sous le même rapport</strong>. Formalisé : ¬(A ∧ ¬A). Principe « le plus ferme de toute démonstration » selon Aristote — celui qu'on ne peut pas refuser sans le présupposer (qui dit « il y a contradiction » s'appuie sur lui). Critère de la <em>vérité-cohérence</em> : une théorie est vraie si elle n'est pas contradictoire.",
  auteur: "Aristote",
  notions: ["raison", "verite"],
  relations: [
    {
      type: "distinction",
      desc: "Non-contradiction (logique classique) ≠ logiques paraconsistantes (admettant des contradictions)",
    },
    {
      type: "distinction",
      desc: "Principe formel ≠ contradiction dialectique (Hegel : la contradiction motrice du devenir)",
    },
  ],
});

CONCEPT({
  id: "pragmatisme",
  term: "Pragmatisme",
  cat: "Philosophie",
  def: "Du grec <em>pragma</em> (action). Courant philosophique américain (Peirce, James, Dewey) fin XIXe – début XXe siècle. Thèse centrale : la valeur d'une idée se mesure à ses <strong>conséquences pratiques</strong>, non à sa correspondance abstraite avec un réel. Une idée est vraie en tant qu'elle « marche », qu'elle est utile et féconde. Le pragmatisme refuse les questions métaphysiques que la pratique ne peut trancher. <em>Maxime pragmatique</em> (Peirce) : « Pour clarifier une idée, considérer ses effets pratiques. »",
  auteur: "Peirce / James / Dewey",
  notions: ["verite", "science", "raison"],
  relations: [
    {type: "distinction", desc: "Pragmatisme (vérité-utilité) ≠ correspondance (vérité-adéquation)"},
    {type: "distinction", desc: "Conséquences pratiques ≠ vérité abstraite"},
    {type: "distinction", desc: "Refus de la métaphysique stérile ≠ relativisme"},
  ],
});

CONCEPT({
  id: "verite-correspondance",
  term: "Vérité-correspondance",
  cat: "Théorie de la vérité",
  def: "Conception classique : une proposition est vraie si elle <strong>correspond</strong> (s'accorde) avec le réel qu'elle décrit. « La neige est blanche » est vrai ssi la neige est blanche (Tarski). Critère <em>externe</em> : la vérité est un rapport entre langage et monde. Difficulté : comment vérifier l'accord ? Le réel ne se donne jamais « brut » mais à travers un langage. Aristote : « Dire de ce qui est qu'il est, et de ce qui n'est pas qu'il n'est pas, c'est dire le vrai. »",
  auteur: "Aristote / Tarski",
  notions: ["verite", "langage"],
  relations: [
    {type: "distinction", desc: "Correspondance (externe) ≠ cohérence (interne)"},
    {type: "distinction", desc: "Adéquation au réel ≠ utilité pratique (pragmatisme)"},
    {type: "distinction", desc: "Vérité (du jugement) ≠ réalité (de la chose)"},
  ],
});

CONCEPT({
  id: "verite-coherence",
  term: "Vérité-cohérence",
  cat: "Théorie de la vérité",
  def: "Conception <em>interne</em> de la vérité : un système de propositions est vrai si ses énoncés sont mutuellement <strong>compatibles</strong> (ne se contredisent pas). Critère du <em>principe de non-contradiction</em>. Caractéristique des sciences formelles (mathématiques, logique) où les axiomes engendrent un système cohérent. Limite : la cohérence est nécessaire mais non suffisante — un système cohérent peut être faux par rapport au réel (une fiction cohérente reste fictive).",
  auteur: "Spinoza / Hegel / Leibniz",
  notions: ["verite", "raison", "science"],
  relations: [
    {type: "distinction", desc: "Cohérence (interne) ≠ correspondance (externe)"},
    {type: "distinction", desc: "Système cohérent ≠ système vrai"},
    {type: "distinction", desc: "Nécessaire (non-contradiction) ≠ suffisant (vérification)"},
  ],
});

CONCEPT({
  id: "verite-instrumentale",
  term: "Vérité instrumentale",
  cat: "Pragmatisme",
  def: "Théorie pragmatique de la vérité (William James, <em>Le Pragmatisme</em>, 1907) : une idée est vraie en tant qu'elle <strong>fonctionne</strong>, qu'elle nous met efficacement en rapport avec d'autres expériences. La vérité n'est pas adéquation contemplative mais <em>processus de vérification</em> : « Le vrai consiste tout simplement dans ce qui est avantageux pour notre pensée. » Idées et théories sont des <em>outils</em> évalués par leur fécondité — comme un instrument se juge à son efficacité, non à sa beauté.",
  auteur: "William James / Dewey",
  notions: ["verite", "science"],
  relations: [
    {type: "distinction", desc: "Vérité instrumentale (utilité) ≠ vérité correspondance (adéquation)"},
    {type: "distinction", desc: "Vérité-processus ≠ vérité-état"},
    {type: "distinction", desc: "Pragmatisme ≠ relativisme (la vérité reste contraignante par ses effets)"},
  ],
});

CONCEPT({
  new: true,
  id: "rasoir-ockham",
  term: "Rasoir d'Ockham",
  cat: "Épistémologie / Logique",
  def: "Principe de <strong>parcimonie</strong> (ou d'économie, de simplicité), du nom du franciscain <em>Guillaume d'Ockham</em> (XIV<sup>e</sup> siècle). Formulation latine : <em>« Pluralitas non est ponenda sine necessitate »</em> — « la pluralité ne doit pas être posée sans nécessité ». Règle méthodologique : face à plusieurs explications concurrentes d'un même phénomène, préférer celle qui mobilise le <strong>moins d'hypothèses ou d'entités</strong>. La formule plus célèbre <em>« Entia non sunt multiplicanda praeter necessitatem »</em> (« les entités ne doivent pas être multipliées au-delà du nécessaire ») lui est attribuée mais ne figure pas dans ses écrits. Ce n'est pas un critère de vérité — le plus simple n'est pas toujours le vrai — mais un critère de <em>choix rationnel</em> entre théories : c'est à ce titre que James en fait l'un des critères (la « simplicité ») d'une idée tenue pour vraie.",
  auteur: "Guillaume d'Ockham",
  notions: ["science", "verite", "raison"],
  relations: [
    {
      to: "verite-instrumentale",
      type: "complete",
      desc: "La simplicité est l'un des critères pragmatiques (James) d'une idée qui fonctionne.",
    },
    {
      to: "falsifiabilite",
      type: "complete",
      desc: "Deux règles méthodologiques d'évaluation et de choix entre théories scientifiques.",
    },
    {
      type: "distinction",
      desc: "Simplicité (économie d'hypothèses) ≠ vérité (le plus simple n'est pas nécessairement le vrai).",
    },
  ],
});

CONCEPT({
  id: "theiere-russell",
  term: "Théière de Russell",
  cat: "Épistémologie",
  def: "Argument forgé par Bertrand Russell (<em>Is There a God?</em>, 1952) : « Si je suggérais qu'entre la Terre et Mars se trouve une théière de porcelaine en orbite elliptique autour du Soleil, trop petite pour être détectée par nos plus puissants télescopes, personne ne serait à même de réfuter mon allégation. » Mais l'irréfutabilité n'est pas une preuve. La <strong>charge de la preuve</strong> incombe à celui qui affirme l'existence d'une entité, non au sceptique. Argument transposé : Dieu, comme la théière, est une hypothèse infalsifiable dont l'irréfutabilité ne justifie pas la croyance.",
  auteur: "Russell",
  notions: ["religion", "science", "verite"],
  relations: [
    {type: "distinction", desc: "Irréfutable ≠ vrai"},
    {
      type: "distinction",
      desc: "Charge de la preuve (sur l'affirmateur) ≠ charge de la réfutation (sur le sceptique)",
    },
    {type: "distinction", desc: "Théière privée ≠ théière sacrée (variable culturelle)"},
  ],
});

CONCEPT({
  new: true,
  id: "agnosticisme",
  term: "Agnosticisme",
  cat: "Philosophie de la religion",
  def: "Position qui consiste à <strong>suspendre son jugement</strong> sur l'existence de Dieu, faute de preuve décisive dans un sens ou dans l'autre (terme forgé par T. H. Huxley en 1869, du grec <em>a-gnôsis</em>, « sans connaissance »). À distinguer de l'<strong>athéisme</strong> (qui affirme que Dieu n'existe pas) et du <strong>théisme</strong> (qui affirme qu'il existe) : l'agnostique ne tranche pas, jugeant la question indécidable. Russell (<em>Is There a God ?</em>, 1952) s'en réclame en pratique : l'existence de Dieu étant une hypothèse <em>infalsifiable</em> (cf. la théière) et la <strong>charge de la preuve</strong> incombant à qui affirme une existence, le doute est l'attitude rationnelle par défaut. Prolonge l'<em>épochè</em> sceptique (suspension du jugement).",
  auteur: "Huxley / Russell",
  notions: ["religion", "verite"],
  relations: [
    {
      to: "theiere-russell",
      type: "prolonge",
      desc: "Faute de preuve, et la charge incombant à l'affirmateur, on suspend le jugement.",
    },
    {
      to: "scepticisme",
      type: "prolonge",
      desc: "Application à la question de Dieu de la suspension sceptique du jugement.",
    },
    {to: "epoche", type: "complete", desc: "L'agnostique pratique l'épochè sur l'existence divine."},
    {
      type: "distinction",
      desc: "Agnosticisme (« je ne sais pas ») ≠ athéisme (« Dieu n'existe pas ») ≠ théisme (« Dieu existe »).",
    },
  ],
});

CONCEPT({
  id: "probleme-induction",
  term: "Problème de l'induction",
  cat: "Épistémologie",
  def: "Problème logique posé par Hume et radicalisé par <strong>Russell</strong> (<em>Problèmes de Philosophie</em>, 1912) : aucune accumulation finie d'observations passées ne <em>prouve</em> qu'une régularité se maintiendra à l'avenir. « Le soleil s'est levé chaque jour » ne démontre pas qu'il se lèvera demain. Toute connaissance empirique est donc <em>conjecturale</em>, non nécessaire. Conséquence majeure : les sciences expérimentales reposent sur un acte de foi inductif. Popper en tire la <strong>falsifiabilité</strong> : si l'induction ne prouve rien, c'est la <em>réfutation</em> (et non la confirmation) qui définit la science.",
  auteur: "Hume / Russell / Popper",
  notions: ["raison", "science", "verite"],
  relations: [
    {type: "distinction", desc: "Conclusion inductive ≠ démonstration déductive"},
    {type: "distinction", desc: "Probabilité ≠ certitude"},
    {type: "distinction", desc: "Confirmation (illusoire) ≠ réfutation (cruciale)"},
  ],
});

CONCEPT({
  id: "religiosite-cosmique",
  term: "Religiosité cosmique",
  cat: "Philosophie de la religion",
  def: "Concept einsteinien (<em>Comment je vois le monde</em>, 1934) : sentiment religieux qui ne porte pas sur un Dieu personnel mais sur l'<strong>admiration extasiée de l'harmonie de la nature</strong>. Le savant remplace l'espoir de la sollicitude divine par l'émerveillement devant l'<em>intelligibilité</em> du cosmos. Religiosité <em>compatible avec</em> et <em>nourrie par</em> la pratique scientifique — c'est le « Dieu de Spinoza » : la nécessité harmonieuse du tout. Pas de prière efficace ni de providence, mais une forme de gratitude métaphysique.",
  auteur: "Einstein / Spinoza",
  notions: ["religion", "science", "nature"],
  liens: {
    religion: "Pour la notion Religion, ce concept déplace la frontière du religieux : la religiosité n'est plus la croyance en un Dieu personnel (la « religion de l'homme simple », anthropomorphique), mais une attitude d'émerveillement devant l'ordre du monde — la « religiosité du savant ».",
    science: "Pour la notion Science, Einstein montre que l'activité scientifique peut reposer sur une forme de foi : la conviction que l'univers est ordonné et intelligible précède et soutient la recherche. Une « religiosité » sans dogme ni providence.",
  },
  relations: [
    {
      to: "noma",
      type: "prolonge",
      desc: "Comme Gould, Einstein articule science et religion sans conflit ; mais là où NOMA les sépare en deux magistères, Einstein les unit dans une même attitude d'émerveillement devant l'intelligibilité du cosmos.",
    },
    {
      to: "illusion",
      type: "oppose",
      desc: "La religiosité cosmique du savant n'est pas l'illusion freudienne du père protecteur : elle ne console pas, elle n'attend rien d'un Dieu personnel — elle contemple la nécessité harmonieuse du tout.",
    },
    {type: "distinction", desc: "Religiosité cosmique ≠ religion personnelle (Dieu providentiel)"},
    {type: "distinction", desc: "Émerveillement scientifique ≠ scientisme (qui prétendrait épuiser le sens)"},
    {type: "distinction", desc: "Spinozisme ≠ athéisme strict"},
  ],
});

CONCEPT({
  id: "pari-pascalien-religion",
  term: "Pari pascalien (décisionnel)",
  cat: "Philosophie de la religion",
  def: "Argument décisionnel de <strong>Pascal</strong> (<em>Pensées</em>, 1670) face à l'incertitude rationnelle sur l'existence de Dieu. « Il faut parier ; cela n'est pas volontaire, vous êtes embarqué. » Quatre issues : (1) Dieu existe et je crois → gain infini ; (2) Dieu existe et je ne crois pas → perte infinie ; (3) Dieu n'existe pas et je crois → perte finie ; (4) Dieu n'existe pas et je ne crois pas → gain fini. L'<em>espérance mathématique</em> est en faveur de la croyance. <strong>« Gagez donc qu'il est, sans hésiter. »</strong> Premier exemple historique de raisonnement décisionnel sous incertitude.",
  auteur: "Pascal",
  notions: ["religion", "raison", "verite"],
  relations: [
    {type: "distinction", desc: "Pari (décision pratique) ≠ démonstration (preuve théorique)"},
    {type: "distinction", desc: "Croire par calcul ≠ croire par foi"},
    {type: "distinction", desc: "Argument décisionnel ≠ argument ontologique"},
  ],
});

CONCEPT({
  id: "rationalisme",
  term: "Rationalisme",
  cat: "Théorie de la connaissance",
  def: "Doctrine selon laquelle la <strong>raison</strong> est la source principale (voire unique) de la connaissance vraie. Le rationalisme affirme l'existence d'<em>idées innées</em> et de vérités <em>a priori</em> que l'esprit possède indépendamment de l'expérience sensible — les sens étant trompeurs. Figures majeures : Descartes (le <em>cogito</em> et les idées claires et distinctes), Spinoza, Leibniz. S'oppose à l'empirisme. Kant en proposera la synthèse : la connaissance combine la matière sensible (expérience) et les formes <em>a priori</em> du sujet.",
  auteur: "Descartes / Spinoza / Leibniz",
  notions: ["raison", "verite", "science", "conscience"],
  relations: [
    {type: "distinction", desc: "Rationalisme ≠ empirisme (raison vs expérience)"},
    {type: "distinction", desc: "Idées innées ≠ tabula rasa (Locke)"},
    {type: "distinction", desc: "Vérités a priori ≠ vérités a posteriori"},
  ],
});

CONCEPT({
  id: "empirisme",
  term: "Empirisme",
  cat: "Théorie de la connaissance",
  def: "Doctrine selon laquelle toute connaissance dérive de l'<strong>expérience</strong> sensible — il n'y a pas d'idées innées. L'esprit à la naissance est une <em>tabula rasa</em> (table rase) sur laquelle l'expérience inscrit ses données (Locke). Hume radicalise : même la causalité n'est qu'une habitude psychologique, non une nécessité rationnelle. Figures majeures : Locke, Hume, Berkeley. S'oppose au rationalisme. Kant dépassera l'opposition : « toute connaissance commence avec l'expérience, mais elle ne dérive pas toute de l'expérience ».",
  auteur: "Locke / Hume / Berkeley",
  notions: ["verite", "science", "raison", "conscience"],
  relations: [
    {type: "distinction", desc: "Empirisme ≠ rationalisme (expérience vs raison)"},
    {type: "distinction", desc: "Tabula rasa ≠ idées innées (Descartes)"},
    {type: "distinction", desc: "Connaissance a posteriori ≠ a priori"},
  ],
});

CONCEPT({
  id: "epoche",
  term: "Épochè",
  cat: "Épistémologie antique",
  def: "Suspension du jugement. Chez les sceptiques, refus d’affirmer ou de nier pour atteindre la tranquillité ; chez Husserl, « mise entre parenthèses » du monde naturel pour décrire les phénomènes tels qu’ils apparaissent à la conscience.",
  auteur: "Husserl",
  notions: ["verite", "conscience", "bonheur"],
  relations: [
    {to: "scepticisme", type: "prolonge", desc: "Outil central du scepticisme antique."},
    {to: "ataraxie", type: "implique", desc: "La suspension du jugement conduit à l’absence de trouble."},
  ],
});

CONCEPT({
  id: "scientisme",
  term: "Scientisme",
  cat: "Philosophie des sciences",
  def: "Idéologie selon laquelle la science, et elle seule, peut répondre à toutes les questions humaines — y compris morales, métaphysiques et religieuses. Absolutisation de la méthode scientifique, qui outrepasse son domaine de validité.",
  notions: ["science", "religion", "verite"],
  relations: [
    {to: "positivisme", type: "prolonge", desc: "Radicalisation idéologique du positivisme."},
    {to: "noma", type: "oppose", desc: "Le NOMA limite la science à son magistère et refuse le scientisme."},
    {
      term: "concordisme",
      type: "distinction",
      desc: "Le scientisme absolutise la science ; le concordisme veut accorder science et religion.",
    },
  ],
});

CONCEPT({
  id: "concordisme",
  term: "Concordisme",
  cat: "Philosophie de la religion",
  def: "Tentative de faire concorder les énoncés des textes religieux avec les découvertes scientifiques, en lisant la science dans les Écritures (ou inversement). Confond les deux registres au lieu de les distinguer.",
  notions: ["religion", "science"],
  relations: [
    {to: "noma", type: "oppose", desc: "Le NOMA sépare les magistères, le concordisme les superpose."},
    {
      to: "religion-naturelle",
      type: "distinction",
      desc: "La religion naturelle se fonde sur la raison ; le concordisme sur l’accord avec les textes révélés.",
    },
  ],
});

CONCEPT({
  id: "relativisme",
  term: "Relativisme",
  cat: "Théorie de la vérité",
  def: "Doctrine selon laquelle la vérité, le bien ou le beau sont toujours relatifs à un individu, une culture ou une époque : il n’existe pas de vérité universelle. « L’homme est la mesure de toute chose » (Protagoras).",
  auteur: "Protagoras",
  notions: ["verite", "justice", "art"],
  relations: [
    {to: "doxa", type: "prolonge", desc: "Réduit la vérité à l’opinion variable."},
    {to: "scepticisme", type: "prolonge"},
    {term: "universalisme", type: "oppose", desc: "L’universalisme affirme des vérités valables pour tous."},
  ],
});

CONCEPT({
  id: "dualisme",
  term: "Dualisme",
  cat: "Métaphysique",
  def: "Thèse métaphysique de l’existence de deux substances distinctes et irréductibles — typiquement l’âme (pensée) et le corps (étendue) chez Descartes, ou l’esprit et la matière.",
  auteur: "Descartes",
  notions: ["conscience", "inconscient"],
  relations: [
    {to: "cogito", type: "prolonge", desc: "Le cogito (substance pensante) se distingue du corps étendu."},
    {to: "materialisme", type: "oppose"},
    {term: "monisme", type: "oppose", desc: "Le monisme ne reconnaît qu’une seule substance."},
  ],
});

CONCEPT({
  id: "materialisme",
  term: "Matérialisme",
  cat: "Métaphysique",
  def: "Doctrine selon laquelle seule la matière existe : la pensée et la conscience sont des produits de l’organisation matérielle. Démocrite (atomisme), Marx (matérialisme historique : les conditions matérielles déterminent les idées).",
  auteur: "Marx",
  notions: ["conscience", "nature", "travail"],
  relations: [
    {
      to: "idealisme",
      type: "oppose",
      desc: "La matière première (matérialisme) contre l’esprit premier (idéalisme).",
    },
    {to: "dualisme", type: "oppose"},
    {
      to: "plus-value",
      type: "prolonge",
      desc: "Le matérialisme historique de Marx part de l’économie réelle.",
    },
  ],
});

CONCEPT({
  id: "idealisme",
  term: "Idéalisme",
  cat: "Idéalisme",
  def: "Doctrine selon laquelle la réalité véritable est d’ordre idéel ou spirituel : les Idées (Platon), l’esprit ou la conscience précèdent et fondent le monde sensible. Platon, Berkeley, Hegel.",
  auteur: "Platon",
  notions: ["conscience", "verite"],
  relations: [
    {to: "materialisme", type: "oppose"},
    {to: "anamnese", type: "prolonge", desc: "Connaître, c’est se ressouvenir des Idées."},
  ],
});

CONCEPT({
  id: "nihilisme",
  term: "Nihilisme",
  cat: "Philosophie nietzschéenne",
  def: "Processus de dévalorisation des valeurs supérieures : « les valeurs suprêmes se dévalorisent ». Avec la « mort de Dieu », le monde paraît privé de sens et de fondement. Nietzsche le diagnostique pour mieux le dépasser.",
  auteur: "Nietzsche",
  notions: ["religion", "liberte", "verite"],
  relations: [
    {
      to: "volonte-puissance",
      type: "oppose",
      desc: "La volonté de puissance, création de valeurs nouvelles, surmonte le nihilisme.",
    },
    {
      to: "transcendance",
      type: "oppose",
      desc: "« Mort de Dieu » : effondrement de l’arrière-monde transcendant.",
    },
  ],
});

CONCEPT({
  id: "metaphysique",
  term: "Métaphysique",
  cat: "Métaphysique",
  def: "Partie de la philosophie qui étudie ce qui est au-delà du physique : l’être en tant qu’être, Dieu, l’âme, la liberté. « Science des premiers principes et des premières causes » (Aristote). Kant en interroge la possibilité comme science.",
  auteur: "Aristote",
  notions: ["raison", "religion", "verite"],
  relations: [
    {to: "physis", type: "distinction", desc: "La métaphysique va au-delà de la nature (physis)."},
    {to: "transcendance", type: "prolonge"},
  ],
});

CONCEPT({
  id: "finalite",
  term: "Finalité",
  cat: "Métaphysique",
  def: "Explication d’un être ou d’un phénomène par sa fin (cause finale, « ce en vue de quoi »), par opposition à l’explication par des causes mécaniques. La nature semble agir en vue d’une fin (téléologie).",
  auteur: "Aristote",
  notions: ["nature", "technique", "science"],
  relations: [
    {
      to: "determinisme",
      type: "oppose",
      desc: "Cause finale (pourquoi) contre cause efficiente / mécanisme (comment).",
    },
    {term: "mécanisme", type: "oppose"},
  ],
});

CONCEPT({
  id: "immanence",
  term: "Immanence",
  cat: "Métaphysique / Religion",
  def: "Caractère de ce qui a son principe en soi-même et reste intérieur au monde, sans cause extérieure ou supérieure. Chez Spinoza, Dieu est immanent à la nature (« Deus sive Natura »).",
  auteur: "Spinoza",
  notions: ["religion", "nature"],
  relations: [
    {
      to: "transcendance",
      type: "oppose",
      desc: "L’immanent reste dans le monde ; le transcendant le dépasse.",
    },
  ],
});

CONCEPT({
  id: "laicite",
  term: "Laïcité",
  cat: "Philosophie politique / Religion",
  def: "Principe de séparation des Églises et de l’État garantissant la neutralité de l’État en matière religieuse et la liberté de conscience de chacun. Distingue l’espace public commun et les convictions privées.",
  notions: ["etat", "religion"],
  relations: [
    {
      to: "religion-civile",
      type: "distinction",
      desc: "La laïcité neutralise l’État ; la religion civile lui donne un culte commun.",
    },
    {to: "contrat-social", type: "prolonge"},
  ],
});

CONCEPT({
  id: "utilitarisme",
  term: "Utilitarisme",
  cat: "Éthique",
  def: "Doctrine morale conséquentialiste qui juge une action selon son utilité, c’est-à-dire sa capacité à produire le plus grand bonheur pour le plus grand nombre. Bentham (calcul des plaisirs), Mill.",
  auteur: "Mill",
  notions: ["bonheur", "justice", "devoir"],
  relations: [
    {
      to: "imperatif-categorique",
      type: "oppose",
      desc: "Conséquentialisme (utilitarisme) contre déontologie du devoir (Kant).",
    },
    {to: "eudaimonia", type: "distinction"},
  ],
});

CONCEPT({
  id: "hedonisme",
  term: "Hédonisme",
  cat: "Éthique antique",
  def: "Doctrine qui fait du plaisir le souverain bien et le but de la vie. L’hédonisme raisonné d’Épicure recherche les plaisirs stables (absence de douleur, ataraxie) plutôt que les plaisirs intenses et inquiets.",
  auteur: "Épicure",
  notions: ["bonheur"],
  relations: [
    {to: "plaisir", type: "prolonge"},
    {to: "ataraxie", type: "complete", desc: "Le plaisir véritable est l’absence de trouble."},
    {
      to: "eudaimonia",
      type: "distinction",
      desc: "Bonheur comme plaisir (hédonisme) vs comme accomplissement (eudaimonia).",
    },
  ],
});

CONCEPT({
  id: "ideologie",
  term: "Idéologie",
  cat: "Philosophie sociale",
  def: "Chez Marx, système d’idées et de représentations qui présente les intérêts de la classe dominante comme universels et naturels, masquant ainsi les rapports réels de domination.",
  auteur: "Marx",
  notions: ["etat", "travail", "justice"],
  relations: [
    {
      to: "alienation",
      type: "prolonge",
      desc: "L’idéologie entretient l’aliénation en voilant l’exploitation.",
    },
    {to: "plus-value", type: "complete"},
  ],
});

CONCEPT({
  id: "maieutique",
  term: "Maïeutique",
  cat: "Philosophie antique",
  def: "Art socratique d’« accoucher les esprits » : par un jeu de questions, Socrate aide son interlocuteur à mettre au jour la vérité qu’il porte sans le savoir, et à reconnaître son ignorance.",
  auteur: "Socrate",
  notions: ["raison", "verite", "langage"],
  relations: [
    {to: "anamnese", type: "prolonge", desc: "Accoucher l’âme, c’est l’aider à se ressouvenir."},
    {to: "doxa", type: "oppose", desc: "Dépasser l’opinion vers le savoir."},
  ],
});

CONCEPT({
  id: "humanisme",
  term: "Humanisme",
  cat: "Histoire de la philosophie",
  def: "Courant de pensée qui place l’homme, sa dignité et sa liberté au centre, avec confiance dans la raison et l’éducation. À la Renaissance (Pic de la Mirandole), puis chez Sartre (« l’existentialisme est un humanisme »).",
  auteur: "Sartre",
  notions: ["liberte", "conscience"],
  relations: [
    {
      to: "mauvaise-foi",
      type: "distinction",
      desc: "L’humanisme existentialiste assume la liberté que la mauvaise foi fuit.",
    },
    {
      term: "transhumanisme",
      type: "oppose",
      desc: "Le transhumanisme veut augmenter l’homme par la technique.",
    },
  ],
});

CONCEPT({
  id: "monisme",
  term: "Monisme",
  cat: "Métaphysique",
  def: "Thèse métaphysique selon laquelle il n’existe qu’une seule substance ou un seul principe ultime du réel, par opposition au dualisme. Chez Spinoza, il n’y a qu’une substance infinie, Dieu ou la Nature (« Deus sive Natura »), dont l’esprit et le corps sont deux attributs.",
  auteur: "Spinoza",
  notions: ["conscience", "nature", "religion"],
  relations: [
    {to: "dualisme", type: "oppose", desc: "Une seule substance (monisme) contre deux (dualisme)."},
    {to: "immanence", type: "prolonge", desc: "Spinoza : une substance unique et immanente au monde."},
  ],
});

CONCEPT({
  id: "mecanisme",
  term: "Mécanisme",
  cat: "Philosophie des sciences",
  def: "Doctrine qui explique tous les phénomènes, y compris le vivant, par des causes matérielles et des lois physiques, comme une machine — excluant les causes finales. Descartes réduit l’animal à une « machine » (animal-machine).",
  auteur: "Descartes",
  notions: ["nature", "science", "technique"],
  relations: [
    {
      to: "finalite",
      type: "oppose",
      desc: "Le mécanisme explique par les causes efficientes, non par les fins.",
    },
    {to: "determinisme", type: "prolonge"},
    {
      to: "elan-vital",
      type: "oppose",
      desc: "Le vitalisme (élan vital) refuse de réduire le vivant à une machine.",
    },
  ],
});

CONCEPT({
  id: "universalisme",
  term: "Universalisme",
  cat: "Théorie de la vérité",
  def: "Position selon laquelle certaines vérités, valeurs ou droits valent pour tous les hommes, indépendamment des cultures et des époques. S’oppose au relativisme. Fondement des droits de l’homme et de la morale kantienne.",
  auteur: "Kant",
  notions: ["verite", "justice", "devoir"],
  relations: [
    {
      to: "relativisme",
      type: "oppose",
      desc: "Vérités valables pour tous (universalisme) contre vérités relatives (relativisme).",
    },
    {to: "imperatif-categorique", type: "prolonge", desc: "La loi morale vaut universellement."},
  ],
});

CONCEPT({
  id: "reification",
  term: "Réification",
  cat: "Philosophie sociale",
  def: "Fait de transformer des rapports humains et sociaux en rapports entre choses, et de traiter une personne comme un simple objet. Liée chez Marx au « fétichisme de la marchandise » ; développée par Lukács.",
  auteur: "Marx",
  notions: ["travail", "justice", "conscience"],
  relations: [
    {to: "alienation", type: "prolonge", desc: "La réification est une forme d’aliénation."},
    {to: "plus-value", type: "complete"},
  ],
});

CONCEPT({
  id: "providence",
  term: "Providence",
  cat: "Philosophie de la religion",
  def: "Gouvernement du monde par Dieu, qui dirige le cours des choses vers une fin bonne. Soulève le problème du mal : comment concilier un Dieu bon et tout-puissant avec l’existence du mal (théodicée) ?",
  notions: ["religion", "nature", "temps"],
  relations: [
    {to: "finalite", type: "prolonge", desc: "Le monde est ordonné en vue d’une fin voulue par Dieu."},
    {to: "transcendance", type: "prolonge"},
    {term: "théodicée", type: "implique", desc: "Justifier la bonté de Dieu face au mal."},
  ],
});

CONCEPT({
  id: "a-priori-posteriori",
  term: "A priori / a posteriori",
  cat: "Théorie de la connaissance",
  def: "Distinction kantienne : est <em>a priori</em> ce qui est indépendant de l’expérience (ex. les vérités mathématiques, universelles et nécessaires) ; est <em>a posteriori</em> ce qui en dérive (les connaissances empiriques, particulières et contingentes).",
  auteur: "Kant",
  notions: ["raison", "science", "verite"],
  relations: [
    {to: "rationalisme", type: "prolonge", desc: "Le rationalisme valorise la connaissance a priori."},
    {to: "empirisme", type: "distinction", desc: "L’empirisme fonde tout sur l’a posteriori."},
  ],
});

CONCEPT({
  id: "inne-acquis",
  term: "Inné / acquis",
  cat: "Anthropologie philosophique",
  def: "Opposition entre ce qui est présent dès la naissance (inné) et ce qui résulte de l’apprentissage et du milieu (acquis). Au cœur du débat nature / culture sur ce qui définit l’homme.",
  notions: ["nature", "conscience", "liberte"],
  relations: [
    {to: "tabula-rasa", type: "prolonge", desc: "Pour Locke, l’esprit est vierge : tout est acquis."},
    {term: "idées innées", type: "oppose", desc: "Le rationalisme défend des idées innées."},
  ],
});

CONCEPT({
  id: "contingence-necessite",
  term: "Contingence / nécessité",
  cat: "Métaphysique",
  def: "Est <strong>nécessaire</strong> ce qui ne peut pas ne pas être (et ne peut être autrement) ; est <strong>contingent</strong> ce qui peut être ou ne pas être, ce qui aurait pu être autrement. La liberté suppose une part de contingence.",
  notions: ["liberte", "nature", "temps"],
  relations: [
    {
      to: "determinisme",
      type: "distinction",
      desc: "Le déterminisme rend tout nécessaire ; la contingence ouvre du possible.",
    },
    {to: "libre-arbitre", type: "implique"},
  ],
});

CONCEPT({
  id: "finitude",
  term: "Finitude",
  cat: "Phénoménologie existentiale",
  def: "Caractère de l’existence humaine limitée, mortelle et temporelle. L’homme est un être fini, conscient de ses limites et de sa mort, ce qui donne sens et urgence à son existence.",
  auteur: "Heidegger",
  notions: ["temps", "conscience", "religion"],
  relations: [
    {to: "etre-vers-mort", type: "prolonge", desc: "L’existence est un « être-vers-la-mort »."},
    {to: "angoisse", type: "implique", desc: "La conscience de la finitude suscite l’angoisse."},
  ],
});

CONCEPT({
  id: "sublimation",
  term: "Sublimation",
  cat: "Psychanalyse",
  def: "Mécanisme par lequel une pulsion (notamment sexuelle) est détournée de son but premier vers une activité socialement valorisée — art, science, création. Forme « réussie » de transformation des pulsions, distincte du refoulement.",
  auteur: "Freud",
  notions: ["inconscient", "art", "travail"],
  relations: [
    {to: "pulsion", type: "prolonge", desc: "La sublimation réoriente l’énergie pulsionnelle."},
    {
      to: "refoulement",
      type: "distinction",
      desc: "Le refoulement bloque la pulsion ; la sublimation la réoriente.",
    },
    {to: "catharsis", type: "complete"},
  ],
  new: true,
});

CONCEPT({
  new: true,
  id: "post-verite",
  term: "Post-vérité",
  cat: "Théorie de la vérité",
  def: "Néologisme élu « mot de l’année » par l’Oxford English Dictionary en 2016 (<em>post-truth</em>) : situation où, dans le débat public, les faits objectifs comptent moins, dans la formation de l’opinion, que l’appel à l’émotion et aux croyances personnelles. Le préfixe « post » ne signifie pas « après la vérité » mais « la vérité <em>n’est plus pertinente</em> ». Cas d’école : campagne pour le Brexit (2016), discours de Trump (« faits alternatifs »), désinformation algorithmique sur les réseaux sociaux. Lecture nietzschéenne (Emmanuel Salanevris) : la post-vérité prolonge le diagnostic de Nietzsche selon lequel « il n’y a pas de faits, seulement des interprétations » — la « volonté de vérité » a perdu son autorité régulatrice, et avec elle l’horizon commun qui rendait possible le débat rationnel.",
  auteur: "Nietzsche (héritage) / Salanevris",
  notions: ["verite", "raison", "etat", "langage"],
  relations: [
    {
      to: "verite-correspondance",
      type: "oppose",
      desc: "La post-vérité abandonne l’exigence d’adéquation aux faits.",
    },
    {to: "relativisme", type: "prolonge", desc: "Forme contemporaine et politique du relativisme."},
    {
      to: "nihilisme",
      type: "prolonge",
      desc: "Effondrement de la valeur régulatrice du vrai diagnostiqué par Nietzsche.",
    },
    {
      to: "sophisme",
      type: "prolonge",
      desc: "Comme les sophistes antiques, séduire l’opinion plutôt que démontrer.",
    },
    {
      to: "novlangue",
      type: "complete",
      desc: "La novlangue appauvrit le pensable, la post-vérité disqualifie le vrai.",
    },
  ],
});

CONCEPT({
  new: true,
  id: "ressentiment",
  term: "Ressentiment",
  cat: "Philosophie nietzschéenne",
  def: "Concept central de Nietzsche (<em>Généalogie de la morale</em>, 1887) : impuissance vengeresse de qui ne peut <em>agir</em> et qui, à défaut, <em>réagit</em> en dévalorisant le fort et en érigeant sa propre faiblesse en vertu (« morale d’esclaves »). Le ressentiment retourne contre l’autre une haine qu’il ne peut décharger par l’action. Mécanisme inversé : ce que l’aristocrate appelle <em>bon</em> (puissance, joie, affirmation), l’homme du ressentiment l’appelle <em>mal</em> ; sa propre impuissance devient <em>bonté</em>. Diagnostic contemporain (Martine Béland) : la culture du <em>like</em>, la culpabilisation moralisatrice et l’indignation permanente sur les réseaux sociaux rejouent la structure du ressentiment.",
  auteur: "Nietzsche",
  notions: ["liberte", "justice", "devoir", "etat"],
  relations: [
    {
      to: "volonte-puissance",
      type: "oppose",
      desc: "La volonté de puissance affirme ; le ressentiment réagit.",
    },
    {
      to: "transvaluation-valeurs",
      type: "implique",
      desc: "Le ressentiment opère une première transvaluation (bon/mauvais → bien/mal).",
    },
    {to: "nihilisme", type: "prolonge", desc: "La morale du ressentiment prépare le nihilisme passif."},
  ],
});

CONCEPT({
  new: true,
  id: "transvaluation-valeurs",
  term: "Transvaluation des valeurs",
  cat: "Philosophie nietzschéenne",
  def: "Programme nietzschéen (<em>Umwertung aller Werte</em>, « renversement de toutes les valeurs ») : retourner l’étiquette morale donnée aux valeurs régnantes pour libérer la vie. Première transvaluation, déjà accomplie dans l’histoire selon Nietzsche : l’aristocratique « <em>bon vs mauvais</em> » (fort/faible, noble/vil) a été renversé par la « morale des esclaves » en « <em>bien vs mal</em> » (humilité/orgueil, charité/égoïsme). Tâche du surhumain : opérer une <em>seconde</em> transvaluation, par-delà bien et mal, qui rende leur valeur aux forces affirmatives de la vie. Programme inséparable de la « mort de Dieu » : sans garantie transcendante, c’est à l’homme de créer ses propres valeurs.",
  auteur: "Nietzsche",
  notions: ["liberte", "devoir", "religion", "verite"],
  relations: [
    {to: "ressentiment", type: "prolonge", desc: "La première transvaluation est l’œuvre du ressentiment."},
    {to: "surhumain", type: "implique", desc: "La seconde transvaluation est la tâche du surhumain."},
    {to: "volonte-puissance", type: "complete"},
    {to: "nihilisme", type: "oppose", desc: "Créer de nouvelles valeurs contre l’effondrement nihiliste."},
  ],
});

CONCEPT({
  new: true,
  id: "surhumain",
  term: "Surhumain (Übermensch)",
  cat: "Philosophie nietzschéenne",
  def: "Figure centrale d’<em>Ainsi parlait Zarathoustra</em> (1883–1885) — traduit aussi par « surhomme », mais le terme allemand <em>Übermensch</em> dit littéralement « <em>par-dessus</em> l’homme » : non un super-humain biologique, mais l’homme qui se <em>dépasse</em> lui-même. « L’homme est quelque chose qui doit être surmonté. » Le surhumain assume la mort de Dieu, refuse les arrière-mondes religieux et le ressentiment, crée ses propres valeurs et dit oui à la vie y compris à l’éternel retour. Affinité, selon Dorian Astor, avec les <em>esprits libres</em> de la bohème : ceux qui supportent l’expérimentation, la dissonance, la solitude créatrice — non pas dominer autrui mais se rendre capable de soi.",
  auteur: "Nietzsche",
  notions: ["liberte", "art", "religion"],
  relations: [
    {
      to: "volonte-puissance",
      type: "prolonge",
      desc: "Le surhumain réalise la volonté de puissance affirmative.",
    },
    {to: "transvaluation-valeurs", type: "implique", desc: "Le surhumain opère la seconde transvaluation."},
    {to: "ressentiment", type: "oppose", desc: "Le surhumain a vaincu le ressentiment en lui."},
    {to: "nihilisme", type: "oppose", desc: "Réponse affirmative au diagnostic du nihilisme."},
  ],
});

CONCEPT({
  new: true,
  id: "gregarite",
  term: "Grégarité",
  cat: "Philosophie nietzschéenne",
  def: "Concept nietzschéen : tendance des hommes à se rassembler en « troupeau » (<em>Herde</em>) — à penser, sentir et juger comme tout le monde par peur de la solitude et de la dissonance. La morale grégaire est celle de l’uniformité, de la moyenne, du <em>conformisme</em>. Diagnostic contemporain (Stéphanie Floccari) : la « tyrannie du <em>like</em> » sur les réseaux sociaux est une grégarité moderne — chaque utilisateur s’aligne sur le plébiscite numérique du groupe, sacrifie la pluralité des points de vue à la quête de reconnaissance. La grégarité fait obstacle aux « esprits libres » et au surhumain.",
  auteur: "Nietzsche",
  notions: ["liberte", "etat", "verite"],
  relations: [
    {
      to: "surhumain",
      type: "oppose",
      desc: "Le surhumain s’extrait du troupeau ; l’esprit grégaire s’y dissout.",
    },
    {
      to: "servitude-volontaire",
      type: "prolonge",
      desc: "La grégarité est servitude volontaire à l’opinion moyenne.",
    },
    {to: "ressentiment", type: "complete", desc: "La morale grégaire prolonge la morale du ressentiment."},
  ],
});

CONCEPT({
  new: true,
  id: "fonction-fabulatrice",
  term: "Fonction fabulatrice",
  cat: "Philosophie de la religion",
  def: "Concept de Bergson (<em>Les Deux Sources de la morale et de la religion</em>, 1932) : faculté humaine spontanée à produire des récits, des mythes, des « représentations fantasmatiques » qui simulent une présence vivante là où il n’y a que des forces aveugles. Réponse de la nature à un risque vital : l’intelligence, en anticipant la mort et en révélant la passivité de la nature, menace la cohésion du groupe et la volonté de vivre — la fonction fabulatrice <em>contre-balance</em> ce risque en produisant des divinités, des esprits, des récits rassurants. Elle est à l’origine de la <strong>religion statique</strong> (de cohésion sociale et de défense), distincte de la <strong>religion dynamique</strong> des mystiques (élan créateur).",
  auteur: "Bergson",
  notions: ["religion", "nature", "inconscient"],
  relations: [
    {to: "illusion", type: "prolonge", desc: "La fonction fabulatrice produit des illusions utiles à la vie."},
    {
      to: "religion-statique-dynamique",
      type: "implique",
      desc: "Elle est à l’origine de la religion statique.",
    },
    {
      to: "aliénation-religieuse",
      type: "distinction",
      desc: "Pour Feuerbach/Marx, la religion aliène ; pour Bergson, elle est d’abord <em>défense vitale</em>.",
    },
  ],
});

CONCEPT({
  new: true,
  id: "religion-statique-dynamique",
  term: "Religion statique / dynamique",
  cat: "Philosophie de la religion",
  def: "Distinction bergsonienne (<em>Les Deux Sources</em>, 1932). <strong>Religion statique</strong> : produit de la fonction fabulatrice, fonction de cohésion sociale et de défense contre l’angoisse de la mort, figée dans les dogmes, les rites, les institutions — c’est elle que critiquent Marx (opium), Freud (illusion) et Durkheim (lien social). <strong>Religion dynamique</strong> : élan mystique des grands créateurs spirituels (saints, prophètes), expérience vivante du divin qui transforme l’humanité, non thématisable par les sciences humaines. Toute religion historique mêle les deux strates — mais la religion statique tend à étouffer la dynamique en l’enfermant dans des formules.",
  auteur: "Bergson",
  notions: ["religion"],
  relations: [
    {
      to: "fonction-fabulatrice",
      type: "prolonge",
      desc: "La religion statique est l’œuvre de la fonction fabulatrice.",
    },
    {
      to: "illusion",
      type: "distinction",
      desc: "La religion <em>dynamique</em> n’est pas illusion : c’est une expérience irréductible.",
    },
    {to: "sacre", type: "complete"},
    {to: "foi", type: "complete"},
  ],
});

CONCEPT({
  new: true,
  id: "culte-morale",
  term: "Religion de simple culte / religion morale",
  cat: "Philosophie de la religion",
  def: "Distinction kantienne (<em>La Religion dans les limites de la simple raison</em>, 1793). Toutes les religions se ramènent à deux types. (1) <strong>Religion de simple culte</strong> : l’homme prie Dieu pour obtenir des faveurs (santé, salut, prospérité), sans rien <em>faire</em> pour devenir meilleur — superstition. (2) <strong>Religion morale</strong> : l’homme s’efforce de devenir meilleur par sa propre conduite, sans rien attendre en retour. Seule la seconde est conforme à la dignité du sujet rationnel et à l’<em>autonomie morale</em>. Kant ramène la religion vraie à la morale : tout culte sans œuvres est superstition.",
  auteur: "Kant",
  notions: ["religion", "devoir", "liberte"],
  relations: [
    {to: "autonomie", type: "prolonge", desc: "La religion morale prolonge l’autonomie morale kantienne."},
    {to: "imperatif-categorique", type: "complete", desc: "La religion vraie se ramène à la loi morale."},
    {to: "religion-naturelle", type: "prolonge"},
    {
      to: "aliénation-religieuse",
      type: "oppose",
      desc: "Le culte sans œuvres aliène, la religion morale émancipe.",
    },
  ],
});

CONCEPT({
  new: true,
  id: "effet-barnum",
  term: "Effet Barnum",
  cat: "Psychologie / Critique des pseudo-sciences",
  def: "Biais cognitif (décrit par Paul Meehl en 1956, du nom du forain P. T. Barnum) : tendance à considérer comme étonnamment justes des descriptions de personnalité <em>générales et vagues</em> qui s’appliqueraient en réalité à n’importe qui. Mécanisme exploité par l’<strong>astrologie</strong>, les horoscopes, la <em>graphologie</em>, la voyance et la plupart des tests de personnalité non scientifiques. Une description « positive, plurivalente et flatteuse » sera reçue comme un portrait vrai. C’est l’une des raisons pour lesquelles ces disciplines sont des <em>pseudo-sciences</em> : leurs énoncés sont non-falsifiables parce qu’assez généraux pour s’adapter à tout cas particulier.",
  auteur: "Meehl / Forer",
  notions: ["science", "verite", "raison"],
  relations: [
    {
      to: "falsifiabilite",
      type: "oppose",
      desc: "L’énoncé Barnum est non-falsifiable : il s’ajuste à tout cas.",
    },
    {to: "sophisme", type: "prolonge", desc: "Forme cognitive du sophisme — séduire par le général."},
    {to: "doxa", type: "prolonge", desc: "L’opinion accepte le vague comme du vrai."},
    {
      to: "theiere-russell",
      type: "complete",
      desc: "Pour Russell comme pour Meehl, la charge de la preuve incombe à qui affirme.",
    },
  ],
});

CONCEPT({
  new: true,
  id: "pastafarisme",
  term: "Pastafarisme",
  cat: "Philosophie de la religion",
  def: "« Église du Monstre en Spaghetti Volant » (<em>Flying Spaghetti Monster</em>), parodie de religion créée en 2005 par Bobby Henderson en réaction à l’<em>intelligent design</em> enseigné à l’école dans le Kansas. Argument : si l’on admet d’enseigner le créationnisme à parité avec l’évolution, alors n’importe quelle hypothèse de création divine non falsifiable mérite la même place — y compris celle d’un Monstre en Spaghetti Volant. Démonstration par l’absurde : on peut « faire une religion de n’importe quoi » si l’on ne retient pas l’exigence de falsifiabilité (Popper) et la charge de la preuve (Russell). Cousin contemporain de la théière de Russell.",
  auteur: "Henderson",
  notions: ["religion", "science", "verite"],
  relations: [
    {to: "theiere-russell", type: "prolonge", desc: "Même argument que la théière : non-réfutable ≠ vrai."},
    {to: "falsifiabilite", type: "complete", desc: "Démonstration <em>a contrario</em> du critère de Popper."},
    {
      to: "concordisme",
      type: "oppose",
      desc: "Réponse satirique aux tentatives de mêler science et religion.",
    },
    {to: "noma", type: "complete", desc: "Plaide pour la séparation des magistères contre le créationnisme."},
  ],
});

CONCEPT({
  new: true,
  id: "maitres-soupcon",
  term: "Maîtres du soupçon",
  cat: "Herméneutique",
  def: "Expression forgée par Paul Ricœur (<em>De l’interprétation. Essai sur Freud</em>, 1965) pour désigner conjointement <strong>Marx, Nietzsche et Freud</strong>. Tous trois rompent avec l’herméneutique classique de la confiance (le sens manifeste donne le vrai) au profit d’une <em>herméneutique du soupçon</em> : ce que la conscience croit dire est <em>l’envers</em> de ce qui se dit vraiment en elle. Marx soupçonne l’idéologie sous le discours politique ; Nietzsche, le ressentiment sous la morale ; Freud, le désir refoulé sous le discours du sujet. Trois variantes d’une même opération : démasquer une <em>fausse conscience</em> et restituer le sens latent.",
  auteur: "Ricœur",
  notions: ["conscience", "inconscient", "religion", "verite"],
  relations: [
    {
      to: "hermeneutique",
      type: "prolonge",
      desc: "Herméneutique du soupçon vs herméneutique de la confiance.",
    },
    {
      to: "aliénation-religieuse",
      type: "complete",
      desc: "La religion est l’un des objets privilégiés du soupçon.",
    },
    {to: "ideologie", type: "complete"},
    {to: "refoulement", type: "complete"},
  ],
});

CONCEPT({
  new: true,
  id: "consommation-opium",
  term: "Consommation comme nouvel opium",
  cat: "Philosophie sociale contemporaine",
  def: "Thèse de Gilles Lipovetsky (<em>Le Bonheur paradoxal</em>, 2006) : ce que la religion fut au XIX<sup>e</sup> siècle pour Marx (« opium du peuple »), l’<strong>hyperconsommation</strong> l’est devenue dans les sociétés démocratiques avancées. La consommation ne se contente plus de satisfaire des besoins ; elle vend des émotions, des identités, du sens — elle promet du <em>bonheur</em> mais entretient la frustration permanente, détourne de l’engagement politique et anesthésie la critique sociale. Mise à jour contemporaine de la critique marxiste : la marchandise a remplacé Dieu dans la fonction de compensation symbolique de la détresse.",
  auteur: "Lipovetsky",
  notions: ["travail", "justice", "religion", "bonheur"],
  relations: [
    {to: "aliénation-religieuse", type: "prolonge", desc: "Transposition contemporaine de l’opium religieux."},
    {
      to: "alienation",
      type: "prolonge",
      desc: "Aliénation par la consommation, non plus seulement par le travail.",
    },
    {
      to: "reification",
      type: "complete",
      desc: "L’hyperconsommateur se traite lui-même comme un assemblage d’objets.",
    },
    {to: "plus-value", type: "complete"},
    {to: "ideologie", type: "complete"},
  ],
});
