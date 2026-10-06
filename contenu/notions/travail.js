/* Notion « Travail » : Le travail libère-t-il ou aliène-t-il ?
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("travail", {
  c: "#3B6D11",
  l: "Travail",
  s: "Le travail libère-t-il ou aliène-t-il ?",
  def: "Le <span class='kw'>travail</span> est la transformation de la nature par l'activité humaine. Il est à la fois <span class='kw'>aliénant</span> (pénible, asservissant, marchandisé) et potentiellement <span class='kw'>libérateur</span> (réalisation de soi, humanisation). Arendt distingue labor/work/action. Nietzsche le critique comme instrument de contrôle social.<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>Étymologie &amp; trois dimensions (Arendt)</div><div class='def-sec-body'>Du latin <em>tripalium</em> (instrument de torture à trois pieux) : le travail est d'abord pénibilité. Hannah Arendt (<em>Condition de l'homme moderne</em>, 1958) distingue trois activités : <strong>Labor</strong> (cycle biologique nécessaire, répétitif, sans œuvre durable — corvée quotidienne) ; <strong>Work / Œuvre</strong> (fabrication d'un monde durable : artisan, artiste) ; <strong>Action</strong> (activité politique libre entre hommes). Seuls l'œuvre et l'action permettent de se réaliser pleinement comme humain.</div></div><div class='def-sec'><div class='def-sec-title'>Aliénation et exploitation (Marx)</div><div class='def-sec-body'>Marx distingue le travail libre (expression de la vie) du travail aliéné (sous le capitalisme). Quatre formes d'aliénation : (1) par rapport au <strong>produit</strong> qui échappe au travailleur ; (2) par rapport à l'<strong>activité</strong> imposée et mécanique ; (3) par rapport à l'<strong>espèce</strong> (déshumanisation) ; (4) par rapport aux <strong>autres</strong> (concurrence). La <em>plus-value</em> est le temps de travail non payé extorqué par le capitaliste.</div></div><div class='def-sec'><div class='def-sec-title'>L'artiste travaille-t-il ? (question clé)</div><div class='def-sec-body'>Une question centrale se pose. <strong>L'artiste travaille</strong> : il produit des efforts réguliers, maîtrise une technique (Nietzsche, <em>Humain trop humain</em> : le « génie » est une illusion — l'artiste observe, travaille, s'exerce). <strong>L'artiste ne travaille pas</strong> : l'œuvre est inutile (≠ satisfaction des besoins), potentiellement immortelle (Arendt), et l'artiste est toujours maître de ses outils (≠ le travailleur asservi à la machine). <strong>L'artiste crée</strong> : l'œuvre est unique, originale, non reproductible par règle — c'est ce que Kant appelle le <em>génie</em>.</div></div><div class='def-sec'><div class='def-sec-title'>Le sens du travail aujourd'hui</div><div class='def-sec-body'>Weil : le travail non servile est celui où le travailleur comprend le lien entre son geste et la finalité du produit. Graeber (<em>Bullshit Jobs</em>) : de nombreux emplois modernes sont perçus comme inutiles par ceux qui les exercent — source de souffrance psychique. Lafargue (<em>Le Droit à la paresse</em>, 1880) : la classe ouvrière s'est laissé intoxiquer par la passion du travail, instrument de sa propre exploitation.</div></div></details>",
  auteurs: [
    {
      n: "Hegel",
      ideas: [
        {
          w: "Phénoménologie de l'Esprit, 1807",
          i: "Dialectique maître/esclave : le maître jouit sans travailler mais reste dépendant. L'esclave, en travaillant la matière, se forme lui-même et découvre sa liberté. Le travail = médiation entre l'homme et le monde.",
          fiche: "Dialectique maître/esclave : en travaillant la matière, l'esclave se forme et se libère, tandis que le maître reste dépendant — le travail médiatise l'homme et le monde.",
          citations: [
            "Par le travail, l'esclave se forme et prend conscience de lui-même (Phénoménologie de l'Esprit, maître et esclave, reformulé)",
          ],
          modified: true,
        },
      ],
    },
    {
      n: "Marx",
      ideas: [
        {
          w: "Manuscrits de 1844 / Le Capital, 1867",
          i: "4 formes d'aliénation : par rapport au produit (qui lui échappe), à l'activité (mécanique), à l'espèce (déshumanisation), aux autres (concurrence). Plus-value : exploitation du travail. Mais le travail libre est l'essence de l'homme.",
          fiche: "Le travail aliéné sépare l'ouvrier de son produit, de son activité, de l'espèce et des autres (plus-value = exploitation) — mais le travail libre est l'essence de l'homme.",
          citations: [
            "Le travail aliéné arrache à l'homme l'objet de sa production et, avec lui, sa vie générique (Manuscrits de 1844, reformulé)",
          ],
          modified: true,
        },
      ],
    },
    {
      n: "Hannah Arendt",
      ideas: [
        {
          w: "Condition de l'homme moderne, 1958",
          i: "Labor (nécessité biologique, cycle sans fin : Extraits 1-4) vs Work/Œuvre (fabrique un monde durable, transforme la nature : Extrait 3) vs Action (activité politique libre). Le labor seul ne réalise pas l'homme.",
          fiche: "Trois activités : labor (nécessité biologique cyclique), œuvre (fabrique un monde durable), action (politique) — le seul labor ne réalise pas l'homme.",
          citations: ["Travail (répétitif, nécessaire) ≠ Œuvre (durable) ≠ Action (politique, libre)"],
        },
      ],
    },
    {
      n: "Nietzsche",
      ideas: [
        {
          w: "Aurore, 1881",
          i: "Le travail comme 'meilleure des polices' : il tient les individus occupés, les détourne de la réflexion. La glorification du travail cache la peur de la liberté individuelle. Danger du 'travailleur' qui s'oublie lui-même.",
          fiche: "Le travail est « la meilleure des polices » : il occupe et détourne de la réflexion ; sa glorification masque la peur de la liberté.",
          citations: ["« Un tel travail constitue la meilleure des polices »"],
        },
      ],
    },
    {
      n: "Simone Weil",
      ideas: [
        {
          w: "Condition ouvrière / Enracinement, 1943",
          i: "Expérience vécue des usines. Le travail en usine est écrasant mais peut être libérateur si le travailleur comprend ce qu'il fait. Devoir de l'ingénieur : concevoir des machines qui ennoblissent les travailleurs.",
          fiche: "Le travail en usine écrase, mais peut libérer si l'ouvrier comprend ce qu'il fait ; devoir de l'ingénieur : concevoir des machines qui n'avilissent pas.",
          citations: [
            "La matière inerte sort ennoblie de l'atelier, les hommes s'y dégradent (formule de Pie XI, Quadragesimo anno, 1931, reprise par Simone Weil, reformulé)",
          ],
          modified: true,
        },
      ],
    },
    {
      n: "Lafargue",
      ideas: [
        {
          w: "Le Droit à la paresse, 1880",
          i: "Pamphlet contre le culte du travail. La classe ouvrière s'est laissé intoxiquer par la passion du travail, instrument de sa propre exploitation. Revendiquer le temps libre comme droit fondamental.",
          fiche: "« Le droit à la paresse » : le culte du travail intoxique la classe ouvrière et sert sa propre exploitation ; revendiquer le temps libre comme droit fondamental.",
          citations: [
            "« Une étrange folie possède les classes ouvrières des nations où règne la civilisation capitaliste »",
          ],
          modified: true,
        },
      ],
    },
    {
      n: "Nietzsche",
      ideas: [
        {
          w: "Humain, trop humain, 1878",
          i: "Contre le mythe du « don » naturel ou du « génie » inné. L'artiste observe, travaille, s'exerce par la répétition. Cette illusion naît de notre ignorance et de notre paresse : on préfère croire au miracle plutôt qu'au labeur. L'activité du génie n'est pas différente de celle de l'inventeur, du savant ou du tacticien — ce sont des hommes dont la pensée est active dans une direction unique.",
          fiche: "Contre le mythe du génie inné : l'artiste observe, s'exerce, répète — le talent est d'abord un travail patient, non un miracle.",
          citations: [
            "Le génie n'a rien de miraculeux : il commence par apprendre à poser des pierres, puis à bâtir (Humain, trop humain, § 162-163, reformulé)",
          ],
          modified: true,
        },
      ],
    },
    {
      n: "Hannah Arendt",
      ideas: [
        {
          w: "La Crise de la culture, 1961",
          i: "L'œuvre d'art est l'objet le plus durable qui soit : elle n'est ni consommée (comme les produits du labor) ni usée (comme les objets d'usage). Elle est délibérément écartée des processus de consommation. Elle est fabriquée pour le monde, qui survivra à la vie des mortels — et non pour les hommes. Cette permanence est ce qui distingue l'œuvre de toute autre production humaine.",
          fiche: "L'œuvre d'art est l'objet le plus durable : ni consommée ni usée, faite pour le monde — la transformer en produit de consommation la détruit.",
          citations: [
            "Les œuvres d'art sont les seules choses à n'avoir aucune fonction dans le processus vital de la société",
          ],
        },
      ],
    },
    {
      n: "Bergson",
      ideas: [
        {
          w: "Le Rire, 1900",
          i: "L'artiste voit là où les autres ne voient pas : il écarte le voile de la perception utilitaire. Ce que l'artiste a vu, nous ne l'aurions pas vu sans lui — il nous ouvre les yeux sur une réalité que nous n'apercevons pas ordinairement. La vérité de l'œuvre se mesure à l'efficacité de la leçon.",
          fiche: "L'artiste écarte le voile de la perception utilitaire : il nous fait voir ce que nous n'aurions pas vu — son œuvre est une leçon de vision.",
          citations: ["L'artiste voit ce que nous ne voyons pas, et son œuvre nous apprend à le voir (reformulé)"],
          modified: true,
        },
      ],
    },
    {
      n: "Adam Smith",
      ideas: [
        {
          w: "Richesse des nations, I, 1 et V, 1 (1776)",
          i: "Dans une manufacture d'épingles, dix ouvriers qui se partagent les opérations (étirer le fil, le couper, faire la pointe…) en fabriquent plus de 48 000 par jour ; seul, chacun en ferait à peine vingt. La division du travail est la source de la richesse. Mais Smith en voit le prix : l'ouvrier qui répète toute sa vie quelques gestes simples s'abrutit, d'où la nécessité d'une instruction publique.",
          new: true,
          citations: [
            "L'homme dont toute la vie se passe à quelques opérations simples devient aussi stupide et ignorant qu'il soit possible (V, 1, reformulé)",
          ],
          fiche: "La division du travail multiplie la production (les épingles), mais abrutit l'ouvrier : il faut une instruction publique.",
        },
        {
          w: "Richesse des nations, I, 2 et IV, 2",
          i: "Nous n'obtenons pas notre dîner de la bienveillance du boucher ou du boulanger, mais de leur intérêt : l'échange fait servir l'intérêt de chacun au bien de tous. C'est dans ce sens que Smith parle, une seule fois dans l'ouvrage, d'une main invisible qui conduit l'individu, en ne cherchant que son gain, à servir un intérêt qu'il ne visait pas.",
          new: true,
          citations: [
            "Ce n'est pas de la bienveillance du boucher ou du boulanger que nous attendons notre dîner, mais du soin qu'ils prennent de leur intérêt (I, 2, reformulé)",
          ],
          fiche: "L'échange fait servir l'intérêt de chacun au bien commun (le boucher, le boulanger, la main invisible).",
        },
      ],
    },
    {
      n: "Beauvoir",
      ideas: [
        {
          w: "Le Deuxième Sexe, t. II, « La femme indépendante »",
          i: "C'est par le travail rémunéré que la femme a conquis l'essentiel de son autonomie : il la sort de la dépendance économique envers le mari. Mais Beauvoir en voit les limites, la double journée, les métiers dévalorisés : le travail ne libère vraiment que dans une société qui change aussi.",
          new: true,
          citations: ["Le travail peut seul garantir à la femme une liberté concrète (reformulé)"],
          fiche: "Le travail rémunéré donne à la femme une liberté concrète, à condition que la société change aussi.",
        },
      ],
    },
  ],
  textes: [
    {
      n: "Hegel — dialectique maître/esclave",
      t: "Maître : jouit sans travailler, mais reste dépendant de l'esclave et de la nature. Esclave : travaille, transforme le monde, se forme. Inversion dialectique : le vrai maître de lui-même devient l'esclave.",
    },
    {
      n: "Arendt — Extraits 1-4",
      t: "Extrait 1 : dans l'Antiquité, travailler = être asservi aux nécessités. Extrait 2 : le labor reproduit la vie biologique (cycle consommation/production). Extrait 3 : productivité = surplus au-delà des besoins vitaux. Extrait 4 : le travail comme conservation du monde commun.",
    },
    {
      n: "Nietzsche — Aurore",
      t: "La glorification du travail cache 'la peur de tout ce qui est individuel'. Le travailleur dur est présenté comme 'dangereux'. La sécurité sociale repose sur l'occupation permanente des individus.",
    },
    {
      n: "Weil — Condition première d'un travail non servile",
      t: "Le travail servile est gouverné par la nécessité, non la finalité. Il est exécuté à cause d'un besoin, non en vue d'un bien. Exister n'est pas une fin : il faut une 'lumière d'éternité' pour rendre le travail supportable.",
    },
    {
      n: "Plan dissertation sur l'aliénation",
      t: "I. Le travail peut être aliénation (peine, servile, déshumanisant). II. Le travail constitue cependant une condition nécessaire à l'émancipation (transforme la nature, crée un surplus, garantit le temps libre).",
    },
    {
      n: "Nietzsche, Humain trop humain",
      t: "L'activité du génie n'est pas foncièrement différente de celle de l'inventeur, du savant ou du tacticien. Ce sont des hommes dont la pensée est active dans une direction unique, qui utilisent tout comme matière première, qui ne cessent d'observer diligemment leur vie intérieure et celle d'autrui. Le génie ne fait rien que d'apprendre à poser des pierres, travailler toujours à y mettre la forme. Tout ce qui est fini, parfait, excite l'étonnement ; tout ce qui est en train de se faire est déprécié.",
    },
    {
      n: "Arendt, La Crise de la culture",
      t: "Parmi les choses qu'on ne rencontre pas dans la nature mais seulement dans le monde fabriqué par l'homme, on distingue entre objets d'usage et œuvres d'art. Les deux possèdent une certaine permanence. Les œuvres d'art sont clairement supérieures : comme elles durent plus longtemps que n'importe quoi d'autre, elles sont les plus mondaines des choses. Du point de vue de la durée pure, les œuvres d'art sont les seules choses à n'avoir aucune fonction dans le processus vital de la société.",
    },
    {
      n: "Hegel, Esthétique",
      t: "Ce qui nous plaît dans la beauté artistique, c'est précisément le caractère de liberté de sa production. L'art beau n'est véritablement art qu'en cette liberté propre. La source des œuvres d'art est la libre activité de l'imagination, plus libre que la nature. Face à la sombre intériorité de la pensée, on cherche l'apaisement dans les figures de l'art.",
    },
    {
      n: "Kant, Critique de la faculté de juger",
      t: "Le génie est le talent de produire ce dont on ne peut donner de règle déterminée — non l'habileté qu'on peut montrer en faisant ce qu'on peut apprendre suivant une règle. L'originalité est sa première qualité. Ses productions doivent être exemplaires et servir de mesure ou de règle d'appréciation. Il ne peut lui-même décrire comment il accomplit ses productions — l'auteur en étant redevable à son génie, ne sait pas lui-même comment les idées s'en trouvent en lui.",
    },
    {
      n: "Merleau-Ponty, Sens et non-sens, 1966 (DM art)",
      t: "Le peintre n'a pu que construire une image. Il faut attendre que cette image s'anime pour les autres. Alors l'œuvre d'art aura joint ces vies séparées — elle n'existera plus seulement en l'une d'elles comme un rêve tenace ou un délire persistant, mais dans l'espace comme une toile coloriée. Elle habitera indivise dans plusieurs esprits, présomptivement dans tout esprit possible, comme une acquisition pour toujours.",
    },
    {
      n: "Schopenhauer, Le Monde comme volonté et représentation, 1819 (DM art)",
      t: "L'œuvre d'art ne doit pas tout livrer directement aux sens, mais juste ce qu'il faut pour mettre l'imagination en bonne voie. L'imagination doit toujours avoir quelque chose à ajouter — c'est elle qui doit dire le dernier mot. Ce qu'il y a de meilleur dans l'art est trop spirituel pour être livré directement aux sens : c'est à l'imagination à le mettre au jour, quoique l'œuvre d'art doive l'engendrer.",
    },
  ],
  exemples: [
    {
      tag: "Cinéma",
      tit: "Charlie Chaplin — Les Temps modernes (1936)",
      body: "Charlot sur la chaîne de montage fordiste : il répète indéfiniment le même geste (serrer des boulons), finit par visser tout ce qui ressemble à un boulon. Image parfaite de l'aliénation par le travail industriel et de la 'déshumanisation' décrite par Marx.",
      lien: "→ Marx (aliénation), Arendt (labor),",
    },
    {
      tag: "Histoire",
      tit: "La révolution industrielle (XIXe s.)",
      body: "Le passage à la manufacture et à l'usine transforme le rapport au travail : le paysan qui maîtrisait son cycle de production devient ouvrier parcellaire, asservi au rythme de la machine. Marx analyse cette transformation comme source d'aliénation.",
      lien: "→ Marx, Arendt,",
    },
    {
      tag: "Texte",
      tit: "Weil — Condition première d'un travail non servile",
      body: "Weil décrit le travail servile comme gouverné par la nécessité pure : on travaille pour survivre, pour pouvoir manger, pour pouvoir retravailler. La seule chose qui rende le travail supportable est 'une lumière d'éternité' — une signification transcendant l'immédiateté.",
      lien: "→ Aliénation, bonheur, sens",
    },
    {
      tag: "Contemporain",
      tit: "Burn-out et bore-out",
      body: "Le burn-out (épuisement par excès de travail) et le bore-out (ennui au travail) sont deux pathologies du rapport au travail. Elles illustrent que le travail peut 'fortifier son corps et ruiner son esprit'. Le travail forcé sur le corps devient accident du travail intérieur.",
      lien: "→ Nietzsche, Graeber, aliénation",
    },
    {
      new: true,
      tag: "Sociologie",
      tit: "Linhart — Le taylorisme s'est adapté à l'individualisation",
      body: "Danièle Linhart : le taylorisme classique (chaîne, cadence, geste répétitif) a muté avec la révolution managériale des années 1990. La <em>nouvelle organisation du travail</em> (lean management, performance individuelle, objectifs chiffrés, évaluation permanente) n'a pas supprimé la contrainte tayloriste : elle l'a <em>individualisée</em>. Le travailleur n'est plus contraint par la machine mais par ses objectifs personnels, son <em>tableau de bord</em>, son auto-surveillance — il devient son propre contremaître. Conséquence : isolement, souffrance psychique, burn-out. La contrainte collective visible a cédé la place à une contrainte intériorisée — souvent plus difficile à combattre.",
      lien: "→ Linhart, taylorisme, lean management, individualisation, burn-out",
    },
    {
      new: true,
      tag: "Climat",
      tit: "Méda — Le travail face au dérèglement climatique",
      body: "Dominique Méda : la transition écologique ne se fera pas en marge du travail mais <em>par</em> et <em>dans</em> le travail. Les emplois carbonés (transport routier, industrie lourde, certains services) sont condamnés à se transformer ou à disparaître ; des emplois nouveaux (rénovation thermique, mobilité douce, agriculture vivrière) sont à inventer. Question politique majeure : assurer la <em>justice de la transition</em> — ne pas faire peser le coût social du changement sur les salariés qui perdent leurs emplois. Le travail redevient ainsi enjeu politique central, après des décennies où il avait paru relégué à une simple variable économique.",
      lien: "→ Méda, transition écologique, emplois carbonés, justice climatique",
    },
    {
      new: true,
      tag: "IA",
      tit: "Coralie Perez — L'IA dans le travail comme champ de concertation",
      body: "L'irruption de l'intelligence artificielle (générative, décisionnelle, robotique) dans le travail n'est pas un <em>destin technique</em> auquel on s'adapte — c'est une transformation qui doit faire l'objet d'une <strong>concertation</strong> entre dirigeants, salariés, syndicats, pouvoirs publics. Sans concertation : déqualification, surveillance algorithmique, dégradation des conditions de travail. Avec concertation : possible répartition des gains de productivité, réduction du temps de travail, montée en compétences. Choix politique, non fatalité technologique. C'est ce que Simondon réclamait déjà en 1958 : une <em>culture technique</em> partagée pour éviter l'aliénation par méconnaissance.",
      lien: "→ Perez, IA, concertation, Simondon, culture technique",
    },
    {
      new: true,
      tag: "Politique",
      tit: "Palier — Tourner le dos au modèle français du low cost",
      body: "Bruno Palier (politiste, Sciences Po) : la France s'est progressivement spécialisée dans un <em>modèle low cost</em> — bas salaires, productivité modérée, emplois peu qualifiés, contournement du droit du travail par les statuts atypiques. Conséquences : services dégradés (santé, éducation, transports), perte de sens, dépendance aux importations. <em>Alternative</em> : « tourner le dos » à ce modèle pour viser un travail <em>de meilleure qualité</em> — plus qualifié, mieux payé, doté de sens, articulé à la transition écologique. « Mieux travailler, c'est aussi être impliqué — non se réduire à des objectifs purement comptables et financiers. »",
      lien: "→ Palier, low cost, qualité du travail, sens, politique de l'emploi",
    },
    {
      new: true,
      tag: "Société",
      tit: "Lipovetsky — La consommation comme nouvelle compensation du travail",
      body: "Pour Gilles Lipovetsky (<em>Le Bonheur paradoxal</em>, 2006), la centralité contemporaine de la consommation tient en partie à l'appauvrissement subjectif du travail. Quand le travail ne fournit plus de sens (taylorisme adapté, bullshit jobs, individualisation), la <em>consommation</em> prend en charge la fonction symbolique de compensation : se faire plaisir, se constituer une identité, exister par ses objets. Transposition contemporaine de l'analyse marxiste : la marchandise est devenue le « nouvel opium » qui anesthésie l'insatisfaction au travail. Cercle vicieux : travailler plus pour consommer plus, pour supporter de travailler.",
      lien: "→ Lipovetsky, hyperconsommation, sens du travail, marxisme contemporain",
    },
  ],
  accroches: [
    {
      type: "Étymologie",
      t: "Le mot « travail » vient du latin tripalium, un instrument de torture : la langue garde la trace d’un soupçon — et si le travail était d’abord une peine avant d’être une libération ?",
      new: true,
    },
    {
      type: "Citation",
      t: "Pour Marx, le travailleur « ne s’affirme pas mais se nie » dans un travail aliéné ; pourtant Hegel voyait dans le travail le moyen par lequel l’esclave accède à la conscience de soi. Libère-t-il ou asservit-il ?",
      src: "Marx, Manuscrits de 1844",
      new: true,
    },
  ],
  liens: ["Technique", "Liberté", "Justice", "État", "Nature", "Bonheur"],
  diss: [
    "Le travail est-il une valeur ?",
    "Travailler, est-ce perdre sa liberté ?",
    "Le travail humanise-t-il l'homme ?",
    "Peut-on se réaliser dans le travail ?",
    "Le travail est-il 'la meilleure des polices' ?",
    {new: true, q: "La transition écologique passe-t-elle par une transformation du travail ?"},
    {new: true, q: "L'intelligence artificielle libère-t-elle ou aliène-t-elle le travailleur ?"},
    {new: true, q: "Travaillons-nous pour consommer ou consommons-nous pour supporter de travailler ?"},
  ],
  plans: [
    {
      q: "Le travail prive-t-il l'homme de sa liberté ?",
      theme: "Le travail comme aliénation",
      intro: "",
      pb: "Le travail prive-t-il l'homme de sa liberté ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Le travail comme peine (étym. tripalium = instrument de torture). Dans l'Antiquité, réservé aux esclaves car asservissement à la nécessité. Le travail force biologique, répétitif et sans fin (labor d'Arendt).",
              auteurs: "",
              ref: "Arendt, Condition moderne, Extrait 1",
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
              args: "Marx : aliénation du travail salarié. 4 formes : rapport au produit (qui appartient au patron), à l'activité (mécanique, imposée), à l'espèce (déshumanisation), aux autres (concurrence). La plus-value = vol légalisé.",
              auteurs: "",
              ref: "Marx, Manuscrits de 1844",
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
              args: "Nietzsche : la glorification du travail sert le contrôle social. 'Bullshit jobs' (Graeber) : des millions de travailleurs occupent des postes inutiles mais bien payés, source de malaise. Le burn-out comme pathologie du culte du travail.",
              auteurs: "",
              ref: "Nietzsche ; Graeber",
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
      q: "Le travail peut-il libérer l'homme ?",
      theme: "Le travail comme condition de l'émancipation humaine",
      intro: "",
      pb: "Le travail peut-il libérer l'homme ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Hegel : l'esclave se libère par le travail. En transformant la matière, il s'y retrouve lui-même. Le travail forme la conscience de soi. Marx dans les 1844 : le travail libre est 'l'expression de la vie'.",
              auteurs: "",
              ref: "Hegel, Phénoménologie",
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
              args: "L'œuvre (Arendt) permet de créer un monde durable et commun. L'artisan, l'artiste réalisent leur humanité dans leur production. Ce que je fabrique me survit et dit qui je suis.",
              auteurs: "",
              ref: "Arendt, Condition moderne, Extrait 3",
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
              args: "Le surplus créé par le travail (Arendt/Marx) garantit un temps libre ('temps hors-travail'). Ce temps libre est la condition de la vie politique, culturelle, de l'action (3e catégorie d'Arendt).",
              auteurs: "",
              ref: "Le surplus et le temps libre",
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
      q: "Le travail est-il encore une valeur ?",
      theme: "Quel sens donner au travail aujourd'hui ?",
      intro: "",
      pb: "Le travail est-il encore une valeur ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "La question du sens : Weil dénonce le travail servile (gouverné par la nécessité). Elle cherche une 'condition première d'un travail non servile' : que le travailleur comprenne le lien entre son geste et la finalité du produit.",
              auteurs: "",
              ref: "Weil, Condition ouvrière",
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
              args: "Graeber et les 'bullshit jobs' : de nombreux emplois modernes sont perçus comme inutiles par ceux qui les exercent. Le travail bien payé mais vide de sens cause autant de souffrance que le travail pénible.",
              auteurs: "",
              ref: "Graeber",
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
              args: "Pascal et le divertissement : le travail nous détourne du néant et de la mort. Il est à la fois nécessaire (survie), potentiellement aliénant (Nietzsche) et potentiellement réalisateur (Hegel). La valeur du travail dépend de ses conditions.",
              auteurs: "",
              ref: "Pascal, Nietzsche",
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
