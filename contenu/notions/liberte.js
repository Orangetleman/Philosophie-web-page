/* Notion « Liberté » : Sommes-nous vraiment libres ?
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("liberte", {
  c: "#D4537E",
  l: "Liberté",
  s: "Sommes-nous vraiment libres ?",
  def: "La <span class='kw'>liberté</span> peut être négative (absence de contraintes), positive (capacité d'agir selon sa raison) ou politique (participation à la loi commune). Enjeu : la liberté est-elle compatible avec le déterminisme ? Avec la morale ? Avec l'État ? Est-elle donnée ou conquise ?<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>Trois conceptions classiques</div><div class='def-sec-body'><strong>Liberté négative</strong> (Isaiah Berlin) : absence d'obstacles, de contraintes extérieures — « être libre de ». Mill : la seule limite légitime à la liberté est la nuisance à autrui. <strong>Liberté positive</strong> : capacité d'agir selon sa propre raison, autonomie — « être libre pour ». Kant : l'autonomie morale (se donner sa propre loi) est la vraie liberté. <strong>Liberté politique</strong> : participation à la loi commune (Rousseau : l'obéissance à la loi qu'on s'est prescrite est liberté).</div></div><div class='def-sec'><div class='def-sec-title'>Déterminisme et libre arbitre</div><div class='def-sec-body'>D'Holbach : déterminisme radical — tout est causé, la liberté est une illusion née de l'ignorance de nos causes. Spinoza : le libre arbitre est une illusion, mais la vraie liberté est d'agir selon sa nature rationnelle (nécessité comprise). Freud : l'inconscient détermine nos actes à notre insu. Sartre : l'homme est « condamné à être libre » — l'existence précède l'essence, la mauvaise foi consiste à se croire déterminé.</div></div><div class='def-sec'><div class='def-sec-title'>Liberté et connaissance</div><div class='def-sec-body'>Spinoza : « La liberté n'est pas l'indépendance mais la nécessité comprise. » Engels (<em>Anti-Dühring</em>) : la liberté consiste dans l'empire sur nous-mêmes fondé sur la connaissance des nécessités naturelles — « on ne peut commander à la nature qu'en lui obéissant ». Bourdieu : connaître les déterminismes sociaux qui nous conditionnent est la condition d'une liberté effective. La cure psychanalytique vise le même objectif.</div></div><div class='def-sec'><div class='def-sec-title'>Liberté civile et État de droit</div><div class='def-sec-body'>Hobbes : la liberté civile (limitée par la loi) est préférable à la liberté naturelle (totale mais infructueuse dans l'état de guerre). Montesquieu : « La liberté ne peut consister qu'à faire ce que les lois permettent. » Tocqueville : le despotisme doux menace les démocraties modernes — la liberté exige la vigilance active des citoyens et leur participation à la vie politique.</div></div></details>",
  auteurs: [
    {
      n: "Kant",
      ideas: [
        {
          w: "Fondements de la métaphysique des mœurs, 1785",
          i: "Liberté = autonomie : se donner sa propre loi. L'hétéronomie (obéir aux désirs, au bonheur, à une autorité) n'est pas la vraie liberté. L'homme est libre dans l'ordre noumènal (raison), déterminé dans le phénoménal (nature).",
          fiche: "Liberté = autonomie : se donner sa propre loi (raison), contre l'hétéronomie (désirs, autorité). Libre comme noumène, déterminé comme phénomène.",
          citations: ["« L'autonomie de la volonté est le principe suprême de la moralité »"],
        },
      ],
    },
    {
      n: "Sartre",
      ideas: [
        {
          w: "L'Être et le Néant, 1943",
          i: "Condamné à être libre : l'homme n'a pas de nature préalable, il se définit par ses actes. La mauvaise foi = se prendre pour une chose déterminée pour fuir l'angoisse de la liberté. L'existence précède l'essence.",
          fiche: "« Condamné à être libre » : pas de nature préalable, l'homme se fait par ses actes ; se croire chose déterminée, c'est la mauvaise foi.",
          citations: ["« Je suis condamné à être libre »"],
        },
      ],
    },
    {
      n: "Spinoza",
      ideas: [
        {
          w: "Éthique, 1677",
          i: "La liberté n'est pas le libre arbitre mais la nécessité comprise. L'homme libre agit selon sa nature propre (raison), non par contrainte externe. Pas de liberté contre la nécessité, mais dans la nécessité.",
          fiche: "La liberté n'est pas le libre arbitre mais la nécessité comprise : est libre qui agit selon sa seule nature (raison), non par contrainte externe.",
          citations: ["« Est libre la chose qui existe par la seule nécessité de sa nature »"],
        },
      ],
    },
    {
      n: "Rousseau",
      ideas: [
        {
          w: "Du Contrat social, 1762",
          i: "Liberté naturelle (illimitée mais solitaire) vs liberté civile (limitée mais garantie par la loi). 'L'obéissance à la loi qu'on s'est prescrite est liberté.' La liberté civile est plus haute que la liberté naturelle.",
          fiche: "La liberté civile — obéir à la loi qu'on s'est prescrite — est plus haute que la liberté naturelle, illimitée mais solitaire.",
          citations: ["« L'obéissance à la loi qu'on s'est prescrite est liberté »"],
        },
      ],
    },
    {
      n: "Mill",
      ideas: [
        {
          w: "De la liberté, 1859",
          i: "Principe de non-nuisance : la seule limite légitime à la liberté individuelle est la nuisance à autrui. Liberté d'expression, de pensée, d'association sont absolues. Critique du despotisme de la majorité.",
          fiche: "Principe de non-nuisance : la seule limite légitime à ma liberté est le tort fait à autrui ; libertés de pensée et d'expression absolues.",
          citations: [
            "« Le seul but légitime pour lequel on peut restreindre la liberté, c'est la protection d'autrui »",
          ],
        },
      ],
    },
    {
      n: "Freud",
      ideas: [
        {
          w: "Malaise dans la civilisation, 1930",
          i: "La liberté est limitée par les pulsions inconscientes et les contraintes de la civilisation. Le sentiment de liberté est en partie illusoire : des forces inconscientes orientent nos choix à notre insu.",
          fiche: "Le sentiment de liberté est en partie illusoire : pulsions inconscientes et contraintes de la civilisation orientent nos choix à notre insu.",
          citations: ["L'inconscient limite notre sentiment de liberté"],
        },
      ],
    },
    {
      n: "D'Holbach",
      ideas: [
        {
          w: "Système de la nature, 1770",
          i: "Déterminisme physique radical : l'homme ne fait jamais que ce que la nature le détermine à faire. Nous croyons être libres parce que nous ignorons les causes qui nous meuvent. 'C'est la grande complication de nos mouvements [...] qui nous persuadent que nous sommes libres.' La liberté de l'homme est une illusion née de son ignorance.",
          fiche: "Déterminisme radical : l'homme ne fait que ce que la nature le détermine à faire ; il se croit libre car il ignore les causes qui le meuvent.",
          citations: ["« L'homme ne fait jamais que ce que nature le détermine à faire »"],
        },
      ],
    },
    {
      n: "Épictète",
      ideas: [
        {
          w: "Manuel (Ier-IIe s. ap. J.-C.)",
          i: "La vraie liberté est intérieure : distinguer ce qui dépend de nous (représentations, jugements, désirs) de ce qui n'en dépend pas (corps, richesse, réputation). La liberté stoïcienne = empire du sage sur ses propres représentations. Accepter ce qu'on ne peut changer, maîtriser ce qu'on peut.",
          fiche: "Liberté intérieure stoïcienne : distinguer ce qui dépend de nous (nos jugements) de ce qui n'en dépend pas ; maîtriser ses représentations, accepter le reste.",
          citations: [
            "« Cherche non que les choses qui arrivent arrivent comme tu veux, mais désire que les choses qui arrivent soient comme elles sont »",
          ],
        },
      ],
    },
    {
      n: "Tocqueville",
      ideas: [
        {
          w: "De la démocratie en Amérique, 1840",
          i: "La démocratie peut dériver vers un despotisme doux et tutélaire si les citoyens sont passifs. L'État bienveillant prend tout en charge, réduisant les citoyens à un troupeau timide et industrieux. La vigilance active des citoyens envers leurs représentants est la condition de la liberté civile.",
          fiche: "La démocratie peut glisser vers un « despotisme doux » si les citoyens, passifs, délèguent tout ; la liberté exige leur vigilance active.",
          citations: ["« La démocratie peut dégénérer en despotisme doux si les citoyens abdiquent leur vigilance »"],
        },
      ],
    },
    {
      n: "Sartre",
      ideas: [
        {
          w: "L'Existentialisme est un humanisme, 1945",
          i: "Thèse centrale : l'existence précède l'essence — l'homme n'a pas de nature prédéfinie, il se définit uniquement par ses actes. La liberté est totale et inévitable : 'L'homme est condamné à être libre.' Chaque acte engage une image de l'humanité entière : 'En me choisissant, je choisis l'homme.' La lâcheté est un choix répété (mauvaise foi), pas un tempérament. L'homme n'est rien d'autre que l'ensemble de ses actes.",
          fiche: "« L'existence précède l'essence » : l'homme se définit par ses actes et, en se choisissant, engage l'humanité entière.",
          citations: ["« L'existence précède l'essence » — « L'homme est condamné à être libre »"],
        },
      ],
    },
    {
      n: "Bourdieu",
      ideas: [
        {
          w: "Leçon sur la leçon, 1982",
          i: "La connaissance sociologique est libératrice : connaître les mécanismes de la reproduction sociale permet de les maîtriser et d'y introduire des éléments modificateurs. La violence symbolique tire son efficacité de la méconnaissance — la connaissance la désamorce. Bourdieu répond à Sartre : la liberté n'est pas pure spontanéité, elle est conditionnée par des structures sociales, mais leur connaissance ouvre un espace de liberté réelle.",
          fiche: "Connaître les déterminismes sociaux est libérateur : comprendre la reproduction et la violence symbolique ouvre un espace de liberté réelle.",
          citations: ["La connaissance des déterminismes sociaux est la condition d'une liberté effective"],
        },
      ],
    },
    {
      n: "Engels",
      ideas: [
        {
          w: "Anti-Dühring, 1878",
          i: "La liberté n'est pas indépendance des lois naturelles mais connaissance de ces lois et capacité à les mettre en œuvre méthodiquement. L'arbitraire apparent (choisir sans comprendre) est non-liberté ; la nécessité comprise (agir en connaissance de cause) est vraie liberté. 'La liberté consiste dans l'empire sur nous-mêmes et sur la nature extérieure, fondée sur la connaissance des nécessités naturelles.'",
          fiche: "La liberté n'est pas l'absence de lois naturelles mais leur connaissance et leur maîtrise : la nécessité comprise, non l'arbitraire aveugle.",
          citations: [
            "« La liberté consiste dans la connaissance des nécessités naturelles et la capacité à les utiliser »",
          ],
        },
      ],
    },
    {
      n: "Hannah Arendt",
      ideas: [
        {
          w: "La Liberté d'être libre, écrit en 1966-1967 et publié en 2017",
          i: "La liberté n'est pas d'abord un fait <em>intérieur</em> (le libre arbitre de la volonté) mais une expérience <strong>politique</strong> et mondaine : elle n'<em>apparaît</em> que dans l'<strong>action</strong>, au milieu d'une <strong>pluralité</strong> d'hommes égaux. Être libre ne se réduit donc pas à « n'obéir à personne » (une indépendance solitaire) : c'est commencer quelque chose de neuf <em>avec</em> les autres, dans l'espace public.",
          new: true,
          citations: [],
        },
      ],
    },
  ],
  textes: [
    {
      n: "Kant — autonomie vs hétéronomie",
      t: "Hétéronomie : obéir à ses désirs, à la recherche du bonheur, à une autorité externe. Autonomie : obéir à la loi que la raison se donne à elle-même. Seule l'autonomie est vraie liberté morale.",
    },
    {
      n: "Sartre — mauvaise foi",
      t: "Le garçon de café joue à être garçon de café : en adoptant parfaitement son rôle, il nie sa liberté (être-en-soi). La mauvaise foi est une fuite de l'angoisse de la liberté.",
    },
    {
      n: "Rousseau — liberté civile et loi",
      t: "En entrant dans la société, on aliène la liberté naturelle mais on gagne la liberté civile et morale. La loi juste est celle qu'on s'est donnée à soi-même (volonté générale). 'L'obéissance à la loi qu'on s'est prescrite est liberté.'",
    },
    {
      n: "Spinoza — nécessité et liberté",
      t: "Le libre arbitre est une illusion : tout a une cause. Mais agir librement = agir selon sa nature propre (raison), non sous contrainte externe. La connaissance des causes libère.",
    },
    {
      n: "Sartre, L'existentialisme est un humanisme — extrait 3",
      t: "Responsabilité universelle : en choisissant pour moi, je choisis pour l'humanité entière. 'En me choisissant, je choisis l'humanité entière.' La mauvaise foi (le lâche) : c'est une lâcheté construite par ses actes, non une nature. Existence précède l'essence.",
    },
    {
      n: "D'Holbach, Système de la nature",
      t: "Déterminisme physique : 'C'est la grande complication de nos mouvements, l'interruption qui nous persuadent que nous sommes libres.' Les hommes sont semblables à un nageur emporté par le courant : ils se croient libres parce qu'ils ignorent les lois qui les meuvent. La liberté n'est qu'une illusion née de l'ignorance des causes.",
    },
    {
      n: "Spinoza, Lettre 58 à Schuller",
      t: "L'homme croit être libre parce qu'il a conscience de ses désirs mais ignore les causes qui les déterminent. Exemple de la pierre lancée : si elle avait conscience d'elle-même, elle se croirait libre. La liberté n'est pas l'absence de cause, c'est l'ignorance de la cause.",
    },
    {
      n: "Freud, Introduction à la psychanalyse — triple blessure",
      t: "La science a infligé trois blessures à l'égoïsme naïf de l'humanité : (1) cosmologique — Copernic : la Terre n'est pas le centre ; (2) biologique — Darwin : l'homme descend de l'animal ; (3) psychologique — Freud : 'Le moi n'est pas maître dans sa propre maison.' Nos actions sont déterminées par des forces inconscientes.",
    },
    {
      n: "Sartre, L'Être et le Néant — extrait 1",
      t: "Critique de la psychanalyse : la censure freudienne doit être de mauvaise foi. Pour refouler quelque chose, il faut d'abord en avoir conscience — ce qui contredit l'idée d'un inconscient vraiment opaque. La censure doit choisir ce qu'elle refoule, donc avoir une conscience de sa propre activité.",
    },
    {
      n: "Sartre, L'Être et le Néant — extrait 2",
      t: "La liberté en situation : même si je ne peux pas changer mon passé ou mon corps, j'ai toujours la capacité de me définir par mon projet. Jean Genet, né de parents inconnus et voleur dès l'enfance, se définit par ses actes futurs. La liberté n'est pas absence de contraintes mais puissance de se projeter autrement.",
    },
    {
      n: "Rousseau, Du contrat social, chap.6 — Du pacte social",
      t: "Le contrat social permet de gagner 'l'équivalent de tout ce qu'on perd et plus de force pour conserver ce que l'on a.' La liberté civile obtenue dans et par la loi commune est supérieure à la liberté naturelle illimitée mais fragile. 'Se donnant à tous, on ne se donne à personne.'",
    },
    {
      n: "Kant, Critique de la Raison Pratique",
      t: "Preuve de l'existence de la liberté par l'expérience du devoir. Nous savons que nous sommes libres parce que nous savons que nous devons. L'impératif catégorique : la loi morale s'impose d'elle-même à la raison, distinct de la contrainte et de la nécessité naturelle.",
    },
    {
      n: "Engels, Anti-Dühring",
      t: "Contre le déterminisme physique paralysant : la liberté ne consiste pas à s'affranchir des lois de la nature, mais à les connaître et à les utiliser. 'On ne peut commander à la nature qu'en lui obéissant.' La connaissance du déterminisme est la condition de son dépassement.",
    },
    {
      n: "Sartre, L'Existentialisme est un humanisme — plan de l'œuvre",
      t: "I. Défense (l'existence précède l'essence) / II. L'homme face à sa liberté ('condamné à être libre') / III. L'action contre le déterminisme (la lâcheté = choix répété, pas tempérament) / IV. L'intersubjectivité et l'universel ('en me choisissant, je choisis l'homme') / V. L'humanisme existentialiste. Citations clés : 'L'existence précède l'essence' — « L'homme est condamné à être libre » — 'L'homme n'est rien d'autre que l'ensemble de ses actes' — 'La vie n'a pas de sens a priori, c'est à vous de lui donner un sens.'",
    },
    {
      n: "Bourdieu, Leçon sur la leçon (1982) — connaissance libératrice",
      t: "La connaissance sociologique est libératrice : connaître les mécanismes de la reproduction sociale permet de les maîtriser et d'y introduire des éléments modificateurs. La violence symbolique tire son efficacité de la méconnaissance — la connaissance la désamorce. Bourdieu répond à Sartre : la liberté n'est pas pure spontanéité, elle est conditionnée par les structures sociales, mais leur connaissance ouvre un espace de liberté réelle.",
    },
  ],
  exemples: [
    {
      tag: "Cinéma",
      tit: "Matrix (1999)",
      body: "Les humains vivent dans une simulation en croyant être libres. Néo découvre qu'il est déterminé par un programme. La pilule rouge = choix de la vérité et de la vraie liberté vs confort de l'illusion. Illustration de l'opposition Spinoza/Sartre sur le libre arbitre.",
      lien: "→ Spinoza (illusion libre arbitre), Sartre (choix radical)",
    },
    {
      tag: "Histoire",
      tit: "L'esclavage antique et moderne",
      body: "L'esclave est l'exemple limite de la privation de liberté. Pour Arendt, les Anciens légitimaient l'esclavage car le travail servile abaissait l'homme au rang d'animal. Pour Marx, le salariat est une forme moderne d'esclavage.",
      lien: "→ Arendt (labor), Marx, Hegel (maître/esclave)",
    },
    {
      tag: "Philosophie",
      tit: "Le garçon de café de Sartre",
      body: "Sartre décrit un garçon de café qui joue parfaitement son rôle : mouvements trop précis, trop vifs, trop certains. Il est de mauvaise foi car il se traite comme une chose (être-en-soi) pour fuir l'angoisse de sa liberté.",
      lien: "→ Sartre (mauvaise foi), conscience",
    },
    {
      tag: "Droit",
      tit: "Droits et libertés fondamentaux (DDHC 1789)",
      body: "La Déclaration des droits de l'homme pose que la liberté est le droit naturel de l'homme : 'La liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui.' Reprise du principe de non-nuisance de Locke et Mill.",
      lien: "→ Mill, Locke, État, justice",
    },
    {
      tag: "Psychanalyse",
      tit: "Le lapsus révélateur de George W. Bush (2022)",
      body: "En 2022, G. W. Bush voulait parler de la guerre en Ukraine menée par Poutine, mais a dit 'Irak'. Selon Freud (Psychopathologie de la vie quotidienne, 1901), ce lapsus n'est pas un accident mais un acte psychique sérieux : il révèle que Bush était hanté par la décision illégitime d'envahir l'Irak en 2003, une pulsion inconsciente échappant momentanément au contrôle du moi. Preuve du déterminisme psychique.",
      lien: "→ Freud (lapsus, inconscient), liberté comme illusion",
    },
    {
      tag: "Littérature",
      tit: "Acte gratuit : Lafcadio (Gide) et Meursault (Camus)",
      body: "Dans Les Caves du Vatican, Lafcadio tue un inconnu pour prouver sa liberté absolue ; dans L'Étranger, Meursault tue 'l'Arabe' sans motif apparent. Ces actes 'gratuits' sont censés prouver le libre arbitre. Mais ils sont en réalité motivés par le désir même de prouver la liberté, ce qui les prive de leur caractère gratuit.",
      lien: "→ Liberté, déterminisme, acte sans motif",
    },
    {
      tag: "Philosophie",
      tit: "Nietzsche : l'orgueil comme motif de croire en la liberté",
      body: "Dans Par-delà le Bien et le Mal (Aph. 21, 1886), Nietzsche soutient que c'est par orgueil que les hommes soutiennent l'existence du libre arbitre : ils veulent être responsables de leurs actes et ne pas être de simples marionnettes déterminées par les dieux ou le hasard. Croire à la liberté est un besoin psychologique, non une vérité.",
      lien: "→ Déterminisme, illusion, responsabilité (Sartre)",
    },
    {
      tag: "Psychologie",
      tit: "Descartes et la fille louche — goût déterminé psychiquement",
      body: "Dans la Lettre à Chanut (1647), Descartes raconte que dans son enfance il aimait une fille qui louchait. Longtemps après, l'impression visuelle du louche était associée pour lui au sentiment amoureux. Exemple de déterminisme psychique : nos goûts ne sont pas libres mais résultent d'associations inconscientes formées dans l'enfance.",
      lien: "→ Déterminisme psychique, Freud, liberté illusoire",
    },
    {
      new: true,
      tag: "Numérique",
      tit: "La « tyrannie du like » et l'esprit libre nietzschéen",
      body: "Stéphanie Floccari analyse la culture du <em>like</em> comme une forme contemporaine de <strong>grégarité</strong> (concept nietzschéen). Mécanisme : chaque utilisateur, par peur de la solitude et besoin de reconnaissance, s'aligne sur le plébiscite numérique du groupe. Conséquence pour la liberté : la <em>conformité visible</em> remplace l'<em>autonomie pensante</em>. Nietzsche oppose à cette servitude la figure de l'<strong>esprit libre</strong> — celui qui « supporte la dissonance », assume la solitude critique et l'inconfort de penser contre la majorité. Liberté contemporaine = capacité de se déconnecter, de douter, de différer, là où la pression sociale incite à l'alignement immédiat.",
      lien: "→ Floccari, Nietzsche, grégarité, esprit libre, réseaux sociaux",
    },
  ],
  accroches: [
    {
      type: "Citation",
      t: "« L’homme est condamné à être libre » : la formule de Sartre transforme la liberté en fardeau — nous ne pouvons pas ne pas choisir, et nous sommes responsables de tout ce que nous sommes.",
      src: "Sartre, L’existentialisme est un humanisme",
      new: true,
    },
    {
      type: "Paradoxe",
      t: "Spinoza compare l’homme qui se croit libre à une pierre qui, lancée, penserait choisir sa trajectoire : et si le sentiment de liberté n’était que l’ignorance des causes qui nous déterminent ?",
      src: "Spinoza, Lettre à Schuller",
      new: true,
    },
  ],
  liens: ["Conscience", "Devoir", "État", "Justice", "Nature", "Vérité"],
  diss: [
    "Sommes-nous libres ?",
    "La liberté est-elle une illusion ?",
    "La liberté est-elle compatible avec l'obéissance aux lois ?",
    "Être libre, est-ce faire ce qu'on veut ?",
    "Peut-on être libre seul ?",
    {q: "Un état de droit est-il la condition à l'exercice de la liberté civile ?"},
    {q: "L'inconscient remet-il en cause la liberté ?"},
    {q: "Peut-on se libérer des déterminismes ?"},
    {q: "La connaissance de nos déterminismes nous rend-elle plus libres ?"},
    {q: "Les déterminismes sociaux peuvent-ils être surmontés ?"},
    {q: "La connaissance libère-t-elle ?"},
    {q: "L'existence précède-t-elle l'essence ?"},
    {q: "La liberté consiste-t-elle à n'obéir à personne ?", new: true},
  ],
  plans: [
    {
      q: "Le déterminisme est-il compatible avec la liberté ?",
      theme: "La liberté et le déterminisme",
      intro: "",
      pb: "Le déterminisme est-il compatible avec la liberté ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Déterminisme radical : tout est causé (Spinoza, sciences naturelles). Le libre arbitre est une illusion qui vient de notre ignorance des causes. Nous croyons choisir mais nous sommes déterminés (biologie, inconscient, éducation, société).",
              auteurs: "",
              ref: "Spinoza, Éthique II ; Freud",
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
              args: "Liberté comme nécessité comprise (Spinoza) : la vraie liberté n'est pas d'agir sans cause mais d'agir selon sa propre nature rationnelle. Le sage est libre non parce qu'il échappe aux causes mais parce qu'il les comprend et agit selon la raison.",
              auteurs: "",
              ref: "Spinoza, Éthique IV-V",
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
              args: "Sartre : l'homme est 'condamné à être libre'. Même si nous sommes en situation (corps, passé, société), nous avons toujours une liberté de conscience. La mauvaise foi consiste à nier cette liberté irréductible.",
              auteurs: "",
              ref: "Sartre, L'Être et le Néant",
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
      q: "Obéir à une règle, est-ce être libre ?",
      theme: "Liberté et morale : autonomie vs contrainte",
      intro: "",
      pb: "Obéir à une règle, est-ce être libre ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Kant : la vraie liberté est l'autonomie morale. Obéir à la loi morale que la raison se donne = être vraiment libre. À l'inverse, obéir à ses désirs (hétéronomie) = être esclave de ses penchants.",
              auteurs: "",
              ref: "Kant, Fondements de la métaphysique des mœurs",
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
              args: "Rousseau : la liberté civile est supérieure à la liberté naturelle. Obéir à la loi commune qu'on s'est donnée = s'obéir à soi-même. C'est la condition de la liberté politique.",
              auteurs: "",
              ref: "Rousseau, Du Contrat social",
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
              args: "Mill : la liberté doit être protégée contre l'État et la société (tyrannie de la majorité). La liberté d'expression et de conscience sont absolues. Limite : nuire à autrui. La liberté individuelle est un bien en soi.",
              auteurs: "",
              ref: "Mill, De la liberté",
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
      q: "La vie sociale est-elle un obstacle à la liberté ?",
      theme: "La liberté est-elle possible dans la société ?",
      intro: "",
      pb: "La vie sociale est-elle un obstacle à la liberté ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "La société comme obstacle : Rousseau (l'homme est né libre mais partout il est dans les fers). Les institutions, la propriété, l'inégalité enchaînent l'homme. La liberté naturelle est perdue dans la société civile.",
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
              args: "La société comme condition : Hegel, Aristote. L'homme est un animal politique ; hors de la cité, il serait 'dieu ou bête'. La liberté réelle se réalise dans les institutions (famille, société, État).",
              auteurs: "",
              ref: "Aristote, Politique ; Hegel, Principes du droit",
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
              args: "Synthèse (Rousseau, Contrat social) : la liberté civile n'est pas la destruction de la liberté naturelle mais son dépassement dialectique. On perd la liberté brute mais on gagne une liberté plus haute, garantie et raisonnée.",
              auteurs: "",
              ref: "Rousseau, Du Contrat social I",
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
      q: "Comment comprendre que la liberté puisse être considérée comme illusoire alors que l'homme se perçoit nécessairement comme libre ?",
      theme: "La liberté est-elle une illusion ?",
      intro: "",
      pb: "Comment comprendre que la liberté puisse être considérée comme illusoire alors que l'homme se perçoit nécessairement comme libre ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "La liberté est le propre de la condition humaine (Sartre) : l'existence précède l'essence, l'homme n'a pas de nature préalable. Il se définit par ses actes, est 'condamné à être libre'. Ne pas choisir, c'est encore choisir. La liberté est l'angoisse même de l'homme.",
              auteurs: "",
              ref: "Sartre, L'existentialisme est un humanisme ; L'Être et le Néant",
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
              args: "Son existence étant impossible à prouver, la liberté semble une erreur de jugement. Les déterminismes pèsent sur nous : physique (D'Holbach), socio-économique (Bourdieu/Passeron), psychique (Freud). L'homme croit choisir mais ignore les causes qui le meuvent (Spinoza, Lettre 58).",
              auteurs: "",
              ref: "D'Holbach, Système de la nature ; Freud, Introduction à la psychanalyse ; Bourdieu, La Reproduction",
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
              args: "C'est par la connaissance de ce qui nous détermine que nous pouvons nous émanciper. La cure psychanalytique (Freud), l'agir en situation (Sartre), la connaissance des lois naturelles (Engels) permettent de reconquérir une liberté réelle. La vraie liberté politique est conférée par le contrat social (Rousseau, Épictète).",
              auteurs: "",
              ref: "Épictète, Manuel ; Rousseau, Du Contrat social ; Engels, Anti-Dühring",
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
      q: "La loi limite-t-elle ou garantit-elle la liberté ?",
      theme: "Un état de droit est-il la condition de la liberté civile ?",
      intro: "",
      pb: "La loi limite-t-elle ou garantit-elle la liberté ?",
      axes: [
        {
          t: "",
          sps: [
            {
              t: "",
              args: "Montesquieu : 'La liberté ne peut consister qu'à faire ce que les lois permettent.' Sans loi, c'est la liberté du plus fort qui s'impose. La loi rend les libertés de chacun compatibles.",
              auteurs: "",
              ref: "Montesquieu, De l'Esprit des Lois, 1748",
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
              args: "Hobbes : la liberté civile (réglée, limitée) est préférable à la liberté naturelle (totale mais infructueuse dans l'état de guerre). Le contrat échange la liberté absolue contre la sécurité et une liberté garantie.",
              auteurs: "",
              ref: "Hobbes, Le Citoyen, 1642",
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
              args: "Tocqueville : l'État de droit peut dériver vers un despotisme doux si les citoyens sont passifs. La liberté civile exige la vigilance active des citoyens pour empêcher l'émergence de pouvoirs illégitimes.",
              auteurs: "",
              ref: "Tocqueville, De la démocratie en Amérique, 1840",
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
