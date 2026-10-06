/* Notion « Démonstration » : peut-on tout démontrer ?
   HORS PROGRAMME (étape 5) : notion du programme de 2003, absente de celui de 2019.
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("demonstration", {
  c: "#3A5F8A",
  l: "Démonstration",
  s: "Peut-on tout démontrer ?",
  def: "<span class='kw'>Démontrer</span>, c'est établir la vérité d'une proposition en la déduisant, par un raisonnement rigoureux, de propositions déjà admises : axiomes, définitions, théorèmes déjà démontrés. La démonstration se distingue de la preuve par l'expérience et de la simple persuasion : elle contraint l'esprit par la seule nécessité logique. Question : peut-on tout démontrer, et la démonstration est-elle le modèle de toute connaissance ?<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>Le modèle géométrique</div><div class='def-sec-body'>Les <em>Éléments</em> d'Euclide (vers 300 av. J.-C.) partent de définitions, de postulats et d'axiomes pour démontrer des théorèmes : c'est le modèle de la démonstration pendant deux mille ans. Aristote fait de la démonstration un syllogisme qui part de principes vrais et premiers. Descartes veut étendre à toute la connaissance les longues chaînes de raisons des géomètres.</div></div><div class='def-sec'><div class='def-sec-title'>Ce qu'on ne peut pas démontrer</div><div class='def-sec-body'>Les premiers principes ne se démontrent pas, sous peine de remonter à l'infini (Aristote). Pascal montre que la méthode parfaite, tout définir et tout prouver, est impossible : on arrive à des mots primitifs et à des principes évidents. Leibniz distingue les vérités de raison, démontrables, et les vérités de fait. Au XXe siècle, Gödel (1931) montre que, dans tout système formel assez riche pour l'arithmétique, il existe des énoncés qu'on ne peut ni démontrer ni réfuter dans ce système (énoncé simplifié).</div></div><div class='def-sec'><div class='def-sec-title'>Démontrer, éprouver</div><div class='def-sec-body'>Kant explique que les mathématiques démontrent parce qu'elles construisent leurs concepts (tracer un triangle) ; la philosophie ne peut pas imiter cette méthode. Les sciences de la nature ne démontrent pas leurs lois : elles les mettent à l'épreuve de l'expérience (Popper). Les géométries non euclidiennes (XIXe siècle) montrent que les axiomes ne sont pas des évidences, mais des points de départ choisis.</div></div></details>",
  sources: [
    "Euclide, <em>Éléments</em>, livre I",
    "Aristote, <em>Seconds Analytiques</em>, I, 2-3",
    "Descartes, <em>Discours de la méthode</em>, II (1637), texte de Wikisource",
    "Pascal, <em>De l'esprit géométrique</em> (vers 1657), texte de Wikisource",
    "Leibniz, <em>Monadologie</em>, § 31-36 (1714), texte français de Leibniz",
    "Kant, <em>Critique de la raison pure</em>, « Discipline de la raison pure » (1781)",
    "Popper, <em>La Logique de la découverte scientifique</em> (1934)",
    "Programme de philosophie de terminale de 2003 (BO n° 25 du 19 juin 2003), où « La démonstration » était une notion",
  ],
  auteurs: [
    {
      n: "Aristote",
      ideas: [
        {
          w: "Seconds Analytiques, I, 2-3",
          i: "Savoir au sens fort, c'est connaître la cause, et cela se fait par démonstration : un syllogisme qui part de prémisses vraies, premières, immédiates, plus connues que la conclusion. Mais ces premiers principes ne peuvent être démontrés, sous peine de remonter à l'infini : ils sont saisis autrement, par l'intellect. Tout n'est pas démontrable, et c'est la condition même de la démonstration.",
          new: true,
          citations: [
            "Il ne peut y avoir démonstration de tout : on irait à l'infini (Seconds Analytiques, I, 3, reformulé)",
          ],
          fiche: "La démonstration part de principes vrais et premiers, qui eux ne se démontrent pas (sinon régression à l'infini).",
        },
      ],
    },
    {
      n: "Descartes",
      ideas: [
        {
          w: "Discours de la méthode, II (1637)",
          i: "Les mathématiques sont les seules sciences où l'on trouve des démonstrations certaines. Descartes en tire une méthode pour toute connaissance : ne recevoir pour vrai que l'évident, diviser les difficultés, conduire par ordre ses pensées des plus simples aux plus composées, tout dénombrer. Rien n'est si éloigné qu'on ne puisse y parvenir si l'on garde l'ordre des déductions.",
          new: true,
          citations: [
            "« Ces longues chaînes de raisons, toutes simples et faciles, dont les géomètres ont coutume de se servir » (Discours de la méthode, II)",
          ],
          fiche: "Les longues chaînes de raisons des géomètres sont le modèle d'une méthode pour toute connaissance.",
        },
      ],
    },
    {
      n: "Pascal",
      ideas: [
        {
          w: "De l'esprit géométrique (vers 1657)",
          i: "La méthode parfaite consisterait à tout définir et tout démontrer : elle est impossible. En remontant, on arrive à des mots primitifs (espace, temps, mouvement, nombre) et à des principes qu'on ne peut prouver, mais si clairs qu'il n'en est pas de plus clairs. La géométrie ne définit ni ne prouve tout ; elle ne suppose que des choses claires par la lumière naturelle.",
          new: true,
          citations: [
            "« en poussant les recherches de plus en plus, on arrive nécessairement à des mots primitifs qu'on ne peut plus définir, et à des principes si clairs qu'on n'en trouve plus qui le soient davantage pour servir à leur preuve » (De l'esprit géométrique)",
          ],
          fiche: "Tout définir et tout démontrer est impossible : on arrive à des mots primitifs et à des principes évidents.",
        },
      ],
    },
    {
      n: "Leibniz",
      ideas: [
        {
          w: "Monadologie, § 31-36 (1714)",
          i: "Deux principes gouvernent nos raisonnements : le principe de contradiction et celui de raison suffisante. D'où deux sortes de vérités : les vérités de raison, nécessaires, dont on trouve la raison par l'analyse jusqu'aux idées primitives ; les vérités de fait, contingentes, dont la raison existe mais nous échappe souvent (pourquoi ce monde-ci plutôt qu'un autre).",
          new: true,
          citations: ["« Il y a deux sortes de vérités, celles de raisonnement et celles de fait » (Monadologie, § 33)"],
          fiche: "Vérités de raison (nécessaires, démontrables par analyse) et vérités de fait (contingentes).",
        },
      ],
    },
    {
      n: "Kant",
      ideas: [
        {
          w: "Critique de la raison pure, « Discipline de la raison pure » (1781)",
          i: "Le mathématicien démontre parce qu'il construit ses concepts dans l'intuition : il trace le triangle et y lit des propriétés nécessaires. Ses jugements sont à la fois universels et nouveaux (synthétiques a priori). La philosophie, qui ne travaille que sur des concepts, ne peut imiter cette méthode : vouloir y démontrer comme en géométrie ne produit que des châteaux de cartes.",
          new: true,
          citations: [
            "La connaissance mathématique procède par construction des concepts (Discipline de la raison pure, reformulé)",
          ],
          fiche: "Les mathématiques démontrent en construisant leurs concepts ; la philosophie ne peut imiter leur méthode.",
        },
      ],
    },
    {
      n: "Popper",
      ideas: [
        {
          w: "La Logique de la découverte scientifique (1934)",
          i: "Aucune accumulation d'observations ne démontre une loi universelle : on ne vérifie jamais que tous les cygnes sont blancs, on peut seulement le réfuter en trouvant un cygne noir. Les sciences de la nature ne démontrent pas leurs théories : elles les conjecturent et les mettent à l'épreuve. Est scientifique une théorie qui peut être réfutée par l'expérience.",
          new: true,
          citations: ["On ne vérifie jamais une loi universelle ; on peut seulement la réfuter (reformulé)"],
          fiche: "Les sciences expérimentales ne démontrent pas : elles conjecturent et réfutent.",
        },
      ],
    },
  ],
  textes: [
    {
      new: true,
      n: "Pascal — La méthode parfaite est impossible (De l'esprit géométrique, vers 1657)",
      t: "« Cette véritable méthode, qui formerait les démonstrations dans la plus haute excellence, s'il était possible d'y arriver, consisterait en deux choses principales : l'une, de n'employer aucun terme dont on n'eût auparavant expliqué nettement le sens ; l'autre, de n'avancer jamais aucune proposition qu'on ne démontrât par des vérités déjà connues. » Texte de Wikisource. Pascal montre aussitôt que cette méthode est impossible : définir suppose d'autres mots, prouver d'autres vérités, à l'infini. Il faut donc s'arrêter à des termes primitifs et à des principes évidents, que la géométrie suppose sans les démontrer.",
    },
  ],
  plans: [
    {
      new: true,
      q: "Peut-on tout démontrer ?",
      intro: "En mathématiques, une affirmation n'est acquise que démontrée, et alors elle l'est pour toujours : le théorème de Pythagore n'a pas vieilli. On rêverait d'une telle certitude partout, en morale, en politique, en science.",
      pb: "Si la démonstration donne la seule certitude parfaite, il faudrait tout démontrer. Mais toute démonstration ne repose-t-elle pas sur quelque chose qu'on ne démontre pas ? Et une connaissance non démontrée est-elle pour autant sans valeur ?",
      axes: [
        {
          t: "La démonstration est le modèle de la connaissance certaine",
          sps: [
            {
              new: true,
              t: "Les longues chaînes de raisons (Descartes)",
              args: "Partir de l'évident et déduire par ordre : rien n'est si éloigné qu'on ne puisse y parvenir.",
              auteurs: "Descartes",
              ref: "Descartes, Discours de la méthode, II",
              limite: "Mais d'où vient l'évidence du point de départ ?",
            },
            {
              new: true,
              t: "Les vérités de raison (Leibniz)",
              args: "Les vérités nécessaires se démontrent par l'analyse, jusqu'aux idées primitives.",
              auteurs: "Leibniz",
              ref: "Leibniz, Monadologie, § 33",
              limite: "L'analyse s'arrête à des primitives qu'elle ne démontre pas.",
            },
          ],
          limite: "Toute démonstration part de quelque chose.",
        },
        {
          t: "Mais toute démonstration repose sur de l'indémontrable",
          sps: [
            {
              new: true,
              t: "Les premiers principes (Aristote)",
              args: "Démontrer les principes mènerait à l'infini : ils sont connus autrement que par démonstration.",
              auteurs: "Aristote",
              ref: "Aristote, Seconds Analytiques, I, 3",
              limite: "",
            },
            {
              new: true,
              t: "Les mots primitifs (Pascal)",
              args: "Tout définir et tout prouver est impossible ; la géométrie suppose des termes et des principes clairs par la lumière naturelle.",
              auteurs: "Pascal",
              ref: "Pascal, De l'esprit géométrique",
              limite: "Les géométries non euclidiennes montreront que même ces évidences peuvent être remplacées.",
            },
          ],
          limite: "Si l'indémontrable est au fondement, ce qui ne se démontre pas n'est pas sans valeur.",
        },
        {
          t: "Une grande part du savoir ne se démontre pas : elle s'éprouve",
          sps: [
            {
              new: true,
              t: "Conjectures et réfutations (Popper)",
              args: "Les sciences de la nature ne démontrent pas leurs lois : elles les mettent à l'épreuve et peuvent seulement les réfuter.",
              auteurs: "Popper",
              ref: "Popper, La Logique de la découverte scientifique",
              limite: "",
            },
            {
              new: true,
              t: "Les limites de la méthode mathématique (Kant)",
              args: "La philosophie ne peut démontrer comme la géométrie ; elle doit examiner ses concepts et les limites de la raison.",
              auteurs: "Kant",
              ref: "Kant, Critique de la raison pure, Discipline de la raison pure",
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
      tag: "Mathématiques",
      tit: "Le cinquième postulat d'Euclide",
      body: "Par un point extérieur à une droite passe une seule parallèle : pendant des siècles, des mathématiciens ont tenté de démontrer ce postulat à partir des autres. Au XIXe siècle, Lobatchevski puis Riemann construisent des géométries cohérentes qui le nient. Un axiome n'est donc pas une évidence absolue, mais un point de départ.",
      lien: "→ Science, Vérité",
    },
    {
      new: true,
      tag: "Mathématiques",
      tit: "Le théorème des quatre couleurs (1976)",
      body: "Toute carte peut être coloriée avec quatre couleurs sans que deux pays voisins aient la même. Appel et Haken le démontrent en 1976 avec l'aide d'un ordinateur, qui examine des centaines de cas. Débat : une démonstration qu'aucun humain ne peut vérifier entièrement à la main en est-elle une ? Aujourd'hui, des logiciels vérifient formellement de telles démonstrations.",
      lien: "→ Technique, Raison",
    },
  ],
  accroches: [
    {
      new: true,
      type: "Question",
      t: "Pourquoi 2 + 2 = 4 ? Et comment le prouver à quelqu'un qui en douterait vraiment ?",
    },
  ],
  liens: ["Raison", "Vérité", "Science", "Langage"],
  diss: [
    {new: true, q: "Peut-on tout démontrer ?"},
    {new: true, q: "Une démonstration peut-elle être fausse ?"},
    {new: true, q: "La démonstration est-elle le seul chemin vers la vérité ?"},
    {new: true, q: "Démontrer, est-ce convaincre ?"},
  ],
});
