/* Notion « Justice » : Qu'est-ce qu'une société juste ?
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("justice", {
  c: "#D85A30",
  l: "Justice",
  s: "Qu'est-ce qu'une société juste ?",
  def: "La <span class='kw'>justice</span> est une vertu morale (rendre à chacun ce qui lui est dû) et un principe politique (organisation équitable de la société). Elle implique l'égalité — mais laquelle, arithmétique ou proportionnelle ? Elle pose aussi la question de la <span class='kw'>légitimité des lois</span> et du droit à la désobéissance.<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>Deux grandes distinctions</div><div class='def-sec-body'><strong>Justice distributive</strong> (Aristote) : distribuer les biens et les honneurs selon le mérite ou le besoin. <strong>Justice commutative</strong> : égalité dans les échanges (contrats, réparations). <strong>Égalité arithmétique</strong> (même chose pour tous) vs <strong>égalité proportionnelle/géométrique</strong> (selon le mérite, les besoins). Rawls distingue <em>equité</em> (fair) et <em>égalité</em> : une inégalité est juste si elle bénéficie aux plus défavorisés.</div></div><div class='def-sec'><div class='def-sec-title'>Droit naturel vs droit positif</div><div class='def-sec-body'>Le <strong>droit naturel</strong> est universel, fondé sur la raison ou la nature humaine (Locke : vie, liberté, propriété sont des droits inaliénables). Le <strong>droit positif</strong> est l'ensemble des lois en vigueur dans une société donnée (variable, historique). Conflit possible : une loi légale peut être injuste. Sophocle (<em>Antigone</em>) : loi divine vs loi de la cité.</div></div><div class='def-sec'><div class='def-sec-title'>Justice sociale et redistribution</div><div class='def-sec-body'>Rawls (<em>Théorie de la justice</em>) : voile d'ignorance — choisir les principes de justice sans savoir quelle place on occupera. Deux principes : (1) libertés de base égales pour tous ; (2) les inégalités sont justes si elles bénéficient aux moins favorisés (principe de différence). Nozick s'y oppose : la redistribution est une violation des droits individuels — la justice est dans l'acquisition légitime.</div></div><div class='def-sec'><div class='def-sec-title'>Justice et désobéissance civile</div><div class='def-sec-body'>Thoreau : face à une loi injuste, désobéir est un devoir moral. King : « On a le devoir moral de désobéir aux lois injustes. » Rawls : la désobéissance civile est légitime si elle est non-violente, publique et accepte ses conséquences légales. Platon (<em>Criton</em>) : Socrate refuse de désobéir, même injustement condamné — loyauté aux lois qui l'ont éduqué.</div></div></details>",
  auteurs: [
    {
      n: "Platon",
      ideas: [
        {
          w: "La République / Protagoras",
          i: "Justice = harmonie de l'âme et de la cité. Mythe de Prométhée : Zeus envoie justice (diké) et pudeur (aidôs) à TOUS les hommes (pas seulement aux spécialistes) comme condition de la vie en société.",
          fiche: "Justice = harmonie de l'âme et de la cité (chacun à sa place) ; le mythe de Prométhée la donne à TOUS les hommes comme condition de la vie en société.",
          citations: ["« Tout homme incapable de pudeur et de justice sera exterminé comme un fléau de la société »"],
        },
      ],
    },
    {
      n: "Aristote",
      ideas: [
        {
          w: "Éthique à Nicomaque, Liv. V",
          i: "Justice distributive : à chacun selon son mérite (inégalité proportionnelle). Justice corrective : rétablir l'égalité après un tort (arithmétique). La justice = juste milieu.",
          fiche: "Justice distributive (à chacun selon son mérite, proportionnelle) et corrective (rétablir l'égalité après un tort) — la justice est un juste milieu.",
          citations: [
            "Justice distributive : à chacun selon son mérite, une égalité proportionnelle (Éthique à Nicomaque, V, 6, reformulé)",
          ],
          modified: true,
        },
      ],
    },
    {
      n: "Rawls",
      ideas: [
        {
          w: "Théorie de la justice, 1971",
          i: "Voile d'ignorance : imaginons que nous ne savons pas quelle place nous occuperons. 2 principes : égale liberté pour tous + principe de différence (les inégalités ne sont justes que si elles profitent aux plus défavorisés).",
          fiche: "Voile d'ignorance : choisir les principes sans connaître sa place ; égale liberté pour tous + principe de différence (les inégalités ne valent que si elles profitent aux plus défavorisés).",
          citations: [
            "Les inégalités ne sont justes que si elles profitent aux plus défavorisés (principe de différence, reformulé)",
          ],
          modified: true,
        },
      ],
    },
    {
      n: "Marx",
      ideas: [
        {
          w: "Le Capital, 1867",
          i: "La justice bourgeoise masque l'exploitation. La plus-value : le travailleur crée plus de valeur qu'il n'en reçoit. La vraie justice = abolir la propriété privée des moyens de production.",
          fiche: "La justice bourgeoise masque l'exploitation (plus-value) ; la vraie justice suppose d'abolir la propriété privée des moyens de production.",
          citations: [
            "« De chacun selon ses capacités, à chacun selon ses besoins ! » (Critique du programme de Gotha, 1875)",
          ],
          modified: true,
        },
      ],
    },
    {
      n: "Hobbes",
      ideas: [
        {
          w: "Léviathan, 1651",
          i: "Sans État, pas de justice possible : état de nature = guerre de tous contre tous. La justice naît du contrat : est juste ce que le souverain déclare juste.",
          fiche: "Sans État, pas de justice (guerre de tous contre tous) : la justice naît du contrat — est juste ce que le souverain déclare juste.",
          citations: ["« L'homme est un loup pour l'homme » (Le Citoyen, épître dédicatoire, 1642, reprenant Plaute)"],
          modified: true,
        },
      ],
    },
    {
      n: "Rousseau",
      ideas: [
        {
          w: "Discours sur l'inégalité, 1755",
          i: "Les inégalités naturelles sont légitimes. Les inégalités sociales sont artificielles et injustes. La propriété est la source de l'injustice sociale.",
          fiche: "Les inégalités sociales, nées de la propriété, sont artificielles et injustes (contrairement aux inégalités naturelles) : la propriété est la source de l'injustice.",
          citations: [
            "« Le premier qui, ayant enclos un terrain, s'avisa de dire : Ceci est à moi, et trouva des gens assez simples pour le croire, fut le vrai fondateur de la société civile » (Discours sur l'inégalité, II)",
          ],
          modified: true,
        },
      ],
    },
    {
      n: "Robert Nozick",
      ideas: [
        {
          w: "Anarchie, État et Utopie, 1974",
          i: "Libertarianisme : critique de Rawls. Chacun a un droit absolu à son corps, sa façon de penser, sa beauté, les fruits de son travail. L'égalité des chances + droit de propriété = justice. Redistribuer les richesses viole les droits individuels. L'exemple des trois enfants et d'une flûte (emprunté à Amartya Sen) illustre la lecture libertarienne : entre Anne (seule à savoir en jouer), Bob (le plus pauvre) et Carla (qui l'a fabriquée), c'est Carla qui y a droit — le producteur détient un titre légitime sur le fruit de son travail.",
          modified: true,
          fiche: "Libertarianisme : chacun a un droit absolu sur lui-même et le fruit de son travail ; l'État minimal protège les titres légitimes — redistribuer viole les droits.",
          citations: ["L'État minimal : protéger les droits sans redistribuer — toute redistribution forcée est injuste"],
        },
      ],
    },
    {
      n: "Amartya Sen",
      ideas: [
        {
          w: "L'idée de justice, 2009",
          i: "Contre une justice purement <strong>transcendantale</strong> (définir LA société parfaitement juste, comme Rawls), Sen défend une justice <strong>comparative</strong> : réduire concrètement les injustices manifestes. Son exemple des trois enfants et d'une flûte le montre — <strong>Anne</strong> sait seule en jouer (compétence/utilité), <strong>Bob</strong> est le plus pauvre et n'a aucun jouet (égalité économique), <strong>Carla</strong> l'a fabriquée (propriété et mérite, la lecture libertarienne proche de Nozick). Trois principes de justice également raisonnables s'opposent, sans arbitre absolu : la justice n'est pas une formule unique.",
          new: true,
          citations: [],
          fiche: "Contre une justice « transcendantale » (définir LA société parfaite), une justice comparative : réduire les injustices réelles ; l'exemple de la flûte montre que plusieurs principes se valent.",
        },
      ],
    },
    {
      n: "Thoreau",
      ideas: [
        {
          w: "La Désobéissance civile, 1849",
          i: "Face à une loi injuste, la résistance est un devoir moral. 'Il n'est pas plus juste d'obéir à une loi injuste qu'à une loi juste.' La désobéissance civile = non-violence, acte public, acceptation des conséquences. Priorité de la conscience morale sur la loi.",
          fiche: "Face à une loi injuste, la résistance est un devoir moral : désobéissance civile non-violente et publique, qui place la conscience au-dessus de la loi.",
          citations: [
            "« Sous un gouvernement qui emprisonne injustement, la vraie place d'un homme juste est aussi en prison »",
          ],
        },
      ],
    },
    {
      n: "Cicéron",
      ideas: [
        {
          w: "De la République, III (fragment transmis par Lactance)",
          i: "Il existe une loi vraie, la droite raison accordée à la nature, la même pour tous et toujours. Elle ne sera pas autre à Rome et autre à Athènes ; ni le Sénat ni le peuple ne peuvent nous en délier. C'est l'une des formules les plus nettes du droit naturel : une loi injuste n'est pas une vraie loi.",
          new: true,
          citations: [
            "Il n'y aura pas une loi à Rome, une autre à Athènes, mais une seule loi éternelle (III, 33, reformulé)",
          ],
          fiche: "La vraie loi est la droite raison accordée à la nature, la même à Rome et à Athènes (droit naturel).",
        },
      ],
    },
    {
      n: "Montesquieu",
      ideas: [
        {
          w: "De l'esprit des lois, I, 1 à 3",
          i: "Les lois ne sont pas des commandements arbitraires : elles sont des rapports nécessaires qui dérivent de la nature des choses. Celles d'un peuple doivent convenir à son régime, à son climat, à ses mœurs, à son commerce : c'est cet ensemble de rapports que Montesquieu appelle l'esprit des lois. Il ouvre ainsi la voie à une science des sociétés.",
          new: true,
          citations: [
            "« Les lois, dans la signification la plus étendue, sont les rapports nécessaires qui dérivent de la nature des choses » (I, 1)",
          ],
          fiche: "Les lois sont des rapports nécessaires qui dérivent de la nature des choses ; elles doivent convenir au peuple qu'elles régissent.",
        },
      ],
    },
    {
      n: "Mauss",
      ideas: [
        {
          w: "Essai sur le don (1925)",
          i: "Dans de nombreuses sociétés (Polynésie, Mélanésie, Nord-Ouest américain), les échanges ne passent pas d'abord par le marché mais par des dons qui obligent : donner, recevoir, rendre. Le don crée un lien et une dette d'honneur. Mauss y voit un fait social total, à la fois économique, juridique, religieux et moral, et une leçon pour nos sociétés : la solidarité ne se réduit pas au contrat.",
          new: true,
          citations: ["Trois obligations fondent l'échange : donner, recevoir, rendre (Essai sur le don, reformulé)"],
          fiche: "Le don oblige à recevoir et à rendre : un lien social qui ne se réduit ni au marché ni au contrat.",
        },
      ],
    },
    {
      n: "Jankélévitch",
      ideas: [
        {
          w: "L'Imprescriptible (textes de 1965 et 1971, recueil en 1986)",
          i: "Faut-il pardonner les crimes nazis ? Alors qu'on débat de leur prescription en Allemagne, Jankélévitch répond que les crimes contre l'humanité sont imprescriptibles : le temps n'efface pas ce qui a voulu nier l'homme. Le pardon a un sens entre personnes, quand le coupable le demande ; or personne ne l'a demandé.",
          new: true,
          citations: ["« Le pardon est mort dans les camps de la mort » (L'Imprescriptible)"],
          fiche: "Les crimes contre l'humanité sont imprescriptibles : le temps ne les efface pas, et le pardon n'a pas été demandé.",
        },
      ],
    },
    {
      n: "Levinas",
      ideas: [
        {
          w: "Autrement qu'être ou au-delà de l'essence (1974)",
          i: "Avec le tiers, l'autre de l'autre, ma responsabilité infinie pour un seul doit se partager : il faut comparer les incomparables, peser, juger. Ainsi naissent la justice, les institutions et l'État. Mais la justice reste sous le contrôle de la responsabilité pour le visage : un État qui l'oublie dérive vers la violence.",
          new: true,
          citations: ["La justice naît de l'entrée du tiers (reformulé)"],
          fiche: "La justice naît avec le tiers : il faut comparer et juger ; elle reste soumise à la responsabilité pour autrui.",
        },
      ],
    },
    {
      n: "Jeanne Hersch",
      ideas: [
        {
          w: "Le Droit d'être un homme (anthologie, Unesco, 1968)",
          i: "Pour les vingt ans de la Déclaration universelle, Hersch rassemble des textes de toutes les époques et de toutes les cultures (proverbes, lois, poèmes, plaintes d'esclaves) qui réclament le respect de l'homme. Les droits de l'homme ne sont pas une invention propre à l'Occident : l'exigence d'être traité en homme se retrouve partout.",
          new: true,
          citations: [
            "L'exigence d'être traité en homme se retrouve dans toutes les cultures (Le Droit d'être un homme, reformulé)",
          ],
          fiche: "L'exigence d'être traité en homme se retrouve dans toutes les cultures : les droits de l'homme ne sont pas qu'occidentaux.",
        },
      ],
    },
    {
      n: "Foucault",
      ideas: [
        {
          w: "Surveiller et punir (1975)",
          i: "Du supplice public (Damiens écartelé en 1757) à la prison moderne, la peine ne cherche plus à frapper le corps mais à corriger l'âme. Ce n'est pas seulement un progrès d'humanité : c'est une nouvelle technique de pouvoir, la discipline, qui surveille, classe et normalise, à l'école, à l'usine, à la caserne comme en prison. Le panoptique de Bentham en est le modèle : un surveillant invisible, des détenus visibles qui finissent par se surveiller eux-mêmes.",
          new: true,
          citations: ["« La visibilité est un piège » (Surveiller et punir, III, 3)"],
          fiche: "Du supplice à la prison : la discipline surveille et normalise ; le panoptique fait que chacun se surveille lui-même.",
        },
      ],
    },
  ],
  textes: [
    {
      n: "Platon, Protagoras",
      t: "Zeus donne justice et pudeur à tous les hommes (contrairement aux techniques réservées aux spécialistes). Sans ces vertus civiques, pas de cité possible.",
    },
    {
      n: "Aristote — justice distributive vs corrective",
      t: "Distributive : inégalité proportionnelle au mérite (5€ donnés → 5€ reçus, mais selon un rapport). Corrective : égalité arithmétique stricte (rembourser exactement).",
    },
    {
      n: "Rawls — voile d'ignorance",
      t: "Expérience de pensée : derrière le voile, on ignore sa position sociale, ses talents, sa conception du bien. On choisira des principes justes par intérêt bien compris.",
    },
    {
      n: "Marx — infrastructure et superstructure",
      t: "L'État et le droit (superstructure) reflètent les intérêts de la classe dominante (infrastructure économique). La justice bourgeoise légalise l'exploitation.",
    },
    {
      n: "Nozick — l'exercice de la flûte",
      t: "Pierre a fabriqué la flûte → libertarianisme : droit de propriété. Paul est le plus pauvre → égalitarisme économique (Rawls). Jacqueline est la seule qui sache jouer → utilitarisme (Mill). Pour Nozick, Pierre y a droit. Mais les différents arguments renvoient chacun à un type différent de logique impartiale. Rawls : il faut se mettre à la place du moins bien loti.",
    },
    {
      n: "Thoreau — La Désobéissance civile",
      t: "Face à une loi injuste, il ne suffit pas de voter contre. 'Sous un gouvernement qui emprisonne injustement, la vraie place de l'homme juste est en prison.' La désobéissance civile vise à 'bloquer la machine du gouvernement' en refusant d'en être le rouage. Elle est non-violente, publique et accepte ses conséquences légales.",
    },
  ],
  exemples: [
    {
      tag: "Histoire",
      tit: "Rosa Parks (1955) — désobéissance civile",
      body: "Rosa Parks refuse de céder sa place dans un bus à un blanc en Alabama. Acte de désobéissance civile qui déclenche le boycott des bus de Montgomery. Exemple de résistance à une loi formellement valide mais moralement injuste.",
      lien: "→ Rawls, Thoreau, désobéissance civile",
    },
    {
      tag: "Actualité",
      tit: "Impôt progressif vs flat tax",
      body: "Le débat entre impôt proportionnel (taux unique) et progressif (qui augmente avec le revenu) illustre l'opposition entre justice arithmétique et principe de différence de Rawls.",
      lien: "→ Rawls (principe différence), Aristote (distributive)",
    },
    {
      tag: "Mythe",
      tit: "Mythe de Prométhée (Platon)",
      body: "Zeus distribue justice et pudeur à TOUS les hommes (pas seulement aux spécialistes). Sans vertu civique partagée, pas de cité possible. La justice est condition d'existence de la société.",
      lien: "→ État, technique, nature",
    },
    {
      tag: "Philosophie",
      tit: "L'expérience du voile d'ignorance (Rawls)",
      body: "Expérience de pensée : si vous deviez choisir les règles de la société sans savoir si vous serez riche ou pauvre, homme ou femme, vous choisiriez des règles justes. Le voile d'ignorance simule l'impartialité.",
      lien: "→ Rawls, contrat social",
    },
    {
      tag: "Texte",
      tit: "Nozick et l'exercice de la flûte",
      body: "À qui donner la flûte ? Pierre (a fabriqué la flûte) → libertarianisme. Paul (le plus pauvre) → égalitarisme économique. Jacqueline (la seule qui sache jouer) → utilitarisme. Pour Nozick, Pierre y a droit (droit de propriété). Pour Rawls, il faut partir du plus défavorisé. Cet exercice illustre l'impossibilité d'une définition unique et consensuelle de la justice.",
      lien: "→ Nozick (libertarianisme), Rawls, Aristote",
    },
    {
      tag: "Histoire",
      tit: "Thoreau et la résistance au gouvernement injuste",
      body: "Thoreau refuse de payer ses impôts en signe de protestation contre l'esclavage et la guerre du Mexique. Il est emprisonné. Pour lui, c'est exactement là que doit être 'la vraie place d'un homme juste'. Il accepte les conséquences légales de sa désobéissance. C'est l'exemple fondateur de la désobéissance civile moderne.",
      lien: "→ Thoreau, King, Gandhi, désobéissance civile",
    },
  ],
  accroches: [
    {
      type: "Expérience de pensée",
      t: "Rawls imagine des individus choisissant les principes de leur société derrière un « voile d’ignorance », sans connaître leur place future : que choisirions-nous si nous pouvions être le plus défavorisé ?",
      src: "Rawls, Théorie de la justice",
      new: true,
    },
    {
      type: "Paradoxe",
      t: "Condamné légalement par un tribunal d’Athènes, Socrate fut-il pour autant condamné légitimement ? L’écart entre le légal et le légitime ouvre toute la question de la justice.",
      new: true,
    },
  ],
  liens: ["État", "Liberté", "Devoir", "Bonheur"],
  diss: [
    "La justice exige-t-elle l'égalité ?",
    "Peut-on légitimement désobéir aux lois ?",
    "La justice est-elle une affaire de convention ?",
    "Justice et vengeance sont-elles compatibles ?",
    "Peut-on être juste sans l'État ?",
    "La redistribution des richesses est-elle juste ?",
  ],
  plans: [
    {
      q: "Traiter tout le monde pareil, est-ce juste ?",
      theme: "Justice = égalité arithmétique ou proportionnelle ?",
      intro: "",
      pb: "Traiter tout le monde pareil, est-ce juste ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "L'égalité arithmétique (corrective, Aristote) : même traitement pour tous. Chacun reçoit exactement la même chose. Modèle de la justice devant la loi : 'la loi est la même pour tous'.",
              auteurs: "",
              ref: "Aristote, Éthique à Nicomaque V",
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
              args: "Mais l'égalité formelle peut masquer des inégalités réelles. Anatole France : 'La loi interdit également aux riches et aux pauvres de coucher sous les ponts.' L'égalité de droit peut être injuste en fait.",
              auteurs: "",
              ref: "Rawls : principe de différence",
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
              args: "Justice proportionnelle (Aristote) ou principe de différence (Rawls) : traiter différemment les différents pour obtenir une égalité réelle. La discrimination positive comme application.",
              auteurs: "",
              ref: "Rawls, Théorie de la justice",
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
      q: "La justice est-elle inscrite dans la nature ou dans nos conventions ?",
      theme: "La justice : naturelle ou conventionnelle ?",
      intro: "",
      pb: "La justice est-elle inscrite dans la nature ou dans nos conventions ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Justice naturelle : pour les Stoïciens, Platon, il existe un droit naturel universel antérieur aux lois humaines. Les Droits de l'Homme en sont l'expression moderne.",
              auteurs: "",
              ref: "Platon, La République ; Déclaration 1789",
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
              args: "Justice conventionnelle : pour Hobbes, la justice naît du contrat social. Sans État, il n'y a ni juste ni injuste. Les lois sont arbitraires mais nécessaires.",
              auteurs: "",
              ref: "Hobbes, Léviathan ; Pascal : 'la coutume fait toute l'équité'",
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
              args: "Nuance : même si les lois sont conventionnelles, certains principes semblent universels (interdiction du meurtre, de la torture). La question du droit naturel reste ouverte.",
              auteurs: "",
              ref: "Rawls : principes universels via le voile d'ignorance",
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
      q: "L'obligation d'obéir aux lois est-elle absolue ?",
      theme: "Peut-on légitimement désobéir aux lois injustes ?",
      intro: "",
      pb: "L'obligation d'obéir aux lois est-elle absolue ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Non : Hobbes, Hegel. La légitimité de l'État repose sur l'obéissance aux lois. La désobéissance menace l'ordre social qui rend possible la justice elle-même.",
              auteurs: "",
              ref: "Hobbes, Léviathan ; Hegel, Philo du droit",
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
              args: "Oui : désobéissance civile (Thoreau, Gandhi, MLK). Face à des lois injustes, la conscience morale peut exiger la résistance. La loi juste est celle conforme à la loi morale.",
              auteurs: "",
              ref: "Martin Luther King, Lettre de Birmingham ; Thoreau",
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
              args: "Nuance : la désobéissance civile est légitime si elle est non-violente, publique, et accepte ses conséquences légales. Elle vise à changer la loi, non à la supprimer.",
              auteurs: "",
              ref: "Rawls : la désobéissance civile dans une société presque juste",
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
