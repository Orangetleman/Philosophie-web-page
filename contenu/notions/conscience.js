/* Notion « Conscience » : Qu'est-ce que la conscience ?
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("conscience", {
  c: "#534AB7",
  l: "Conscience",
  s: "Qu'est-ce que la conscience ?",
  def: "La <span class='kw'>conscience</span> est la présence à soi et au monde. On distingue la <span class='kw'>conscience immédiate</span> (perception du monde) et la <span class='kw'>conscience réflexive</span> (retour sur soi). Mais la psychanalyse (Freud) remet en cause sa transparence : une grande part de la vie psychique nous échappe.<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>Étymologie &amp; distinctions</div><div class='def-sec-body'>Du latin <em>cum scientia</em> (« avec savoir »). On distingue : <strong>conscience psychologique</strong> (présence au monde, perception) ; <strong>conscience morale</strong> (sens du bien et du mal, voix intérieure) ; <strong>conscience politique</strong> (prise de conscience collective, engagement). Ces trois sens se recoupent souvent.</div></div><div class='def-sec'><div class='def-sec-title'>Le problème du cogito (Descartes)</div><div class='def-sec-body'>Le cogito (<em>Méditations</em>, 1641) pose la conscience comme seule certitude indubitable. Mais est-ce une substance ou un acte ? Nietzsche critique le cogito : dire « je pense » présuppose un sujet substantiel qui n'est pas prouvé — il ne faut dire que « ça pense ». Hume va encore plus loin : le moi n'est qu'un « faisceau de perceptions » sans unité stable.</div></div><div class='def-sec'><div class='def-sec-title'>Conscience et inconscient</div><div class='def-sec-body'>La psychanalyse freudienne (Ça / Moi / Surmoi) montre que la conscience n'est que la partie émergée de l'iceberg psychique. Les désirs refoulés, les pulsions, les actes manqués révèlent que le moi n'est pas « maître en sa propre maison ». La conscience n'est donc ni transparente ni souveraine.</div></div><div class='def-sec'><div class='def-sec-title'>Identité et intersubjectivité</div><div class='def-sec-body'>Hegel : la conscience de soi naît dans le <strong>regard d'autrui</strong> (dialectique maître/esclave). Locke : l'identité personnelle se fonde sur la mémoire (continuité de conscience). Ricœur distingue <em>idem</em> (identité numérique, permanence) et <em>ipse</em> (identité narrative, récit de soi). Sartre : la conscience est néant — elle n'est jamais « chose ».</div></div></details>",
  auteurs: [
    {
      n: "Descartes",
      ideas: [
        {
          w: "Discours de la méthode, 1637 / Méditations métaphysiques, 1641",
          i: "Cogito : « Je pense, donc je suis » (<em>Discours de la méthode</em>, IVe partie ; les <em>Méditations</em> disent « je suis, j'existe »). La conscience est le seul fondement indubitable. Dualisme : l'âme (pensée) et le corps (étendue) sont deux substances distinctes.",
          modified: true,
          fiche: "Le <strong>cogito</strong> (« je pense donc je suis ») est la seule certitude indubitable : la conscience fonde le savoir. Dualisme âme (pensée) / corps (étendue).",
          citations: ["« Je pense, donc je suis »"],
        },
      ],
    },
    {
      n: "Freud",
      ideas: [
        {
          w: "Introduction à la psychanalyse, 1916",
          i: "L'inconscient comme iceberg : le moi n'est pas maître en sa propre maison. Ça / Moi / Surmoi. Les pulsions refoulées agissent à notre insu (rêves, lapsus, actes manqués).",
          fiche: "« Le moi n'est pas maître dans sa propre maison » : l'<strong>inconscient</strong> (pulsions refoulées, Ça/Moi/Surmoi) agit à notre insu — la conscience n'est ni transparente ni souveraine.",
          citations: ["« Le moi n'est pas maître dans sa propre maison » (Une difficulté de la psychanalyse, 1917)"],
          modified: true,
        },
      ],
    },
    {
      n: "Sartre",
      ideas: [
        {
          w: "L'Être et le Néant, 1943",
          i: "La conscience est néant : elle n'est jamais chose. Elle est toujours intentionnelle (dirigée vers autre chose). La mauvaise foi = se croire une chose déterminée.",
          fiche: "La conscience est <strong>néant et liberté</strong> : toujours dirigée vers autre chose, jamais une chose. Se croire déterminé, c'est la <em>mauvaise foi</em>.",
          citations: ["« La conscience est ce qu'elle n'est pas et n'est pas ce qu'elle est »"],
        },
      ],
    },
    {
      n: "Hegel",
      ideas: [
        {
          w: "Phénoménologie de l'Esprit, 1807",
          i: "Dialectique maître/esclave : la conscience de soi naît dans le conflit. Je me reconnais dans le regard de l'autre. L'autoconscience est médiatisée par autrui.",
          fiche: "La conscience de soi naît du <strong>regard d'autrui</strong> (dialectique maître/esclave) : « elle n'existe que reconnue ».",
          citations: ["« La conscience de soi n'existe que reconnue »"],
        },
      ],
    },
    {
      n: "Bergson",
      ideas: [
        {
          w: "Matière et mémoire, 1896",
          i: "La conscience est durée vécue, flux continu. Elle n'est pas réductible au cerveau. La mémoire est la substance du moi.",
          fiche: "La conscience est <strong>durée</strong> vécue, flux continu irréductible au cerveau ; la mémoire fait l'étoffe du moi.",
          citations: ["La conscience = durée intérieure, non espace mesurable"],
        },
      ],
    },
    {
      n: "Locke",
      ideas: [
        {
          w: "Essai sur l'entendement humain, 1690",
          i: "L'identité personnelle repose sur la conscience mémorielle : je suis la même personne par continuité de mes souvenirs.",
          fiche: "L'identité personnelle = <strong>continuité de la mémoire</strong> : je suis le même par mes souvenirs, non par une substance.",
          citations: ["La mémoire = fondement de l'identité personnelle"],
        },
      ],
    },
    {
      n: "Hume",
      ideas: [
        {
          w: "Traité de la nature humaine, 1739",
          i: "Le moi n'est pas une substance immuable mais un 'faisceau de perceptions' qui se succèdent à toute vitesse. 'L'esprit est une sorte de théâtre où diverses perceptions font successivement leur apparition.' Il n'y a ni simplicité ni identité dans le moi : nous inventons la notion de 'substance' pour masquer ce flux.",
          fiche: "Le moi n'est pas une substance mais un <strong>faisceau de perceptions</strong> qui se succèdent ; son unité stable est une fiction.",
          citations: ["« Les hommes ne sont rien d'autre qu'un faisceau ou une collection de différentes perceptions »"],
        },
      ],
    },
    {
      n: "Ricœur",
      ideas: [
        {
          w: "Écrits et conférences 1 — Autour de la psychanalyse, 2008",
          i: "L'identité narrative : nous apprenons à devenir le narrateur de notre propre histoire. La subjectivité n'est ni une suite incohérente d'événements ni une substantialité immuable : c'est une identité narrative qui se construit par le récit. Ce que nous appelons 'soi' est médiatisé par les récits culturels que nous appliquons à notre vie.",
          fiche: "Le soi est une <strong>identité narrative</strong> : on devient le narrateur de sa propre histoire, entre permanence et changement.",
          citations: ["« Nous apprenons à devenir le narrateur de notre propre histoire »"],
        },
      ],
    },
    {
      n: "Alain",
      ideas: [
        {
          w: "Études",
          i: "L'idée du Moi se forme corrélativement à l'idée des autres. C'est par le langage, le nom propre, les jugements d'autrui que nous tenons la première connaissance de nous-mêmes. L'honneur = sentiment intérieur des sanctions extérieures. La conscience de soi est toujours socialement médiatisée.",
          fiche: "La conscience de soi est <strong>médiatisée par autrui</strong> : « c'est des autres que nous tenons la première connaissance de nous-mêmes ».",
          citations: ["« C'est des autres que nous tenons la première connaissance de nous-mêmes »"],
        },
      ],
    },
    {
      n: "Nietzsche",
      ideas: [
        {
          w: "Par-delà le Bien et le Mal, 1886",
          i: "Critique du cogito cartésien : 'je' est une simple hypothèse grammaticale. La routine du langage nous fait supposer un sujet là où il n'y a que processus. 'Quelque chose pense' ne suppose pas nécessairement un sujet substantiel. La conscience de soi est une construction fictive de la grammaire.",
          fiche: "Critique du cogito : le « je » n'est qu'une <strong>hypothèse grammaticale</strong> ; il y a du <em>processus</em>, pas un sujet substantiel.",
          citations: [
            "Le je n'est qu'une habitude grammaticale : on pense, donc il faut quelqu'un qui pense (Par-delà bien et mal, § 17 et 54, reformulé)",
          ],
          modified: true,
        },
      ],
    },
    {
      n: "Kant",
      ideas: [
        {
          w: "Anthropologie du point de vue pragmatique",
          i: "L'enfant qui commence à dire 'je' opère un retournement décisif : auparavant il se sentait simplement, maintenant il se pense. Ce passage s'effectue à travers le langage et l'intersubjectivité : c'est parce qu'autrui m'adresse un 'tu' que je peux me saisir comme 'je'. La conscience réflexive émerge dans et par le rapport à l'autre.",
          fiche: "Dire « je » fait passer du <em>se sentir</em> au <strong>se penser</strong> : la conscience réflexive émerge par le langage et le rapport à autrui.",
          citations: ["Le langage et l'intersubjectivité sont la condition de la conscience réflexive"],
        },
      ],
    },
    {
      n: "Pascal",
      ideas: [
        {
          w: "Pensées",
          i: "L'homme est 'un roseau pensant', le plus faible de la nature, mais sa grandeur est dans sa pensée. La conscience de la mort distingue l'homme de la nature aveugle : quand l'univers l'écraserait, l'homme serait encore plus noble que ce qui le tue, parce qu'il sait qu'il meurt. La conscience humaine n'est pas une faiblesse mais une dignité.",
          fiche: "L'homme est un <strong>roseau pensant</strong> : faible mais grand par la pensée ; la conscience de sa mort fait toute sa dignité.",
          citations: ["« L'homme n'est qu'un roseau, le plus faible de la nature, mais c'est un roseau pensant »"],
        },
      ],
    },
    {
      n: "Zhuangzi",
      ideas: [
        {
          w: "Zhuangzi, chapitre 2",
          i: "Zhuang Zhou rêve qu'il est un papillon, heureux de voleter, sans savoir qu'il est Zhou. Il s'éveille : est-il Zhou qui a rêvé être papillon, ou un papillon qui rêve être Zhou ? Le récit ne conclut pas au doute sur tout mais à la transformation des choses : nos distinctions (moi et autre, rêve et veille) dépendent d'un point de vue.",
          new: true,
          citations: [
            "Est-ce Zhou qui rêvait d'être un papillon, ou un papillon qui rêve d'être Zhou ? (chap. 2, reformulé)",
          ],
          fiche: "Le rêve du papillon : rien ne garantit, de l'intérieur, que je suis éveillé ; nos distinctions dépendent d'un point de vue.",
        },
      ],
    },
    {
      n: "Avicenne",
      ideas: [
        {
          w: "Livre de la guérison, De l'âme, I, 1 et V, 7",
          i: "L'expérience de pensée de l'homme volant : imaginons un homme créé d'un coup, adulte, suspendu dans l'air, les yeux voilés, les membres écartés pour qu'ils ne se touchent pas. Il ne perçoit rien de son corps ni du monde. Pourtant il affirme qu'il existe. L'âme se connaît donc elle-même sans passer par le corps : six siècles avant Descartes, la conscience de soi est posée comme première.",
          new: true,
          citations: [
            "L'homme suspendu dans l'air, privé de toute sensation, affirme encore qu'il existe (De l'âme, I, 1, reformulé)",
          ],
          fiche: "L'homme volant, privé de toute sensation, sait encore qu'il existe : la conscience de soi ne dépend pas du corps.",
        },
      ],
    },
    {
      n: "Montaigne",
      ideas: [
        {
          w: "Essais, « Au lecteur » (1580) et III, 2, « Du repentir »",
          i: "Montaigne se prend lui-même pour objet, non pour se donner en exemple, mais parce que chaque homme porte la forme entière de l'humaine condition. Il découvre un moi changeant et divers, qu'on ne peut peindre qu'en mouvement. La connaissance de soi n'est pas une saisie d'un coup, comme chez Descartes, mais un essai sans fin.",
          new: true,
          citations: [
            "« Je suis moi-même la matière de mon livre » (Essais, « Au lecteur »)",
            "« Je ne peins pas l'être. Je peins le passage » (III, 2)",
          ],
          fiche: "Se peindre soi-même : un moi changeant, qu'on ne saisit qu'en passage ; chaque homme porte la forme entière de l'humaine condition.",
        },
      ],
    },
    {
      n: "Malebranche",
      ideas: [
        {
          w: "De la recherche de la vérité, III, II, 7 (1674–1675)",
          i: "Contre Descartes, pour qui l'esprit est plus aisé à connaître que le corps, Malebranche soutient que nous n'avons pas d'idée claire de notre âme. Nous la connaissons seulement par conscience, ou sentiment intérieur : nous sentons que nous pensons, voulons, souffrons, sans savoir ce qu'est l'âme. Paradoxe : le corps, objet de la géométrie, est mieux connu que l'esprit.",
          new: true,
          citations: ["Nous ne connaissons notre âme que par conscience ou sentiment intérieur (III, II, 7, reformulé)"],
          fiche: "Nous n'avons pas d'idée claire de l'âme : nous ne la connaissons que par conscience, ou sentiment intérieur.",
        },
      ],
    },
    {
      n: "Husserl",
      ideas: [
        {
          w: "Méditations cartésiennes, § 14 (1931)",
          i: "Toute conscience est conscience de quelque chose : c'est l'intentionnalité. La conscience n'est pas une boîte qui contiendrait des images des choses, elle est un mouvement vers elles. Percevoir, imaginer, se souvenir, désirer sont des manières différentes de viser un objet. La phénoménologie décrit ces vécus en suspendant la croyance spontanée à l'existence du monde (épochè), pour revenir aux choses mêmes.",
          new: true,
          citations: [
            "« Le mot intentionnalité ne signifie rien d'autre que cette particularité foncière et générale qu'a la conscience d'être conscience de quelque chose » (§ 14, trad. Peiffer et Levinas)",
          ],
          fiche: "Toute conscience est conscience de quelque chose (intentionnalité) : la conscience est visée du monde, non boîte à images.",
        },
      ],
    },
  ],
  textes: [
    {
      n: "Descartes — le cogito",
      t: "Même si je me trompe, c'est moi qui me trompe : la pensée ne peut être mise en doute. Certitude irréductible du sujet pensant.",
    },
    {
      n: "Freud — inconscient et rêve",
      t: "Le rêve est la 'voie royale' vers l'inconscient. Les actes manqués, lapsus révèlent les désirs refoulés qui agissent à notre insu.",
    },
    {
      n: "Corps et conscience",
      t: "Concept religieux du corps : âme/corps séparés (Platon, Descartes). Concept biologique : corps objet d'études (dissections, greffes). Le corps est constitutif de l'identité du sujet.",
    },
    {
      n: "Agence Biomédecine",
      t: "'Être un corps' vs 'avoir un corps' : ambivalence culturelle. Le don d'organes pose la question de l'identité corporelle et de la conscience de soi en tant que personne.",
    },
    {
      n: "Hume, Traité de la nature humaine",
      t: "Quand je pénètre au plus intime de ce que j'appelle 'moi', je tombe toujours sur telle ou telle perception particulière. Je ne peux jamais me saisir 'moi' sans saisir une perception. L'identité du moi est une fiction : nous inventons un principe unificateur pour relier des perceptions discontinues.",
    },
    {
      n: "Locke, Essai sur l'entendement humain — identité personnelle",
      t: "La conscience accompagne toujours la pensée. C'est elle qui fait que chacun est ce qu'il appelle 'soi'. L'identité personnelle = identité de conscience. Problème : la conscience est interrompue par l'oubli — sommes-nous 'la même chose pensante' à travers le temps ?",
    },
    {
      n: "Sartre, L'existentialisme est un humanisme — extrait 4",
      t: "L'intersubjectivité : pour obtenir une vérité quelconque sur moi, il faut que je passe par l'autre. L'autre est indispensable à mon existence, aussi bien qu'à la connaissance que j'ai de moi. C'est dans le monde de l'intersubjectivité que l'homme décide ce qu'il est.",
    },
    {
      n: "Descartes, Discours de la méthode",
      t: "Même en supposant que tout soit faux, il faut nécessairement que 'moi qui pense, je sois quelque chose'. 'Je pense, donc je suis' : certitude première et indubitable. L'âme (res cogitans) est distincte du corps (res extensa) : elle n'a besoin d'aucun lieu ni d'aucune chose matérielle.",
    },
    {
      n: "Ricœur, 'La vie : un récit en quête de narrateur'",
      t: "La vie n'est pas vécue comme un roman mais nous lui appliquons une intelligence narrative. L'identité narrative est la seule qui échappe à l'alternative entre changement pur et identité absolue. C'est en nous racontant que nous nous constituons comme sujets.",
    },
    {
      n: "Alain, Études",
      t: "La chronologie de mes souvenirs est élaborée, discutée, contrôlée en commun. 'J'apprends ma propre histoire.' L'existence sociale tient par l'intérieur : l'honneur = sentiment intérieur des sanctions extérieures. Le moi individu est distinct des autres mais connu par eux.",
    },
    {
      n: "Nietzsche, Par-delà le Bien et le Mal — texte complémentaire",
      t: "La superstition des logiciens : croire que 'je pense' implique un 'je' comme sujet. Quelque chose pense — mais ce 'quelque chose' est déjà une interprétation du processus, non le processus lui-même. Le sujet 'je' est une hypothèse grammaticale, non une certitude.",
    },
    {
      n: "Hegel, Esthétique",
      t: "L'homme se constitue pour soi par son activité pratique. Il est poussé à se trouver lui-même dans ce qui lui est donné extérieurement. Il parvient en changeant les choses extérieures qu'il marque du sceau de son intériorité. Exemple : le petit garçon qui jette des pierres dans l'eau et admire les ronds — il bénéficie du spectacle de sa propre activité.",
    },
    {
      n: "Kant, Anthropologie du point de vue pragmatique — l'enfant dit 'je'",
      t: "Avant de dire 'je', l'enfant parle de lui à la troisième personne ('Pierre veut'). Le jour où il dit 'je' pour la première fois, c'est un retournement décisif : il se pense lui-même. Ce passage est lié au langage — à la fois signe et condition de la conscience réflexive. L'intersubjectivité (le 'tu' d'autrui) précède l'individuation du 'je'.",
    },
    {
      n: "Pascal, Pensées — le roseau pensant",
      t: "L'homme est un roseau, le plus faible de la nature. Un souffle de vent peut le tuer. Mais quand l'univers l'écraserait, l'homme serait encore plus noble que ce qui le tue, parce qu'il sait qu'il meurt et que l'avantage que l'univers a sur lui, l'univers n'en sait rien. La conscience de la mort est la marque de la dignité humaine, non de sa faiblesse.",
    },
    {
      n: "Sartre, L'Être et le Néant — la honte et le regard d'autrui",
      t: "La honte révèle à autrui un être que je suis mais qui m'échappe. Je découvre que je suis quelque chose pour l'autre avant d'être quelque chose pour moi. Le regard d'autrui est un intermédiaire qui renvoie de moi à moi-même. La conscience de soi n'est donc pas auto-suffisante : elle passe nécessairement par l'autre. Critique du cogito cartésien : autrui possède une part de moi-même.",
    },
  ],
  exemples: [
    {
      tag: "Littérature",
      tit: "Proust — À la recherche du temps perdu",
      body: "La mémoire involontaire (madeleine de Proust) révèle que la conscience n'est pas maîtresse de ses propres contenus. Un goût ressuscite toute une époque : le passé 'habite' en nous à notre insu.",
      lien: "→ Bergson (durée), inconscient (Freud)",
    },
    {
      tag: "Cas clinique",
      tit: "Cas de dédoublement de personnalité",
      body: "Certains patients présentent plusieurs états de conscience distincts et amnésiques l'un pour l'autre. Cela interroge l'unité du sujet et l'identité personnelle fondée sur la mémoire.",
      lien: "→ Locke (identité = mémoire), Freud (ça/moi/surmoi)",
    },
    {
      tag: "Science",
      tit: "Neurosciences — expérience de Libet (1983)",
      body: "Le cerveau prépare le mouvement 300ms avant que le sujet ait conscience de sa décision. Cela suggère que la conscience serait 'en retard' sur le cerveau : notre sentiment de décision consciente serait une illusion rétrospective.",
      lien: "→ Remet en cause le libre arbitre, le cogito",
    },
    {
      tag: "Société",
      tit: "Don d'organes (Agence Biomédecine)",
      body: "La question 'ai-je un corps ou suis-je un corps ?' divise les Français. 32% des 16-25 ans pensent que s'il y a un au-delà, il faut 'entrer en entier'. Le corps est constitutif de l'identité consciente du sujet.",
      lien: "→ Corps, technique, identité",
    },
    {
      tag: "Science",
      tit: "Victor, l'enfant sauvage de l'Aveyron",
      body: "Victor, retrouvé dans les bois vers 1800, ne sursautait pas au coup de fusil tiré derrière lui (signifiant pourtant un danger), mais réagissait au son d'une noix qu'on décortiquait. La conscience est toujours prise dans un réseau de significations : on ne perçoit que ce qui a un sens pour soi. La conscience est intentionnelle et culturellement médiatisée.",
      lien: "→ Conscience intentionnelle, Husserl, culture vs nature",
    },
    {
      tag: "Philosophie",
      tit: "Hume et le moi comme 'théâtre'",
      body: "Hume compare l'esprit à un théâtre où des perceptions défilent sans qu'on sache où sont représentées les scènes ni de quels matériaux il est fait. Quand je cherche mon 'moi', je ne trouve que des perceptions. Cette thèse remet en cause toute identité substantielle du sujet et ouvre la question de l'identité narrative (Ricœur).",
      lien: "→ Hume (flux de perceptions), Ricœur (identité narrative), Nietzsche (critique du cogito)",
    },
    {
      tag: "Philosophie",
      tit: "Hegel : l'enfant qui jette des pierres dans l'eau",
      body: "Hegel dans l'Esthétique : le petit garçon qui jette des pierres dans l'eau et admire les ronds qui se forment bénéficie du spectacle de sa propre activité. C'est la forme la plus primitive de conscience de soi par l'œuvre : je me retrouve dans ce que je produis. La conscience de soi naît dans et par l'activité pratique.",
      lien: "→ Hegel (travail, conscience), Travail (notion liée)",
    },
  ],
  accroches: [
    {
      type: "Citation",
      t: "« Le moi n’est pas maître dans sa propre maison » : par cette formule, Freud résume la révolution psychanalytique — la conscience, loin d’être transparente, ignore une part d’elle-même.",
      src: "Freud, Introduction à la psychanalyse",
      new: true,
    },
    {
      type: "Expérience",
      t: "En 1983, l’expérience de Libet montre que le cerveau prépare un geste 300 millisecondes avant que le sujet ait conscience de l’avoir décidé : notre sentiment de décider librement serait-il une illusion rétrospective ?",
      new: true,
    },
  ],
  liens: ["Liberté", "Nature", "Devoir"],
  diss: [
    "La conscience de soi est-elle une connaissance de soi ?",
    "Peut-on agir de façon inconsciente ?",
    "L'inconscient remet-il en cause la liberté ?",
    "Suis-je ce que j'ai conscience d'être ?",
    "Le corps est-il constitutif de l'identité ?",
    {q: "Prendre conscience de soi, est-ce devenir insaisissable ?"},
    {q: "La conscience de soi est-elle le fondement de l'identité personnelle ?"},
    {q: "Avoir conscience de soi, est-ce se connaître ?"},
    {q: "La conscience de soi naît-elle dans le rapport à autrui ?"},
    {q: "Le langage est-il la condition de la conscience réflexive ?"},
  ],
  plans: [
    {
      q: "La conscience peut-elle être notre seul point d'appui pour connaître ?",
      theme: "La conscience comme certitude et fondement du sujet",
      intro: "",
      pb: "La conscience peut-elle être notre seul point d'appui pour connaître ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Oui : le cogito cartésien fonde la certitude absolue. Le doute hyperbolique aboutit à la seule vérité indubitable : 'Je pense, donc je suis'.",
              auteurs: "",
              ref: "Descartes, Méditations I",
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
              args: "Mais la conscience immédiate peut être trompeuse : illusions, hallucinations. La certitude du cogito ne garantit pas la vérité du monde extérieur.",
              auteurs: "",
              ref: "Descartes lui-même le reconnaît (malin génie)",
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
              args: "La conscience réflexive enrichit le cogito : connaissance de soi, non simple sentiment d'exister. Elle implique un effort de retour sur ses actes et jugements.",
              auteurs: "",
              ref: "Alain : 'La conscience n'est pas un miroir'",
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
      q: "Sommes-nous vraiment transparents à nous-mêmes ?",
      theme: "Les limites de la conscience : l'inconscient",
      intro: "",
      pb: "Sommes-nous vraiment transparents à nous-mêmes ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Non : Freud montre que la conscience est la partie émergée de l'iceberg. Ça, Moi, Surmoi. Les pulsions refoulées orientent nos comportements à notre insu.",
              auteurs: "",
              ref: "Freud, Introduction à la psychanalyse",
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
              args: "La mauvaise foi (Sartre) n'est pas l'inconscient : c'est une fuite consciente-mais-niée de notre liberté. L'homme se ment à lui-même volontairement.",
              auteurs: "",
              ref: "Sartre, L'Être et le Néant",
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
              args: "Nuance : même si l'inconscient existe, la psychanalyse vise à ramener les conflits à la conscience. La cure = élargissement de la conscience sur l'inconscient.",
              auteurs: "",
              ref: "Freud : 'Là où était le ça, le moi doit advenir'",
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
      q: "La conscience de soi naît-elle du rapport à l'autre ?",
      theme: "Conscience de soi et reconnaissance par autrui",
      intro: "",
      pb: "La conscience de soi naît-elle du rapport à l'autre ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Oui : pour Hegel, la conscience ne peut se reconnaître qu'en rencontrant une autre conscience. Le conflit maître/esclave révèle que l'autoconscience a besoin d'être reconnue.",
              auteurs: "",
              ref: "Hegel, Phénoménologie de l'Esprit",
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
              args: "Sartre : le regard d'autrui peut aussi être aliénant ('l'enfer c'est les autres'). Le regard objectivant me transforme en chose.",
              auteurs: "",
              ref: "Sartre, Huis clos",
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
              args: "Synthèse : la conscience de soi se construit dans et par le rapport à autrui, mais cette construction peut être aliénante ou libératrice selon la qualité de la reconnaissance.",
              auteurs: "",
              ref: "Honneth : la lutte pour la reconnaissance",
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
      q: "La conscience de soi est-elle le fondement de l'identité personnelle ou la révélation de son insaisissabilité ?",
      theme: "Prendre conscience de soi, est-ce devenir insaisissable ?",
      intro: "",
      pb: "La conscience de soi est-elle le fondement de l'identité personnelle ou la révélation de son insaisissabilité ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Prendre conscience de soi, c'est justement parvenir à se saisir : Descartes (cogito = certitude première), Hegel (conscience de soi via l'activité pratique et la reconnaissance). La conscience réflexive enrichit le sujet.",
              auteurs: "",
              ref: "Descartes, Discours de la méthode ; Hegel, Esthétique",
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
              args: "La conscience de soi révèle l'insaisissabilité du sujet : une part de moi m'est étrangère (Freud — rêves, lapsus, actes manqués). L'inconscient donne sens à ce qui ne semblait pas en avoir, mais la conscience n'en a plus le monopole. 'L'inconscient est structuré comme un langage' (Lacan).",
              auteurs: "",
              ref: "Freud, Introduction à la psychanalyse ; Sartre, L'Être et le Néant",
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
              args: "C'est pourquoi le moi est insaisissable : aporie de l'identité (Hume — le moi = flux de perceptions ; Nietzsche — le 'je' est une hypothèse grammaticale) et aporie de la mortalité (Heidegger — la seule certitude de la conscience est sa finitude). L'identité narrative (Ricœur) est la seule voie : nous nous constituons par le récit.",
              auteurs: "",
              ref: "Hume, Traité de la nature humaine ; Heidegger, Être et Temps ; Ricœur, Autour de la psychanalyse",
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
