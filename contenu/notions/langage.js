/* Notion « Langage » : Le langage ne sert-il qu'à communiquer ?
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("langage", {
  c: "#6B4FA0",
  l: "Langage",
  s: "Le langage ne sert-il qu'à communiquer ?",
  def: "Le <span class='kw'>langage</span> est tout système de signes permettant l'expression ou la communication. Il se distingue des autres systèmes par la <span class='kw'>double articulation</span> (monèmes + phonèmes). Question centrale : est-il un simple <span class='kw'>moyen</span> (instrument) ou peut-il être une <span class='kw'>fin en soi</span> ?<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>Trois distinctions fondamentales</div><div class='def-sec-body'><strong>Langage</strong> (général) : système de signes permettant l'exploration ou la communication — englobe le langage animal, informatique, humain. <strong>Langue</strong> : instrument de communication propre à une communauté humaine, produit social et stable (le français, l'anglais…). <strong>Parole</strong> (Saussure) : acte individuel par lequel un individu s'approprie une langue commune. Et aussi : <strong>logos</strong> (parole rationnelle, Aristote) ≠ <strong>phone</strong> (voix animale, cri).</div></div><div class='def-sec'><div class='def-sec-title'>Signe linguistique (Saussure)</div><div class='def-sec-body'>Le signe = <strong>signifiant</strong> (image acoustique, le son) + <strong>signifié</strong> (concept mental). Lien <strong>arbitraire</strong> mais <strong>inséparable</strong> — comme le recto/verso d'une feuille. Le <strong>référent</strong> (l'objet réel) est distinct. La licorne : signifiant + signifié sans référent → le langage dépasse la transmission utilitaire.</div></div><div class='def-sec'><div class='def-sec-title'>Signal vs Symbole (Benveniste)</div><div class='def-sec-body'>Le <strong>signal</strong> est un fait physique relié à un autre par rapport naturel/conventionnel — l'animal y réagit par réflexe. Le <strong>symbole</strong> est institué par l'homme : il faut apprendre à l'interpréter. L'animal <em>exprime</em> ses émotions, il ne les <em>dénomme</em> pas. Cette capacité symbolique est à la base de toutes les fonctions conceptuelles.</div></div><div class='def-sec'><div class='def-sec-title'>6 fonctions du langage (Jakobson)</div><div class='def-sec-body'><strong>Émotive</strong> (je), <strong>conative</strong> (tu — commander, persuader), <strong>référentielle</strong> (il — décrire), <strong>phatique</strong> (maintenir le contact), <strong>métalinguistique</strong> (parler du code lui-même), <strong>poétique</strong> (la forme du message). Une phrase combine rarement une seule fonction. La fonction poétique : le langage comme fin en soi.</div></div><div class='def-sec'><div class='def-sec-title'>Le langage structure la pensée</div><div class='def-sec-body'>Saussure : sans les signes, notre pensée n'est qu'une « nébuleuse amorphe et indistincte ». Hegel (<em>Philosophie de l'esprit</em>) : « C'est dans les mots que nous pensons. » Boroditsky : les locuteurs ayant des catégories linguistiques différentes (ex. point cardinal vs gauche/droite) perçoivent le monde différemment. Orwell (<em>1984</em>) : la <em>novlangue</em> réduit le pensable en appauvrissant le vocabulaire.</div></div></details>",
  auteurs: [
    {
      n: "Saussure",
      ideas: [
        {
          w: "Cours de linguistique générale, 1916 (publié à titre posthume)",
          i: "Fonde la linguistique moderne. Le signe = signifiant + signifié, lien arbitraire mais inséparable. La langue est un système de différences : les mots n'ont pas de valeur en eux-mêmes, mais par rapport aux autres. Sans les signes, la pensée est une nébuleuse indistincte.",
          fiche: "Le signe = signifiant + signifié, lien arbitraire ; la langue est un système de différences (les mots valent les uns par rapport aux autres). Sans signes, la pensée est une nébuleuse.",
          citations: ["« La pensée, chaotique de sa nature, est forcée de se préciser en se décomposant »"],
        },
      ],
    },
    {
      n: "Benveniste",
      ideas: [
        {
          w: "Problèmes de linguistique générale, 1963",
          i: "Distingue signal et symbole : l'animal perçoit le signal et y réagit par réflexe conditionné — l'homme invente et comprend des symboles. Cette capacité symbolique est à la base des fonctions conceptuelles. Ex. du feu rouge : signal univoque pour l'animal (réaction adéquate, dressage), mais symbole équivoque pour l'homme qui l'interprète selon le contexte — <em>ya la police / vous pouvez passer / vous n'avez pas fermé le coffre / mettez les feux / décalez-vous</em>. La pensée est par essence symbolique.",
          fiche: "L'homme invente et comprend des symboles (équivoques, interprétés selon le contexte) là où l'animal ne réagit qu'à des signaux : la pensée est par essence symbolique.",
          citations: ["« L'homme invente et comprend des symboles ; l'animal, non. Tout découle de là »"],
        },
      ],
    },
    {
      n: "Jakobson",
      ideas: [
        {
          w: "Essais de linguistique générale, 1963",
          i: "Identifie 6 fonctions du langage selon le pôle de communication dominant : (1) <strong>Émotive</strong> (émetteur) — ex. « Malheureusement, mes demandes d'eau restent sans réponse… » / modalisateurs « très/trop investi » ; (2) <strong>Conative/impressive</strong> (destinataire) — ex. « Donne-moi vite de l'eau / svp / pitié » ; (3) <strong>Référentielle</strong> (contexte) — ex. « Les élèves ne donnent pas d'eau » ; (4) <strong>Phatique</strong> (contact) — ex. « N'est-ce pas ? », « C'est ça », « Allô ! ho ! » ; (5) <strong>Métalinguistique</strong> (code) — ex. « Hein ?! », « Que veut dire 'propédeutique' ? », « Comment dit-on 'bonjour' en espagnol ? » ; (6) <strong>Poétique</strong> (message) — ex. « 0 de stress ya point S », « Forme formidable », « very, very, véritable », Calligrammes d'Apollinaire. Le langage est irréductible à la seule transmission d'information.",
          fiche: "Six fonctions du langage selon le pôle dominant : émotive, conative, référentielle, phatique, métalinguistique, poétique — le langage ne sert pas qu'à informer.",
          citations: ["La fonction poétique : l'accent mis sur le message pour son propre compte"],
        },
      ],
    },
    {
      n: "Austin",
      ideas: [
        {
          w: "Quand dire, c'est faire, 1962",
          i: "Distingue énoncés constatatifs (décrivent, vrais/faux) et performatifs (accomplissent l'action qu'ils énoncent). 'Je vous déclare mari et femme' : dire, c'est faire. Conditions de félicité : statut du locuteur, reconnaissance institutionnelle. Le langage est un mode d'action.",
          fiche: "« Quand dire, c'est faire » : les énoncés performatifs accomplissent l'acte qu'ils énoncent (« je vous déclare mari et femme ») — le langage est un mode d'action.",
          citations: ["« Produire l'énonciation est exécuter une action »"],
        },
      ],
    },
    {
      n: "Bergson",
      ideas: [
        {
          w: "Le Rire, 1900 / L'évolution créatrice, 1907",
          i: "<em>Le Rire</em> : les mots (termes généraux) masquent le particulier et l'intime — nous ne voyons pas les choses mais des étiquettes. Seul le « poète » peut saisir la singularité, voire créer les mots / une langue spécifique (ex. « spleen » de Baudelaire). Pb des glissements sémantiques : un même signe peut avoir des connotations variables — ex. « bonnomatisme », « qualitatif », « punition »/« bordel », « passion » (pâtir, subir → passivité), « adulti » (quelqu'un qui m'aime). L'<em>Évolution créatrice</em> : le signe intelligent est mobile (connotations, ironie, sens figurés), contrairement au signe instinctif adhérent.",
          fiche: "Les mots généraux masquent le singulier (de simples « étiquettes ») ; seul le poète saisit l'unique — « les mots s'insinuent entre la chose et nous ».",
          citations: ["« Les mots s'insinuent entre la chose et nous »"],
        },
      ],
    },
    {
      n: "Hegel",
      ideas: [
        {
          w: "Philosophie de l'esprit, 1817",
          i: "C'est dans les mots que nous pensons. La pensée ne devient consciente d'elle-même qu'en se donnant une forme extérieure par le langage. L'intuition n'est que pensée obscure à l'état de fermentation. Le mot articulé donne à la pensée son objectivité.",
          fiche: "« C'est dans les mots que nous pensons » : la pensée ne se saisit qu'en s'extériorisant dans le langage ; sans lui, elle reste obscure, à l'état de fermentation.",
          citations: [
            "« C'est dans les mots que nous pensons — c'est le son articulé, le mot, qui seul nous offre une existence où l'externe et l'interne sont si intimement unis »",
          ],
        },
      ],
    },
    {
      n: "Orwell",
      ideas: [
        {
          w: "1984, 1949",
          i: "La novlangue est une langue artificielle conçue pour réduire le champ du pensable : moins de mots = moins de pensées possibles. Instrument du pouvoir totalitaire. Illustre que le langage conditionne la pensée et peut être outil d'oppression autant que de libération.",
          fiche: "La novlangue réduit le champ du pensable (moins de mots = moins de pensées) : le langage conditionne la pensée et peut devenir un instrument d'oppression.",
          citations: ["« La novlangue réduira finalement le champ de la pensée »"],
        },
      ],
    },
    {
      n: "Watzlawick",
      ideas: [
        {
          w: "Une logique de la communication, 1967",
          i: "Analyse les injonctions paradoxales : messages qui exigent un comportement spontané ('Soyez spontané !'). Pour obéir, il faudrait être spontané par obéissance — contradiction performative. Ces paradoxes révèlent les limites de la communication humaine et expliquent certaines formes de souffrance psychique.",
          fiche: "Injonctions paradoxales (« Soyez spontané ! ») : y obéir suppose la spontanéité même exigée — contradiction performative, source de souffrance psychique.",
          citations: ["« Soyez spontané ! » — prototype de l'injonction paradoxale"],
        },
      ],
    },
    {
      n: "Boroditsky",
      ideas: [
        {
          w: "'How language shapes the way we think', conférence TED 2017 (essai sur Edge.org en 2009)",
          i: "Linguiste cognitive américaine. Ses expériences (framework BIG : S-N-E-O) montrent que notre langue (vocabulaire + grammaire) structure nos manières de penser, percevoir, se représenter le temps et l'espace. Expériences : (1) <em>deep</em> — la langue influence le comptage ; (2) <em>early</em> — la langue influence la perception des couleurs ; (3) <em>Broad</em> — le genre grammatical des mots influence les associations de caractères (ex. 'pont' : robuste en espagnol / élégant en allemand) ; (4) <em>Weighty</em> — la langue influence l'attribution de causalité (l'accusation du gg). Ex : associations indirectes de caractères <em>lents</em> (partiellement culturellement) genrées, en raison du genre grammatical des objets.",
          fiche: "La langue (vocabulaire et grammaire) façonne la pensée : perception des couleurs, du temps, attribution de causalité — « language crafts reality ».",
          citations: ["« Language crafts reality »"],
        },
      ],
    },
    {
      n: "Cassin",
      ideas: [
        {
          w: "Vocabulaire européen des philosophies (dir.), 2004",
          i: "Les <strong>intraduisibles</strong> : certains mots sont philosophiquement intraduisibles car ils condensent une vision du monde irréductible (<em>logos</em> ≠ raison + discours en anglais ; <em>Stimmung</em> allemand ≠ humeur + atmosphère ; <em>saudade</em> portugais). La traduction est toujours une trahison partielle. Philosophie comme exploration des différences de langues — non un universalisme de fait, mais un universalisme à conquérir par la traduction.",
          fiche: "Les « intraduisibles » : certains mots condensent une vision du monde irréductible (logos, Stimmung, saudade) ; l'universel se conquiert par la traduction.",
          citations: ["Les intraduisibles révèlent ce que chaque langue pense que les autres ne pensent pas"],
        },
        {
          w: "Quand dire, c'est vraiment faire. Homère, Gorgias, Trump et nous, 2018 / Le Bon plaisir des dieux, 2019",
          i: "<strong>Trump, Poutine et la brutalisation langagière.</strong> Cassin analyse les régimes politiques contemporains à la lumière de Gorgias et de la sophistique antique : « la langue est un grand maître, qui fait ce qu'elle veut et nul ne le peut ». Le fascisme produit des <em>manières de pensée</em> dont la plus efficace est la <em>torsion</em> : on prend un mot, on le retourne, on appelle « justice » l'arbitraire, « presse libre » la propagande, « ennemi du peuple » l'opposant. La <em>brutalisation</em> du débat public est d'abord brutalisation de la langue. Conséquence : la critique du langage politique est une tâche philosophique <em>urgente</em>, pas un raffinement académique. La sophistique n'est pas morte : elle gouverne.",
          fiche: "Brutalisation de la langue (Gorgias, Trump) : on tord les mots (« justice » pour l'arbitraire) ; critiquer le langage politique est une tâche philosophique urgente.",
          citations: [
            "« La langue est un grand maître, qui fait ce qu'elle veut et nul ne le peut » (Gorgias, cité par Cassin)",
            "« Une langue de fascistes peut faire des hommes des fascistes »",
          ],
        },
      ],
    },
    {
      n: "Hannah Arendt",
      ideas: [
        {
          w: "La Crise de la culture, 1961",
          i: "La langue est mémoire : elle conserve la trace des générations. Le langage n'est pas seulement communication — c'est le médium dans lequel le monde commun se constitue et se transmet. La perte de la langue commune est une perte du monde commun.",
          fiche: "La langue est mémoire et médium du monde commun : perdre la langue partagée, c'est perdre le monde commun — le langage ne fait pas que communiquer.",
          citations: ["Le langage conserve / trace / mémoire / historique"],
        },
      ],
    },
    {
      n: "Tristan Tzara",
      ideas: [
        {
          w: "Manifeste Dada, 1918 / Pour faire un poème dadaïste",
          i: "Le langage est un matériau artistique manipulable, comme les pigments du peintre. Le poème dadaïste se fabrique en découpant un article de journal, en mettant les mots dans un sac, en les agitant et en les tirant au hasard. Le hasard et la rupture avec le sens ouvrent à une nouveauté radicale. Refus de la conception utilitaire du langage : les mots sont libérés de leur fonction référentielle pour devenir pure matière sonore et visuelle.",
          fiche: "Dada : le langage est un matériau (poème tiré au hasard d'un sac de mots) ; libérés du référent, les mots deviennent pure matière sonore et visuelle.",
          citations: ["« Prenez un journal, prenez des ciseaux… Le poème vous ressemblera »"],
        },
      ],
    },
    {
      n: "André Breton",
      ideas: [
        {
          w: "Manifeste du surréalisme, 1924",
          i: "L'écriture automatique permet l'accès direct à l'inconscient en suspendant le contrôle rationnel — le langage devient l'expression brute de la pensée non-censurée. Le surréalisme invente des jeux collectifs (cadavre exquis, jeu des définitions) où la combinaison aléatoire de phrases produit un sens neuf. La fonction poétique (Jakobson) est ici poussée à l'extrême : le langage n'est plus moyen, il est laboratoire de la pensée.",
          citations: ["L'écriture automatique : 'pensée parlée' libérée du contrôle rationnel"],
        },
      ],
    },
    {
      n: "Georges Perec",
      ideas: [
        {
          w: "La Disparition, 1969 (OULIPO)",
          i: "Membre majeur de l'OULIPO (Ouvroir de Littérature Potentielle). <em>La Disparition</em> est un roman de plus de 300 pages écrit sans la lettre 'e' (lipogramme). La contrainte radicale, loin d'appauvrir le langage, génère paradoxalement de la nouveauté : l'écrivain doit inventer des tournures, mobiliser un lexique inédit. Démontre que le langage comme matériau peut être réinventé par les règles formelles. Voir aussi : palindromes (le poème '9691, edna d'nilu, o, mû, acéré, perçu… ').",
          citations: ["« La contrainte est libératrice » (devise oulipienne)"],
        },
      ],
    },
  ],
  textes: [
    {
      n: "Benveniste — Signal vs Symbole",
      t: "Un signal est un fait physique relié à un autre par rapport naturel ou conventionnel. L'animal perçoit le signal et réagit adéquatement (réflexe conditionné, dressage). Le décodage est univoque. L'homme utilise en outre le symbole : la réponse peut être erronée et nécessite une interprétation — le symbole est équivoque. Ex. du feu rouge perçu par un policier : ya la police / vous pouvez passer / vous n'avez pas fermé le coffre / mettez les feux / décalez-vous. L'animal exprime ses émotions, il ne peut les dénommer. La capacité symbolique est à la base des fonctions conceptuelles.",
    },
    {
      n: "Conception partielle du langage et sa limite",
      t: "Conception partielle : on comprend que le langage est un moyen de communiquer en fait de nos besoins et d'actions à accomplir — considéré comme un code transmettant des informations sur un individu ou le monde extérieur. En ce sens, le langage humain = code fait de signaux. Mais cette conception ne s'y réduit pas, car la fonction symbolique et conceptuelle est démontrée : il faut recourir au contexte, interpréter (le symbole est équivoque ≠ signal univoque), et le langage produit du sens au-delà de la seule information.",
    },
    {
      n: "Boroditsky — 'How language shapes the way we think ?'",
      t: "Notre langage (vocabulaire + grammaire) structure nos manières de penser, de percevoir sensoriellement le monde, de nous représenter le temps et l'espace, et conditionne l'acquisition de compétences pratiques. Framework BIG (S-N-E-O) : (1) Organisation spatiale — ceux qui utilisent les points cardinaux ont une orientation supérieure ; (2) Compter — la langue influence le comptage (deep/count) ; (3) Percevoir — la langue influence la perception des couleurs (early/colors) ; (4) Sens de valeur/attention — Broad (le genre grammatical des choses) ; (5) Weighty (la cause : l'accusation du gg). Ex. : association indirecte de caractères lents (partiellement culturellement) genrée, d'objets en raison de leur genre grammatical. 'Language crafts reality.'",
    },
    {
      n: "Saussure — La langue comme pensée dans la matière phonique",
      t: "La pensée, abstraction faite de son expression par les mots, n'est qu'une masse amorphe et indistincte. Sans les signes, nous serions incapables de distinguer deux idées d'une façon claire et constante. Le signifiant et le signifié sont les deux faces du signe linguistique, aussi inséparables que le recto et le verso d'une feuille de papier. La pensée ne préexiste pas aux sons.",
    },
    {
      n: "Bergson — Termes généraux",
      t: "Nous ne voyons pas les choses mêmes ; nous nous bornons, le plus souvent, à lire des étiquettes collées sur elles. Les mots (sauf les noms propres) désignent des genres — le mot s'insinue entre la chose et nous. Seul le « poète » peut saisir la singularité avec des termes généraux, voire créer les mots d'une langue spécifique. Ex. : « Spleen » de Baudelaire — mot anglais devenu concept propre, intraduisible, condensant une humeur mélancolique moderne. Jusque dans notre propre individu, l'individualité nous échappe. (Le Rire, 1900)",
    },
    {
      n: "Bergson — Mobilité du signe / glissements sémantiques",
      t: "Ce qui caractérise les signes du langage humain, c'est leur mobilité. Le signe instinctif est un signe adhérent, le signe intelligent est un signe mobile. Un signe n'est pas figé dans une seule signification. Exemples de glissements sémantiques : « bonnomatisme », « qualitatif », « punition »/« bordel » (changement de registre), « passion » (pâtir, subir → passivité, connotation négative), « adulti » (quelqu'un qui m'aime — sens affectif construit). Le glissement sémantique montre que le langage ne peut se réduire à un code stable. (L'évolution créatrice, 1907)",
    },
    {
      n: "Watzlawick — Injonctions paradoxales",
      t: "La forme la plus fréquente sous laquelle le paradoxe s'introduit dans la communication humaine est l'injonction exigeant un comportement déterminé qui, par sa nature même, ne saurait être que spontané. 'Soyez spontané !' — pour obéir, il faudrait être spontané par obéissance, donc sans spontanéité. (Une logique de la communication, 1967)",
    },
    {
      n: "Hegel — La pensée dans les mots",
      t: "C'est dans les mots que nous pensons. Nous n'avons conscience de nos pensées déterminées et réelles que lorsque nous leur donnons la forme objective, que nous les différencions de notre intériorité et par suite nous les marquons d'une forme externe. L'intuition n'est que de la pensée obscure, à l'état de fermentation. C'est le son articulé, le mot, qui seul nous offre une existence où l'externe et l'interne sont si intimement unis. (Philosophie de l'esprit, 1817)",
    },
    {
      n: "Austin — Performatif",
      t: "Quand je dis 'oui je le veux' lors de la cérémonie du mariage, ce n'est ni décrire ce que je fais ni affirmer que je le fais : c'est le faire. Je propose d'appeler une telle phrase 'performative'. Ce nom dérive du verbe 'perform' : produire l'énonciation est exécuter une action. Conditions de félicité : statut du locuteur, reconnaissance par l'assistance. (Quand dire, c'est faire, 1962)",
    },
    {
      n: "Fonction poétique, signifiant et synesthésie (Rimbaud)",
      t: "Fonction poétique (Jakobson) : les signes/mots sont des matériaux permettant l'expérimentation sensorielle — la forme se déploie sur la feuille (visuel), le son (auditif). Recherche de synesthésie comme prolongement visant à toucher les sens via les signifiés. Rimbaud, 'L'Alchimie du verbe' : 'J'inventais la couleur des voyelles / A noir, E blanc, I rouge, O bleu, U vert' / 'le bon son de septembre ou je sentais des gouttes, / I rosée à mon front comme un vin de vigueur.' Le signifiant lui-même devient matière expressive irréductible au sens conceptuel. Voir aussi : Calligrammes d'Apollinaire (forme visuelle du texte).",
    },
    {
      n: "Le langage = fin en soi (refus du présupposé II)",
      t: "Présupposé à dépasser : 'le langage sert à…' = langage comme outil/moyen. Refus de ce présupposé : <strong>le langage est fin en soi</strong>. Trois aspects le démontrent : (1) <strong>fonction poétique</strong> — le langage est matériau artistique (Tzara, Cendrars, Apollinaire, Perec, Breton, OULIPO) : place au hasard, règles/contraintes, qui paradoxalement génèrent de la nouveauté ; (2) <strong>fonction performative</strong> (Austin, 'Quand dire, c'est faire') : se marier, léguer, parier, baptiser — actions qui se réduisent à l'acte d'énonciation. PARLER = AGIR. Énoncé descriptif ≠ énoncé performatif. Conditions de félicité : consentement, autorité/statut symbolique, fictions (règles administratives), liens, contrats ; (3) <strong>langage = pensée</strong> — deux faces d'une même pièce.",
    },
    {
      n: "Co-construction langage/pensée et effet clarificateur (Saussure)",
      t: "Indétermination initiale : sans langage, la pensée est <em>matière phonique</em> (« bruit »), <em>masse amorphe et indistincte</em>. Aucun mot, aucune catégorie : chaos de sensations, perceptions, émotions inorganisé — l'expérience sans langage. <strong>Co-construction</strong> langage/pensée : le mot organise le chaos. La désorganisation cède à un tri organisationnel (« clarté »), systématique et matriciel (« constant »). Exemples : calcul d'intégrale, anthropocène, diapédèse, radioalpha (désigner l'imperceptible), formication (vocabulaire de la symptomatologie). Le mot/signe linguistique opère une <strong>objectivation d'un état intérieur</strong> qui explique l'effet clarificateur — d'où la thérapie par la parole (Freud) et la sublimation artistique.",
    },
  ],
  exemples: [
    {
      tag: "Littérature",
      tit: "Tour de Babel (Genèse 11)",
      body: "Mythe fondateur de l'incommunicabilité : les hommes parlaient une seule langue, construisaient la Tour de Babel. Dieu confond leurs langues et les disperse. Illustre que la multiplicité des langues est à la fois richesse (diversité des mondes) et obstacle (incompréhension). Borgès, Cassin sur les intraduisibles prolongent cette réflexion.",
      lien: "→ Limite de la communication, intraduisibles",
    },
    {
      tag: "Littérature",
      tit: "Orwell — 1984 et la novlangue",
      body: "La novlangue est conçue pour rendre hérétique impossible : si 'liberté' est supprimé du dictionnaire, le concept disparaît avec le mot. 'Bienbon' remplace 'bien', 'doubleplusbienbon' est le superlatif absolu. Illustre la thèse que le langage conditionne la pensée — et que son contrôle est instrument de pouvoir totalitaire.",
      lien: "→ Langage, Liberté, État (notions liées)",
    },
    {
      tag: "Philosophie",
      tit: "Austin — Énoncés performatifs",
      body: "'Je vous déclare mari et femme' (le maire), 'Je baptise ce bateau la Queen Elisabeth', 'Je lègue ma montre à mon frère'. Ces phrases ne décrivent pas une action — elles la font. Elles modifient la réalité sociale. Conditions de félicité : statut du locuteur, reconnaissance. Un convive éméché ne peut pas déclarer mari et femme deux invités.",
      lien: "→ Langage comme action, Travail, Droit",
    },
    {
      tag: "Science",
      tit: "Boroditsky — Le langage oriente la perception (BIG framework)",
      body: "Framework BIG (S-N-E-O) — 5 domaines d'expérimentation : (1) Organisation spatiale : les Kuuk Thaayorre utilisent les points cardinaux → orientation spatiale extraordinaire ; (2) Comptage (deep/count) : la langue structure le dénombrement ; (3) Perception des couleurs (early/colors) : catégories linguistiques influencent la discrimination visuelle ; (4) Genre grammatical (Broad) : 'pont' → robuste/fort en espagnol (masculin), élégant/beau en allemand (féminin) — associations de caractères lents partiellement genrées culturellement ; (5) Attribution causale (Weighty) : la langue influence qui l'on accuse dans un accident. 'Language crafts reality.'",
      lien: "→ Langage, Conscience, Raison, relativisme linguistique",
    },
    {
      tag: "Littérature",
      tit: "Rimbaud — 'L'Alchimie du verbe' et synesthésie",
      body: "Fonction poétique (Jakobson) : le signifiant devient matière expressive. Rimbaud : 'J'inventais la couleur des voyelles / A noir, E blanc, I rouge, O bleu, U vert.' Puis : 'le bon son de septembre ou je sentais des gouttes, / I rosée à mon front comme un vin de vigueur.' Le poète exploite la synesthésie — correspondance entre sons et sensations — pour dépasser la fonction référentielle. Le langage comme fin en soi. Voir aussi : Calligrammes d'Apollinaire (forme visuelle du poème).",
      lien: "→ Fonction poétique (Jakobson), Art, langage comme fin en soi",
    },
    {
      tag: "Philosophie",
      tit: "Jakobson — Les 6 fonctions (publicités)",
      body: "'Dior, j'adore' → fonction poétique (jeu de sonorités). 'Allô, vous m'entendez ?' → fonction phatique. 'Vite ! Dépêche-toi !' → fonction conative. 'Hélas ! Je suis arrivé trop tard' → fonction émotive. 'Que voulez-vous dire par là ?' → fonction métalinguistique. 'Le train est en retard' → fonction référentielle.",
      lien: "→ Fonctions du langage, Communication",
    },
    {
      tag: "Philosophie",
      tit: "Watzlawick — Injonctions paradoxales",
      body: "'Soyez spontané !' : paradoxe de communication — on ne peut obéir qu'en désobéissant à l'esprit de l'injonction. Autres exemples : 'Tu devrais m'aimer', 'Ne sois pas si docile'. Ces paradoxes révèlent que le langage peut se retourner contre sa propre fonction et produire de la souffrance psychique (double bind de Bateson).",
      lien: "→ Limites de la communication, Injonction paradoxale",
    },
    {
      tag: "Littérature",
      tit: "Tristan Tzara — Poème dadaïste (« recette »)",
      body: "Tzara propose une « recette » pour faire un poème dadaïste : prendre un journal, prendre des ciseaux, choisir un article de la longueur du poème souhaité, découper soigneusement chaque mot, les mettre dans un sac, agiter doucement, sortir les coupures dans l'ordre où elles quittent le sac, recopier consciencieusement. « Le poème vous ressemblera. » Provocation et démonstration : le langage est matériau, le hasard peut faire œuvre, et la fonction référentielle n'est pas l'essence du poème.",
      lien: "→ Tzara, fonction poétique, langage = matériau, hasard créateur",
    },
    {
      tag: "Littérature",
      tit: "Apollinaire — Calligrammes (1918)",
      body: "Apollinaire dispose les vers de manière à former une image (cœur, pluie, tour Eiffel, cravate). La forme visuelle du texte fait sens — le signifiant graphique devient porteur de signifié. Illustre la fonction poétique : le langage n'est plus seulement son ou concept, mais aussi forme spatiale. L'œil lit autant que l'oreille entend. Prolonge la synesthésie de Rimbaud (L'Alchimie du verbe).",
      lien: "→ Fonction poétique, Art, Rimbaud (synesthésie)",
    },
    {
      tag: "Littérature",
      tit: "Breton — Cadavre exquis et écriture automatique",
      body: "<strong>Cadavre exquis</strong> : jeu collectif surréaliste où chacun écrit un mot puis plie la feuille pour cacher ce qu'il a écrit avant de la passer. Le premier essai a donné « Le cadavre — exquis — boira — le vin — nouveau ». Le hasard combinatoire produit du sens neuf. <strong>Écriture automatique</strong> : écrire vite, sans plan, sans censure rationnelle, pour laisser émerger l'inconscient. Le langage devient laboratoire de l'inconscient — au croisement de la fonction poétique (Jakobson) et de la psychanalyse (Freud).",
      lien: "→ Breton, surréalisme, inconscient (Freud), fonction poétique",
    },
    {
      tag: "Littérature",
      tit: "Perec — La Disparition (1969) et OULIPO",
      body: "<em>La Disparition</em> est un roman policier de plus de 300 pages écrit sans la lettre 'e' (lipogramme) — la voyelle la plus fréquente du français. La contrainte est si radicale qu'elle devient le sujet caché du livre (le 'e' qui a disparu = Anton Voyl, le héros). L'OULIPO (Ouvroir de Littérature Potentielle, fondé en 1960 par Queneau et Le Lionnais) explore systématiquement les contraintes formelles : palindromes, lipogrammes, S+7. Devise : « la contrainte est libératrice ». Démontre que les règles formelles génèrent paradoxalement de la nouveauté.",
      lien: "→ Perec, OULIPO, langage = matériau, contrainte créatrice",
    },
    {
      tag: "Littérature",
      tit: "Cendrars — La Prose du Transsibérien (1913)",
      body: "Blaise Cendrars épouse l'expérience du rythme du train Transsibérien en s'abandonnant au rythme du langage : vers libres, scansion irrégulière, longueurs variables. Le poème (premier 'livre simultané' avec Sonia Delaunay, 2 mètres de long) joint texte et couleurs. Le langage cesse d'être pur véhicule pour devenir corps rythmique, sensoriel, qui mime ce qu'il évoque.",
      lien: "→ Fonction poétique, rythme, Apollinaire, Calligrammes",
    },
    {
      new: true,
      tag: "Actualité",
      tit: "Cassin — Comment Trump et Poutine malmènent la langue",
      body: "Barbara Cassin analyse les usages politiques contemporains du langage à la lumière de la <em>sophistique antique</em> (Gorgias) et de la <em>novlangue</em> orwellienne. Mécanismes observés : (1) <strong>torsion</strong> — un mot est retourné contre son sens (« presse libre » désigne la propagande, « démocratie » la majorité tyrannique) ; (2) <strong>répétition</strong> — une affirmation reprise est tenue pour vraie, indépendamment de toute preuve ; (3) <strong>insulte rituelle</strong> — l'opposant n'est pas réfuté, il est disqualifié comme catégorie morale (« ennemi du peuple ») ; (4) <strong>brutalisation</strong> — l'horizon du débat se rétrécit, l'argument cède la place à l'agression. Cassin : ce n'est pas un raffinement académique, c'est une <em>urgence philosophique</em> — « une langue de fascistes peut faire des hommes des fascistes ».",
      lien: "→ Cassin, Trump, Poutine, sophistique, brutalisation langagière, novlangue",
    },
    {
      new: true,
      tag: "Société",
      tit: "« Une société qui cherche ses mots »",
      body: "Diagnostic contemporain : appauvrissement du vocabulaire politique commun (<em>Le 1 Hebdo</em>, 2024-2025). À mesure que les mots se raréfient et se polarisent, le débat public glisse de l'argumentation vers l'<em>indignation</em>, du raisonnement vers le <em>slogan</em>. Phénomène lié à : (1) la rapidité des échanges numériques (140 puis 280 caractères) ; (2) la logique algorithmique qui valorise l'émotion sur la nuance ; (3) la viralité du like et du repartage. Conséquence : on partage la langue sans plus partager les concepts qu'elle véhicule — phénomène que Cassin appelle « brutalisation » et qu'Orwell anticipait sous le nom de novlangue. Réponse philosophique : redonner épaisseur conceptuelle au vocabulaire commun, redonner à la conversation le temps qu'elle demande.",
      lien: "→ Novlangue, Cassin, post-vérité, débat public, réseaux sociaux",
    },
    {
      new: true,
      tag: "Philosophie politique",
      tit: "Simone Weil — La liberté d'expression a-t-elle des limites ?",
      body: "Dans <em>L'Enracinement</em> (1949, posthume) et plusieurs textes des années de Londres, Simone Weil distingue deux choses qu'on confond trop souvent : (1) la <strong>liberté de l'intelligence</strong> — qui doit être absolue pour le penseur ou le savant, parce que la pensée a besoin du droit de tout examiner, y compris l'impossible et l'odieux ; (2) la <strong>liberté de propagande</strong> — qui ne peut être absolue, parce qu'elle exerce un pouvoir de fait sur les âmes et engage donc une <em>responsabilité</em>. Confondre les deux conduit, selon Weil, à protéger le mensonge sous couvert de penser librement. Le débat contemporain sur les <em>fake news</em>, les <em>haters</em>, les contenus extrêmes en ligne rejoue ce partage qu'elle proposait il y a quatre-vingts ans.",
      lien: "→ Weil, liberté d'expression, responsabilité, post-vérité, fake news",
    },
  ],
  accroches: [
    {
      type: "Citation",
      t: "« Les limites de mon langage signifient les limites de mon monde » : pour Wittgenstein, on ne pense pas d’abord puis on parle — c’est le langage qui découpe ce que nous pouvons penser.",
      src: "Wittgenstein, Tractatus",
      new: true,
    },
    {
      type: "Paradoxe",
      t: "Bergson déplore que « le mot brutal range » la réalité dans des cases : le langage, fait pour communiquer, trahirait-il ce qu’il y a de plus singulier en nous ?",
      new: true,
    },
  ],
  liens: ["Conscience", "Liberté", "Technique", "Raison", "Art", "Nature"],
  diss: [
    {q: "Le langage ne sert-il qu'à communiquer ?"},
    {q: "Les mots peuvent-ils tout dire ?"},
    {q: "Le langage exprime-t-il la pensée ou la constitue-t-il ?"},
    {q: "Peut-on communiquer sans mentir ?"},
    {q: "Le langage est-il un obstacle à la connaissance ?"},
    {q: "Parler, est-ce agir ?"},
    {q: "Peut-on penser sans langage ?"},
    {q: "Toutes les langues sont-elles équivalentes ?"},
    {q: "Le langage nous appartient-il ?"},
    {q: "Science et religion s'opposent-elles nécessairement ?"},
  ],
  plans: [
    {
      q: "Le langage n'est-il qu'un instrument de transmission d'information ?",
      theme: "Le langage est un moyen de communiquer",
      intro: "",
      pb: "Le langage n'est-il qu'un instrument de transmission d'information ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Chez les animaux, le langage est un code servant à communiquer des informations sur le monde extérieur ou l'individu lui-même (codes visuels, sonores, chimiques, tactiles). Le langage humain peut en ce sens s'apparenter à un code.",
              auteurs: "",
              ref: "Éthologie animale ; Saussure (signifiant/signifié comme code)",
              limite: "",
            },
          ],
          limite: "",
        },
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Saussure fonde la linguistique structurale : le signe = signifiant + signifié, arbitraires mais inséparables. Le langage humain est un système qui permet de désigner des objets, actions, états de manière compréhensible par autrui.",
              auteurs: "",
              ref: "Saussure, Cours de linguistique générale",
              limite: "",
            },
          ],
          limite: "",
        },
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Cependant le langage humain ne peut se réduire à un code : comprendre un énoncé exige d'interpréter, faire des hypothèses, contextualiser. Benveniste : signal ≠ symbole — l'animal réagit au signal, l'homme interprète le symbole.",
              auteurs: "",
              ref: "Benveniste, Problèmes de linguistique générale",
              limite: "",
            },
          ],
          limite: "",
        },
      ],
      new: false,
      modified: false,
      migrated: true,
    },
    {
      q: "En quoi le langage dépasse-t-il la simple transmission d'information ?",
      theme: "Le langage a d'autres fonctions que la communication",
      intro: "",
      pb: "En quoi le langage dépasse-t-il la simple transmission d'information ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Argument par l'absurde (II.1) : le langage échoue trop souvent à communiquer efficacement pour qu'on considère qu'il ne sert qu'à ça. (a) Pb des termes généraux — les mots masquent le particulier ; seul le poète peut saisir la singularité, voire créer un mot : 'spleen' de Baudelaire (Bergson, Le Rire). (b) Mobilité signifiante — glissements sémantiques : 'bonnomatisme', 'qualitatif', 'passion' (pâtir/passivité), 'adulti' (quelqu'un qui m'aime). (c) Injonctions paradoxales : 'Soyez spontané !' — ordre auquel il est logiquement impossible de répondre par l'obéissance, car si on y obéit on n'y obéit pas (Watzlawick).",
              auteurs: "",
              ref: "Bergson, Le Rire ; Watzlawick, Une logique de la communication",
              limite: "",
            },
          ],
          limite: "",
        },
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Jakobson identifie 6 fonctions du langage. Les fonctions émotive (marques d'affect : 'Malheureusement…', modalisateurs), conative (impératif, persuasion : 'Donne-moi de l'eau !'), phatique ('Allô ! N'est-ce pas ?'), métalinguistique ('Que veut dire… ?') et poétique dépassent la seule transmission d'information référentielle.",
              auteurs: "",
              ref: "Jakobson, Essais de linguistique générale",
              limite: "",
            },
          ],
          limite: "",
        },
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Le langage a aussi une fonction sociale/politique : facteur d'appartenance et d'identité culturelle. Il peut être instrument de pouvoir (novlangue d'Orwell : supprimer les mots c'est supprimer les pensées) ou mémoire collective (Arendt). La langue est la dimension culturelle d'une communauté.",
              auteurs: "",
              ref: "Orwell, 1984 ; Arendt, La Crise de la culture",
              limite: "",
            },
          ],
          limite: "",
        },
      ],
      new: false,
      modified: false,
      migrated: true,
    },
    {
      q: "Le langage n'est-il qu'un simple moyen ou peut-il être une fin en lui-même ?",
      theme: "Loin d'être un simple moyen, le langage peut être une fin en soi",
      intro: "",
      pb: "Le langage n'est-il qu'un simple moyen ou peut-il être une fin en lui-même ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "La fonction poétique du langage (Jakobson) centre le message sur lui-même, détruisant le rapport utilitaire entre signifiant et signifié. Le signifiant devient matière expressive : synesthésie (Rimbaud : 'A noir, E blanc, I rouge, O bleu, U vert'), calligrammes (Apollinaire), jeux de sonorités. Le langage dépasse la communication pour atteindre l'expérimentation sensorielle.",
              auteurs: "",
              ref: "Jakobson, Essais de linguistique générale ; Rimbaud, 'L'Alchimie du verbe' ; Apollinaire",
              limite: "",
            },
          ],
          limite: "",
        },
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Austin : le langage performatif est un mode d'action — certaines paroles font des choses. 'Je vous déclare mari et femme' modifie la réalité. Le langage n'est pas seulement représentation mais constitution du réel social. Le droit repose sur cette performativité.",
              auteurs: "",
              ref: "Austin, Quand dire, c'est faire, 1962",
              limite: "",
            },
          ],
          limite: "",
        },
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Le langage structure et met en forme la pensée (Saussure, Hegel) — la pensée sans langage n'est qu'une nébuleuse indistincte. Plus profond encore (Boroditsky, framework BIG) : la langue oriente la manière de percevoir le monde — comptage, couleurs, espace, genre grammatical, attribution causale. Le langage n'est pas seulement moyen de la pensée mais sa condition de possibilité.",
              auteurs: "",
              ref: "Saussure, CLG ; Hegel, Philosophie de l'esprit ; Boroditsky, 'How language shapes the way we think', TED 2017",
              limite: "",
            },
          ],
          limite: "",
        },
      ],
      new: false,
      modified: false,
      migrated: true,
    },
  ],
});
