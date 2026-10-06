/* Notion « Interprétation » : tout est-il affaire d’interprétation ?
   HORS PROGRAMME (étape 5) : notion du programme de 2003, absente de celui de 2019.
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("interpretation", {
  c: "#9A6A3A",
  l: "Interprétation",
  s: "Tout est-il affaire d'interprétation ?",
  def: "<span class='kw'>Interpréter</span>, c'est dégager le sens de quelque chose qui ne le livre pas immédiatement : un texte, un rêve, une œuvre, un comportement, un événement. L'interprète traduit, fait passer d'un sens caché ou obscur à un sens compris. Question : y a-t-il des interprétations vraies et d'autres fausses, ou chacun peut-il comprendre comme il veut ?<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>L'art d'interpréter les textes</div><div class='def-sec-body'>L'herméneutique (du grec <em>hermêneia</em>, l'interprétation, qu'on rapproche d'Hermès, messager des dieux) est d'abord l'art d'interpréter les textes sacrés et juridiques. Averroès demande d'interpréter un verset quand son sens apparent contredit une démonstration. Spinoza veut qu'on interprète l'Écriture par l'Écriture seule, comme on étudie la nature, en tenant compte de sa langue et de son histoire.</div></div><div class='def-sec'><div class='def-sec-title'>Expliquer et comprendre</div><div class='def-sec-body'>Au XIXe siècle, Dilthey oppose les sciences de la nature, qui expliquent par des causes, et les sciences de l'esprit, qui comprennent un sens. Weber veut que la sociologie comprenne le sens que les acteurs donnent à leurs actions pour en expliquer les effets. Ricœur refuse l'opposition : expliquer plus, c'est comprendre mieux. On parle de cercle herméneutique : on comprend le tout par les parties et les parties par le tout.</div></div><div class='def-sec'><div class='def-sec-title'>Tout est-il interprétation ?</div><div class='def-sec-body'>Nietzsche affirme qu'il n'y a pas de faits, seulement des interprétations : chaque point de vue interprète le monde selon ses besoins (perspectivisme). Freud fait du rêve un texte à déchiffrer. Ricœur appelle Marx, Nietzsche et Freud les « maîtres du soupçon ». Mais Umberto Eco (<em>Les Limites de l'interprétation</em>, 1990) rappelle qu'un texte limite les lectures qu'il autorise : il y a des surinterprétations.</div></div></details>",
  sources: [
    "Averroès, <em>Discours décisif</em> (1179)",
    "Spinoza, <em>Traité théologico-politique</em>, chap. VII (1670)",
    "Nietzsche, <em>Fragments posthumes</em> (1886-1887)",
    "Freud, <em>L'Interprétation des rêves</em> (1900 ; phrase de la « voie royale » ajoutée en 1909)",
    "Weber, <em>Économie et société</em>, I, § 1 (1922)",
    "Ricœur, <em>De l'interprétation. Essai sur Freud</em> (1965) ; <em>Du texte à l'action</em> (1986)",
    "Umberto Eco, <em>Les Limites de l'interprétation</em> (1990)",
    "Programme de philosophie de terminale de 2003 (BO n° 25 du 19 juin 2003), où « L'interprétation » était une notion",
  ],
  auteurs: [
    {
      n: "Averroès",
      ideas: [
        {
          w: "Discours décisif (1179)",
          i: "Quand le sens apparent d'un verset contredit une conclusion démontrée, il faut l'interpréter (<em>ta'wîl</em>) : faire passer le mot de son sens propre à un sens figuré, selon les usages de la langue arabe. Mais cette interprétation est réservée aux savants capables de démonstration : la livrer au plus grand nombre sèmerait le trouble.",
          new: true,
          citations: [
            "Interpréter, c'est faire passer un mot du sens propre au sens figuré, selon l'usage de la langue (Discours décisif, reformulé)",
          ],
          fiche: "Quand le sens apparent contredit la démonstration, on interprète, en passant du sens propre au sens figuré.",
        },
      ],
    },
    {
      n: "Spinoza",
      ideas: [
        {
          w: "Traité théologico-politique, chap. VII (1670)",
          i: "Pour interpréter l'Écriture, il faut procéder comme pour la nature : ne rien tirer d'ailleurs que de l'Écriture elle-même, de sa langue (l'hébreu), de l'histoire de chaque livre, de ses auteurs et de ses lecteurs. On cherche le sens d'un texte, non sa vérité : il ne faut pas confondre ce que dit l'auteur avec ce que la raison juge vrai.",
          new: true,
          citations: [
            "La méthode d'interprétation de l'Écriture ne diffère pas de celle de l'interprétation de la nature (chap. VII, reformulé)",
          ],
          fiche: "Interpréter l'Écriture par l'Écriture seule, comme on étudie la nature : chercher le sens, non la vérité.",
        },
      ],
    },
    {
      n: "Nietzsche",
      ideas: [
        {
          w: "Fragments posthumes (1886-1887) ; Par-delà bien et mal (1886)",
          i: "Contre le positivisme, qui s'en tient aux faits, Nietzsche répond : justement, il n'y a pas de faits, seulement des interprétations. Le monde n'a pas un sens mais d'innombrables : chaque point de vue, chaque force, chaque besoin l'interprète. C'est le perspectivisme. Même la science est une interprétation, utile à un certain type de vie.",
          new: true,
          citations: ["« Il n'y a pas de faits, seulement des interprétations » (Fragments posthumes, 1886-1887)"],
          fiche: "Il n'y a pas de faits, seulement des interprétations : le monde a autant de sens que de perspectives.",
        },
      ],
    },
    {
      n: "Freud",
      ideas: [
        {
          w: "L'Interprétation des rêves (1900)",
          i: "Le rêve a un sens. Son contenu manifeste (ce dont on se souvient) déguise un contenu latent (des pensées et des désirs refoulés). L'interprétation remonte de l'un à l'autre par les associations libres du rêveur, en défaisant le travail du rêve (condensation, déplacement). C'est le modèle de toute interprétation psychanalytique.",
          new: true,
          citations: [
            "« L'interprétation des rêves est la voie royale qui mène à la connaissance de l'inconscient » (L'Interprétation des rêves, chap. VII, ajout de 1909)",
          ],
          fiche: "Le rêve déguise un contenu latent ; l'interprétation le retrouve par les associations du rêveur.",
        },
      ],
    },
    {
      n: "Weber",
      ideas: [
        {
          w: "Économie et société, I, § 1 (1922)",
          i: "La sociologie veut comprendre par interprétation l'activité sociale, et par là l'expliquer causalement. Comprendre, c'est saisir le sens visé par l'acteur : un homme coupe du bois, pour le vendre, pour se chauffer, pour se défouler ? Le même geste n'a pas le même sens. Pour comparer, le sociologue construit des types idéaux.",
          new: true,
          citations: [
            "La sociologie veut comprendre par interprétation l'activité sociale, et par là l'expliquer causalement (Économie et société, I, § 1, reformulé)",
          ],
          fiche: "Comprendre le sens que l'acteur donne à son action pour l'expliquer : le même geste n'a pas le même sens.",
        },
      ],
    },
    {
      n: "Ricœur",
      ideas: [
        {
          w: "De l'interprétation (1965) ; Du texte à l'action (1986)",
          i: "Ricœur distingue deux styles d'interprétation : une herméneutique du soupçon, celle de Marx, Nietzsche et Freud, les « maîtres du soupçon », qui démasque les illusions de la conscience ; et une herméneutique de la confiance, qui recueille le sens. Il refuse d'opposer expliquer et comprendre : on comprend mieux un texte après en avoir expliqué la structure et le contexte.",
          new: true,
          citations: ["« expliquer plus, c'est comprendre mieux » (Du texte à l'action)"],
          fiche: "Soupçon et confiance ; expliquer et comprendre ne s'opposent pas : expliquer plus, c'est comprendre mieux.",
        },
      ],
    },
  ],
  textes: [
    {
      new: true,
      n: "Spinoza — Interpréter l'Écriture comme on étudie la nature (Traité théologico-politique, VII, 1670)",
      t: "Résumé du chapitre : on attribue à l'Écriture ce qu'on veut y lire, et chaque Église défend ses fictions. Spinoza propose une méthode : de même que l'interprétation de la nature part d'une histoire de la nature (des observations) pour en tirer des définitions, l'interprétation de l'Écriture doit partir d'une histoire de l'Écriture : la langue hébraïque, le contenu de chaque livre, la vie de ses auteurs, les circonstances de sa rédaction et de sa transmission. On ne cherche pas si ce que dit le texte est vrai, mais ce qu'il veut dire. Cette méthode fonde la critique historique des textes.",
    },
  ],
  plans: [
    {
      new: true,
      q: "Tout est-il affaire d'interprétation ?",
      intro: "Un message bref, un silence, un tableau, une loi : chacun y lit autre chose. « C'est ton interprétation » sert souvent à clore une discussion, comme si toutes se valaient.",
      pb: "Si tout est interprétation, il n'y a plus de vérité, seulement des points de vue. Mais si certaines interprétations sont meilleures que d'autres, à quoi le reconnaît-on ? Interpréter, est-ce projeter son point de vue, ou chercher un sens qui est déjà là ?",
      axes: [
        {
          t: "Beaucoup de choses demandent à être interprétées",
          sps: [
            {
              new: true,
              t: "Le texte et son sens apparent (Averroès)",
              args: "Quand le sens apparent contredit une démonstration, il faut interpréter le texte : passer du sens propre au sens figuré.",
              auteurs: "Averroès",
              ref: "Averroès, Discours décisif",
              limite: "Encore faut-il des règles pour ne pas faire dire n'importe quoi au texte.",
            },
            {
              new: true,
              t: "Le rêve, un texte à déchiffrer (Freud)",
              args: "Le rêve a un sens caché ; l'interprétation remonte du contenu manifeste au contenu latent.",
              auteurs: "Freud",
              ref: "Freud, L'Interprétation des rêves",
              limite: "L'interprète risque de trouver ce qu'il cherchait.",
            },
          ],
          limite: "Si même nos rêves demandent une interprétation, qu'est-ce qui y échappe ?",
        },
        {
          t: "Au point que tout semble interprétation",
          sps: [
            {
              new: true,
              t: "Pas de faits, des interprétations (Nietzsche)",
              args: "Chaque perspective interprète le monde selon ses besoins ; même la science est une interprétation.",
              auteurs: "Nietzsche",
              ref: "Nietzsche, Fragments posthumes",
              limite: "Mais la thèse ne se réfute-t-elle pas elle-même, si elle n'est qu'une interprétation ?",
            },
            {
              new: true,
              t: "Le monde social est fait de sens (Weber)",
              args: "Une action n'existe socialement que par le sens que lui donnent les acteurs : l'interprétation est la méthode même de la sociologie.",
              auteurs: "Weber",
              ref: "Weber, Économie et société, I, § 1",
              limite: "",
            },
          ],
          limite: "Que tout soit à interpréter ne veut pas dire que toutes les interprétations se valent.",
        },
        {
          t: "Mais l'interprétation a des règles et des limites",
          sps: [
            {
              new: true,
              t: "Une méthode d'interprétation (Spinoza)",
              args: "Interpréter un texte par lui-même, sa langue et son histoire : chercher son sens, non lui faire dire ce qu'on pense vrai.",
              auteurs: "Spinoza",
              ref: "Spinoza, Traité théologico-politique, VII",
              limite: "",
            },
            {
              new: true,
              t: "Expliquer plus, comprendre mieux (Ricœur)",
              args: "L'explication (structure, contexte) contrôle la compréhension ; Eco ajoute qu'un texte limite les lectures qu'il autorise.",
              auteurs: "Ricœur",
              ref: "Ricœur, Du texte à l'action ; Eco, Les Limites de l'interprétation",
              limite: "",
            },
          ],
          limite: "",
        },
      ],
    },
  ],
  exemples: [
    {
      new: true,
      tag: "Droit",
      tit: "Le juge, interprète de la loi",
      body: "Une loi est générale, un litige est particulier : le juge doit interpréter le texte pour l'appliquer à un cas que le législateur n'avait pas forcément prévu. En France, la Cour de cassation veille à ce que la loi soit interprétée de la même manière partout. L'interprétation a ici des règles, et des conséquences très concrètes.",
      lien: "→ Justice, Langage",
    },
    {
      new: true,
      tag: "Psychologie",
      tit: "Les taches d'encre de Rorschach",
      body: "Le psychiatre suisse Hermann Rorschach publie en 1921 un test fait de taches d'encre symétriques : chacun y voit autre chose, un papillon, deux danseurs, un masque. Ce qu'on interprète dit ici surtout quelque chose de l'interprète. À l'inverse, un texte de loi ou un poème offrent des repères que la tache n'offre pas.",
      lien: "→ Inconscient, Art",
    },
  ],
  accroches: [
    {
      new: true,
      type: "Question",
      t: "Un émoji souriant à la fin d'un message : sympathique ou ironique ? Qui décide du sens, celui qui écrit ou celui qui lit ?",
    },
  ],
  liens: ["Langage", "Vérité", "Inconscient", "Religion", "Art"],
  diss: [
    {new: true, q: "Tout est-il affaire d'interprétation ?"},
    {new: true, q: "Y a-t-il des interprétations fausses ?"},
    {new: true, q: "Comprendre, est-ce interpréter ?"},
    {new: true, q: "Un texte veut-il dire ce que son auteur a voulu dire ?"},
  ],
});
