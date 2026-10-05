/* Notion « Art » : L'artiste travaille-t-il ?
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("art", {
  c: "#8B5E3C",
  l: "Art",
  s: "L'artiste travaille-t-il ?",
  def: "L'<span class='kw'>art</span> (latin <em>ars</em>, grec <em>technê</em>) désigne à la fois la maîtrise technique et la création singulière. L'œuvre d'art est l'objet unique qui exprime la singularité d'un individu. Question centrale : l'artiste est-il un travailleur, un non-travailleur, ou un créateur d'une troisième espèce ?<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>Étymologie : art, technique, artisan</div><div class='def-sec-body'>Le latin <em>ars</em> traduit le grec <em>technê</em>, qui possède le double sens de <strong>savoir-faire/technique</strong> et de <strong>création artistique</strong>. C'est pourquoi l'artiste et l'artisan partagent la même racine : <em>artifex</em>. Le terme « Artisee » (ou « artisan » selon les usages) désigne à la fois l'artiste et l'artisan. La limite entre les deux se trouve dans le design, l'architecture, la gastronomie, la mode — arts à la fois utiles et créatifs.</div></div><div class='def-sec'><div class='def-sec-title'>Le Beau</div><div class='def-sec-body'>L'œuvre d'art vise traditionnellement le <strong>Beau</strong>, par opposition aux objets utiles et fonctionnels. Kant : le beau est « un universel sans concept » — on attend que tout le monde partage le jugement esthétique (<em>sensus communis</em>) sans pouvoir le justifier par une règle. Bourdieu (<em>La Distinction</em>) : le jugement esthétique exprime un <strong>habitus de classe</strong> — le goût n'est pas universel mais socialement construit. Dewey (<em>L'art comme expérience</em>) : l'art comme sentiment de complétude, de totalité, d'achèvement.</div></div><div class='def-sec'><div class='def-sec-title'>Le ready-made et l'institution</div><div class='def-sec-body'>Le <strong>ready-made</strong> (Duchamp, <em>La Fontaine</em>, 1917) : un objet banal promu au statut d'œuvre d'art par simple désignation institutionnelle. L'art est ainsi ce que les institutions culturelles (musées, galeries, critiques) reconnaissent comme tel. Brian O'Doherty (<em>L'espace de la galerie et son idéologie</em>) : c'est l'espace de la galerie — et non l'objet lui-même — qui fait l'œuvre. Autres exemples : « Merda d'artista » (Manzoni), sculptures immatérielles (Salvatore Garau).</div></div><div class='def-sec'><div class='def-sec-title'>Reproductibilité et culture de masse</div><div class='def-sec-body'>Arendt (<em>La Crise de la culture</em>) : faire de l'œuvre d'art un produit de consommation de masse revient à détruire l'artiste, car les consommateurs reviennent à détruire ce qu'ils consomment. Walter Benjamin : la reproduction technique détruit l'<em>aura</em> de l'œuvre originale. Aujourd'hui : streaming, copies numériques, NFT — qu'est-ce qui subsiste de l'unicité ?</div></div></details>",
  auteurs: [
    {
      n: "Kant",
      ideas: [
        {
          w: "Critique de la faculté de juger, 1790",
          i: "Le génie est le talent de produire ce dont on ne peut donner de règle déterminée. L'originalité est sa première qualité. Ses productions doivent être exemplaires. L'auteur ne sait pas comment les idées s'en trouvent en lui — il ne peut décrire ni montrer comment il accomplit ses productions. Le beau est un 'universel sans concept' : un jugement esthétique attend l'accord universel sans pouvoir le démontrer.",
          fiche: "Le génie « donne la règle à l'art » sans pouvoir l'expliquer : originalité et exemplarité ; le beau est un « universel sans concept ».",
          citations: ["Le génie donne la règle à l'art sans pouvoir expliquer comment"],
        },
      ],
    },
    {
      n: "Nietzsche",
      ideas: [
        {
          w: "Humain, trop humain, 1878",
          i: "Contre le mythe du génie inné. L'artiste observe, travaille, s'exerce par la répétition — comme l'inventeur ou le tacticien. L'illusion du génie naît de notre ignorance et de notre paresse : tout ce qui est fini excite l'étonnement ; tout ce qui est en train de se faire est déprécié. L'art est donc d'abord un travail.",
          fiche: "Contre le mythe du génie inné : l'artiste observe, travaille, répète — l'art est d'abord un labeur ; l'illusion du don naît de notre paresse.",
          citations: [
            "« Le génie ne fait rien que d'apprendre à poser des pierres, travailler toujours à y mettre la forme »",
          ],
        },
      ],
    },
    {
      n: "Hannah Arendt",
      ideas: [
        {
          w: "La Crise de la culture, 1961",
          i: "L'œuvre d'art est la plus durable des choses humaines : elle n'est ni consommée ni usée, délibérément écartée du processus vital. Fabriquée pour le monde (qui survivra aux mortels), non pour les hommes. La culture de masse menace l'art en transformant les œuvres en produits de consommation, détruisant ainsi leur permanence et leur unicité.",
          fiche: "L'œuvre d'art est la chose la plus durable (ni consommée ni usée), faite pour le monde ; la culture de masse la détruit en la changeant en produit.",
          citations: [
            "Les œuvres d'art sont les seules choses à n'avoir aucune fonction dans le processus vital de la société",
          ],
        },
      ],
    },
    {
      n: "Hegel",
      ideas: [
        {
          w: "Esthétique, 1818–1829",
          i: "L'art beau est véritablement art en sa liberté propre. La source des œuvres est la libre activité de l'imagination, plus libre que la nature. L'art est un libérateur : l'objectivation des sentiments (les rendre extérieurs, représentation) leur enlève leur intensité et les rend à notre libre jugement. L'art porte une puissance de conviction et de conversion.",
          fiche: "« L'art beau n'est art qu'en sa liberté propre » : libre activité de l'imagination ; en objectivant les sentiments, l'art libère et porte une puissance de conversion.",
          citations: ["« L'art beau n'est véritablement art qu'en cette liberté propre »"],
        },
      ],
    },
    {
      n: "Bourdieu",
      ideas: [
        {
          w: "La Distinction, 1979",
          i: "Le jugement esthétique ('c'est beau') exprime un habitus de classe spécifique — non un universel. Le goût est socialement construit : ceux qui possèdent la culture légitime maîtrisent ses codes et se trouvent ainsi dominants. L'accès à l'art est inégal (capital culturel, économique, social). B. O'Doherty : l'espace de la galerie et son idéologie.",
          fiche: "Le goût n'est pas universel mais un habitus de classe : la culture légitime est un capital qui distingue et domine ; l'accès à l'art est socialement inégal.",
          citations: ["Le goût n'est pas universel mais l'expression d'un habitus de classe particulier"],
        },
      ],
    },
    {
      n: "Sartre",
      ideas: [
        {
          w: "L'Imaginaire, 1940",
          i: "Le paradoxe de l'objet d'art : sa signification demeure irréelle (hors du monde), mais il peut être la cause et la fin d'activités réelles. Un tableau met en jeu des intérêts économiques et politiques réels. La réalité d'une société comporte la socialisation de certaines irréalités — les œuvres reçues sont réelles en ce qu'elles provoquent des actions et des sentiments réels.",
          fiche: "Paradoxe de l'objet d'art : sa signification est irréelle (imaginaire), mais il cause et finalise des activités et des sentiments bien réels.",
          citations: ["« Le paradoxe de l'objet d'art c'est que sa signification demeure irréelle »"],
        },
      ],
    },
    {
      n: "Bergson",
      ideas: [
        {
          w: "Le Rire, 1900",
          i: "L'artiste écarte le voile de la perception utilitaire. Ce que l'artiste a vu, nous ne l'aurions jamais vu sans lui. Son œuvre nous sert de leçon : l'efficacité de la leçon se mesure à la vérité de l'œuvre. L'art révèle ce que nous ne voyons pas ordinairement car notre perception est orientée vers l'action pratique.",
          fiche: "L'artiste écarte le voile de la perception utilitaire : il nous fait voir ce que nous ne voyons pas ordinairement — son œuvre est une leçon de vision.",
          citations: [
            "« Ce que l'artiste a vu, nous ne le reverrons pas — mais s'il a vu pour tout de bon, son œuvre nous sert de leçon »",
          ],
        },
      ],
    },
    {
      n: "Merleau-Ponty",
      ideas: [
        {
          w: "Sens et non-sens, 1966",
          i: "Le peintre construit une image — il faut attendre qu'elle s'anime pour les autres. Alors l'œuvre habitera indivise dans plusieurs esprits, présomptivement dans tout esprit possible, comme une acquisition pour toujours. L'œuvre d'art joint des vies séparées dans un espace commun : elle existe non dans un seul esprit mais entre les esprits.",
          fiche: "L'œuvre d'art « habite indivise dans plusieurs esprits » : elle joint des vies séparées dans un espace commun, comme une acquisition durable.",
          citations: ["L'œuvre d'art habite indivise dans plusieurs esprits, comme une acquisition pour toujours"],
        },
      ],
    },
    {
      n: "Schopenhauer",
      ideas: [
        {
          w: "Le Monde comme volonté et représentation, 1819",
          i: "L'œuvre d'art ne doit pas tout livrer directement aux sens — elle doit mettre l'imagination en bonne voie. L'imagination doit toujours avoir quelque chose à ajouter : c'est elle qui dit le dernier mot. Ce qu'il y a de meilleur dans l'art est trop spirituel pour être livré directement : c'est à l'imagination à le mettre au jour.",
          fiche: "L'art ne doit pas tout livrer aux sens : il met l'imagination en route — c'est elle qui « dit le dernier mot » ; le meilleur de l'art est trop spirituel pour le direct.",
          citations: ["« Ce qu'il y a de meilleur dans l'art est trop spirituel pour être livré directement aux sens »"],
        },
      ],
    },
  ],
  textes: [
    {
      n: "Nietzsche, Humain trop humain — I. L'artiste travaille",
      t: "L'activité du génie n'est pas différente de celle de l'inventeur, du savant ou du tacticien. Ce sont des hommes dont la pensée est active dans une direction unique, qui utilisent tout comme matière première, qui ne cessent d'observer diligemment leur vie intérieure et celle d'autrui. Le génie ne fait rien que d'apprendre à poser des pierres, travailler toujours à y mettre la forme. Tout ce qui est fini, parfait, excite l'étonnement ; tout ce qui est en train de se faire est déprécié.",
    },
    {
      n: "Arendt, La Crise de la culture — II. L'artiste ne travaille pas",
      t: "Les œuvres d'art ne sont pas consommées comme des biens, ni usées comme des objets d'usage : elles sont délibérément écartées des processus de consommation et d'utilisation, isolées loin de la sphère des nécessités de la vie humaine. Les œuvres d'art sont les seules choses à n'avoir aucune fonction dans le processus vital de la société. Du point de vue de la durée, elles sont clairement supérieures à toutes les autres choses — les plus mondaines.",
    },
    {
      n: "Kant, Critique de la faculté de juger — III. L'artiste crée",
      t: "Le génie est le talent de produire ce dont on ne peut donner de règle déterminée — non l'habileté qu'on peut apprendre suivant une règle. L'originalité est sa première qualité. Ses productions doivent être exemplaires : originales elles-mêmes, elles doivent pouvoir être proposées à l'imitation. Il ne peut lui-même décrire comment il accomplit ses productions — l'auteur en étant redevable à son génie, ne sait pas lui-même comment les idées s'en trouvent en lui.",
    },
    {
      n: "Hegel, Esthétique — liberté de la création",
      t: "Ce qui nous plaît dans la beauté artistique, c'est précisément le caractère de liberté de sa production. L'art beau n'est véritablement art qu'en cette liberté propre. La source des œuvres d'art est la libre activité de l'imagination qui, dans ses images, est plus libre que la nature. L'art est un libérateur : les passions perdent leur force du fait même qu'elles sont devenues objets de représentations — le sentiment sort de l'état de concentration et s'offre à notre libre jugement.",
    },
    {
      n: "Bergson, Le Rire",
      t: "Ce que l'artiste a vu, nous ne le reverrons pas, du moins pas tout à fait de même. Mais s'il a vu pour tout de bon, l'effort qu'il a fait pour écarter le voile s'impose à notre imitation. Son œuvre est un exemple qui nous sert de leçon. L'efficacité de la leçon se mesure précisément à la vérité de l'œuvre. La vérité porte donc en elle une puissance de conviction, de conversion même.",
    },
    {
      n: "Merleau-Ponty, Sens et non-sens",
      t: "Le peintre n'a pu que construire une image. Il faut attendre que cette image s'anime pour les autres. Alors l'œuvre d'art aura joint ces vies séparées — elle n'existera plus seulement en l'une d'elles comme un rêve tenace ou un délire persistant, ou dans l'espace comme une toile coloriée. Elle habitera indivise dans plusieurs esprits, présomptivement dans tout esprit possible, comme une acquisition pour toujours.",
    },
    {
      n: "Schopenhauer, Le Monde comme volonté",
      t: "L'œuvre d'art ne doit pas tout livrer directement aux sens, mais juste ce qu'il faut pour mettre l'imagination en bonne voie. L'imagination doit toujours avoir quelque chose à ajouter. Ce qu'il y a de meilleur dans l'art est trop spirituel pour être livré directement aux sens : c'est à l'imagination à le mettre au jour, quoique l'œuvre d'art doive l'engendrer. Voltaire : 'Le secret d'être ennuyeux, c'est de tout dire.'",
    },
    {
      n: "Sartre, L'Imaginaire",
      t: "Le paradoxe de l'objet d'art c'est que sa signification demeure irréelle, hors du monde, et que cependant il peut être la cause et la fin d'activités réelles. Un tableau met en jeu des intérêts économiques ; en temps de guerre, on l'évacue comme une personne. La réalité d'une société comporte la socialisation de certaines irréalités : les œuvres reçues sont réelles en ceci qu'elles provoquent des actions réelles, des sentiments réels et définissent le développement historique d'une société.",
    },
  ],
  exemples: [
    {
      tag: "Art contemporain",
      tit: "Duchamp — La Fontaine (1917)",
      body: "Un urinoir de porcelaine, signé 'R. Mutt', exposé comme œuvre d'art. Le ready-made radical : c'est l'acte de désignation institutionnelle qui crée l'œuvre, non le geste technique. Duchamp illustre la thèse de B. O'Doherty : c'est l'espace de la galerie et non l'objet lui-même qui fait l'art. Il met à mort la notion de savoir-faire artistique.",
      lien: "→ Institution, beau, technique (notion)",
    },
    {
      tag: "Art contemporain",
      tit: "Manzoni — Merda d'artista / Sculture immateriali",
      body: "Piero Manzoni vend ses propres excréments en boîtes numérotées ('Merda d'artista', 1961). Salvatore Garau vend aux enchères des 'sculptures immatérielles' (zones de vide certifiées, comme 'Io Sono', 2021). Ces œuvres poussent à l'extrême la logique institutionnelle : l'art est ce que l'artiste désigne comme art. La valeur commerciale atteinte prouve que l'institution valide cette thèse.",
      lien: "→ Institution (Duchamp), valeur esthétique vs commerciale",
    },
    {
      tag: "Philosophie",
      tit: "L'artiste travaille-t-il ?",
      body: "I. L'artiste travaille : efforts réguliers, maîtrise technique (Nietzsche, Humain trop humain). II. L'artiste ne travaille pas : œuvre inutile, immortelle, artiste maître de ses outils (Arendt, La Crise de la culture). III. L'artiste crée : œuvre unique, originale, génie (Kant, Critique de la faculté de juger). La question articule les notions de Travail, Technique et Liberté.",
      lien: "→ Travail, Technique, Liberté (notions liées)",
    },
    {
      tag: "Cinéma",
      tit: "Iris Brey — Le regard féminin (2020)",
      body: "Brey analyse le 'female gaze' : un regard qui donne une subjectivité au personnage féminin, permettant au spectateur de ressentir l'expérience de l'héroïne sans simplement s'identifier à elle. La différence entre ressentir et s'identifier est capitale dans son approche phénoménologique. L'œuvre d'art peut ainsi créer des formes d'empathie inédites.",
      lien: "→ Merleau-Ponty (intersubjectivité), Sartre (imaginaire)",
    },
    {
      tag: "Musique",
      tit: "L'esthétique musicale — sensibilité vs analyse",
      body: "Écouter de la musique peut faire plaisir à mon ouïe (sensibilité pure) ou mobiliser une analyse structurelle. Le 'faire travailler les sons' (Schopenhauer : laisser l'imagination compléter) illustre la distinction entre art comme expérience sensorielle et art comme expérience intellectuelle. La musique est l'art le plus 'spirituel' car le moins matériel.",
      lien: "→ Schopenhauer (imagination), Kant (beau sans concept)",
    },
  ],
  accroches: [
    {
      type: "Actualité",
      t: "En 1917, Duchamp expose un urinoir industriel signé « R. Mutt » sous le titre Fontaine : si n’importe quel objet peut devenir une œuvre, qu’est-ce qui fait encore l’art ?",
      new: true,
    },
    {
      type: "Citation",
      t: "Hegel annonçait que « l’art, dans sa plus haute destination, est pour nous chose passée » : non qu’il disparaîtra, mais qu’il ne suffit plus à dire le vrai. À quoi sert alors une œuvre ?",
      src: "Hegel, Esthétique",
      new: true,
    },
  ],
  liens: ["Travail", "Technique", "Liberté", "Conscience", "Nature"],
  diss: [
    {q: "L'artiste travaille-t-il ?"},
    {q: "Peut-on apprendre à créer ?"},
    {q: "L'œuvre d'art a-t-elle une utilité ?"},
    {q: "Le génie est-il inné ou acquis ?"},
    {q: "L'art doit-il être beau ?"},
    {q: "La technique suffit-elle pour créer une œuvre d'art ?"},
    {q: "L'art est-il un langage universel ?"},
    {q: "Une œuvre d'art peut-elle être immortelle ?"},
    {q: "L'art est-il affaire de goût ?"},
  ],
  plans: [
    {
      q: "L'activité artistique est-elle un travail comme les autres ?",
      theme: "L'artiste travaille",
      intro: "",
      pb: "L'activité artistique est-elle un travail comme les autres ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "L'artiste produit des efforts réguliers pour transformer la matière ou réifier une idée. Un musicien, un sculpteur fournissent des efforts répétitifs. Le travail technique est un point commun entre l'artiste et le travailleur : maîtrise des matériaux, des techniques diverses.",
              auteurs: "",
              ref: "Nietzsche, Humain trop humain",
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
              args: "Nietzsche démonte le mythe du génie inné : c'est notre ignorance et notre paresse qui nous font croire au 'don'. L'activité du génie ressemble à celle du savant ou du tacticien — observation, répétition, travail acharné. La maîtrise technique et la raison instrumentale sont indispensables.",
              auteurs: "",
              ref: "Nietzsche, Humain trop humain",
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
              args: "Perspective critique (limite de I) : inégalité socio-économique d'accès à l'art (Bourdieu). Le travail ne suffit pas (capital culturel). L'art peut devenir 'prêt-à-mâcher' via les 'ready-made' — n'importe quel objet peut être art si l'institution le décide.",
              auteurs: "",
              ref: "Bourdieu, La Distinction ; Duchamp, La Fontaine",
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
      q: "En quoi l'œuvre d'art se distingue-t-elle radicalement du produit du travail ?",
      theme: "L'artiste ne travaille pas",
      intro: "",
      pb: "En quoi l'œuvre d'art se distingue-t-elle radicalement du produit du travail ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "L'artiste est toujours maître de ses outils (≠ travailleur asservi à la machine). L'œuvre est inutile au sens strict : elle ne satisfait pas les besoins vitaux. L'artiste porte un regard désintéressé sur le monde — c'est justement pourquoi il rend visible ce que nous ne voyons pas ordinairement.",
              auteurs: "",
              ref: "Kant (désintéressement esthétique) ; Bergson, Le Rire",
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
              args: "Le fruit du travail est destiné à être consommé et remplacé. L'œuvre d'art est potentiellement immortelle (Arendt) : écartée des processus de consommation, elle survit à toutes les générations. Son rapport au temps est radicalement différent de celui du produit.",
              auteurs: "",
              ref: "Arendt, La Crise de la culture",
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
              args: "L'activité artistique est elle-même sa propre fin (Hegel : liberté propre). La 'valeur esthétique' ≠ 'valeur de fait descriptif'. L'art résiste à la réduction économique — même si le marché de l'art lui assigne une valeur commerciale, son essence demeure irréductible au prix.",
              auteurs: "",
              ref: "Hegel, Esthétique ; Sartre, L'Imaginaire",
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
      q: "La création artistique est-elle une troisième forme d'activité irréductible au travail et à la non-activité ?",
      theme: "L'artiste crée",
      intro: "",
      pb: "La création artistique est-elle une troisième forme d'activité irréductible au travail et à la non-activité ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "L'œuvre est unique et originale (≠ production en série). L'originalité est la première qualité du génie (Kant) : produire ce dont on ne peut donner de règle déterminée. Ce n'est pas simplement du savoir-faire — c'est du talent. L'artiste crée en un sens que l'artisan ne peut pas.",
              auteurs: "",
              ref: "Kant, Critique de la faculté de juger",
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
              args: "La création artistique met en jeu une liberté particulière : liberté de ses moyens et de ses fins (Hegel). L'imagination créatrice est plus libre que la nature. L'œuvre est une acquisition permanente qui joint des esprits séparés (Merleau-Ponty) — elle crée une forme d'intersubjectivité unique.",
              auteurs: "",
              ref: "Hegel, Esthétique ; Merleau-Ponty, Sens et non-sens",
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
              args: "Ouverture / limite : le problème de la reproductibilité de l'œuvre et de la culture de masse (Arendt). Faire de l'œuvre un produit de consommation revient à détruire l'artiste. La 'crise de la culture' : industrie culturelle (Walter Benjamin, Adorno) — quand tout est art, plus rien ne l'est.",
              auteurs: "",
              ref: "Arendt, La Crise de la culture ; Benjamin, L'œuvre d'art à l'époque de sa reproductibilité",
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
