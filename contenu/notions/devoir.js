/* Notion « Devoir » : Sommes-nous obligés d'agir moralement ?
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("devoir", {
  c: "#993556",
  l: "Devoir",
  s: "Sommes-nous obligés d'agir moralement ?",
  def: "Le <span class='kw'>devoir moral</span> est une obligation inconditionnelle de la raison (Kant), distincte de l'intérêt ou de l'inclination. Pour Kant, le devoir est <span class='kw'>catégorique</span> — il s'impose à tous, indépendamment des conséquences. Mais le devoir peut aussi être compris comme fait social (Durkheim) ou création existentielle (Sartre).<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>L'impératif catégorique (Kant)</div><div class='def-sec-body'>Kant distingue <strong>impératif hypothétique</strong> (si tu veux X, fais Y — conditionnel) et <strong>impératif catégorique</strong> (fais cela, quoi qu'il arrive — inconditionnel). Trois formulations : (1) <em>Universalisation</em> : « Agis comme si ta maxime devait devenir loi universelle » ; (2) <em>Humanité comme fin</em> : « Traite l'humanité toujours comme fin, jamais seulement comme moyen » ; (3) <em>Législation universelle</em> : agis comme membre d'un règne des fins. Une action n'a de valeur morale que si elle est accomplie <em>par devoir</em> (et non simplement <em>conformément</em> au devoir).</div></div><div class='def-sec'><div class='def-sec-title'>Devoir légal vs devoir moral</div><div class='def-sec-body'>Le devoir légal est l'ensemble des obligations imposées par la loi positive (code pénal, contrats). Le devoir moral est intérieur, fondé sur la conscience ou la raison. Ils peuvent coïncider ou entrer en conflit. Arendt (<em>Eichmann à Jérusalem</em>) : l'obéissance aveugle à la loi sans exercice du jugement moral conduit à la « banalité du mal ». Nuremberg : « j'obéissais aux ordres » refusé comme justification.</div></div><div class='def-sec'><div class='def-sec-title'>Désobéissance civile</div><div class='def-sec-body'>Quand la loi est injuste, le devoir moral peut exiger de désobéir. Thoreau (<em>La Désobéissance civile</em>, 1849) : une loi injuste n'est pas une loi. King : « On a le devoir moral de désobéir aux lois injustes. » La désobéissance civile est non-violente, publique, et accepte ses conséquences légales (distinguée de l'anarchisme). Rawls la légitime sous trois conditions : injustice grave, recours légaux épuisés, non-violence.</div></div><div class='def-sec'><div class='def-sec-title'>Devoirs envers la nature et l'avenir</div><div class='def-sec-body'>Jonas (<em>Le Principe responsabilité</em>) : la technique moderne crée de nouveaux devoirs envers les générations futures et la biosphère. « Heuristique de la peur » : anticiper la catastrophe pour s'en prémunir. Simone Weil : devoir de l'ingénieur envers les travailleurs — la technique doit intégrer le bien-être humain dans sa conception même.</div></div></details>",
  auteurs: [
    {
      n: "Kant",
      ideas: [
        {
          w: "Fondements de la métaphysique des mœurs, 1785",
          i: "Impératif catégorique : 'Agis uniquement d'après la maxime que tu peux vouloir voir devenir une loi universelle.' Agir par devoir (non conformément au devoir par intérêt). Autrui comme fin, jamais seulement comme moyen.",
          fiche: "Impératif catégorique : agis selon une maxime universalisable et traite autrui comme une fin, jamais seulement comme un moyen. Agir PAR devoir, non par intérêt.",
          citations: [
            "« Agis de telle sorte que tu traites l'humanité aussi bien dans ta personne que dans la personne de tout autre toujours en même temps comme une fin, et jamais simplement comme un moyen » (Fondements de la métaphysique des mœurs, II, trad. Delbos)",
          ],
          modified: true,
        },
      ],
    },
    {
      n: "Hans Jonas",
      ideas: [
        {
          w: "Le Principe responsabilité, 1990",
          i: "Nouveau devoir face à la puissance technique : responsabilité envers les générations futures et la nature. Heuristique de la peur : anticiper les risques pour agir prudemment. Devoir de non-nuisance au futur.",
          fiche: "Nouveau devoir à l'âge technique : responsabilité envers les générations futures et la nature ; « heuristique de la peur » — anticiper le pire pour l'éviter.",
          citations: [
            "« Agis de façon que les effets de ton action soient compatibles avec la permanence d'une vie authentiquement humaine sur terre » (Le Principe responsabilité, chap. I)",
          ],
          modified: true,
        },
      ],
    },
    {
      n: "Sartre",
      ideas: [
        {
          w: "L'existentialisme est un humanisme, 1946 (conférence 1945)",
          i: "Condamnés à être libres, nous sommes responsables de tout. Pas de nature humaine préalable, pas de Dieu pour dicter le devoir. Le devoir vient de notre liberté radicale. Mauvaise foi = fuir cette responsabilité.",
          fiche: "« Condamné à être libre » : sans nature ni Dieu, le devoir naît de notre liberté ; le fuir, c'est la mauvaise foi.",
          citations: ["« Condamné à être libre » — le devoir vient de notre liberté, non d'une loi donnée"],
        },
      ],
    },
    {
      n: "Durkheim",
      ideas: [
        {
          w: "De la division du travail social, 1893",
          i: "Le devoir moral est un fait social : la morale est la conscience collective intériorisée. L'obligation morale vient de la société, non d'une raison pure.",
          fiche: "Le devoir moral est un fait social : l'obligation vient de la conscience collective intériorisée, non d'une raison pure.",
          citations: ["La morale = 'manière d'agir obligatoire' issue du social"],
        },
      ],
    },
    {
      n: "Simone Weil",
      ideas: [
        {
          w: "L'Enracinement, 1943",
          i: "L'ingénieur a un devoir moral envers les travailleurs : intégrer leur bien-être dans la conception des machines. Le devoir professionnel dépasse le contrat. La technique doit être au service de l'homme.",
          fiche: "Le devoir dépasse le contrat : l'ingénieur doit intégrer le bien-être des travailleurs ; la technique doit servir l'homme.",
          citations: [
            "« Poser en termes techniques les problèmes des répercussions des machines sur le bien-être moral des ouvriers »",
          ],
        },
      ],
    },
    {
      n: "Nietzsche",
      ideas: [
        {
          w: "Généalogie de la morale, 1887",
          i: "Critique de la morale du devoir : elle est issue du ressentiment des faibles. La 'morale des esclaves' (christianisme, Kant) valorise la soumission. Le devoir est une forme de culpabilité institutionnalisée.",
          fiche: "Critique de la morale du devoir : née du ressentiment des faibles (« morale d'esclaves »), elle institutionnalise la culpabilité.",
          citations: ["La mauvaise conscience = intériorisation de la cruauté contre soi-même"],
        },
      ],
    },
    {
      n: "Platon",
      ideas: [
        {
          w: "Criton, ~399 av. J.-C. (étude de texte)",
          i: "Socrate condamné à mort refuse de fuir malgré l'invitation de Criton. Les lois lui parlent : elles l'ont fait naître, éduquer, protéger. Les désobéir serait les trahir comme des parents. Nous avons le devoir d'obéir à la loi même si elle nous paraît injuste — ou alors convaincre légalement qu'elle est injuste. Analogie lois/parents : pertinente en démocratie, mais limitée.",
          fiche: "Criton : Socrate refuse de fuir — les lois sont comme des parents ; on doit leur obéir, ou les convaincre légalement de leur injustice.",
          citations: [
            "Les Lois de la cité demandent à Socrate s'il croit qu'une cité peut subsister si les jugements rendus y restent sans force (Criton, 50 a-b, reformulé)",
          ],
          modified: true,
        },
      ],
    },
    {
      n: "Hannah Arendt",
      ideas: [
        {
          w: "Eichmann à Jérusalem — Rapport sur la banalité du mal, 1963",
          i: "Adolf Eichmann, organisateur de la Solution finale, se défend en disant qu'il 'faisait son devoir de citoyen respectueux de la loi' et obéissait aux ordres. Il invoque même Kant pour justifier son obéissance. Arendt montre que c'était une déformation inconsciente de Kant : il s'agissait d'une 'obéissance de cadavre'. La banalité du mal : le mal peut être accompli sans haine, par simple absence de jugement moral.",
          fiche: "Banalité du mal (Eichmann) : obéir sans juger — « obéissance de cadavre » — rend le mal possible ; le devoir n'exonère pas du jugement moral.",
          citations: ["L''obéissance de cadavre' : obéir sans exercer son jugement moral est la source du mal banal"],
        },
      ],
    },
    {
      n: "Thoreau",
      ideas: [
        {
          w: "La Désobéissance civile, 1849",
          i: "Face à une loi injuste, ne pas l'amender, c'est en être complice. 'Une minorité est impuissante tant qu'elle se conforme à la majorité.' La désobéissance civile = acte public, non violent, qui accepte ses conséquences légales. Elle vise à 'bloquer la machine du gouvernement'. Le passage de la pensée à l'acte est essentiel.",
          fiche: "Désobéissance civile : obéir à une loi injuste, c'est s'en faire complice ; une résistance publique, non-violente, qui assume ses conséquences.",
          citations: ["« Il n'est pas plus juste d'obéir à une loi injuste qu'à une loi juste »"],
        },
      ],
    },
    {
      n: "La Boétie",
      ideas: [
        {
          w: "Discours de la servitude volontaire, 1549",
          i: "Pourquoi les hommes obéissent-ils librement à la tyrannie ? Parce qu'ils s'y habituent dès l'enfance. La servitude est volontaire : si les hommes cessaient de donner leur force au tyran, il tomberait. La liberté se retrouve en cessant de servir, non en combattant.",
          fiche: "Servitude volontaire : le tyran n'a que le pouvoir qu'on lui donne ; cesser de le servir suffit à le faire tomber.",
          citations: [
            "« Soyez résolus de ne servir plus, et vous voilà libres » (Discours de la servitude volontaire, orthographe modernisée)",
          ],
          modified: true,
        },
      ],
    },
    {
      n: "Srdja Popovic",
      ideas: [
        {
          w: "Comment faire tomber un dictateur quand on est seul, tout petit, et sans armes, 2015",
          i: "Fondateur du mouvement Otpor en Serbie. Stratégie de la désobéissance non-violente. L'humour comme outil politique : faire perdre en crédibilité les dirigeants. Méthode CANVAS : petites transgressions mineures, actions créatives, désunion des piliers du régime. Appliqué en Syrie sous Bachar Al-Assad (balles de ping-pong).",
          fiche: "Désobéissance non-violente organisée : l'humour et la créativité (méthode CANVAS) désunissent les piliers d'un régime.",
          citations: ["L'humour et la créativité comme armes de la désobéissance non-violente"],
        },
      ],
    },
    {
      n: "Cicéron",
      ideas: [
        {
          w: "Les Devoirs (De officiis), 44 av. J.-C.",
          i: "Adressé à son fils, le traité fait du devoir (officium) l'action convenable, celle dont on peut rendre raison. L'honnête (sagesse, justice, courage, tempérance) et l'utile ne s'opposent qu'en apparence : rien de vraiment utile ne peut être contraire à l'honnête. Le devoir envers la communauté humaine passe avant l'intérêt particulier.",
          new: true,
          citations: [
            "Ce qui semble utile mais s'oppose à l'honnête n'est qu'une apparence d'utilité (livre III, reformulé)",
          ],
          fiche: "Le devoir (officium) est l'action convenable ; l'utile véritable ne contredit jamais l'honnête.",
        },
      ],
    },
    {
      n: "Adam Smith",
      ideas: [
        {
          w: "Théorie des sentiments moraux, 1759",
          i: "La morale repose sur la sympathie, la capacité de se mettre par l'imagination à la place d'autrui. Pour juger notre propre conduite, nous la regardons avec les yeux d'un spectateur impartial, que nous avons intériorisé : c'est la conscience morale. Smith, qu'on réduit souvent à l'apologie de l'intérêt, est d'abord un philosophe de la sympathie.",
          new: true,
          citations: [
            "Le spectateur impartial, l'homme au-dedans de nous, est le juge de notre conduite (partie III, reformulé)",
          ],
          fiche: "La morale naît de la sympathie ; nous jugeons nos actes par les yeux d'un spectateur impartial intériorisé.",
        },
      ],
    },
    {
      n: "Bentham",
      ideas: [
        {
          w: "Introduction aux principes de morale et de législation, chap. I (1789)",
          i: "Principe d'utilité : une action est bonne si elle augmente le bonheur des personnes concernées, mauvaise si elle le diminue. La morale devient un calcul : on mesure plaisirs et peines selon leur intensité, leur durée, leur certitude, leur proximité. Le législateur doit viser le plus grand bonheur du plus grand nombre.",
          new: true,
          citations: [
            "« La nature a placé l'humanité sous le gouvernement de deux maîtres souverains, la douleur et le plaisir » (chap. I)",
          ],
          fiche: "Principe d'utilité : est bon ce qui augmente le bonheur ; la morale est un calcul des plaisirs et des peines.",
        },
      ],
    },
    {
      n: "Levinas",
      ideas: [
        {
          w: "Totalité et infini (1961) ; Éthique et infini (1982)",
          i: "Le visage d'autrui, nu et vulnérable, me parle avant tout discours : il m'interdit de le tuer et m'oblige. La responsabilité pour autrui est première, antérieure à toute liberté et à tout savoir : l'éthique est la philosophie première. Elle est asymétrique : je suis responsable d'autrui sans attendre la réciproque.",
          new: true,
          citations: ["« Autrui est le seul être que je peux vouloir tuer » (Totalité et infini)"],
          fiche: "Le visage d'autrui m'interdit de tuer et m'oblige : la responsabilité pour autrui est première.",
        },
      ],
    },
    {
      n: "Anscombe",
      ideas: [
        {
          w: "La Philosophie morale moderne (1958)",
          i: "Les notions de devoir moral et d'obligation morale sont des survivances d'une éthique de la loi divine : sans législateur, elles n'ont plus de sens. Anscombe forge le mot conséquentialisme pour critiquer les morales qui jugent un acte à ses seules conséquences, au point d'admettre qu'on puisse condamner un innocent. Elle appelle à revenir, avec Aristote, à une éthique des vertus.",
          new: true,
          citations: ["Les concepts d'obligation et de devoir moral devraient être abandonnés (1958, reformulé)"],
          fiche: "Le devoir moral sans législateur divin n'a plus de sens : critique du conséquentialisme, retour aux vertus.",
        },
      ],
    },
    {
      n: "Iris Murdoch",
      ideas: [
        {
          w: "La Souveraineté du bien (1970)",
          i: "La vie morale n'est pas faite seulement de choix ponctuels : elle se joue dans l'attention, le regard juste et aimant porté sur la réalité et sur autrui. Une mère apprend peu à peu à voir sa belle-fille autrement, sans rien faire de visible : c'est déjà un progrès moral. Le grand ennemi est l'ego, ce voile d'anxiété qui empêche de voir.",
          new: true,
          citations: ["L'attention, regard juste et aimant porté sur une réalité individuelle (reformulé)"],
          fiche: "La morale se joue dans l'attention, regard juste et aimant sur autrui, plus que dans des choix ponctuels.",
        },
      ],
    },
  ],
  textes: [
    {
      n: "Kant — 3 formulations de l'impératif catégorique",
      t: "(1) Universalisation : 'Agis comme si ta maxime devait devenir loi universelle.' (2) Humanité comme fin : 'Traite l'humanité toujours comme fin.' (3) Législation universelle : 'Agis comme membre d'un règne des fins.'",
    },
    {
      n: "Jonas",
      t: "Prométhée déchaîné par la science. Face à l'irréversible et au planétaire, anticipation de la catastrophe comme guide éthique. 'Heuristique de la peur.'",
    },
    {
      n: "Simone Weil",
      t: "Les ingénieurs ont jusqu'ici eu en vue seulement les besoins de la fabrication. La technique entière de la production devrait être transformée. Le bien-être moral des ouvriers doit devenir matière d'enseignement.",
    },
    {
      n: "Sartre — liberté et responsabilité",
      t: "En choisissant pour moi-même, je choisis pour tous les hommes. L'angoisse est la marque de la liberté. La mauvaise foi = se croire déterminé, nier sa liberté pour fuir la responsabilité.",
    },
    {
      n: "Platon, Criton — étude de texte",
      t: "Criton incite Socrate à désobéir au jugement en s'enfuyant. Socrate s'appuie sur le principe de justice : désobéir à la justice c'est trahir la démocratie. Les lois lui ont permis de grandir, il leur doit obéissance — comme à des parents. Mais cette analogie a des limites : elle suppose que les lois soient le reflet de la volonté commune, ce qui n'est pas toujours vrai.",
    },
    {
      n: "Arendt, Eichmann à Jérusalem — texte central",
      t: "Transition de I à II : 'L'obéissance de cadavre'. Eichmann agissait en citoyen respectueux de la loi. Il finissait par insister sur 'les avantages et les inconvénients de l'obéissance aveugle'. Kant déformé : Eichmann disait avoir vécu selon les préceptes moraux de Kant — mais il les avait réduits à l'obéissance aux lois générales de l'État, non à la loi morale universelle.",
    },
    {
      n: "Thoreau, La Désobéissance civile",
      t: "Face à une loi injuste, si tu te contentes de respecter la loi, tu deviens l'agent de l'injustice. La machine du gouvernement est corrompue. Il faut que des hommes cessent d'être la 'machine' qui l'entretient. La désobéissance civile est non-violente, publique, et accepte ses conséquences. C'est un acte politique qui vise à bloquer la machine par la vertu morale, non la violence.",
    },
    {
      n: "La Boétie, Discours de la servitude volontaire",
      t: "'Comment des milliers d'hommes se laissent-ils asservir par un seul ?' L'habitude et l'éducation expliquent la servitude volontaire. Résistance : ne pas obéir suffit — 'cessez de servir, et vous serez libres'. Mais cette résistance individuelle est insuffisante : il faut une action collective et organisée.",
    },
  ],
  exemples: [
    {
      tag: "Histoire",
      tit: "Le procès de Nuremberg (1945-46)",
      body: "Les officiers nazis invoquent le devoir d'obéissance ('Befehl ist Befehl' = un ordre est un ordre). Mais le tribunal reconnaît que certains actes sont criminels même si légaux. Le devoir moral prime sur le devoir légal.",
      lien: "→ Kant (humanité comme fin), Jonas",
    },
    {
      tag: "Littérature",
      tit: "Antigone (Sophocle)",
      body: "Antigone doit choisir entre obéir à la loi de Créon (ne pas enterrer son frère) et obéir à la loi divine (enterrer les morts). Elle choisit le devoir moral contre le devoir légal et en meurt.",
      lien: "→ Désobéissance civile, justice naturelle",
    },
    {
      tag: "Actualité",
      tit: "Lanceurs d'alerte (Snowden, Assange)",
      body: "Ces individus ont révélé des pratiques illégales au nom d'un devoir moral envers les citoyens. Ils ont violé leur devoir légal (secret défense) par devoir moral envers la vérité et la démocratie.",
      lien: "→ Rawls (désobéissance civile), Kant",
    },
    {
      tag: "Philosophie",
      tit: "Simone Weil et le devoir de l'ingénieur",
      body: "Weil décrit des ingénieurs qui conçoivent des machines en ne pensant qu'aux bénéfices et à la production, jamais au bien-être moral des ouvriers. Elle appelle à un devoir professionnel élargi intégrant la dimension humaine.",
      lien: "→ Technique, travail, Jonas",
    },
    {
      tag: "Histoire",
      tit: "Socrate et le Criton",
      body: "Condamné à mort injustement, Socrate refuse pourtant de fuir. Argument : les lois lui ont tout donné (naissance, éducation, protection). Les désobéir serait les trahir comme des parents. Mais l'analogie a des limites : elle ne vaut qu'en démocratie, quand les lois reflètent la volonté commune.",
      lien: "→ Platon (Criton), justice, État, désobéissance civile",
    },
    {
      tag: "Histoire",
      tit: "Eichmann et la banalité du mal (Arendt,)",
      body: "Eichmann organisait la déportation des Juifs tout en se croyant 'bon citoyen respectueux de la loi'. Il invoque même Kant. Arendt montre que le mal peut être accompli sans haine, par simple absence de jugement moral. La leçon : la morale exige de penser, pas seulement d'obéir.",
      lien: "→ Arendt (banalité du mal), Kant (jugement moral), désobéissance",
    },
    {
      tag: "Actualité",
      tit: "Popovic et les balles de ping-pong en Syrie",
      body: "Des activistes syriens envoyaient des balles de ping-pong dans les rues avec des slogans anti-Assad. Impossible à contrôler pour la police. Exemple de désobéissance non-violente créative. L'humour comme outil politique qui fait perdre en crédibilité les dictateurs.",
      lien: "→ Popovic, Thoreau, La Boétie, désobéissance civile",
    },
    {
      tag: "Texte",
      tit: "La Boétie — 'Cessez de servir, vous serez libres'",
      body: "La Boétie pose la question fondamentale : comment un seul tyran domine-t-il des milliers d'hommes ? Par l'habitude, l'éducation, la peur. La liberté ne nécessite pas de combattre — il suffit de cesser d'obéir. Mais la résistance individuelle ne suffit pas : il faut une action collective.",
      lien: "→ La Boétie (servitude volontaire), Thoreau, Popovic",
    },
  ],
  accroches: [
    {
      type: "Citation",
      t: "« Deux choses remplissent l’âme d’admiration : le ciel étoilé au-dessus de moi et la loi morale en moi » — Kant place le devoir au même rang de mystère que l’univers lui-même.",
      src: "Kant, Critique de la raison pratique",
      new: true,
    },
    {
      type: "Cas",
      t: "Faut-il dire la vérité à un meurtrier qui cherche sa victime ? Sur ce cas, Kant soutient qu’on ne peut jamais mentir : le devoir est-il inconditionnel, au point d’ignorer ses conséquences ?",
      new: true,
    },
  ],
  liens: ["Liberté", "Justice", "Conscience", "Nature", "Technique"],
  diss: [
    "Le devoir est-il toujours rationnel ?",
    "A-t-on le droit de désobéir à la loi ?",
    "Agir moralement, est-ce agir contre ses intérêts ?",
    "L'homme a-t-il des devoirs envers la nature ?",
    "Le devoir est-il une contrainte ou une liberté ?",
    "L'obéissance est-elle une vertu morale ?",
    "Peut-on fonder la morale sur la nature ?",
  ],
  plans: [
    {
      q: "Le devoir est-il une loi que la raison se donne à elle-même ?",
      theme: "Le devoir comme impératif rationnel universel",
      intro: "",
      pb: "Le devoir est-il une loi que la raison se donne à elle-même ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Oui (Kant) : l'autonomie morale consiste à se donner sa propre loi. L'hétéronomie (obéir au bonheur, aux désirs, à l'autorité) n'est pas morale. Seul le devoir accompli par respect de la loi morale a une valeur morale.",
              auteurs: "",
              ref: "Kant, Fondements, I",
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
              args: "L'universalité de l'impératif catégorique garantit son objectivité : une maxime est morale si elle peut être universalisée sans contradiction. Exemple : le mensonge ne peut être universalisé (si tout le monde mentait, la notion de vérité disparaîtrait).",
              auteurs: "",
              ref: "Kant, Fondements, II",
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
              args: "Critique : peut-on toujours universaliser ? Cas limites (mentir à un assassin pour protéger sa victime). Kant répond qu'on doit toujours dire la vérité. Mais cette rigidité est contestée.",
              auteurs: "",
              ref: "Schiller, Constant : critique du kantisme",
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
      q: "A-t-on toujours le devoir d'obéir ?",
      theme: "Les limites du devoir formel : cas de conscience",
      intro: "",
      pb: "A-t-on toujours le devoir d'obéir ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Désobéissance civile : face à une loi injuste, la conscience morale peut primer. Martin Luther King : 'On a le devoir moral de désobéir aux lois injustes.' Le devoir moral peut entrer en conflit avec le devoir légal.",
              auteurs: "",
              ref: "King, Lettre de Birmingham",
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
              args: "Objection de conscience (soldats, médecins) : certains professionnels refusent d'exécuter des ordres contraires à leur conscience. La notion de 'crimes contre l'humanité' reconnaît ce droit.",
              auteurs: "",
              ref: "Procès de Nuremberg : 'j'obéissais aux ordres' refusé",
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
              args: "Mais qui décide de ce qui est 'injuste' ? Le risque de l'anarchie morale. Rawls : la désobéissance civile est légitime si elle est non-violente, publique et accepte ses conséquences.",
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
      q: "Avons-nous des devoirs envers ce qui n'existe pas encore ?",
      theme: "De nouveaux devoirs : la responsabilité envers l'avenir",
      intro: "",
      pb: "Avons-nous des devoirs envers ce qui n'existe pas encore ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Oui (Jonas) : la technique crée des effets irréversibles à l'échelle planétaire. Les générations futures ne peuvent pas encore défendre leurs droits. Nous avons donc le devoir de les protéger.",
              auteurs: "",
              ref: "Jonas, Le Principe responsabilité",
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
              args: "Ce devoir implique un principe de précaution : en cas de doute sur un risque grave et irréversible, agir comme si la catastrophe était probable. 'L'heuristique de la peur' guide l'action.",
              auteurs: "",
              ref: "Jonas",
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
              args: "Application concrète : devoir de Simone Weil envers les travailleurs. Les ingénieurs et concepteurs de machines ont le devoir de penser aux conditions de travail. Le devoir s'étend à tous les acteurs techniques.",
              auteurs: "",
              ref: "Simone Weil",
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
