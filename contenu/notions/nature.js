/* Notion « Nature » : Qu'est-ce qui est naturel ?
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("nature", {
  c: "#1D9E75",
  l: "Nature",
  s: "Qu'est-ce qui est naturel ?",
  def: "La <span class='kw'>nature</span> désigne le monde physique (<em>phusis</em>), l'essence propre d'un être, ou ce qui s'oppose à la culture et à la technique. Enjeu : y a-t-il une 'bonne nature' à respecter ou à dépasser ? La frontière nature/culture est-elle nette ?<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>Étymologie &amp; trois sens</div><div class='def-sec-body'>Du latin <em>natura</em> (naissance, essence), traduit le grec <em>physis</em> (ce qui croît spontanément). Trois sens : (1) <strong>nature vs culture</strong> — ce qui est inné vs acquis ; (2) <strong>nature d'une chose</strong> — son essence, ce qu'elle est par définition ; (3) <strong>la Nature</strong> — l'ensemble du monde physique, le cosmos. La culture <em>(latin colere)</em> désigne l'ensemble des acquis transmis en société — et non hérités biologiquement.</div></div><div class='def-sec'><div class='def-sec-title'>Nature vs Culture</div><div class='def-sec-body'>Rousseau : « l'homme est né libre » mais la société le corrompt (état de nature pacifique idéalisé). Lévi-Strauss : la prohibition de l'inceste est universelle (nature) mais son contenu varie (culture) — la frontière nature/culture est elle-même culturelle. Frans de Waal : les comportements altruistes et empathiques existent chez les chimpanzés — la morale a des racines naturelles.</div></div><div class='def-sec'><div class='def-sec-title'>La nature a-t-elle des droits ?</div><div class='def-sec-body'>Christopher Stone (<em>Should Trees Have Standing?</em>) : les arbres devraient avoir une personnalité juridique. Michel Serres (<em>Le Contrat naturel</em>) : étendre le contrat social à la nature. Constitution équatorienne (2008) : la <em>Pacha Mama</em> a des droits constitutionnels. Gange et Yamuna reconnus « personnes morales » en Inde (2017). Code civil français (2015) : l'animal est reconnu comme « être doué de sensibilité ».</div></div><div class='def-sec'><div class='def-sec-title'>Technique, nature et responsabilité</div><div class='def-sec-body'>Descartes : nous rendre « maîtres et possesseurs de la nature ». Jonas (<em>Le Principe responsabilité</em>) : notre puissance technique crée des obligations envers les générations futures. L'CRISPR (Emmanuelle Charpentier, Nobel 2020) pose la question de la modification du génome humain — jusqu'où peut-on « corriger » la nature ?</div></div></details>",
  auteurs: [
    {
      n: "Aristote",
      ideas: [
        {
          w: "Physique / Parties des animaux",
          i: "La nature est un principe interne de mouvement. La main : 'outil à faire des outils'. L'homme est un animal politique par nature. La nature ne fait rien en vain.",
          fiche: "La nature est un principe interne de mouvement et « ne fait rien en vain » ; l'homme est par nature un animal politique, et la main « l'outil à faire des outils ».",
          citations: ["« La main semble être non pas un outil, mais plusieurs »"],
        },
      ],
    },
    {
      n: "Descartes",
      ideas: [
        {
          w: "Discours de la méthode, 1637",
          i: "Nous rendre 'maîtres et possesseurs de la nature' grâce à la physique pratique. La nature est une machine que la science peut dominer pour améliorer nos conditions de vie.",
          fiche: "La science doit nous rendre « comme maîtres et possesseurs de la nature » : la nature est une machine que la physique pratique peut dominer pour notre bien.",
          citations: ["« Nous rendre comme maîtres et possesseurs de la nature »"],
        },
      ],
    },
    {
      n: "Rousseau",
      ideas: [
        {
          w: "Discours sur l'inégalité, 1755",
          i: "Homme naturellement bon, libre et solitaire. La société et la propriété le corrompent. L'état de nature est un mythe régulateur qui sert à critiquer la société présente.",
          fiche: "L'homme est naturellement bon, libre et solitaire ; la société et la propriété le corrompent — l'état de nature est un mythe régulateur pour critiquer le présent.",
          citations: ["« L'homme est né libre, et partout il est dans les fers » (Du contrat social, I, 1)"],
          modified: true,
        },
      ],
    },
    {
      n: "Hans Jonas",
      ideas: [
        {
          w: "Le Principe responsabilité, 1990",
          i: "La technique moderne menace la nature et les générations futures. 'Heuristique de la peur' : anticiper le pire pour agir responsablement. Nouveau devoir envers la nature.",
          fiche: "La technique menace la nature et les générations futures : un nouveau devoir envers la nature, guidé par l'« heuristique de la peur ».",
          citations: [
            "« Agis de façon que les effets de ton action soient compatibles avec la permanence d'une vie authentiquement humaine sur terre » (Le Principe responsabilité, chap. I)",
          ],
          modified: true,
        },
      ],
    },
    {
      n: "Darwin",
      ideas: [
        {
          w: "L'Origine des espèces, 1859",
          i: "Sélection naturelle : la nature ne poursuit aucune finalité. L'homme est issu de la nature animale sans rupture absolue. La 'nature humaine' est une construction évolutive.",
          fiche: "Sélection naturelle : la nature ne poursuit aucune fin ; l'homme descend de l'animal sans rupture absolue — la « nature humaine » est une construction évolutive.",
          citations: ["L'homme : un primate évolué, sans rupture fondamentale avec l'animal"],
        },
      ],
    },
    {
      n: "Platon",
      ideas: [
        {
          w: "Protagoras",
          i: "Mythe de Prométhée : l'homme est 'nu, sans chaussures, sans armes'. Épiméthée a tout distribué aux animaux. Prométhée vole le feu technique pour compenser la nudité naturelle de l'homme.",
          fiche: "Mythe de Prométhée : l'homme naît « nu, sans armes », être déficient ; la technique (le feu volé) compense sa nudité naturelle.",
          citations: ["L'homme : être déficient naturel, compensé par la technique"],
        },
      ],
    },
    {
      n: "Frans de Waal",
      ideas: [
        {
          w: "L'Âge de l'empathie, 2009 / Le Bonobo, Dieu et nous, 2013",
          i: "Les primates (bonobos, chimpanzés) manifestent des comportements d'empathie, de partage, de réconciliation. La morale a des racines naturelles : la pitié naturelle ne serait pas un monopole humain. Contre Hobbes : la nature n'est pas seulement guerre, elle inclut aussi la coopération et la solidarité.",
          modified: true,
          fiche: "La morale a des racines naturelles : empathie, partage, réconciliation chez les primates — contre Hobbes, la nature inclut aussi la coopération.",
          citations: ["« La morale précède la religion et n'a pas besoin d'elle »"],
        },
      ],
    },
    {
      n: "Épicure",
      ideas: [
        {
          w: "Lettre à Ménécée / Maximes Capitales",
          i: "Distinction désirs naturels et nécessaires / naturels et non nécessaires / ni naturels ni nécessaires. Seuls les premiers méritent d'être satisfaits. La nature définit les limites du bonheur réel. Contre la démesure des désirs artificiels.",
          fiche: "La nature borne nos besoins réels : seuls les désirs naturels et nécessaires méritent satisfaction — « la nature nous a fait peu riches de besoins ».",
          citations: ["Les désirs naturels et nécessaires sont faciles à satisfaire (Lettre à Ménécée, reformulé)"],
          modified: true,
        },
      ],
    },
    {
      n: "Christopher Stone",
      ideas: [
        {
          w: "'Les arbres doivent-ils pouvoir plaider ?' (1972)",
          i: "Argument pragmatique pour les droits de la nature : forêts, rivières et éléments naturels devraient avoir des droits positifs. Les entités naturelles ne peuvent pas parler — mais les entreprises, États, propriétés et nourrissons non plus, et les juristes parlent pour eux. Stone propose qu'une personne soucieuse d'un objet naturel puisse saisir un tribunal pour mettre en place une tutelle (guardianship).",
          fiche: "Les entités naturelles (forêts, rivières) devraient avoir des droits, comme les entreprises ou les nourrissons : un tuteur parlerait pour elles en justice.",
          citations: ["Les entités naturelles méritent le même statut juridique que les personnes morales"],
        },
      ],
    },
    {
      n: "Baptiste Morizot",
      ideas: [
        {
          w: "Manières d'être vivant, 2020",
          i: "Diplomatie inter-espèces : face aux conflits entre espèces (loup/brebis/berger), il faut une approche diplomatique visant l'intérêt commun de toutes les formes de vie. Être diplomate = se sentir légèrement traître envers tout le monde, maintenir l'ambivalence entre tous les points de vue contradictoires. Concept d'égards ajustés à toutes les formes de vie.",
          fiche: "Diplomatie inter-espèces : arbitrer les conflits (loup/brebis) par des « égards ajustés » à toutes les formes de vie — « se sentir légèrement traître envers tout le monde ».",
          citations: ["« Être diplomate, c'est se sentir légèrement traître envers tout le monde »"],
        },
      ],
    },
    {
      n: "Michel Serres",
      ideas: [
        {
          w: "Le Contrat naturel, 1990",
          i: "Notre rapport actuel à la nature = parasitisme (on prend tout, on ne donne rien). Il faut passer du contrat exclusivement social à un contrat naturel de symbiose et de réciprocité. Le droit de symbiose définit la responsabilité réciproque : autant la nature donne à l'homme, autant celui-ci doit rendre à celle-là, devenue sujet de droit.",
          fiche: "Notre rapport à la nature est un parasitisme ; il faut un « contrat naturel » de symbiose et de réciprocité, faisant de la nature un sujet de droit.",
          citations: ["Passer du parasitisme à la symbiose : un nouveau contrat naturel"],
        },
      ],
    },
    {
      n: "François Ost",
      ideas: [
        {
          w: "La Nature hors la loi. L'écologie à l'épreuve du droit, 1995",
          i: "Contre la thèse des droits de la nature : le langage des droits présuppose la conscience de l'égale dignité et l'aptitude à la faire valoir par la parole et l'action. L'asymétrie vivant/humain (seul l'humain a accédé au sens) justifie non des droits de la nature mais des devoirs asymétriques de responsabilité des humains envers elle.",
          fiche: "Contre les droits de la nature : l'asymétrie humain/vivant (seul l'humain accède au sens) fonde non des droits de la nature, mais des devoirs de l'homme envers elle.",
          citations: [
            "L'asymétrie humain/vivant fonde des devoirs (pas des droits) : nous devons protéger la nature, elle ne peut pas revendiquer",
          ],
        },
      ],
    },
    {
      n: "Val Plumwood",
      ideas: [
        {
          w: "Dans l'œil du crocodile. L'humanité comme proie, 2021",
          i: "Récit d'une attaque de crocodile en 1985 : l'humain se découvre proie, membre d'une communauté biotique. Le dualisme homme/nature (l'humain comme esprit pur séparé du corps et des animaux) est une construction culturelle millénaire — une erreur profonde. Appel à se réidentifier en termes écologiques : solidarité avec les autres vivants, réformer notre conception de la mort comme nourriture partagée.",
          fiche: "Le dualisme homme/nature est une erreur culturelle : devenue proie d'un crocodile, l'humaine se redécouvre animal parmi les animaux d'une communauté biotique.",
          citations: ["Le dualisme homme/nature est une erreur culturelle : nous sommes des animaux parmi les animaux"],
        },
      ],
    },
    {
      n: "Héraclite",
      ideas: [
        {
          w: "Fragments (fr. 123 et 60 DK)",
          i: "La nature (phusis), le principe qui fait naître et croître les choses, aime à se cacher : elle ne se livre pas aux sens, il faut la déchiffrer comme un oracle. Ce qu'on y découvre, c'est l'unité des contraires : le chemin qui monte et celui qui descend sont un seul et même chemin, le jour et la nuit sont une même chose.",
          new: true,
          citations: ["La nature aime à se cacher (fr. 123, reformulé)"],
          fiche: "La nature aime à se cacher ; sous le visible, l'unité des contraires (le chemin qui monte et celui qui descend sont le même).",
        },
      ],
    },
    {
      n: "Lucrèce",
      ideas: [
        {
          w: "De la nature, I (atomes et vide)",
          i: "Rien ne naît de rien, rien ne retourne au néant : la nature n'est faite que d'atomes éternels, insécables, qui se meuvent dans le vide et se combinent. Tout ce qui existe, astres, plantes, âmes, résulte de leurs rencontres, sans dessein divin. Connaître la nature, c'est cesser de la peupler de dieux.",
          new: true,
          citations: ["Rien ne naît de rien, par l'effet d'une puissance divine (I, 150, reformulé)"],
          fiche: "Rien ne naît de rien : la nature n'est qu'atomes et vide, sans dessein divin.",
        },
      ],
    },
    {
      n: "Montaigne",
      ideas: [
        {
          w: "Essais, I, 31, « Des cannibales »",
          i: "À propos des Tupinambas du Brésil, Montaigne retourne l'accusation : nous appelons barbare ce qui n'est pas de notre usage. Les « sauvages » le sont comme un fruit sauvage, que l'art humain n'a pas abâtardi ; et la cruauté des guerres de religion, où l'on torture des vivants, vaut bien celle qui mange des morts.",
          new: true,
          citations: ["« Chacun appelle barbarie ce qui n'est pas de son usage » (I, 31)"],
          fiche: "Chacun appelle barbarie ce qui n'est pas de son usage : critique de l'ethnocentrisme.",
        },
      ],
    },
    {
      n: "Diderot",
      ideas: [
        {
          w: "Supplément au voyage de Bougainville (écrit en 1772, publié en 1796)",
          i: "Un vieillard tahitien et l'aumônier de l'expédition comparent leurs mœurs. Les interdits européens sur la sexualité, contraires à la nature, produisent hypocrisie et malheur ; chez les Tahitiens, la règle suit la nature et l'utilité commune. Diderot ne prône pas un retour à l'état sauvage : il demande qu'on n'impose pas des lois qui contredisent la nature humaine.",
          new: true,
          citations: ["Le vieillard tahitien demande aux Européens de laisser ses mœurs en paix (reformulé)"],
          fiche: "Des lois contraires à la nature produisent hypocrisie et malheur : la morale doit s'accorder à la nature humaine.",
        },
      ],
    },
    {
      n: "Bentham",
      ideas: [
        {
          w: "Introduction aux principes de morale et de législation, chap. XVII, note (1789)",
          i: "Le jour viendra peut-être où les animaux obtiendront les droits qu'on leur refuse. Ce qui compte moralement n'est ni la raison ni le langage, mais la capacité de souffrir : c'est elle qui donne droit à la considération. Bentham ouvre ainsi l'éthique animale moderne, que reprendra Peter Singer.",
          new: true,
          citations: [
            "« La question n'est pas : peuvent-ils raisonner ? ni : peuvent-ils parler ? mais : peuvent-ils souffrir ? » (chap. XVII, note)",
          ],
          fiche: "Ce qui donne droit à la considération morale n'est ni la raison ni la parole, mais la capacité de souffrir.",
        },
      ],
    },
    {
      n: "Beauvoir",
      ideas: [
        {
          w: "Le Deuxième Sexe, t. II (1949)",
          i: "Il n'y a pas d'éternel féminin, ni de destin biologique. La féminité est une situation produite par l'éducation, les mœurs, l'économie : la société fait de la femme l'Autre de l'homme, définie par rapport à lui. Ce qui passe pour la nature féminine est une construction, donc peut changer.",
          new: true,
          citations: ["« On ne naît pas femme : on le devient » (t. II, 1re partie, chap. I)"],
          fiche: "La féminité n'est pas une nature mais une construction sociale : la femme est faite l'Autre de l'homme.",
        },
      ],
    },
    {
      n: "Lévi-Strauss",
      ideas: [
        {
          w: "Les Structures élémentaires de la parenté (1949)",
          i: "Où finit la nature, où commence la culture ? Est naturel ce qui est universel ; est culturel ce qui suit une règle, variable d'une société à l'autre. La prohibition de l'inceste est le seul fait à la fois universel et réglé : elle est le passage même de la nature à la culture. Elle oblige à chercher un conjoint hors de sa famille, donc à échanger, et noue les groupes entre eux.",
          new: true,
          citations: [
            "La prohibition de l'inceste, à la fois universelle et réglée, marque le passage de la nature à la culture (reformulé)",
          ],
          fiche: "La prohibition de l'inceste, universelle et réglée, est le passage de la nature à la culture ; elle oblige à l'échange.",
        },
        {
          w: "Race et histoire (1952)",
          i: "Écrit pour l'Unesco. Toutes les sociétés ont une histoire aussi longue ; aucune n'est primitive. Traiter l'autre de barbare, c'est adopter justement l'attitude qu'on lui reproche. Le progrès vient de la coalition des cultures, de leurs échanges : une civilisation isolée s'appauvrit.",
          new: true,
          citations: ["« Le barbare, c'est d'abord l'homme qui croit à la barbarie » (Race et histoire)"],
          fiche: "Aucune culture n'est primitive ; traiter l'autre de barbare, c'est être soi-même barbare.",
        },
      ],
    },
  ],
  textes: [
    {
      n: "Descartes, Discours de la méthode",
      t: "La physique pratique permet de connaître force du feu, eau, air. Maîtres et possesseurs de la nature : le premier bien est la santé.",
    },
    {
      n: "Jonas, Le Principe responsabilité",
      t: "Prométhée déchaîné par la science. La promesse de la technique s'est inversée en menace. Heuristique de la peur comme boussole.",
    },
    {
      n: "Platon, Protagoras",
      t: "Mythe de Prométhée : Épiméthée distribue les qualités aux animaux, oublie l'homme. Prométhée vole le feu à Héphaïstos. Zeus envoie justice et pudeur à tous les hommes.",
    },
    {
      n: "Aristote, Parties des animaux",
      t: "La main comme outil polymorphe : griffe, serre, corne, lance. L'homme peut acquérir le plus grand nombre de techniques grâce à la main.",
    },
    {
      n: "Stone, 'Les arbres doivent-ils pouvoir plaider ?' (1972) — argument pragmatique",
      t: "Les entités naturelles (forêts, rivières) ne peuvent pas parler mais les entreprises, États, nourrissons non plus — et les juristes parlent pour eux. Accorder des droits à la nature est juridiquement possible et moralement cohérent. La tutelle (guardianship) permettrait de représenter les intérêts des objets naturels devant les tribunaux.",
    },
    {
      n: "Morizot, Manières d'être vivant — le Chantier Castor",
      t: "Projet de guérison d'une rivière en alliance avec les castors (entité naturelle hybride). Méthode : incision (élargir les rivières), guérison des maladies (contrer l'érosion), alliance et réciprocité avec le castor et la rivière, utilisation de moyens naturels (biomimétisme, lowtech). Le lowtech = catégorie de techniques simples, appropriables, durables, résilientes.",
    },
    {
      n: "Serres, Le Contrat naturel — parasitisme vs symbiose",
      t: "Notre rapport actuel à la nature est parasitaire : nous prenons tout sans rendre. Le droit de maîtrise se réduit au parasitisme. Le droit de symbiose définit la responsabilité réciproque — comme un contrat entre partenaires, où chacun doit à l'autre. La nature devient sujet de droit.",
    },
    {
      n: "Jonas, Le Principe responsabilité — impératif écologique",
      t: "'Agis de façon que les effets de ton action soient compatibles avec la permanence d'une vie authentiquement humaine sur terre.' L'âge de la civilisation technique rend l'avenir de l'humanité et de la biosphère la première obligation collective. La responsabilité s'étend au-delà de l'intersubjectif jusqu'à la survie future de l'espèce et de la biosphère entière.",
    },
    {
      n: "Ost, La Nature hors la loi — devoirs asymétriques",
      t: "Le langage des droits suppose la conscience de l'égale dignité et l'aptitude à la faire valoir. Entre le vivant et l'humain s'établit une asymétrie : seul l'humain a accédé au niveau du sens. Non pas que les animaux aient des droits à faire valoir, mais bien que les hommes ont des devoirs asymétriques de responsabilité — justifiés par la vulnérabilité des bénéficiaires et la nécessité de respecter les symbioses biologiques.",
    },
  ],
  exemples: [
    {
      tag: "Écologie",
      tit: "Le dérèglement climatique",
      body: "La hausse des températures mondiales (+1,5°C depuis l'ère pré-industrielle) est la conséquence directe de la domination technico-industrielle de la nature. C'est l'illustration concrète de l'avertissement de Jonas sur les effets irréversibles de la technique.",
      lien: "→ Jonas (principe responsabilité), Descartes (domination nature)",
    },
    {
      tag: "Anthropologie",
      tit: "Claude Lévi-Strauss — l'universalité de la culture",
      body: "L'opposition nature/culture se retrouve dans toutes les sociétés : la prohibition de l'inceste est universelle mais son contenu varie. Il n'y a pas de société 'purement naturelle' : l'homme est toujours déjà culturel.",
      lien: "→ Rousseau, question de la nature humaine",
    },
    {
      tag: "Mythe",
      tit: "Mythe de Prométhée (Platon, Protagoras)",
      body: "L'homme est l'animal déficient par excellence : nu, sans griffes, sans fourrure, sans vitesse. Il compense par la technique (feu volé à Héphaïstos) et par la vie politique (justice et pudeur données par Zeus à tous les hommes).",
      lien: "→ Technique, Justice, État",
    },
    {
      tag: "Science",
      tit: "OGM et transgénèse",
      body: "Les OGM illustrent le projet cartésien poussé à l'extrême : modifier le génome des plantes pour les adapter à nos besoins. Mais ils posent la question des limites éthiques : jusqu'où peut-on 'corriger' la nature ?",
      lien: "→ Devoir, technique, Jonas",
    },
    {
      tag: "Droit",
      tit: "Constitution équatorienne (2008) — Pacha Mama",
      body: "Première constitution nationale à reconnaître des droits à la nature (Pacha Mama, 'là où la vie est reproduite et se produit'). La nature a le droit à son existence, à son maintien et à la régénération de ses cycles vitaux. Exemple concret de la thèse de Stone mis en pratique au niveau constitutionnel.",
      lien: "→ Stone, Serres, Jonas, droits de la nature",
    },
    {
      tag: "Droit",
      tit: "Gange et Yamuna reconnus personnes morales (Inde, 2017)",
      body: "La haute cour de l'Uttarakhand a qualifié les fleuves Gange et Yamuna d'entités vivantes ayant le statut de personne morale. Illustration directe de l'argument de Stone : les juristes parlent pour des entités qui ne peuvent pas parler. La décision a été suspendue mais ouvre un débat mondial.",
      lien: "→ Stone (tutelle), droits de la nature",
    },
    {
      tag: "Droit",
      tit: "Code civil français (2015) — l'animal sensible",
      body: "La réforme du Code civil en 2015 reconnaît que l'animal est 'un être doué de sensibilité'. Étape intermédiaire entre le statut de chose et celui de sujet de droit. Illustre les avancées et les limites du droit actuel : l'animal n'est plus une chose, mais n'a pas encore de droits positifs.",
      lien: "→ Frans de Waal, droits de la nature, Stone",
    },
    {
      tag: "Philosophie",
      tit: "Chantier Castor — Morizot (diplomatie inter-espèces)",
      body: "Alliance avec les castors pour régénérer une rivière : incision, guérison des 'maladies' de la rivière (érosion), réciprocité avec le castor. Le lowtech (biomimétisme, techniques simples et appropriables) comme modèle. La technique au service de la diplomatie inter-espèces plutôt que de la domination de la nature.",
      lien: "→ Morizot (diplomatie), Serres (symbiose), technique",
    },
    {
      tag: "Philosophie",
      tit: "Val Plumwood — l'humanité comme proie",
      body: "Attaquée par un crocodile en 1985, Plumwood découvre que l'humain est aussi une proie — membre d'une communauté biotique, pas maître d'une nature extérieure. Cette expérience remet en cause le dualisme homme/nature occidental : nous sommes des animaux parmi les animaux, pris dans des réseaux écologiques de prédation réciproque.",
      lien: "→ Plumwood (dualisme homme/nature), Morizot, droits de la nature",
    },
  ],
  accroches: [
    {
      type: "Actualité",
      t: "En 2008, l’Équateur inscrit dans sa Constitution les droits de la « Pacha Mama » (la Terre-Mère) : un fleuve ou une forêt peuvent-ils être sujets de droit ? La nature cesse alors d’être un simple décor de l’action humaine.",
      new: true,
    },
    {
      type: "Citation",
      t: "Descartes assignait à la science de nous rendre « comme maîtres et possesseurs de la nature » ; trois siècles plus tard, la crise écologique fait de cette ambition un problème plutôt qu’un programme.",
      src: "Descartes, Discours de la méthode",
      new: true,
    },
  ],
  liens: ["Technique", "Liberté", "Devoir", "État"],
  diss: [
    "L'être humain est-il un être naturel ?",
    "Faut-il respecter la nature ?",
    "La technique nous éloigne-t-elle de la nature ?",
    "Y a-t-il une nature humaine ?",
    "L'homme a-t-il des devoirs envers la nature ?",
    {q: "La nature a-t-elle des droits ?"},
    {q: "Sommes-nous moralement responsables envers la nature ?"},
    {q: "Peut-on concevoir une diplomatie inter-espèces ?"},
    {q: "La nature est-elle un sujet de droit ?"},
  ],
  plans: [
    {
      q: "Ce qui est naturel est-il nécessairement bon ?",
      theme: "La nature comme norme et modèle",
      intro: "",
      pb: "Ce qui est naturel est-il nécessairement bon ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Rousseau : la nature est bonne, la société corrompt. L'homme naturel est libre, égal, bon. Le 'retour à la nature' comme critique de la civilisation.",
              auteurs: "",
              ref: "Rousseau, Discours sur l'inégalité",
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
              args: "Mais l'appel à la nature peut être un argument fallacieux (sophisme naturaliste) : ce qui est naturel n'est pas automatiquement bon (maladies, prédation, mort sont naturelles).",
              auteurs: "",
              ref: "Hume : 'Le fait n'implique pas le droit'",
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
              args: "Aristote propose un juste milieu : la nature fixe des limites et des fins. La technique doit s'y conformer (médecine curative) sans les transgresser (médecine transhumaniste).",
              auteurs: "",
              ref: "Aristote, Physique II",
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
      q: "Devons-nous maîtriser la nature ou la respecter ?",
      theme: "La domination de la nature par la technique",
      intro: "",
      pb: "Devons-nous maîtriser la nature ou la respecter ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Descartes : la physique pratique nous permet de dominer la nature pour notre bien-être (santé, confort). La technique est la réalisation du projet cartésien de domination.",
              auteurs: "",
              ref: "Discours de la méthode",
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
              args: "Mais la domination a des limites : destructions écologiques, dérèglement climatique. La technique peut détruire les conditions de vie sur Terre.",
              auteurs: "",
              ref: "GIEC, données climatiques actuelles",
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
              args: "Jonas : face à la puissance technique, nouveau devoir. La nature a une valeur intrinsèque. 'Heuristique de la peur' : agir selon le principe de précaution.",
              auteurs: "",
              ref: "Jonas",
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
      q: "L'homme a-t-il une essence naturelle fixe ?",
      theme: "Y a-t-il une 'nature humaine' ?",
      intro: "",
      pb: "L'homme a-t-il une essence naturelle fixe ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Oui : Aristote (animal politique), les religions (créé à l'image de Dieu), la sociobiologie. L'homme a une nature qui le prédispose à certains comportements.",
              auteurs: "",
              ref: "Aristote, Politique I",
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
              args: "Non : Sartre ('l'existence précède l'essence'). L'homme n'a pas de nature préalable, il se définit par ses choix. Beauvoir : même chose pour les femmes ('on ne naît pas femme').",
              auteurs: "",
              ref: "Sartre, L'existentialisme est un humanisme",
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
              args: "Nuance évolutive : il y a des tendances naturelles (sociabilité, langage, outil) mais elles sont plastiques. La culture transforme et dépasse la nature sans la supprimer totalement.",
              auteurs: "",
              ref: "Darwin, Lévi-Strauss",
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
      q: "Peut-on reconnaître un statut juridique à la nature ?",
      theme: "La nature a-t-elle des droits ?",
      intro: "",
      pb: "Peut-on reconnaître un statut juridique à la nature ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Par définition, la nature n'a pas de droits (Hobbes, Léviathan 1651) : l'état de nature est antérieur à tout droit — 'là où il n'y a pas de loi, rien n'est injuste'. Le droit suppose la parole, la conscience et l'action — ce dont animaux et plantes sont dépourvus (Ost). Nous avons des droits sur la nature, pas elle sur nous.",
              auteurs: "",
              ref: "Hobbes, Léviathan ; Ost, La Nature hors la loi",
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
              args: "Argument pragmatique : accorder des droits aux entités naturelles est juridiquement possible et moralement cohérent (Stone). Les forêts et rivières devraient avoir des droits positifs — comme les entreprises ou les nourrissons, les juristes pourraient parler pour elles. Exemples : Constitution équatorienne (2007, Pacha Mama), fleuve Gange reconnu personne morale (Inde, 2017).",
              auteurs: "",
              ref: "Stone, 'Les arbres doivent-ils pouvoir plaider ?' 1972",
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
              args: "La responsabilité morale des humains envers toutes les entités naturelles impose de mettre en place des relations justes, de symbiose et de réciprocité (Jonas, Serres, Morizot). Le principe responsabilité s'étend au-delà de l'intersubjectif jusqu'à la biosphère entière. Même sans droits formels, nous avons des devoirs envers la nature.",
              auteurs: "",
              ref: "Jonas, Le Principe responsabilité ; Serres, Le Contrat naturel ; Morizot, Manières d'être vivant",
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
