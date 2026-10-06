/* Notion « Autrui » : suis-je moi-même sans les autres ?
   HORS PROGRAMME (étape 5) : notion du programme de 2003, absente de celui de 2019.
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("autrui", {
  c: "#B85C8A",
  l: "Autrui",
  s: "Ai-je besoin d’autrui pour être moi-même ?",
  def: "<span class='kw'>Autrui</span> (du latin <em>alter</em>, l'autre) désigne l'autre homme en tant qu'il est à la fois <strong>semblable</strong> à moi (une conscience, un sujet libre) et <strong>autre</strong> que moi : je ne vivrai jamais sa vie de l'intérieur. Ce n'est ni une chose parmi les choses, ni un simple double de moi. Question : comment puis-je connaître une conscience qui n'est pas la mienne, et ai-je besoin d'elle pour être moi-même ?<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>Le problème de l’accès à autrui</div><div class='def-sec-body'>Le <em>cogito</em> de Descartes assure le sujet de sa propre pensée, pas de celle des autres : de sa fenêtre, il ne voit que des chapeaux et des manteaux, et c'est son jugement qui y met des hommes. D'où le risque du <strong>solipsisme</strong> (l'idée que seul mon esprit existe à coup sûr). Le raisonnement par analogie (ce corps agit comme le mien, il doit donc penser comme moi) reste fragile. Husserl répond qu'autrui n'est pas déduit mais <strong>apprésenté</strong> : je perçois son corps comme un corps vivant, habité, sans jamais accéder à son vécu.</div></div><div class='def-sec'><div class='def-sec-title'>Autrui, condition de la conscience de soi</div><div class='def-sec-body'>Pour Hegel, la conscience de soi ne se satisfait que <strong>reconnue</strong> par une autre : d'où la lutte pour la reconnaissance et la dialectique du maître et de l'esclave. Sartre décrit la <strong>honte</strong> : sous le regard d'autrui, je découvre l'objet que je suis pour lui. Autrui me révèle à moi-même, mais il peut aussi m'enfermer : la réplique de <em>Huis clos</em>, « L'enfer, c'est les autres », vise selon Sartre des rapports viciés, où l'on ne se juge plus que par le jugement d'autrui.</div></div><div class='def-sec'><div class='def-sec-title'>Autrui, exigence morale</div><div class='def-sec-body'>Kant demande de traiter l'humanité, en moi et en autrui, toujours comme une fin et jamais simplement comme un moyen. Levinas va plus loin : le <strong>visage</strong> d'autrui, nu et vulnérable, m'oblige avant même que je le connaisse ; la relation à autrui est d'abord éthique. Rousseau voyait déjà dans la <strong>pitié</strong> une répugnance naturelle à voir souffrir son semblable.</div></div></details>",
  sources: [
    "Descartes, <em>Méditations métaphysiques</em>, II (1641), texte de Wikisource (éd. Cousin)",
    "Hegel, <em>Phénoménologie de l’esprit</em>, IV, A (1807)",
    "Husserl, <em>Méditations cartésiennes</em>, V (1931, trad. Peiffer et Levinas)",
    "Sartre, <em>L’Être et le Néant</em>, III, 1 (1943) ; <em>Huis clos</em> (1944)",
    "Merleau-Ponty, <em>Phénoménologie de la perception</em>, II, 4 (1945)",
    "Levinas, <em>Totalité et infini</em> (1961) ; <em>Éthique et infini</em> (1982)",
    "Programme de philosophie de terminale de 2003 (BO n° 25 du 19 juin 2003), où « Autrui » était une notion",
    "Stanford Encyclopedia of Philosophy, article « Other Minds » (le problème des autres esprits)",
  ],
  auteurs: [
    {
      n: "Descartes",
      ideas: [
        {
          w: "Méditations métaphysiques, II (1641)",
          i: "Le cogito assure le sujet de sa propre existence, pas de celle des autres. De sa fenêtre, Descartes voit passer des chapeaux et des manteaux : rien, dans ce que voient ses yeux, ne prouve qu'ils ne couvrent pas des automates. Il juge que ce sont des hommes : autrui n'est pas vu, il est inféré par l'esprit. D'où le soupçon de <strong>solipsisme</strong>, que la philosophie d'après cherchera à lever.",
          new: true,
          citations: ["« que vois-je de cette fenêtre, sinon des chapeaux et des manteaux » (Méditation seconde)"],
          fiche: "De ma fenêtre je ne vois que chapeaux et manteaux : autrui n’est pas perçu, il est jugé par l’esprit (risque du solipsisme).",
        },
      ],
    },
    {
      n: "Hegel",
      ideas: [
        {
          w: "Phénoménologie de l’esprit, IV, A (1807)",
          i: "La conscience de soi ne se satisfait pas des choses : elle veut être <strong>reconnue</strong> par une autre conscience. D'où une lutte à mort pour la reconnaissance, où celui qui préfère la vie à la liberté devient l'esclave de l'autre. Mais le maître dépend de la reconnaissance d'un esclave qu'il méprise, tandis que l'esclave, par le travail, se forme lui-même. Je n'existe pleinement comme sujet que reconnu par un autre sujet.",
          new: true,
          citations: [
            "La conscience de soi n’atteint sa satisfaction que dans une autre conscience de soi (IV, reformulé)",
          ],
          fiche: "La conscience de soi exige d’être reconnue par une autre : lutte pour la reconnaissance, maître et esclave.",
        },
      ],
    },
    {
      n: "Husserl",
      ideas: [
        {
          w: "Méditations cartésiennes, V (1931)",
          i: "Comment l'ego, qui n'a accès qu'à ses propres vécus, peut-il avoir l'expérience d'un autre ego ? Par une <strong>apprésentation</strong> : je perçois le corps d'autrui comme un corps vivant, semblable au mien, habité par une conscience à laquelle je n'accède jamais directement. Autrui est donné comme celui dont le vécu m'échappe par principe ; et c'est avec les autres que se constitue un monde commun et objectif (l'<em>intersubjectivité</em>).",
          new: true,
          citations: ["Autrui m’est donné par apprésentation, jamais en original (Cinquième méditation, reformulé)"],
          fiche: "Autrui n’est pas déduit mais apprésenté : je perçois son corps comme habité, sans accéder à son vécu ; le monde objectif est intersubjectif.",
        },
      ],
    },
    {
      n: "Sartre",
      ideas: [
        {
          w: "L’Être et le Néant, III, 1 (1943) ; Huis clos (1944)",
          i: "Je regarde par le trou d'une serrure ; j'entends des pas : quelqu'un me voit. La <strong>honte</strong> me saisit : sous le regard d'autrui, je deviens un objet que je n'ai pas choisi d'être. Autrui me révèle à moi-même, mais il me fige aussi. Dans <em>Huis clos</em>, trois morts se torturent sous le regard les uns des autres. Sartre précisera en 1964 que la célèbre réplique vise des rapports tordus, où l'on dépend tout entier du jugement d'autrui.",
          new: true,
          citations: [
            "« autrui est le médiateur indispensable entre moi et moi-même » (L’Être et le Néant, III, 1)",
            "« L’enfer, c’est les autres » (Huis clos, scène 5)",
          ],
          fiche: "Le regard d’autrui me fait honte et me fige en objet : autrui est le médiateur entre moi et moi-même.",
        },
      ],
    },
    {
      n: "Merleau-Ponty",
      ideas: [
        {
          w: "Phénoménologie de la perception, II, 4, « Autrui et le monde humain » (1945)",
          i: "Contre Sartre, Merleau-Ponty refuse de faire du regard d'autrui une menace première. Autrui m'apparaît d'abord dans un monde commun, par son corps, ses gestes, sa parole. Dans le <strong>dialogue</strong>, ma pensée et la sienne se tissent ensemble : il me fait penser des pensées que je n'avais pas. Le regard qui transforme l'autre en objet ne vient que lorsque la communication est rompue.",
          new: true,
          citations: ["Dans le dialogue, il se constitue entre autrui et moi un terrain commun (II, 4, reformulé)"],
          fiche: "Autrui m’apparaît d’abord dans un monde commun ; dans le dialogue, nos pensées se tissent ensemble.",
        },
      ],
    },
    {
      n: "Levinas",
      ideas: [
        {
          w: "Totalité et infini (1961) ; Éthique et infini (1982)",
          i: "Connaître autrui, c'est encore le ramener à moi, à mes catégories. Mais le <strong>visage</strong> d'autrui, nu et vulnérable, résiste à cette prise : avant d'être un objet à connaître, il est une parole qui m'oblige. La relation à autrui est d'abord éthique : elle est responsabilité, sans réciprocité attendue.",
          new: true,
          citations: [
            "Le visage d’autrui n’est pas d’abord un objet à percevoir : il me commande (Éthique et infini, reformulé)",
          ],
          fiche: "Le visage d’autrui résiste à la connaissance et m’oblige : la relation à autrui est d’abord éthique.",
        },
      ],
    },
  ],
  textes: [
    {
      new: true,
      n: "Descartes — Des chapeaux et des manteaux (Méditations métaphysiques, II, 1641)",
      t: "« si par hasard je ne regardais d'une fenêtre des hommes qui passent dans la rue, à la vue desquels je ne manque pas de dire que je vois des hommes, tout de même que je dis que je vois de la cire ; et cependant que vois-je de cette fenêtre, sinon des chapeaux et des manteaux, qui pourraient couvrir des machines artificielles qui ne se remueraient que par ressorts ? mais je juge que ce sont des hommes ; et ainsi je comprends par la seule puissance de juger qui réside en mon esprit ce que je croyais voir de mes yeux. » Texte de l'édition Cousin (Wikisource), orthographe modernisée ; d'autres éditions portent « des spectres ou des hommes feints ». Descartes veut montrer que l'esprit connaît mieux que les sens ; mais l'exemple pose, sans le vouloir, le problème d'autrui : je ne perçois jamais directement une autre pensée.",
    },
  ],
  plans: [
    {
      new: true,
      q: "Ai-je besoin d’autrui pour être moi-même ?",
      intro: "Être soi semble l'affaire la plus intime qui soit : personne ne peut penser ni sentir à ma place. Pourtant c'est des autres que j'ai reçu ma langue, mon nom, mes manières, et c'est souvent dans leurs yeux que je découvre ce que je suis.",
      pb: "Si la conscience de soi est un rapport immédiat de moi à moi, autrui semble inutile, voire menaçant. Mais peut-on se connaître et se construire sans être reconnu ? Et si autrui est nécessaire, faut-il alors dépendre de son regard ?",
      axes: [
        {
          t: "Le moi semble se suffire : la conscience de soi est première",
          sps: [
            {
              new: true,
              t: "La certitude de soi précède celle d’autrui (Descartes)",
              args: "Le <em>cogito</em> est la première certitude : je suis certain de penser avant d'être certain qu'il existe d'autres esprits. Autrui n'est qu'inféré, par un jugement, à partir de chapeaux et de manteaux vus d'une fenêtre.",
              auteurs: "Descartes",
              ref: "Descartes, Méditations métaphysiques, II",
              limite: "Mais une conscience qui ne connaît qu'elle-même risque le solipsisme.",
            },
            {
              new: true,
              t: "Se connaître sans le monde (Avicenne)",
              args: "L'homme volant d'Avicenne, privé de toute sensation, sait encore qu'il existe : la conscience de soi ne doit rien au corps ni aux autres.",
              auteurs: "Avicenne",
              ref: "Avicenne, Livre de la guérison, De l’âme, I, 1",
              limite: "Cette conscience nue sait qu'elle est, mais pas qui elle est.",
            },
          ],
          limite: "Savoir que je suis n'est pas savoir qui je suis : pour cela, il faut un autre.",
        },
        {
          t: "Autrui est le médiateur entre moi et moi-même",
          sps: [
            {
              new: true,
              t: "La lutte pour la reconnaissance (Hegel)",
              args: "La conscience de soi ne se satisfait que reconnue par une autre conscience. Le maître, reconnu par un esclave qu'il méprise, n'obtient qu'une reconnaissance pauvre ; l'esclave, par le travail, se forme lui-même.",
              auteurs: "Hegel",
              ref: "Hegel, Phénoménologie de l’esprit, IV, A",
              limite: "La reconnaissance passe ici par le conflit.",
            },
            {
              new: true,
              t: "La honte et le regard (Sartre)",
              args: "Surpris à regarder par le trou d'une serrure, j'ai honte : je découvre l'objet que je suis pour autrui. « Autrui est le médiateur indispensable entre moi et moi-même. »",
              auteurs: "Sartre",
              ref: "Sartre, L’Être et le Néant, III, 1",
              limite: "Mais ce regard me fige : dépendre du jugement d'autrui peut devenir un enfer (Huis clos).",
            },
          ],
          limite: "Autrui est nécessaire ; reste à savoir si la relation doit être conflit ou dépendance.",
        },
        {
          t: "Être soi avec autrui : la rencontre plutôt que le regard",
          sps: [
            {
              new: true,
              t: "Le dialogue et le monde commun (Merleau-Ponty)",
              args: "Avant d'être un regard qui me juge, autrui est un partenaire dans un monde commun. Dans le dialogue, il me fait penser des pensées que je n'avais pas : il m'enrichit au lieu de m'aliéner.",
              auteurs: "Merleau-Ponty",
              ref: "Merleau-Ponty, Phénoménologie de la perception, II, 4",
              limite: "Le dialogue suppose déjà une confiance qui peut manquer.",
            },
            {
              new: true,
              t: "La responsabilité pour autrui (Levinas)",
              args: "Le visage d'autrui m'oblige avant toute connaissance. Je deviens moi-même en répondant de lui : mon identité n'est pas une possession, c'est une réponse.",
              auteurs: "Levinas",
              ref: "Levinas, Totalité et infini ; Éthique et infini",
              limite: "Exigence infinie : la justice devra la partager entre tous (le tiers).",
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
      tag: "Histoire",
      tit: "Victor, l’enfant sauvage de l’Aveyron",
      body: "Capturé en 1800 dans les bois de l'Aveyron, vers l'âge de douze ans, Victor avait grandi seul. Le jeune médecin Jean Itard tente de l'éduquer pendant plusieurs années : Victor fait des progrès, mais n'apprend jamais à parler. L'humanité de l'homme (le langage, la conscience de soi telle que nous la connaissons) ne se développe pas sans les autres.",
      lien: "→ Langage, Conscience",
    },
    {
      new: true,
      tag: "Société",
      tit: "Exister sous le regard des réseaux",
      body: "Une photo publiée attend ses réactions : le nombre de « j'aime » devient une mesure de soi. C'est le regard d'autrui selon Sartre, démultiplié : il me révèle à moi-même mais peut aussi m'enfermer dans une image. La question de Hegel revient sous une forme nouvelle : quelle reconnaissance cherche-t-on, et auprès de qui ?",
      lien: "→ Conscience, Liberté",
    },
  ],
  accroches: [
    {
      new: true,
      type: "Expérience de pensée",
      t: "Si tu étais le dernier être humain sur Terre, saurais-tu encore qui tu es ? Et en quelle langue penserais-tu ?",
    },
  ],
  liens: ["Conscience", "Devoir", "Langage", "Liberté", "Désir"],
  diss: [
    {new: true, q: "Autrui est-il un autre moi ?"},
    {new: true, q: "Peut-on connaître autrui ?"},
    {new: true, q: "Le regard d’autrui me rend-il étranger à moi-même ?"},
    {new: true, q: "Avons-nous des devoirs envers autrui ?"},
  ],
});
