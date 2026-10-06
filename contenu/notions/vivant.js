/* Notion « Vivant » : le vivant n’est-il qu’une machine ?
   HORS PROGRAMME (étape 5) : notion du programme de 2003, absente de celui de 2019.
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("vivant", {
  c: "#4E8A3C",
  l: "Vivant",
  s: "Le vivant n'est-il qu'une machine ?",
  def: "Le <span class='kw'>vivant</span> désigne l'ensemble des êtres qui naissent, se nourrissent, croissent, se reproduisent et meurent. Ce qui le distingue d'une chose inerte : il se maintient lui-même en échangeant avec son milieu, il s'organise, se répare, se reproduit. Question : peut-on l'expliquer comme une machine, par les seules lois de la physique et de la chimie, ou faut-il lui reconnaître une manière d'être propre ?<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>L'âme, principe de vie</div><div class='def-sec-body'>Pour Aristote, l'âme (<em>psychè</em>) est la forme du corps vivant, ce qui l'anime : âme nutritive chez les plantes, sensitive chez les animaux, intellective chez l'homme. La nature ne fait rien en vain : chaque organe a une fonction, une fin.</div></div><div class='def-sec'><div class='def-sec-title'>Le modèle de la machine</div><div class='def-sec-body'>Descartes explique le corps vivant comme une machine faite de pièces et de mouvements, à la manière d'une horloge ; les animaux ne sont que des machines. Kant répond qu'une machine a seulement une force motrice, alors qu'un être organisé a une force formatrice : il se produit, se répare et se reproduit lui-même ; en lui tout est fin et moyen. Il juge absurde d'espérer un « Newton du brin d'herbe », qui expliquerait le vivant par des lois mécaniques seules.</div></div><div class='def-sec'><div class='def-sec-title'>Évolution et responsabilité</div><div class='def-sec-body'>Darwin explique l'adaptation des vivants par la sélection naturelle, sans dessein. Bergson voit dans l'évolution un élan vital créateur, que ni le mécanisme ni le finalisme n'épuisent. Hans Jonas voit déjà dans le métabolisme du plus simple organisme une forme de liberté, et en tire une responsabilité envers le vivant, que la technique peut détruire.</div></div></details>",
  sources: [
    "Aristote, <em>De l'âme</em>, II, 1-3 ; <em>Les Parties des animaux</em>",
    "Descartes, <em>Discours de la méthode</em>, V (1637)",
    "Kant, <em>Critique de la faculté de juger</em>, § 64-66 et 75 (1790)",
    "Darwin, <em>L'Origine des espèces</em> (1859)",
    "Bergson, <em>L'Évolution créatrice</em> (1907)",
    "Hans Jonas, <em>Le Phénomène de la vie</em> (1966 ; trad. 2001) ; <em>Le Principe responsabilité</em> (1979)",
    "Programme de philosophie de terminale de 2003 (BO n° 25 du 19 juin 2003), où « Le vivant » était une notion",
  ],
  auteurs: [
    {
      n: "Aristote",
      ideas: [
        {
          w: "De l'âme, II, 1-3 ; Les Parties des animaux",
          i: "L'âme n'est pas une chose logée dans le corps : elle est la forme du corps vivant, ce qui fait qu'il vit. Elle a plusieurs puissances : nutritive (les plantes se nourrissent et se reproduisent), sensitive (les animaux sentent et se meuvent), intellective (l'homme pense). Et la nature ne fait rien en vain : chaque organe existe en vue d'une fonction.",
          new: true,
          citations: ["La nature ne fait rien en vain (maxime de plusieurs traités, reformulé)"],
          fiche: "L'âme est la forme du corps vivant (nutritive, sensitive, intellective) ; la nature ne fait rien en vain.",
        },
      ],
    },
    {
      n: "Descartes",
      ideas: [
        {
          w: "Discours de la méthode, V (1637)",
          i: "Le corps vivant est une machine, comme une horloge faite de roues et de ressorts : le mouvement du cœur, la circulation, les réflexes s'expliquent par la disposition des organes et la chaleur. Les animaux ne sont que des machines : sans langage véritable ni raison, ils agissent seulement par la disposition de leurs organes. Seule l'âme humaine, qui pense, échappe au mécanisme.",
          new: true,
          citations: [
            "Les animaux agissent par la disposition de leurs organes, comme une horloge marque les heures (Discours, V, reformulé)",
          ],
          fiche: "Le corps vivant s'explique comme une machine ; les animaux ne sont que des machines (animaux-machines).",
        },
      ],
    },
    {
      n: "Kant",
      ideas: [
        {
          w: "Critique de la faculté de juger, § 64-66 et 75 (1790)",
          i: "Dans une montre, une roue ne produit pas une autre roue, et la montre ne remplace pas d'elle-même une pièce perdue. Un être organisé, lui, se produit lui-même : l'arbre fabrique sa propre substance, se répare, engendre d'autres arbres. En lui, chaque partie est à la fois fin et moyen des autres. Nous ne pouvons le comprendre qu'en lui supposant une finalité, sans pouvoir prouver qu'elle existe dans la nature : c'est un principe de jugement, non une connaissance.",
          new: true,
          citations: ["Dans un être organisé, tout est fin et réciproquement moyen (§ 66, reformulé)"],
          fiche: "L'être organisé se produit et se répare lui-même : en lui tout est fin et moyen ; ce n'est pas une machine.",
        },
      ],
    },
    {
      n: "Darwin",
      ideas: [
        {
          w: "L'Origine des espèces (1859)",
          i: "Les individus d'une espèce varient ; il en naît plus qu'il n'en peut survivre ; ceux dont les variations sont avantageuses dans leur milieu survivent et se reproduisent davantage. Accumulée pendant des millions d'années, cette sélection naturelle produit des organes adaptés sans qu'aucune intention les ait conçus. L'apparence de finalité s'explique sans finalité.",
          new: true,
          citations: [
            "La sélection naturelle produit des organes adaptés sans qu'aucune intention les ait conçus (reformulé)",
          ],
          fiche: "La sélection naturelle explique l'adaptation sans dessein : l'apparence de finalité s'explique sans finalité.",
        },
      ],
    },
    {
      n: "Bergson",
      ideas: [
        {
          w: "L'Évolution créatrice (1907)",
          i: "Ni le mécanisme (tout est donné d'avance dans les causes) ni le finalisme (tout est donné d'avance dans un plan) ne rendent compte de la vie, qui invente. L'évolution est l'œuvre d'un élan vital, une poussée qui se divise en lignes divergentes (l'instinct chez les insectes, l'intelligence chez l'homme) et crée de l'imprévisible.",
          new: true,
          citations: ["La vie est un élan qui crée de l'imprévisible nouveauté (chap. I, reformulé)"],
          fiche: "Ni mécanisme ni finalisme : la vie est un élan créateur qui invente de l'imprévisible.",
        },
      ],
    },
    {
      n: "Hans Jonas",
      ideas: [
        {
          w: "Le Phénomène de la vie (1966) ; Le Principe responsabilité (1979)",
          i: "Le plus simple organisme ne se contente pas d'être : par le métabolisme, il renouvelle sans cesse sa matière tout en restant lui-même. Il a donc déjà un rapport à soi, un intérêt à vivre, une forme élémentaire de liberté, et la fragilité qui va avec. Jonas en tire une éthique : nous sommes responsables du vivant et des générations futures, que la puissance technique peut détruire.",
          new: true,
          citations: ["Le métabolisme est la première forme de liberté (Le Phénomène de la vie, reformulé)"],
          fiche: "Le métabolisme est déjà une forme de liberté ; d'où une responsabilité envers le vivant.",
        },
      ],
    },
  ],
  textes: [
    {
      new: true,
      n: "Kant — Une montre n'est pas un être organisé (Critique de la faculté de juger, § 65, 1790)",
      t: "Résumé du texte : dans une montre, chaque pièce est là pour faire tourner les autres, mais aucune n'est la cause productrice d'une autre ; la montre ne produit pas d'autres montres, ne remplace pas d'elle-même les pièces qu'on lui a retirées, ne se répare pas. Une machine n'a qu'une force motrice. L'être organisé possède en lui une force formatrice, qu'il communique à la matière : il se produit, se répare, se reproduit. C'est pourquoi on ne peut le penser comme un simple mécanisme, et pourquoi Kant parle de « fin naturelle ».",
    },
  ],
  plans: [
    {
      new: true,
      q: "Le vivant n'est-il qu'une machine ?",
      intro: "On parle de la « mécanique » du corps, on remplace des organes, on modifie des gènes : la médecine traite souvent le vivant comme une machine, et cela réussit. Pourtant aucune machine ne naît, ne se répare seule ni ne se reproduit.",
      pb: "Si le vivant n'est qu'une machine très complexe, la science peut l'expliquer entièrement par des causes physiques. Mais l'organisation du vivant, qui se produit lui-même, ne demande-t-elle pas d'autres concepts ? Et ce qui est en jeu n'est-il que théorique ?",
      axes: [
        {
          t: "Le vivant s'explique comme une machine",
          sps: [
            {
              new: true,
              t: "L'animal-machine (Descartes)",
              args: "Le corps vivant s'explique par la disposition des organes et le mouvement, comme une horloge. C'est le programme de la physiologie moderne.",
              auteurs: "Descartes",
              ref: "Descartes, Discours de la méthode, V",
              limite: "Descartes doit pourtant mettre l'âme humaine à part.",
            },
            {
              new: true,
              t: "Une adaptation sans dessein (Darwin)",
              args: "La sélection naturelle explique l'adaptation des organes sans recourir à une intention : plus besoin de finalité.",
              auteurs: "Darwin",
              ref: "Darwin, L'Origine des espèces",
              limite: "Mais expliquer l'origine d'un organe ne dit pas ce qu'est un organisme.",
            },
          ],
          limite: "Reste que le vivant fait ce qu'aucune machine ne fait : il se produit lui-même.",
        },
        {
          t: "Mais le vivant s'organise et se produit lui-même",
          sps: [
            {
              new: true,
              t: "La montre et l'arbre (Kant)",
              args: "Une machine n'a qu'une force motrice ; l'être organisé se produit, se répare, se reproduit. En lui tout est fin et moyen.",
              auteurs: "Kant",
              ref: "Kant, Critique de la faculté de juger, § 65-66",
              limite: "Kant fait de cette finalité un principe pour juger, non un savoir.",
            },
            {
              new: true,
              t: "L'âme, forme du corps (Aristote)",
              args: "Ce qui fait vivre le corps n'est pas une pièce de plus, mais sa forme, son organisation même.",
              auteurs: "Aristote",
              ref: "Aristote, De l'âme, II",
              limite: "",
            },
          ],
          limite: "Comprendre le vivant engage aussi notre manière de le traiter.",
        },
        {
          t: "Le vivant invente, et il a une valeur",
          sps: [
            {
              new: true,
              t: "L'élan vital (Bergson)",
              args: "La vie crée de l'imprévisible : ni le mécanisme ni le finalisme ne l'épuisent.",
              auteurs: "Bergson",
              ref: "Bergson, L'Évolution créatrice",
              limite: "",
            },
            {
              new: true,
              t: "Responsables du vivant (Hans Jonas)",
              args: "Le métabolisme est une première liberté ; une technique capable de détruire le vivant nous rend responsables de lui.",
              auteurs: "Hans Jonas",
              ref: "Jonas, Le Phénomène de la vie ; Le Principe responsabilité",
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
      tag: "Histoire des sciences",
      tit: "Le cœur selon Harvey et Descartes",
      body: "En 1628, William Harvey démontre la circulation du sang. Descartes l'admire et l'explique mécaniquement dans le <em>Discours de la méthode</em>, mais se trompe sur la cause : il attribue le battement à la chaleur qui dilate le sang, alors que Harvey y voyait une contraction musculaire. Le mécanisme est un programme fécond, qui peut se tromper dans le détail.",
      lien: "→ Science, Nature",
    },
    {
      new: true,
      tag: "Biologie",
      tit: "L'axolotl, qui fait repousser ses membres",
      body: "Cet amphibien mexicain peut régénérer une patte, une partie de sa moelle épinière, voire de son cœur. Aucune machine ne remplace d'elle-même une pièce perdue : c'est exactement le critère de Kant pour distinguer un être organisé d'une montre.",
      lien: "→ Nature, Technique",
    },
  ],
  accroches: [
    {
      new: true,
      type: "Question",
      t: "Un robot qui se réparerait seul et fabriquerait des copies de lui-même serait-il vivant ?",
    },
  ],
  liens: ["Nature", "Science", "Technique", "Devoir", "Matière et esprit"],
  diss: [
    {new: true, q: "Le vivant n'est-il qu'une machine ?"},
    {new: true, q: "Peut-on expliquer la vie ?"},
    {new: true, q: "Y a-t-il une finalité dans la nature ?"},
    {new: true, q: "Avons-nous des devoirs envers les êtres vivants ?"},
  ],
});
