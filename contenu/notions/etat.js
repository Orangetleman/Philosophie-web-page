/* Notion « État » : L'État est-il nécessaire ?
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("etat", {
  c: "#5F5E5A",
  l: "État",
  s: "L'État est-il nécessaire ?",
  def: "L'<span class='kw'>État</span> est une forme d'organisation politique qui détient le <span class='kw'>monopole de la violence légitime</span> (Weber) sur un territoire. Il naît d'un contrat social ou d'un rapport de force. Question centrale : l'État est-il garant de la liberté ou menace contre elle ? La désobéissance peut-elle être légitime face à un État injuste ?<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>Origine et légitimité</div><div class='def-sec-body'>Weber (<em>Le Savant et le politique</em>, 1919) : l'État détient le <strong>monopole de la violence physique légitime</strong> sur un territoire. Trois types de légitimité : <strong>traditionnelle</strong> (coutume, héritage), <strong>charismatique</strong> (personnalité exceptionnelle du chef), <strong>légale-rationnelle</strong> (règles impersonnelles — l'État de droit moderne). Les théories du contrat social (Hobbes, Locke, Rousseau) cherchent à fonder cette légitimité rationnellement.</div></div><div class='def-sec'><div class='def-sec-title'>Trois visions du contrat social</div><div class='def-sec-body'><strong>Hobbes</strong> : état de nature = guerre de tous contre tous → contrat cède tous les droits à un souverain absolu (Léviathan) pour la sécurité. <strong>Locke</strong> : état de nature pacifique mais fragile → l'État protège les droits naturels, le contrat est révocable si le gouvernement viole ces droits. <strong>Rousseau</strong> : volonté générale souveraine, inaliénable — l'État juste exprime la volonté générale (≠ volonté de tous = somme des intérêts particuliers).</div></div><div class='def-sec'><div class='def-sec-title'>Critiques de l'État</div><div class='def-sec-body'><strong>Marx &amp; Engels</strong> : l'État est l'instrument de la classe dominante (police + armée + prison au service du capital). L'État bourgeois protège les intérêts du capital, non l'intérêt général. Objectif révolutionnaire : dépérissement de l'État. <strong>Nozick</strong> (libertarianisme) : l'État minimal est seul légitime — la redistribution viole les droits individuels. <strong>La Boétie</strong> : la tyrannie repose sur la servitude volontaire — le tyran n'a que la puissance qu'on lui donne.</div></div><div class='def-sec'><div class='def-sec-title'>État et liberté</div><div class='def-sec-body'>Hegel : l'État n'est pas seulement instrument mais fin en soi — la liberté objective se réalise dans les institutions (famille → société civile → État). Tocqueville : la démocratie peut dériver vers un <strong>despotisme doux</strong> si les citoyens sont passifs — l'État bienveillant prend tout en charge et réduit les citoyens à un troupeau. Exigence : vigilance active des citoyens.</div></div></details>",
  auteurs: [
    {
      n: "Hobbes",
      ideas: [
        {
          w: "Léviathan, 1651",
          i: "Sans État : état de nature = guerre de tous contre tous, vie 'solitaire, misérable, bestiale et brève'. Le contrat cède tous les droits à un souverain absolu (Léviathan) en échange de la sécurité. La justice naît du contrat.",
          fiche: "Sans État, guerre de tous contre tous (vie « solitaire, misérable, brève ») : on cède tous ses droits à un souverain absolu (le Léviathan) en échange de la sécurité.",
          citations: ["« L'homme est un loup pour l'homme » (formule du De Cive, 1642)"],
        },
      ],
    },
    {
      n: "Locke",
      ideas: [
        {
          w: "Traité du gouvernement civil, 1690",
          i: "L'état de nature est pacifique mais fragile (sans juge impartial). L'État protège les droits naturels (vie, liberté, propriété). Le contrat est révocable : si le gouvernement viole les droits, la révolution est légitime.",
          fiche: "L'état de nature est pacifique mais sans juge impartial : l'État protège les droits naturels (vie, liberté, propriété) par un contrat révocable — révolution légitime s'ils sont violés.",
          citations: ["L'État = protecteur des droits naturels, contrat révocable"],
        },
      ],
    },
    {
      n: "Rousseau",
      ideas: [
        {
          w: "Du Contrat social, 1762",
          i: "Volonté générale : la souveraineté appartient au peuple, inaliénable et indivisible. Le contrat transforme la liberté naturelle en liberté civile. L'État juste = expression de la volonté générale, pas de la volonté de tous.",
          fiche: "Volonté générale : la souveraineté appartient au peuple (inaliénable) ; l'État juste exprime la volonté générale, distincte de la somme des intérêts particuliers.",
          citations: ["« L'obéissance à la loi qu'on s'est prescrite est liberté »"],
        },
      ],
    },
    {
      n: "Hegel",
      ideas: [
        {
          w: "Principes de la philosophie du droit, 1820",
          i: "L'État est la réalité effective de la liberté objective. Il n'est pas seulement instrument mais fin en soi : la vie éthique concrète. La famille (amour) → la société civile (intérêts) → l'État (universalité).",
          fiche: "L'État est la réalité effective de la liberté : non un simple instrument mais la vie éthique concrète (famille → société civile → État).",
          citations: ["« L'État est la réalité effective de la liberté concrète »"],
        },
      ],
    },
    {
      n: "Marx",
      ideas: [
        {
          w: "L'Idéologie allemande / Le Manifeste, 1848",
          i: "L'État est l'instrument de la classe dominante. Infrastructure économique → superstructure (État, droit, idéologie). L'État bourgeois protège les intérêts du capital. Objectif : dépérissement de l'État dans la société communiste.",
          fiche: "L'État est l'instrument de la classe dominante (« le comité d'affaires de la bourgeoisie ») ; il a vocation à dépérir dans la société communiste.",
          citations: ["« L'État n'est que le comité d'affaires de la bourgeoisie »"],
        },
      ],
    },
    {
      n: "Weber",
      ideas: [
        {
          w: "Le Savant et le politique, 1919",
          i: "L'État = monopole de la violence physique légitime sur un territoire. 3 types de légitimité : traditionnelle, charismatique, légale-rationnelle. L'État moderne repose sur la légitimité légale-rationnelle.",
          fiche: "L'État = monopole de la violence physique légitime sur un territoire ; trois légitimités (traditionnelle, charismatique, légale-rationnelle), la dernière fondant l'État moderne.",
          citations: ["« L'État revendique le monopole de la violence physique légitime »"],
        },
      ],
    },
    {
      n: "Engels",
      ideas: [
        {
          w: "L'Origine de la famille, de la propriété et de l'État, 1884",
          i: "L'État dispose de 3 instruments de domination : la police, l'armée et la prison. Il répond au besoin de la classe dominante de contrôler la classe exploitée. L'État s'appuie sur la force (contrainte) et sur l'idéologie (légitimation). Distinction infrastructure (économie) / superstructure (État, droit, idées). Concept de 'conscience de classe'.",
          fiche: "L'État domine par la force (police, armée, prison) et par l'idéologie, au service de la classe dominante : un appareil de la superstructure.",
          citations: ["L'État = police + armée + prison au service de la classe dominante"],
        },
      ],
    },
    {
      n: "Robert Nozick",
      ideas: [
        {
          w: "Anarchie, État et Utopie, 1974",
          i: "Libertarianisme : l'État minimal est seul légitime. Chacun a le droit absolu à son corps, sa façon de penser, ses biens. L'égalité des chances + droit de propriété = justice. Critique de Rawls : redistribuer les richesses viole les droits individuels. La justice n'est pas dans la redistribution mais dans le respect des titres de propriété acquis légitimement.",
          fiche: "Seul l'État minimal est légitime : protéger les droits et les titres de propriété acquis légitimement, sans redistribuer (critique de Rawls).",
          citations: ["L'État minimal : seul légitime — protéger les droits sans redistribuer"],
        },
      ],
    },
    {
      n: "La Boétie",
      ideas: [
        {
          w: "Discours de la servitude volontaire, 1549",
          i: "Pourquoi les hommes obéissent-ils librement à la tyrannie ? Par habitude, éducation, complicité. Le tyran n'a que la puissance qu'on lui donne. La résistance n'exige pas de combattre : il suffit de cesser de servir. Mais la résistance individuelle ne suffit pas — il faut une action collective organisée.",
          fiche: "Servitude volontaire : le tyran n'a que le pouvoir qu'on lui donne ; cesser de servir suffit — mais il faut une action collective organisée.",
          citations: ["« Un tyran n'a que la puissance que vous lui donnez — cessez de le servir, il tombera »"],
        },
      ],
    },
  ],
  textes: [
    {
      n: "Hobbes — état de nature",
      t: "Sans loi : pas de justice, ni propriété, ni industrie. 'La force et la ruse sont les deux vertus cardinales.' Le Léviathan : l'État-monstre qui garantit la paix par sa puissance absolue.",
    },
    {
      n: "Rousseau — contrat social",
      t: "Aliéner la liberté naturelle pour gagner la liberté civile. La loi = volonté générale (ce que le peuple veut pour le bien commun), différente de la volonté de tous (somme des intérêts particuliers).",
    },
    {
      n: "Marx — infrastructure et superstructure",
      t: "Infrastructure économique détermine la superstructure (État, droit, idéologie). L'État semble neutre et universel mais défend les intérêts de la bourgeoisie. Engels développe cette analyse.",
    },
    {
      n: "Platon — justice dans la cité",
      t: "Zeus donne justice et pudeur à tous pour que la cité soit possible. Sans vertu civique partagée, pas de société. L'État repose sur une éducation morale des citoyens.",
    },
    {
      n: "Engels — L'Origine de la famille...",
      t: "L'État répond au besoin de la classe dominante de se maintenir au pouvoir. Ses 3 instruments : police (contrôle quotidien), armée (force brute), prison (répression). La classe ouvrière (prolétariat) possède uniquement sa force de travail. La bourgeoisie possède les moyens de production (capital). L'État est le gardien de cet ordre.",
    },
    {
      n: "Nozick — libertarianisme",
      t: "L'égalité des chances a semblé à de nombreux auteurs être le but égalitaire minimal. Il y a deux façons d'assurer une telle égalité : en dégradant directement la situation de ceux qui sont le plus favorisés par le hasard ou en améliorant la situation des moins favorisés. Cette dernière solution exige l'utilisation des ressources, et suppose donc l'aggravation de certains pour améliorer les autres. Nozick s'y oppose : cela viole les droits individuels.",
    },
    {
      n: "Hobbes, Le Citoyen",
      t: "Liberté civile vs liberté naturelle : à l'état de nature, chacun a droit sur toute chose, ce qui produit le chaos. La liberté civile, limitée et réglée par la loi, est préférable à la liberté naturelle totale mais infructueuse. Le contrat social échange la liberté absolue contre la sécurité et une liberté garantie.",
    },
    {
      n: "Rousseau, Du contrat social — Du pacte social",
      t: "'Trouver une forme d'association qui défende et protège de toute la force commune la personne et les biens de chaque associé, et par laquelle chacun, s'unissant à tous, n'obéisse pourtant qu'à lui-même, et reste aussi libre qu'auparavant.' En entrant dans la société civile, on gagne 'l'équivalent de tout ce qu'on perd et plus de force pour conserver ce que l'on a.'",
    },
    {
      n: "Tocqueville, De la démocratie en Amérique",
      t: "La démocratie peut dériver vers un despotisme doux et tutélaire. Si les citoyens, enivrés de jouissances, abandonnent leur vigilance, l'État prend en charge tous leurs besoins et les réduit à un troupeau timide et industrieux. La responsabilité des citoyens est d'empêcher l'émergence de pouvoirs illégitimes en maintenant leur participation active.",
    },
  ],
  exemples: [
    {
      tag: "Histoire",
      tit: "La Révolution française (1789)",
      body: "La Révolution française illustre le passage de la légitimité traditionnelle (roi de droit divin) à la légitimité légale-rationnelle (souveraineté nationale). La Déclaration des droits de l'homme incarne l'idée lockéenne que l'État doit protéger les droits naturels.",
      lien: "→ Locke, Rousseau, légitimité",
    },
    {
      tag: "Philosophie",
      tit: "Le Léviathan de Hobbes",
      body: "La couverture du Léviathan (1651) montre un souverain géant dont le corps est fait de milliers de sujets. Métaphore parfaite : l'État est la somme des volontés individuelles qui lui ont cédé leur force en échange de la sécurité.",
      lien: "→ Hobbes, contrat social",
    },
    {
      tag: "Actualité",
      tit: "États faillis (Somalie, Libye post-2011)",
      body: "Les 'États faillis' illustrent la thèse de Hobbes : quand l'État s'effondre, c'est bien l'état de nature (guerre civile, milices, insécurité totale) qui revient. Preuve a contrario de la nécessité de l'État.",
      lien: "→ Hobbes (état de nature), Weber (monopole violence)",
    },
    {
      tag: "Contemporain",
      tit: "Désobéissance fiscale et justice",
      body: "Le débat sur l'évasion fiscale des multinationales illustre la tension entre l'État et les intérêts économiques. Marx dirait que l'État défend les intérêts du capital ; Rawls demanderait si cette situation profite aux plus défavorisés.",
      lien: "→ Marx (État bourgeois), Rawls (principe différence)",
    },
    {
      tag: "Histoire",
      tit: "George Floyd/Naël — la légitimité de la violence d'État",
      body: "Les violences policières illustrent la question de la légitimité du monopole de la violence d'État. Quand la force de l'État est perçue comme illégitime et disproportionnée, elle engendre des mouvements de résistance. Weber : la légitimité du monopole de la violence doit être continuellement réaffirmée.",
      lien: "→ Weber (monopole violence légitime), Engels (police/armée/prison), désobéissance",
    },
    {
      tag: "Actualité",
      tit: "La Boétie et la servitude volontaire — s'applique aux régimes autoritaires",
      body: "La Boétie : si les peuples soumis à une tyrannie cessaient simplement d'obéir, le tyran tomberait de lui-même. Appliqué aux régimes contemporains : Popovic en Serbie (mouvement Otpor), puis en Syrie (balles de ping-pong anti-Assad). La désobéissance collective est l'outil ultime face à l'État tyrannique.",
      lien: "→ La Boétie, Popovic, Thoreau, désobéissance civile",
    },
    {
      new: true,
      tag: "Démocratie",
      tit: "La démocratie et la « cacophonie des valeurs » (lecture nietzschéenne)",
      body: "Diagnostic nietzschéen contemporain (Typhaine Mobille) : la démocratie moderne est exposée à une <em>cacophonie des valeurs</em>. Une fois renversée la hiérarchie traditionnelle des valeurs (Dieu, le roi, la nation), aucune nouvelle hiérarchie ne s'impose — chacun défend sa propre échelle, et le débat public devient juxtaposition d'incompatibles. Nietzsche n'est pas <em>anti-démocrate</em> par principe ; il avertit du risque <em>nihiliste</em> qu'une démocratie sans transvaluation peut basculer dans le règne du plus médiocre — le « dernier homme » qui « cligne de l'œil » et veut « son petit plaisir pour le jour, son petit plaisir pour la nuit ». La tâche démocratique serait alors de produire une <em>nouvelle hiérarchie</em> compatible avec l'égalité formelle — non un retour aux anciennes, mais une <em>transvaluation</em>.",
      lien: "→ Nietzsche, démocratie, valeurs, transvaluation, dernier homme",
    },
    {
      new: true,
      tag: "Numérique",
      tit: "La « tyrannie du like » : grégarité contemporaine",
      body: "Analyse de Stéphanie Floccari : les réseaux sociaux organisent une nouvelle <strong>grégarité</strong> (concept nietzschéen — la tendance à penser, sentir et juger « comme le troupeau »). Le <em>like</em> opère un plébiscite numérique : chaque utilisateur, par peur de la solitude et besoin de reconnaissance, s'aligne sur l'opinion dominante du groupe — la pluralité s'efface au profit du conformisme. Conséquence politique : la délibération démocratique cède la place à la <em>viralité</em>, l'argumentation au slogan, la nuance au camp. Réponse nietzschéenne : cultiver l'<em>esprit libre</em>, capable de supporter la dissonance, la solitude critique, et l'inconfort de penser contre la majorité.",
      lien: "→ Floccari, Nietzsche, grégarité, esprit libre, réseaux sociaux, démocratie",
    },
    {
      new: true,
      tag: "Critique",
      tit: "Le « ressentiment » comme passion politique contemporaine",
      body: "Martine Béland analyse les passions politiques contemporaines à travers le concept nietzschéen de <strong>ressentiment</strong> : impuissance vengeresse de qui ne peut <em>agir</em> et qui, à défaut, <em>réagit</em> en dévalorisant le fort. Lecture appliquée à : (1) l'indignation permanente sur les réseaux sociaux ; (2) la rhétorique victimaire au service du pouvoir ; (3) la <em>culpabilisation</em> moralisatrice qui dispense d'agir. Le ressentiment retourne la passion politique contre soi-même — il <em>réagit</em> au lieu d'<em>agir</em>. Sortir du ressentiment : passer de la critique négative à la création de valeurs nouvelles (transvaluation). La démocratie suppose des citoyens capables d'agir, non seulement de se plaindre.",
      lien: "→ Béland, Nietzsche, ressentiment, culpabilisation, passions politiques",
    },
  ],
  accroches: [
    {
      type: "Citation",
      t: "Sans État, prévient Hobbes, l’homme vit dans la « guerre de tous contre tous » où la vie est « solitaire, misérable, pénible, quasi animale et brève ». L’État est-il le prix de la sécurité ?",
      src: "Hobbes, Léviathan",
      new: true,
    },
    {
      type: "Paradoxe",
      t: "« On peut tout faire avec des baïonnettes, sauf s’asseoir dessus » : la formule attribuée à Talleyrand rappelle qu’aucun État ne tient durablement par la seule force — il lui faut la légitimité.",
      new: true,
    },
  ],
  liens: ["Justice", "Liberté", "Travail", "Devoir", "Nature", "Vérité"],
  diss: [
    "Peut-on se passer de l'État ?",
    "L'État est-il garant de la liberté ?",
    "L'État doit-il tout réguler ?",
    "Obéir à l'État, est-ce renoncer à sa liberté ?",
    "D'où vient la légitimité de l'État ?",
    "L'État est-il toujours l'instrument de la classe dominante ?",
    "La désobéissance à l'État peut-elle être légitime ?",
    {new: true, q: "La démocratie est-elle menacée par la cacophonie des valeurs ?"},
    {new: true, q: "Le « like » est-il devenu la nouvelle tyrannie ?"},
    {new: true, q: "La post-vérité menace-t-elle la démocratie ?"},
  ],
  plans: [
    {
      q: "Peut-on se passer de l'État ?",
      theme: "L'État comme nécessité face à la violence naturelle",
      intro: "",
      pb: "Peut-on se passer de l'État ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Hobbes : sans État, état de guerre. La violence est le seul régulateur des conflits. La vie est 'solitaire, misérable, bestiale et brève'. L'État est la condition de toute vie sociale stable.",
              auteurs: "",
              ref: "Hobbes, Léviathan XIII",
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
              args: "Mais tous ne partagent pas ce pessimisme. Locke : l'état de nature est pacifique, gouverné par la loi naturelle et la raison. L'État n'est pas nécessaire pour éviter la guerre, mais pour trancher les conflits.",
              auteurs: "",
              ref: "Locke, Traité du gouvernement civil",
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
              args: "Anarchisme (Proudhon, Bakounine) : l'État est lui-même source de violence et d'oppression. Les associations libres et la coopération peuvent organiser la vie collective sans État. Mais cette thèse reste utopique ou très exigeante.",
              auteurs: "",
              ref: "Proudhon : 'l'anarchie c'est l'ordre sans le pouvoir'",
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
      q: "L'État garantit-il la liberté ou la menace-t-il ?",
      theme: "L'État et la liberté : protecteur ou oppresseur ?",
      intro: "",
      pb: "L'État garantit-il la liberté ou la menace-t-il ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "L'État protège la liberté (Locke, Rousseau) : sans État, la liberté du plus faible est nulle. L'État garantit les droits individuels et l'égalité devant la loi. La liberté civile est supérieure à la liberté naturelle.",
              auteurs: "",
              ref: "Locke, Rousseau Du Contrat social",
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
              args: "Mais l'État peut devenir tyrannie. Tocqueville : le despotisme démocratique menace les libertés par le biais de la 'tyrannie de la majorité'. L'État providence peut conduire à une 'douce servitude'.",
              auteurs: "",
              ref: "Tocqueville, De la démocratie en Amérique",
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
              args: "Marx : l'État bourgeois est structurellement oppresseur. Il protège la liberté formelle (égalité devant la loi) mais maintient l'inégalité réelle. La liberté réelle exige la transformation de l'économie, pas seulement de l'État.",
              auteurs: "",
              ref: "Marx, Le Capital ; La Question juive",
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
      q: "Pourquoi obéit-on à l'État ?",
      theme: "La légitimité de l'État : d'où vient l'autorité ?",
      intro: "",
      pb: "Pourquoi obéit-on à l'État ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Consentement (Locke, Rousseau) : l'État est légitime si les citoyens y ont consenti (contrat social). La démocratie est la forme d'État la plus légitime car la loi y est l'expression de la volonté du peuple.",
              auteurs: "",
              ref: "Rousseau, Du Contrat social III",
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
              args: "Weber : la légitimité peut être traditionnelle (roi de droit divin), charismatique (leader charismatique) ou légale-rationnelle (État de droit). L'État moderne repose sur la loi, non sur la personne du gouvernant.",
              auteurs: "",
              ref: "Weber, Le Savant et le politique",
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
              args: "Rawls : l'État est légitime s'il respecte les principes de justice que les citoyens auraient choisis derrière le voile d'ignorance. La légitimité se fonde sur la justice, pas seulement sur le consentement.",
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
  ],
});
