/* Notion « Société » : la société est-elle naturelle ?
   HORS PROGRAMME (étape 5) : notion du programme de 2003, absente de celui de 2019.
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("societe", {
  c: "#A0623E",
  l: "Société",
  s: "La société est-elle naturelle ?",
  def: "Une <span class='kw'>société</span> est un groupe d'individus qui vivent ensemble selon des règles, des institutions, des échanges et une culture communs, au-delà des seuls liens familiaux. Elle se distingue de l'<strong>État</strong>, qui l'organise politiquement, et de la <strong>communauté</strong>, liée par une appartenance affective. Question : vivre en société est-il naturel à l'homme, ou le résultat d'un accord, voire d'une contrainte ?<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>Une société naturelle ?</div><div class='def-sec-body'>Pour Aristote, l'homme est par nature un animal politique : celui qui vit hors de toute cité est une brute ou un dieu. La parole, qui permet de discuter de l'utile et du juste, le destine à la vie commune. Adam Smith voit dans le penchant à échanger une disposition propre à l'homme, d'où naît la division du travail.</div></div><div class='def-sec'><div class='def-sec-title'>Une société artificielle ?</div><div class='def-sec-body'>Pour Hobbes, l'état de nature est une guerre de chacun contre chacun ; la société naît d'un contrat dicté par la peur de la mort. Pour Rousseau, l'homme naturel vit indépendant ; la société, avec la propriété, crée l'inégalité et la dépendance, et seul un contrat juste peut la rendre légitime. Kant parle d'insociable sociabilité : les hommes ont besoin les uns des autres et se repoussent.</div></div><div class='def-sec'><div class='def-sec-title'>La société, réalité propre</div><div class='def-sec-body'>Durkheim montre que les faits sociaux (la langue, le droit, la monnaie, même le taux de suicide) s'imposent aux individus et doivent être étudiés comme des choses. Mauss montre que le don et le contre-don tissent les liens sociaux. Tocqueville craint que l'égalité démocratique ne produise un individualisme qui isole chacun dans un petit cercle et abandonne la grande société.</div></div></details>",
  sources: [
    "Aristote, <em>Les Politiques</em>, I, 2",
    "Hobbes, <em>Léviathan</em>, chap. XIII et XVII (1651)",
    "Rousseau, <em>Discours sur l'origine et les fondements de l'inégalité</em> (1755)",
    "Durkheim, <em>Les Règles de la méthode sociologique</em> (1895) ; <em>Le Suicide</em> (1897)",
    "Tocqueville, <em>De la démocratie en Amérique</em>, II, 2e partie, chap. 2 (1840)",
    "Mauss, <em>Essai sur le don</em> (1925)",
    "Programme de philosophie de terminale de 2003 (BO n° 25 du 19 juin 2003), où « La société » était une notion",
  ],
  auteurs: [
    {
      n: "Aristote",
      ideas: [
        {
          w: "Les Politiques, I, 2",
          i: "La cité existe par nature, car l'homme est par nature un animal politique : celui qui vit hors de toute cité, par nature et non par accident, est soit une brute, soit un dieu. L'homme seul possède la parole (<em>logos</em>), qui sert à manifester l'utile et le nuisible, donc le juste et l'injuste ; c'est la mise en commun de ces valeurs qui fait la famille et la cité.",
          new: true,
          citations: [
            "L'homme est par nature un animal politique (Les Politiques, I, 2, reformulé ; la traduction varie)",
          ],
          fiche: "L'homme est par nature un animal politique : la parole le destine à discuter du juste dans la cité.",
        },
      ],
    },
    {
      n: "Hobbes",
      ideas: [
        {
          w: "Léviathan, chap. XIII et XVII (1651)",
          i: "Sans pouvoir commun qui les tienne en respect, les hommes sont dans un état de guerre de chacun contre chacun : pas d'industrie, pas de culture, pas de société, une vie solitaire, misérable et brève. La société n'est pas naturelle : elle naît d'un contrat par lequel chacun cède son droit à un souverain, par crainte de la mort et désir de sécurité.",
          new: true,
          citations: ["« L'homme est un loup pour l'homme » (Le Citoyen, épître dédicatoire, 1642, reprenant Plaute)"],
          fiche: "Sans pouvoir commun, guerre de chacun contre chacun : la société naît d'un contrat dicté par la peur.",
        },
      ],
    },
    {
      n: "Rousseau",
      ideas: [
        {
          w: "Discours sur l'origine et les fondements de l'inégalité (1755)",
          i: "L'homme de la nature vit isolé, libre, mû par l'amour de soi et la pitié. La société naît d'accidents (catastrophes naturelles, invention de la métallurgie et de l'agriculture) et surtout de la propriété, qui engendre l'inégalité, la dépendance et l'amour-propre. Ce n'est pas la nature mais l'histoire sociale qui a corrompu l'homme ; il faudra un contrat légitime pour refonder la société.",
          new: true,
          citations: [
            "« Le premier qui, ayant enclos un terrain, s'avisa de dire : Ceci est à moi, et trouva des gens assez simples pour le croire, fut le vrai fondateur de la société civile » (Discours sur l'inégalité, II)",
          ],
          fiche: "L'homme naturel est indépendant ; la société, née de la propriété, produit l'inégalité et la dépendance.",
        },
      ],
    },
    {
      n: "Durkheim",
      ideas: [
        {
          w: "Les Règles de la méthode sociologique (1895) ; Le Suicide (1897)",
          i: "Les faits sociaux (la langue, le droit, la monnaie, les modes) sont extérieurs aux individus et exercent sur eux une contrainte : on ne les invente pas, on les reçoit. Même le geste qui semble le plus personnel, le suicide, varie avec l'intégration des groupes (religion, famille, situation économique). La société est une réalité propre, plus que la somme des individus.",
          new: true,
          citations: [
            "« La première règle et la plus fondamentale est de considérer les faits sociaux comme des choses » (Les Règles de la méthode sociologique, chap. II)",
          ],
          fiche: "Les faits sociaux s'imposent aux individus et s'étudient comme des choses ; même le suicide a des causes sociales.",
        },
      ],
    },
    {
      n: "Tocqueville",
      ideas: [
        {
          w: "De la démocratie en Amérique, II, 2e partie, chap. 2 (1840)",
          i: "L'égalité des conditions défait les liens hiérarchiques de l'ancienne société, où chacun dépendait d'un autre. Elle produit l'individualisme : chacun se retire dans un petit cercle de proches et abandonne la grande société à elle-même, ce qui ouvre la voie à un pouvoir tutélaire. Remèdes : les associations, la vie locale, la liberté politique.",
          new: true,
          citations: [
            "« L'individualisme est un sentiment réfléchi et paisible qui dispose chaque citoyen à s'isoler de la masse de ses semblables » (De la démocratie en Amérique, II, II, 2)",
          ],
          fiche: "L'égalité démocratique produit l'individualisme, qui isole chacun ; remède : les associations et la liberté politique.",
        },
      ],
    },
    {
      n: "Mauss",
      ideas: [
        {
          w: "Essai sur le don (1925)",
          i: "Les sociétés ne tiennent pas seulement par le marché et le contrat : elles sont tissées d'échanges de dons qui obligent à recevoir et à rendre. Le don crée des liens, des alliances, des dettes d'honneur. Mauss y voit un fait social total, à la fois économique, juridique, religieux et moral.",
          new: true,
          citations: ["Trois obligations fondent l'échange : donner, recevoir, rendre (Essai sur le don, reformulé)"],
          fiche: "La société est tissée de dons qui obligent : donner, recevoir, rendre.",
        },
      ],
    },
  ],
  textes: [
    {
      new: true,
      n: "Tocqueville — L'individualisme (De la démocratie en Amérique, II, 1840)",
      t: "« L'individualisme est un sentiment réfléchi et paisible qui dispose chaque citoyen à s'isoler de la masse de ses semblables et à se retirer à l'écart avec sa famille et ses amis ; de telle sorte que, après s'être ainsi créé une petite société à son usage, il abandonne volontiers la grande société à elle-même. » Tocqueville distingue l'individualisme de l'égoïsme, vice de tous les temps : l'individualisme est propre aux sociétés démocratiques, où l'égalité défait les liens de dépendance. Il n'est pas haine des autres, mais retrait ; et c'est ce retrait qui laisse le champ libre à un pouvoir qui se charge de tout.",
    },
  ],
  plans: [
    {
      new: true,
      q: "La société est-elle naturelle ?",
      intro: "Personne ne choisit de naître dans une société : on y reçoit une langue, des manières, des règles avant d'avoir pu y réfléchir. La société semble aussi naturelle que l'air qu'on respire ; pourtant ses règles varient d'un peuple à l'autre et changent avec l'histoire.",
      pb: "Si la société est naturelle, l'homme ne peut vivre qu'en elle, et elle n'a pas besoin d'être justifiée. Si elle est artificielle, née d'un accord ou d'une contrainte, il faut se demander ce qui la rend légitime. Mais ne façonne-t-elle pas les individus au point que la question de sa naturalité se pose autrement ?",
      axes: [
        {
          t: "L'homme est par nature un être social",
          sps: [
            {
              new: true,
              t: "L'animal politique (Aristote)",
              args: "La parole destine l'homme à vivre en cité ; hors de la cité, il serait une brute ou un dieu.",
              auteurs: "Aristote",
              ref: "Aristote, Les Politiques, I, 2",
              limite: "Mais la cité grecque n'est qu'une forme de société parmi d'autres.",
            },
            {
              new: true,
              t: "Le penchant à échanger (Adam Smith)",
              args: "Les hommes ont un penchant à échanger, dont naît la division du travail : le besoin des autres est inscrit dans notre condition.",
              auteurs: "Adam Smith",
              ref: "Smith, Richesse des nations, I, 2",
              limite: "Avoir besoin des autres ne dit pas comment vivre avec eux.",
            },
          ],
          limite: "Si la société était naturelle, pourquoi tant de conflits ?",
        },
        {
          t: "La société est un artifice, né d'un contrat",
          sps: [
            {
              new: true,
              t: "La guerre de chacun contre chacun (Hobbes)",
              args: "Sans pouvoir commun, la vie est solitaire, misérable et brève : la société naît d'un contrat dicté par la peur.",
              auteurs: "Hobbes",
              ref: "Hobbes, Léviathan, XIII et XVII",
              limite: "",
            },
            {
              new: true,
              t: "La société corrompt l'homme naturel (Rousseau)",
              args: "La propriété engendre l'inégalité et la dépendance ; seul un contrat juste peut légitimer la société.",
              auteurs: "Rousseau",
              ref: "Rousseau, Discours sur l'inégalité ; Du contrat social",
              limite: "L'idée d'un homme d'avant la société est une hypothèse, non un fait.",
            },
          ],
          limite: "Ni simplement naturelle ni simplement voulue, la société fait l'individu autant qu'il la fait.",
        },
        {
          t: "La société est une réalité propre, qui façonne les individus",
          sps: [
            {
              new: true,
              t: "Les faits sociaux comme des choses (Durkheim)",
              args: "La langue, le droit, même le taux de suicide s'imposent aux individus : la société est plus que la somme de ses membres.",
              auteurs: "Durkheim",
              ref: "Durkheim, Les Règles de la méthode sociologique ; Le Suicide",
              limite: "",
            },
            {
              new: true,
              t: "Le risque de l'individualisme (Tocqueville)",
              args: "L'égalité démocratique isole chacun ; la société doit être entretenue par les associations et la liberté politique.",
              auteurs: "Tocqueville",
              ref: "Tocqueville, De la démocratie en Amérique, II",
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
      tag: "Sociologie",
      tit: "Le suicide selon Durkheim",
      body: "À partir des statistiques européennes du XIXe siècle, Durkheim montre que les taux de suicide varient de façon régulière selon les groupes : plus élevés chez les protestants que chez les catholiques, chez les célibataires que chez les gens mariés, en temps de crise économique. L'acte le plus intime a des causes sociales : le degré d'intégration et de régulation des groupes.",
      lien: "→ Liberté, Science",
    },
    {
      new: true,
      tag: "Littérature",
      tit: "Robinson Crusoé (Defoe, 1719)",
      body: "Seul sur son île, Robinson tient un calendrier, une comptabilité, cultive, élève, se donne des règles et, quand Vendredi arrive, lui apprend l'anglais et le commandement. Il a emporté la société anglaise avec lui. L'exemple montre qu'on n'est jamais tout à fait hors de la société : on en porte les habitudes en soi.",
      lien: "→ Autrui, Travail",
    },
  ],
  accroches: [
    {
      new: true,
      type: "Question",
      t: "Ta langue, tes vêtements, tes manières de table : qu'as-tu vraiment choisi seul dans ta façon de vivre ?",
    },
  ],
  liens: ["État", "Justice", "Travail", "Autrui", "Histoire"],
  diss: [
    {new: true, q: "La société est-elle naturelle ?"},
    {new: true, q: "Peut-on vivre hors de la société ?"},
    {new: true, q: "La société fait-elle l'individu ?"},
    {new: true, q: "L'individualisme menace-t-il la société ?"},
  ],
});
