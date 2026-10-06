/* Notion « Perception » : percevoir, est-ce connaître ?
   HORS PROGRAMME (étape 5) : notion du programme de 2003, absente de celui de 2019.
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("perception", {
  c: "#3E8E9E",
  l: "Perception",
  s: "Percevoir, est-ce connaître ?",
  def: "La <span class='kw'>perception</span> est l'acte par lequel un sujet saisit, par les sens, un objet comme présent hors de lui : cette table, ce bruit dans la rue. Elle se distingue de la <strong>sensation</strong>, simple impression reçue (une couleur, une chaleur) : percevoir, c'est déjà organiser des sensations en objets. Question : la perception nous donne-t-elle le monde tel qu'il est, ou déjà une interprétation ?<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>Percevoir, est-ce juger ?</div><div class='def-sec-body'>Un morceau de cire approché du feu change de couleur, d'odeur, de forme ; pourtant Descartes dit que c'est la même cire : ce ne sont donc pas les sens qui la connaissent, mais l'esprit qui juge. Alain le montre avec un cube : je n'en vois jamais les six faces égales, et pourtant je perçois un cube. La perception anticipe, et l'illusion est une erreur de jugement plus qu'une erreur des sens.</div></div><div class='def-sec'><div class='def-sec-title'>D'où viennent nos idées ?</div><div class='def-sec-body'>Pour les empiristes, toute connaissance commence par les sens. Locke distingue les qualités premières (étendue, figure, mouvement), qui sont dans les choses, et les qualités secondes (couleur, saveur), qui n'existent que pour nous. Condillac imagine une statue à qui l'on ouvre les sens un à un : percevoir des objets extérieurs s'apprend, grâce au toucher. Berkeley va jusqu'au bout : être, pour une chose sensible, c'est être perçu.</div></div><div class='def-sec'><div class='def-sec-title'>Une perception vécue</div><div class='def-sec-body'>Merleau-Ponty refuse de choisir entre la sensation et le jugement : percevoir, c'est l'engagement de notre corps dans le monde. Nous percevons des formes sur un fond, des objets à portée de main, avant de les penser (c'est aussi la leçon de la psychologie de la forme). Bergson ajoute que notre perception est réglée par l'action : nous ne retenons des choses que ce qui nous sert, et l'artiste nous apprend à voir davantage.</div></div></details>",
  sources: [
    "Descartes, <em>Méditations métaphysiques</em>, II (1641), texte de Wikisource (éd. Cousin)",
    "Berkeley, <em>Traité des principes de la connaissance humaine</em> (1710)",
    "Condillac, <em>Traité des sensations</em> (1754)",
    "Alain, <em>Éléments de philosophie</em> (1941 ; d'abord <em>Quatre-vingt-un chapitres sur l'esprit et les passions</em>, 1917)",
    "Bergson, <em>Le Rire</em>, III (1900)",
    "Merleau-Ponty, <em>Phénoménologie de la perception</em> (1945)",
    "Held et al., « The newly sighted fail to match seen with felt », <em>Nature Neuroscience</em> (2011), sur le problème de Molyneux",
    "Programme de philosophie de terminale de 2003 (BO n° 25 du 19 juin 2003), où « La perception » était une notion",
  ],
  auteurs: [
    {
      n: "Descartes",
      ideas: [
        {
          w: "Méditations métaphysiques, II (1641)",
          i: "Un morceau de cire sorti de la ruche a sa couleur, son odeur, sa dureté, il rend un son quand on le frappe. Approché du feu, tout cela change ; pourtant c'est la même cire. Ce ne sont donc ni les sens ni l'imagination qui la connaissent, mais l'entendement : percevoir, au sens fort, c'est juger. La perception peut être confuse ou claire selon l'attention de l'esprit.",
          new: true,
          citations: [
            "« sa perception n'est point une vision, ni un attouchement, ni une imagination [...] mais seulement une inspection de l'esprit » (Méditation seconde)",
          ],
          fiche: "La cire change sous le feu mais reste la même : ce n'est pas un sens qui la connaît, c'est l'esprit qui juge.",
        },
      ],
    },
    {
      n: "Berkeley",
      ideas: [
        {
          w: "Traité des principes de la connaissance humaine (1710)",
          i: "Nous ne percevons jamais une matière derrière les qualités : seulement des couleurs, des formes, des résistances, c'est-à-dire des idées. Distinguer, comme Locke, des qualités premières (dans les choses) et secondes (en nous) ne tient pas : l'étendue elle-même n'est jamais perçue sans couleur, et varie avec le point de vue. Une chose sensible n'est rien d'autre que ce qui en est perçu.",
          new: true,
          citations: ["« Esse est percipi » : leur être est d'être perçu (§ 3)"],
          fiche: "On ne perçoit que des idées, jamais une matière derrière elles : être, pour une chose sensible, c'est être perçu.",
        },
      ],
    },
    {
      n: "Condillac",
      ideas: [
        {
          w: "Traité des sensations (1754)",
          i: "La statue qui ne sent qu'une odeur de rose devient cette odeur : elle ne perçoit encore aucun objet hors d'elle. C'est le toucher, en rencontrant des résistances, qui lui apprend à distinguer son corps et des corps extérieurs ; il éduque ensuite la vue, qui seule ne verrait que des couleurs. Percevoir un monde d'objets n'est pas donné : cela s'apprend.",
          new: true,
          citations: [
            "Le toucher apprend aux autres sens à juger des objets extérieurs (Traité des sensations, III, reformulé)",
          ],
          fiche: "La statue ne perçoit d'abord aucun objet : c'est le toucher qui apprend aux autres sens à juger du monde extérieur.",
        },
      ],
    },
    {
      n: "Alain",
      ideas: [
        {
          w: "Éléments de philosophie (1941 ; d'abord 1917)",
          i: "Je ne vois jamais un cube tel qu'il est, six faces carrées égales : je vois des losanges, des ombres, au mieux trois faces. Pourtant je perçois un cube. La perception est donc une anticipation, un jugement qui dépasse ce que donnent les sens ; et l'illusion n'est pas une faute des sens, qui ne disent rien, mais une erreur de ce jugement.",
          new: true,
          citations: [
            "Percevoir un cube, c'est juger qu'il a six faces égales que je ne vois jamais ensemble (reformulé)",
          ],
          fiche: "Je ne vois jamais les six faces du cube, et pourtant je le perçois : la perception est un jugement qui anticipe.",
        },
      ],
    },
    {
      n: "Bergson",
      ideas: [
        {
          w: "Le Rire, III (1900)",
          i: "Nous ne voyons pas les choses mêmes : nous nous bornons le plus souvent à lire les étiquettes collées sur elles. Notre perception est réglée par l'action : elle retient de chaque chose ce qui nous est utile et la range dans un genre que le mot désigne. L'artiste, plus détaché de l'action, voit davantage, et son œuvre nous apprend à voir.",
          new: true,
          citations: [
            "« Le mot, qui ne note de la chose que sa fonction la plus commune et son aspect banal, s'insinue entre elle et nous » (Le Rire, chap. III)",
          ],
          fiche: "Nous lisons des étiquettes plutôt que nous ne voyons les choses : la perception est réglée par l'action.",
        },
      ],
    },
    {
      n: "Merleau-Ponty",
      ideas: [
        {
          w: "Phénoménologie de la perception (1945)",
          i: "La perception n'est ni une addition de sensations (comme le veut l'empirisme) ni un jugement de l'esprit (comme le veut l'intellectualisme). Elle est l'ouverture première de notre corps au monde : je perçois des formes sur un fond, des objets à portée de main, des visages, avant de les penser. Le monde perçu est le sol de toute connaissance, y compris scientifique.",
          new: true,
          citations: ["Le monde n'est pas ce que je pense, mais ce que je vis (Avant-propos, reformulé)"],
          fiche: "Percevoir n'est ni sentir ni juger : c'est l'ouverture du corps au monde, sol de toute connaissance.",
        },
      ],
    },
  ],
  textes: [
    {
      new: true,
      n: "Descartes — Le morceau de cire (Méditations métaphysiques, II, 1641)",
      t: "« Or ce qui est ici grandement à remarquer, c'est que sa perception n'est point une vision, ni un attouchement, ni une imagination, et ne l'a jamais été, quoiqu'il le semblât ainsi auparavant, mais seulement une inspection de l'esprit, laquelle peut être imparfaite et confuse, comme elle était auparavant, ou bien claire et distincte, comme elle est à présent, selon que mon attention se porte plus ou moins aux choses qui sont en elle, et dont elle est composée. » Texte de l'édition Cousin (Wikisource), orthographe modernisée. Tout ce que les sens disaient de la cire a changé au feu ; ce qui demeure ne se voit pas, il se conçoit. Percevoir au sens fort est un acte de l'esprit.",
    },
  ],
  plans: [
    {
      new: true,
      q: "Percevoir, est-ce connaître ?",
      intro: "On dit « je l'ai vu de mes yeux » pour clore une discussion : la perception passe pour la preuve la plus sûre. Pourtant le bâton plongé dans l'eau paraît brisé, et deux témoins d'un même accident ne racontent pas la même chose.",
      pb: "Si percevoir, c'est seulement recevoir ce que donnent les sens, la perception est trompeuse et ne saurait être une connaissance. Mais toute connaissance ne commence-t-elle pas par elle ? Et la perception n'est-elle pas déjà une manière de comprendre le monde ?",
      axes: [
        {
          t: "Percevoir n'est pas encore connaître : les sens trompent",
          sps: [
            {
              new: true,
              t: "La cire et l'inspection de l'esprit (Descartes)",
              args: "Tout ce que les sens saisissent de la cire change au feu ; ce qui la fait connaître comme la même cire est un jugement de l'esprit. La perception sensible, seule, n'est pas une connaissance.",
              auteurs: "Descartes",
              ref: "Descartes, Méditations métaphysiques, II",
              limite: "Mais ce jugement s'exerce sur ce que les sens lui donnent.",
            },
            {
              new: true,
              t: "On ne perçoit que des idées (Berkeley)",
              args: "Nous ne percevons jamais la matière elle-même, seulement des qualités qui n'existent que pour nous. La perception ne nous fait pas sortir de nos idées.",
              auteurs: "Berkeley",
              ref: "Berkeley, Principes, § 3",
              limite: "Si l'on suit Berkeley, il n'y a plus rien à connaître derrière la perception.",
            },
          ],
          limite: "Pourtant, sans perception, de quoi l'esprit jugerait-il ?",
        },
        {
          t: "Mais toute connaissance commence par la perception, qui est déjà un jugement",
          sps: [
            {
              new: true,
              t: "Apprendre à percevoir (Condillac)",
              args: "Le toucher apprend aux autres sens à juger des objets extérieurs : percevoir un monde s'apprend, et c'est le premier de nos savoirs.",
              auteurs: "Condillac",
              ref: "Condillac, Traité des sensations, III",
              limite: "Le problème de Molyneux montre que la vue retrouvée ne reconnaît pas d'emblée ce que la main connaissait.",
            },
            {
              new: true,
              t: "Le cube et l'anticipation (Alain)",
              args: "Je ne vois jamais les six faces du cube, et je le perçois pourtant : la perception est une connaissance en acte, qui peut se tromper et se corriger.",
              auteurs: "Alain",
              ref: "Alain, Éléments de philosophie",
              limite: "Si percevoir, c'est juger, que reste-t-il de propre au sensible ?",
            },
          ],
          limite: "Ni simple réception ni simple jugement : il faut repenser ce qu'est percevoir.",
        },
        {
          t: "La perception est un rapport vécu au monde, sol de la connaissance mais réglé par l'action",
          sps: [
            {
              new: true,
              t: "Le primat de la perception (Merleau-Ponty)",
              args: "Avant de juger, mon corps est engagé dans le monde : la perception est le sol sur lequel se construit toute science, qui ne fait que la préciser.",
              auteurs: "Merleau-Ponty",
              ref: "Merleau-Ponty, Phénoménologie de la perception",
              limite: "Ce sol n'est pas neutre : nous percevons selon nos besoins.",
            },
            {
              new: true,
              t: "Voir au-delà des étiquettes (Bergson)",
              args: "Notre perception ne retient que l'utile ; l'art élargit la perception et nous fait voir ce que nous ne remarquions pas.",
              auteurs: "Bergson",
              ref: "Bergson, Le Rire, III",
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
      tag: "Science",
      tit: "Le problème de Molyneux",
      body: "En 1688, William Molyneux demande à Locke : un aveugle de naissance qui recouvrerait la vue distinguerait-il, sans les toucher, un cube d'une sphère ? Locke et Berkeley répondent que non. En 2011, une étude sur des enfants opérés de la cataracte en Inde (Held et al., <em>Nature Neuroscience</em>) leur donne raison : juste après l'opération, ils ne reconnaissent pas à la vue les formes qu'ils connaissent au toucher, mais l'apprennent en quelques jours.",
      lien: "→ Science, Conscience",
    },
    {
      new: true,
      tag: "Expérience",
      tit: "L'illusion de Müller-Lyer",
      body: "Deux segments de même longueur, l'un terminé par des flèches ouvertes, l'autre par des flèches fermées : le premier paraît plus long. On peut les mesurer, savoir qu'ils sont égaux, et continuer à les voir inégaux. L'exemple résiste à Alain (l'illusion ne disparaît pas quand le jugement est corrigé) et donne raison à ceux qui voient dans la perception autre chose qu'un jugement.",
      lien: "→ Vérité, Science",
    },
  ],
  accroches: [
    {new: true, type: "Question", t: "Le ciel est-il bleu, ou est-ce seulement toi qui le vois bleu ?"},
  ],
  liens: ["Conscience", "Vérité", "Science", "Art", "Langage"],
  diss: [
    {new: true, q: "Percevoir, est-ce connaître ?"},
    {new: true, q: "Nos sens nous trompent-ils ?"},
    {new: true, q: "Voyons-nous le monde tel qu'il est ?"},
    {new: true, q: "Faut-il apprendre à percevoir ?"},
  ],
});
