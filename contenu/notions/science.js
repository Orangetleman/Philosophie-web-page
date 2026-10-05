/* Notion « Science » : La science peut-elle tout expliquer ?
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("science", {
  c: "#1A7A4A",
  l: "Science",
  s: "La science peut-elle tout expliquer ?",
  def: "La <span class='kw'>science</span> est une connaissance rationnelle, méthodique et vérifiable des phénomènes naturels ou humains. Elle se distingue de la croyance par ses exigences de preuve et de réfutabilité. Question : la science produit-elle la vérité ? Y a-t-il des domaines hors de sa portée ?<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>Savoir ≠ Croire (Platon)</div><div class='def-sec-body'>Platon (<em>Théétète</em>) propose une définition canonique du savoir : <strong>une croyance vraie justifiée</strong>. Il ne suffit pas de croire (adhésion subjective) ni même que la croyance soit vraie par hasard — il faut une <em>justification</em> (preuve, démonstration, méthode). C'est cette exigence de justification qui distingue la science de la croyance religieuse : <strong>CROIRE ≠ SAVOIR</strong>. La science est adhésion <em>avec</em> démonstration ; la religion, adhésion <em>sans</em> démonstration.</div></div><div class='def-sec'><div class='def-sec-title'>Science et religion : oppositions historiques</div><div class='def-sec-body'>La dissection humaine longtemps prohibée par l'Église catholique (sacralité du corps) a freiné l'anatomie. Galilée condamné par l'Inquisition en 1633 pour avoir défendu l'héliocentrisme. À l'inverse : la pratique de la <strong>relecture par les pairs</strong> (peer-review) en science est l'héritage tardif des pratiques de censure ecclésiastique — où l'Église contrôlait ce qui pouvait être publié. Mais opposition n'est pas nécessité : Galilée, Newton, Mendel, Lemaître étaient eux-mêmes croyants. Stephen Jay Gould (<em>NOMA</em>) : science et religion sont des « magistères qui ne se recouvrent pas » — la science dit le « comment », la religion le « pourquoi ».</div></div></details>",
  auteurs: [
    {
      n: "Popper",
      ideas: [
        {
          w: "La Logique de la découverte scientifique, 1934",
          i: "Critère de démarcation : une théorie est scientifique si elle est réfutable (falsifiable). La psychanalyse et le marxisme ne sont pas des sciences car elles ne peuvent être réfutées. La science progresse par conjectures et réfutations.",
          fiche: "Critère de démarcation : une théorie est scientifique si elle est réfutable (falsifiable) ; la science progresse par conjectures et réfutations, non par accumulation de preuves.",
          citations: ["« La science n'est pas un corps de connaissances certaines mais de conjectures audacieuses »"],
        },
      ],
    },
    {
      n: "Kuhn",
      ideas: [
        {
          w: "La Structure des révolutions scientifiques, 1962",
          i: "La science progresse par paradigmes — matrices disciplinaires partagées. La révolution scientifique est un changement de paradigme, non une accumulation linéaire. Exemple : passage de Ptolémée à Copernic.",
          fiche: "La science progresse par paradigmes (matrices partagées) : une révolution scientifique est un changement de paradigme (Ptolémée→Copernic), non une accumulation linéaire.",
          citations: ["« Un paradigme est ce que les membres d'une communauté scientifique partagent »"],
        },
      ],
    },
    {
      n: "Platon",
      ideas: [
        {
          w: "Théétète, ~369 av. J.-C.",
          i: "Définition canonique du savoir : <strong>une croyance vraie justifiée</strong>. Il ne suffit pas qu'une croyance soit vraie — il faut pouvoir en rendre raison (<em>logos</em>). Cette exigence de <em>justification</em> distingue la science (savoir démontré) de l'opinion (<em>doxa</em>) et de la croyance religieuse (adhésion sans démonstration). CROIRE ≠ SAVOIR : la science est adhésion <em>avec</em> démonstration.",
          fiche: "Le savoir est une croyance vraie justifiée : l'exigence de justification (logos) distingue la science de la simple croyance — CROIRE ≠ SAVOIR.",
          citations: ["« Le savoir est une croyance vraie justifiée »"],
        },
      ],
    },
    {
      n: "Stephen Jay Gould",
      ideas: [
        {
          w: "Et Dieu dit : « Que Darwin soit ! », 1999",
          i: "Principe NOMA (Non-Overlapping Magisteria) : science et religion sont deux <strong>magistères qui ne se recouvrent pas</strong>. La science traite du « comment » (faits, mécanismes, lois empiriques) ; la religion traite du « pourquoi » (sens, valeurs, finalité ultime). Leurs domaines sont distincts — donc l'opposition n'est pas nécessaire mais résulte de transgressions de frontières (créationnisme, scientisme).",
          fiche: "Principe NOMA : science et religion sont des « magistères qui ne se recouvrent pas » — la science dit le « comment », la religion le « pourquoi » ; l'opposition n'est pas nécessaire.",
          citations: ["« La science traite de la fabrique du monde, la religion du sens de la vie »"],
        },
      ],
    },
    {
      n: "Russell",
      ideas: [
        {
          w: "Science et religion, 1935 / Problèmes de Philosophie, 1912 / Is There a God?, 1952",
          i: "Critique rationaliste rigoureuse du conflit science/religion : « Les credos sont la source du conflit intellectuel entre la science et la religion », car ils mettent en doute les credos religieux et requièrent les esprits libres. <strong>Problème de l'induction</strong> : aucune science empirique n'est définitivement prouvée. <strong>Théière de Russell</strong> (1952) : si j'affirmais qu'une théière en porcelaine est en orbite entre la Terre et Mars, personne ne pourrait me réfuter — mais la charge de la preuve pèse sur celui qui affirme l'existence, non sur celui qui doute. Argument transposé à la religion : Dieu est une théière.",
          fiche: "Critique du conflit science/religion + problème de l'induction : aucune science empirique n'est définitivement prouvée ; la « théière en orbite » : la charge de la preuve pèse sur qui affirme.",
          citations: [
            "« Une théorie qui ne peut être réfutée par aucun fait concevable n'est pas scientifique — il en va de même de la théière en orbite »",
          ],
        },
      ],
    },
    {
      n: "Einstein",
      ideas: [
        {
          w: "Comment je vois le monde, 1934",
          i: "<strong>Religiosité cosmique</strong> : le sentiment religieux le plus haut ne naît pas du « Dieu sensible au cœur » de Pascal mais de l'<em>admiration de l'ordre rationnel</em> du monde. La science elle-même engendre une forme de religiosité — celle de l'esprit qui s'émerveille devant l'intelligibilité du cosmos. C'est le « Dieu de Spinoza » : pas de providence personnelle, mais une nécessité harmonieuse à laquelle l'esprit s'incline. La science et un certain sentiment religieux sont donc non seulement compatibles, mais peuvent procéder l'un de l'autre.",
          fiche: "« Religiosité cosmique » : la science engendre l'émerveillement devant l'ordre rationnel du monde (le « Dieu de Spinoza ») — science et sentiment religieux peuvent procéder l'un de l'autre.",
          citations: [
            "« La religiosité cosmique est le sentiment le plus fort et le plus noble qui soit accessible à la recherche scientifique »",
          ],
        },
      ],
    },
    {
      n: "Bachelard",
      ideas: [
        {
          w: "La Formation de l'esprit scientifique, 1938",
          i: "<strong>Obstacle épistémologique</strong> : la connaissance scientifique ne progresse pas par accumulation linéaire d'observations, mais par <em>ruptures</em> avec des « obstacles » internes à l'esprit qui pense — habitudes, images premières, opinions sensibles, métaphores trompeuses, autorité de l'évidence immédiate. L'<em>opinion</em> est l'obstacle premier : elle traduit des besoins en termes de connaissance. La science doit penser <em>contre</em> elle. L'erreur n'est donc pas accident extérieur : elle est la matière même du progrès — « toute connaissance est une réponse à une question ».",
          fiche: "La connaissance progresse par ruptures avec des « obstacles épistémologiques » (habitudes, images, opinion) ; l'opinion « a toujours tort » : la science pense contre elle.",
          citations: [
            "« On ne peut rien fonder sur l'opinion : il faut d'abord la détruire »",
            "« L'opinion a, en droit, toujours tort »",
          ],
        },
        {
          w: "Le Nouvel Esprit scientifique, 1934 / Le Rationalisme appliqué, 1949",
          i: "Application contemporaine : <strong>l'intelligence artificielle peut devenir un nouvel obstacle épistémologique</strong>. Les modèles numériques (deep learning) produisent des résultats « porteurs avec une apparente rigueur mathématique » qui certifient à une compréhension élevée. Mais l'apparente précision formelle n'est qu'une <em>rationalité non constructive</em> — illusion de domination de l'intuition naïve. La « mystification épistémologique » consiste à imaginer que toute représentation informatique du réel est une <em>fenêtre transparente sur le monde</em>, alors qu'elle est une <em>abstraction construite</em>. Le savant rigoureux doit se défier autant de la magie du numérique que de la magie sensible : tout deux sont des obstacles à franchir.",
          fiche: "Application contemporaine : l'IA peut devenir un nouvel obstacle épistémologique — l'apparente rigueur mathématique des modèles fait prendre une abstraction construite pour une fenêtre transparente sur le réel.",
          citations: [
            "« L'esprit scientifique nous interdit d'avoir une opinion sur des questions que nous ne comprenons pas, sur des questions que nous ne savons pas formuler clairement »",
          ],
        },
      ],
    },
  ],
  textes: [
    {
      n: "Platon, Théétète — savoir = croyance vraie justifiée",
      t: "Socrate, dans le <em>Théétète</em>, examine successivement trois définitions du savoir : (1) le savoir = sensation (réfutée : sensations contradictoires) ; (2) le savoir = opinion vraie (réfutée : on peut avoir raison par hasard) ; (3) le savoir = opinion vraie accompagnée de raison (<em>logos</em>). Cette troisième définition, bien que problématique chez Platon lui-même, est devenue la définition classique de la connaissance occidentale (« justified true belief »). Elle pose la justification rationnelle comme critère de démarcation entre savoir et simple croyance.",
    },
    {
      n: "Définitions et opposition science/religion",
      t: "<strong>Science</strong> = ensemble de savoirs/connaissances ; adhésion <em>avec</em> démonstration. <strong>Religion</strong> = ensemble de croyances ; adhésion <em>sans</em> démonstration. Platon : le savoir est « une croyance vraie justifiée ». <strong>CROIRE ≠ SAVOIR</strong>. <em>Oppositions historiques</em> : (a) la dissection humaine prohibée par l'Église catholique (sacralité du corps) — frein durable à l'anatomie scientifique ; (b) histoire des pratiques de relecture par les pairs (peer-review) résultant elles-mêmes de pratiques de censure ecclésiastique sur les publications. Mais ces oppositions historiques ne suffisent pas à conclure à une opposition <em>nécessaire</em> : la question reste ouverte (cf. Galilée croyant, Mendel moine, Lemaître prêtre).",
    },
    {
      n: "Russell — Science et religion (1935)",
      t: "« Les credos sont la source du conflit intellectuel entre la science et la religion. L'âpreté de la résistance à été due à leurs liens avec les Églises et les codes moraux. Ceux qui mettaient en doute les credos affaiblissaient l'autorité du clergé, et risquaient d'amoindrir ses revenus ; en outre, ils paraissaient pour saper la moralité, puisque le clergé déduisait les devoirs moraux des credos. <em>Il semblait donc aux dirigeants temporels comme aux gens d'Église, qu'ils avaient de bonnes raisons de craindre les doctrines révolutionnaires des hommes de science.</em> […] Un credo religieux diffère d'une théorie scientifique en ce qu'il prétend exprimer la vérité éternelle et absolument certaine, tandis que la science garde un caractère provisoire : elle s'attend à ce que des modifications de ses théories actuelles deviennent tôt ou tard nécessaires, et se rend compte que sa méthode est logiquement incapable d'arriver à une démonstration complète et définitive. »",
    },
    {
      n: "Russell — Dieu apparaît comme une hypothèse inutile et infalsifiable (Is There a God?, 1952)",
      t: "« De nombreuses personnes orthodoxes parlent comme s'il était le travail des sceptiques de réfuter les dogmes plutôt qu'à ceux qui les soutiennent de les prouver. Ceci est bien évidemment une erreur. Si je suggérais qu'entre la Terre et Mars se trouve une théière de porcelaine en orbite elliptique autour du Soleil, personne ne serait à même de réfuter mon allégation à la condition que je prenne la précaution de préciser que la théière est trop petite pour être détectée par nos plus puissants télescopes. Mais si j'affirmais que, comme ma proposition ne peut être réfutée, il n'est pas tolérable pour la raison humaine d'en douter, on me considérerait aussitôt comme un illuminé. Cependant, si l'existence de cette théière était décrite dans des livres anciens, enseignée comme une vérité sacrée tous les dimanches et inculquée aux enfants à l'école, alors toute hésitation à croire en son existence deviendrait un signe d'excentricité et vaudrait au sceptique les soins d'un psychiatre. »",
    },
    {
      n: "Kuhn — La notion de paradigme (La Structure des révolutions scientifiques, 1962)",
      t: "« Considérons d'abord un changement de paradigme particulièrement célèbre, la naissance de l'astronomie copernicienne. Quand la théorie précédente, le système de Ptolémée, avait été élaborée par les Anciens et améliorée pendant les cinq derniers siècles avant J.-C., et les deux derniers siècles suivants, elle réussissait admirablement à prédire les changements de position des étoiles aussi bien que des planètes. […] Mais à mesure que le temps passait, un spectateur considérant le résultat net des efforts de nombreux astronomes pouvait remarquer que la complexité de l'astronomie augmentait beaucoup plus vite que son exactitude et qu'une divergence corrigée à tel endroit se manifestait probablement à un autre. […] Telle fut la condition indispensable du rejet du paradigme de Ptolémée par Copernic et de la recherche d'un nouveau paradigme. »<br><br>Idée majeure : la science ne progresse pas seulement par accumulation linéaire, mais par <em>révolutions</em> où un paradigme (matrice disciplinaire partagée) en remplace un autre — incommensurable avec lui.",
    },
    {
      n: "Russell — Le problème de l'induction (Problèmes de Philosophie, 1912)",
      t: "« Si on nous demande pourquoi nous croyons que le soleil se lèvera demain, il est clair que nous répondrons tout naturellement — parce qu'il s'est levé jusqu'ici chaque jour. Nous croyons fermement qu'il se lèvera à l'avenir, parce qu'il s'est ainsi levé dans le passé. […] <strong>Le fait que deux choses se soient toujours produites ensemble dans le passé ne constitue pas une preuve qu'elles continueront à se produire ensemble dans l'avenir.</strong> » Conséquence : la science empirique repose sur un acte de foi inductif — la croyance que les régularités passées se maintiendront. Aucune théorie scientifique n'est définitivement démontrée.",
    },
    {
      n: "Popper — La falsifiabilité comme critère de scientificité (À la Recherche d'un monde meilleur, 1984)",
      t: "« La connaissance est recherche de la vérité — recherche de théories objectivement vraies, explicatives. Elle <em>n'est pas recherche de certitude</em>. L'erreur est humaine : toute connaissance humaine est faillible, et donc incertaine. […] Ce n'est que si nous ne pouvons pas les réfuter, en dépit des plus grands efforts, que nous pouvons dire qu'elles ont résisté aux tests les plus sévères. C'est la raison pour laquelle la découverte d'exemples qui confirment une théorie n'a pas de signification, si nous n'avons pas essayé, sans succès, de découvrir des réfutations. Car si nous ne prenons pas une attitude critique, nous trouverons toujours ce que nous désirons : nous rechercherons, et nous trouverons, des confirmations ; nous éviterons, et nous ne verrons pas, tout ce qui pourrait être dangereux pour nos théories favorites. » (Popper, <em>Misère de l'historicisme</em>, 1945)",
    },
    {
      n: "Einstein — La religiosité scientifique (Comment je vois le monde, 1934)",
      t: "« Vous trouverez difficilement un esprit fouillant profondément la science qui ne possède pas une religiosité caractéristique. Mais cette religiosité se distingue de l'homme simple : pour ce dernier, Dieu est un être dont il espère la sollicitude, dont il redoute le châtiment, un être avec lequel il entretient dans une certaine mesure des relations impersonnelles, si respectueuses qu'elles soient : c'est un sentiment sublimé de même nature que les rapports du fils à père. Au contraire, le savant est pénétré du sentiment de la causalité de tout ce qui arrive. Pour lui, l'avenir ne comporte pas moins de détermination et d'obligation que le passé, la morale n'a rien de divin, c'est une question purement humaine. <strong>Sa religiosité réside dans l'admiration extasiée de l'harmonie de la nature ; il s'y révèle une raison si supérieure que toutes les raisons humaines dans leurs pensées n'est vis-à-vis de cette qu'un reflet absolument nul.</strong> Ce sentiment est le leitmotiv de la vie et des efforts du savant, dans la mesure où il peut s'élever au-dessus de l'esclavage de ses désirs égoïstes. »",
    },
  ],
  exemples: [
    {
      tag: "Histoire",
      tit: "La dissection prohibée par l'Église catholique",
      body: "Pendant tout le Moyen Âge, l'Église catholique a interdit ou fortement encadré la dissection des cadavres humains, au nom de la sacralité du corps (créé à l'image de Dieu, devant ressusciter intact). Cette prohibition a freiné durablement l'anatomie médicale. Vésale (<em>De humani corporis fabrica</em>, 1543) a dû braver ces interdits pour fonder l'anatomie moderne. Cas paradigmatique d'opposition historique science/religion.",
      lien: "→ Opposition science/religion, histoire de la médecine",
    },
    {
      tag: "Histoire",
      tit: "Procès de Galilée (1633)",
      body: "Galilée, défenseur de l'héliocentrisme copernicien (la Terre tourne autour du Soleil), est condamné par l'Inquisition romaine en 1633. Il abjure publiquement (« E pur si muove » — légende) et finit ses jours en résidence surveillée. Réhabilité par Jean-Paul II en 1992. Symbole canonique du conflit entre vérité scientifique et autorité religieuse — mais à nuancer : Galilée resta catholique fervent ; le conflit était autant institutionnel et politique que théologique.",
      lien: "→ Galilée, héliocentrisme, autorité religieuse vs autonomie scientifique",
    },
    {
      tag: "Histoire",
      tit: "Peer-review : héritage laïcisé de la censure ecclésiastique",
      body: "La pratique moderne de la relecture par les pairs (peer-review) avant publication scientifique trouve une partie de ses racines dans les procédures ecclésiastiques de contrôle des publications (<em>imprimatur</em>, censure, Index). Ce que l'Église faisait pour préserver le dogme, la communauté scientifique le fait aujourd'hui pour préserver la rigueur méthodologique. Continuité institutionnelle, rupture épistémique : même geste, autre finalité.",
      lien: "→ Sociologie des sciences, peer-review, héritage institutionnel",
    },
    {
      tag: "Science",
      tit: "Lemaître — l'« atome primitif » (Big Bang) par un prêtre",
      body: "Georges Lemaître (1894-1966), prêtre catholique belge et astrophysicien, est l'auteur de la théorie de l'atome primitif (1931) — ancêtre du Big Bang. Pie XII voulut y voir une preuve scientifique de la Création ; Lemaître refusa cette assimilation au nom de l'autonomie des deux ordres. Cas exemplaire de la thèse NOMA de Gould : un même esprit peut conduire science et religion sans confusion ni conflit.",
      lien: "→ NOMA (Gould), compatibilité science/religion, Big Bang",
    },
    {
      tag: "Épistémologie",
      tit: "Russell — La théière en orbite (1952)",
      body: "Russell forge l'image de la <strong>théière en orbite</strong> entre la Terre et Mars, trop petite pour être détectée par les télescopes : aucun observateur ne pourrait la réfuter. Mais cela ne fait pas d'elle une hypothèse raisonnable — la <em>charge de la preuve</em> pèse sur celui qui affirme, non sur le sceptique. Si l'on conjecture une existence non démontrable, on ne peut exiger d'être cru. Argument classique contre la position selon laquelle l'incapacité à réfuter une croyance religieuse vaudrait preuve de sa vérité.",
      lien: "→ Russell, charge de la preuve, falsifiabilité, théière",
    },
    {
      tag: "Épistémologie",
      tit: "Kuhn — Le passage de Ptolémée à Copernic",
      body: "Cas paradigmatique de <em>révolution scientifique</em> (Kuhn, 1962). Le système de Ptolémée fonctionnait remarquablement pour prédire les positions astronomiques. Pour corriger des divergences mineures, ses successeurs ajoutaient des <em>épicycles</em> — la théorie devenait de plus en plus complexe sans gagner en précision. Copernic ne « réfute » pas Ptolémée : il propose un autre <strong>paradigme</strong>, héliocentrique, plus économe. La science ne progresse pas par accumulation linéaire mais par ruptures où une matrice disciplinaire en remplace une autre, parfois <em>incommensurable</em> avec elle.",
      lien: "→ Kuhn, paradigme, révolution scientifique, Copernic",
    },
    {
      tag: "Philosophie",
      tit: "Einstein — Le « Dieu de Spinoza »",
      body: "Einstein revendique explicitement Spinoza : « Je crois au Dieu de Spinoza, qui se révèle dans l'harmonie de tout ce qui existe — non en un Dieu qui se préoccupe des destinées et des actes des hommes. » Pas de providence personnelle, pas de prière efficace, pas de miracle. Mais une <strong>religiosité cosmique</strong> : émerveillement devant l'intelligibilité de l'univers, et conviction que ce qui rend la science possible (l'ordre rationnel du monde) est lui-même un mystère digne d'admiration. Cas exemplaire d'une religiosité <em>compatible avec</em> et <em>nourrie par</em> la pratique scientifique.",
      lien: "→ Einstein, Spinoza, religiosité cosmique, panthéisme",
    },
    {
      new: true,
      tag: "Critique des pseudo-sciences",
      tit: "L'effet Barnum (astrologie, horoscopes, tests de personnalité)",
      body: "L'<strong>effet Barnum</strong> (décrit par Paul Meehl en 1956, du nom du forain américain P. T. Barnum, célèbre pour ses spectacles attrape-tout) est un biais cognitif : on tend à accepter comme étonnamment justes des descriptions de personnalité <em>générales et vagues</em> qui s'appliqueraient en réalité à n'importe qui. C'est l'<strong>astrologie</strong> qui exploite le plus systématiquement ce biais : « Vous êtes parfois extraverti, mais aussi capable d'introspection » s'applique à 100 % des humains. Les horoscopes, la graphologie, la plupart des tests de personnalité non scientifiques fonctionnent ainsi. Conséquence épistémologique : ces énoncés ne sont pas <em>faux</em>, ils sont <em>non-falsifiables</em> — ils s'ajustent à tout cas particulier. Critère décisif (Popper) : une discipline scientifique doit faire des prédictions <em>précises</em> qui pourraient être démenties.",
      lien: "→ Effet Barnum, falsifiabilité (Popper), pseudo-science, astrologie",
    },
    {
      new: true,
      tag: "Épistémologie",
      tit: "Russell — Le caractère provisoire de la science (Essais sceptiques, 1928)",
      body: "Dans <em>Essais sceptiques</em> (1928), Russell analyse trois traits constitutifs de la connaissance scientifique : (1) la science <strong>se renouvelle</strong> — caractère <em>provisoire</em> : aucune théorie n'est tenue pour définitive ; (2) la science est <strong>incomplète</strong> — il y a toujours plus à savoir ; (3) la science n'est jamais <strong>non dépassée</strong> — toute théorie sait qu'elle pourra l'être un jour. Russell oppose ce régime à celui du <em>credo</em> religieux qui prétend à la « vérité éternelle et absolument certaine ». L'attitude proprement scientifique est ce <em>scepticisme méthodique</em> qui maintient ouverte la possibilité de la révision. Russell prolonge ici le pyrrhonisme antique (épokhē, suspension du jugement) en l'orientant non vers le silence mais vers la conjecture audacieuse et révisable.",
      lien: "→ Russell, scepticisme, pyrrhonisme, falsifiabilité, science provisoire",
    },
    {
      new: true,
      tag: "Épistémologie",
      tit: "Bachelard — L'IA comme nouvel obstacle épistémologique",
      body: "Application contemporaine de la thèse bachelardienne (<em>La Formation de l'esprit scientifique</em>, 1938). Les modèles d'<strong>intelligence artificielle</strong> produisent des résultats « porteurs avec une apparente rigueur mathématique » qui suggèrent une compréhension élevée du réel. Mais cette <em>précision formelle</em> n'est qu'une rationalité non-constructive — illusion de domination de l'intuition naïve. La <strong>mystification épistémologique</strong> consiste à imaginer que toute représentation informatique du réel est une <em>fenêtre transparente sur le monde</em>, alors qu'elle est une <em>abstraction construite</em>. Bachelard estimait que la science a toujours, à chaque époque, son <em>premier obstacle</em> à franchir : à l'époque pré-lavoisienne c'était l'animisme, à la nôtre c'est la magie du numérique. Le savant rigoureux doit se défier autant des sortilèges du <em>deep learning</em> que de ceux du sens commun.",
      lien: "→ Bachelard, obstacle épistémologique, IA, modélisation",
    },
    {
      new: true,
      tag: "Méthode",
      tit: "Induction, déduction et problème de l'induction",
      body: "<strong>Raisonnement déductif</strong> : du général au particulier — d'un énoncé général « toutes les A sont B » + « x est A », on tire « x est B » (validité formelle, vérité préservée). <strong>Raisonnement inductif</strong> : du particulier au général — d'un nombre fini de cas observés (CP1, CP2, CP3 sont B), on tire la loi « tous les A sont B ». La science empirique procède inductivement, et c'est précisément ce qui constitue le <strong>problème de l'induction</strong> (Hume, Russell) : il est <em>impossible</em> de tester l'infini des cas particuliers. Aucune accumulation d'observations passées ne prouve qu'une régularité se maintiendra (« le soleil s'est levé chaque jour ⇒ il se lèvera demain » : conclusion non démontrée). Conséquence : la science empirique est <em>conjecturale</em>, jamais nécessaire. C'est ce qui mène Popper à proposer la <em>falsifiabilité</em> comme critère de scientificité — non plus la confirmation (impossible), mais la résistance aux tentatives de réfutation.",
      lien: "→ Induction / déduction, problème de l'induction (Hume, Russell), falsifiabilité (Popper)",
    },
  ],
  accroches: [
    {
      type: "Citation",
      t: "« Une théorie scientifique n’est jamais vérifiable, elle est seulement falsifiable » : Popper renverse l’idée reçue — ce qui fait la force de la science, c’est qu’elle accepte d’être réfutée.",
      src: "Popper, La Logique de la découverte scientifique",
      new: true,
    },
    {
      type: "Histoire",
      t: "En 1633, Galilée est contraint d’abjurer devant l’Inquisition l’idée que la Terre tourne : le conflit n’oppose pas tant la science à la religion que deux manières de fonder la vérité.",
      new: true,
    },
  ],
  liens: ["Raison", "Vérité", "Technique", "Nature", "Langage", "Religion"],
  diss: [
    "La science peut-elle tout expliquer ?",
    "Y a-t-il une vérité scientifique unique ?",
    "La science est-elle objective ?",
    "Le progrès scientifique est-il nécessairement un progrès moral ?",
    {new: true, q: "Science et religion s'opposent-elles nécessairement ?"},
    {new: true, q: "Le savoir est-il une croyance comme une autre ?"},
    {new: true, q: "La science a-t-elle besoin de la religion ?"},
    {new: true, q: "L'intelligence artificielle nous rapproche-t-elle ou nous éloigne-t-elle du réel ?"},
    {new: true, q: "Une théorie qui ne peut être réfutée mérite-t-elle d'être appelée scientifique ?"},
  ],
  plans: [
    {
      q: "En quoi la science se distingue-t-elle radicalement de la religion ?",
      theme: "Science et religion s'opposent par leurs régimes de vérité",
      intro: "",
      pb: "En quoi la science se distingue-t-elle radicalement de la religion ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Distinction fondamentale Platon : le savoir est <em>une croyance vraie justifiée</em>. La science exige démonstration et reproductibilité ; la religion repose sur la foi (adhésion sans démonstration). CROIRE ≠ SAVOIR : ce sont deux régimes épistémiques distincts.",
              auteurs: "",
              ref: "Platon, Théétète",
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
              args: "Critère de démarcation (Popper) : une théorie est scientifique si elle est <em>réfutable</em>. Les énoncés religieux (existence de Dieu, miracle, providence) ne le sont pas — ils sont à l'extérieur du domaine scientifique. La science avance par réfutation, la religion par révélation et tradition.",
              auteurs: "",
              ref: "Popper, La Logique de la découverte scientifique",
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
              args: "Oppositions historiques attestées : dissection humaine prohibée par l'Église catholique (sacralité du corps), condamnation de Galilée (1633), Index des livres interdits, procès Scopes (1925) sur l'évolution. La science a dû conquérir son autonomie contre l'autorité religieuse.",
              auteurs: "",
              ref: "Histoire des sciences ; cas Galilée",
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
      q: "Science et religion sont-elles condamnées à s'affronter ?",
      theme: "Mais l'opposition n'est ni nécessaire ni absolue",
      intro: "",
      pb: "Science et religion sont-elles condamnées à s'affronter ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Stephen Jay Gould — principe <strong>NOMA</strong> (Non-Overlapping Magisteria) : science et religion sont deux magistères distincts qui ne se recouvrent pas. La science dit le « comment » (faits, mécanismes), la religion le « pourquoi » (sens, valeurs). Pas de conflit possible si chacun reste dans son domaine.",
              auteurs: "",
              ref: "Gould, Et Dieu dit : « Que Darwin soit ! »",
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
              args: "De nombreux grands scientifiques ont été croyants : Galilée (catholique fervent malgré sa condamnation), Newton (théologien autant que physicien), Mendel (moine augustinien fondateur de la génétique), Lemaître (prêtre, père du Big Bang), Einstein (« religion cosmique »). La pratique scientifique n'exclut pas la foi religieuse.",
              auteurs: "",
              ref: "Histoire des sciences",
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
              args: "L'institution scientifique a hérité de structures religieuses : la <strong>relecture par les pairs</strong> (peer-review) est l'héritage laïcisé des pratiques de censure ecclésiastique sur les publications. Université, monastères, copies de manuscrits — la science moderne s'est construite dans et avec l'institution religieuse, non seulement contre elle.",
              auteurs: "",
              ref: "Histoire institutionnelle des sciences",
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
      q: "Que reste-t-il à la religion quand la science avance ?",
      theme: "Science et religion répondent à des besoins humains distincts mais complémentaires",
      intro: "",
      pb: "Que reste-t-il à la religion quand la science avance ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "La science explique mais n'oriente pas : elle ne dit pas <em>ce qu'il faut faire</em> (Hume — on ne déduit pas le devoir-être de l'être). La religion (et plus largement la philosophie morale) offre des cadres de sens et d'action que la science ne produit pas. La science peut <em>informer</em> nos choix, non les <em>fonder</em>.",
              auteurs: "",
              ref: "Hume, Traité de la nature humaine ; Weber, Le Savant et le politique",
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
              args: "Wittgenstein : « Nous sentons que, même si toutes les questions scientifiques possibles sont résolues, nos problèmes vitaux n'ont même pas encore été effleurés. » La science ne répond pas à la question du sens de l'existence — c'est le rôle traditionnel de la religion (ou de la philosophie).",
              auteurs: "",
              ref: "Wittgenstein, Tractatus logico-philosophicus, 6.52",
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
              args: "Inversement, la religion n'est plus aujourd'hui une cosmologie concurrente de la science : la plupart des théologies modernes acceptent la science (cosmologie, évolution) et se replient sur le sens, l'éthique, le rituel, la communauté. L'opposition n'est nécessaire que lorsqu'une des deux empiète sur l'autre (créationnisme, scientisme).",
              auteurs: "",
              ref: "Théologie contemporaine ; Habermas, Une époque de transitions",
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
