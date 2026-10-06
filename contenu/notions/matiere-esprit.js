/* Notion « Matière et esprit » : l’esprit est-il autre chose que la matière ?
   HORS PROGRAMME (étape 5) : notion du programme de 2003, absente de celui de 2019.
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("matiere-esprit", {
  c: "#5A6E99",
  l: "Matière et esprit",
  s: "L'esprit est-il autre chose que la matière ?",
  def: "La <span class='kw'>matière</span> désigne ce dont les corps sont faits : ce qui occupe l'espace, se mesure, obéit aux lois physiques. L'<span class='kw'>esprit</span> désigne ce qui pense, sent, veut : la conscience, les idées, les intentions. Question : l'esprit est-il une réalité distincte de la matière (une âme), ou une manière dont la matière, le cerveau, fonctionne ? Et s'ils sont distincts, comment agissent-ils l'un sur l'autre ?<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>Tout est matière</div><div class='def-sec-body'>Pour les atomistes (Démocrite, Épicure, Lucrèce), l'âme est faite d'atomes très fins : elle naît, souffre et meurt avec le corps. Les neurosciences contemporaines montrent que chaque activité mentale a un corrélat cérébral, ce qui semble leur donner raison.</div></div><div class='def-sec'><div class='def-sec-title'>Deux substances</div><div class='def-sec-body'>Descartes distingue la chose qui pense (inétendue) et la chose étendue (le corps) : je peux douter d'avoir un corps, non de penser. Mais comment une pensée meut-elle un bras ? La princesse Élisabeth de Bohême lui pose la question en 1643 ; Descartes répond que l'union de l'âme et du corps se connaît par la vie et les sens plutôt que par l'entendement. Malebranche fera de Dieu la seule cause de cette correspondance.</div></div><div class='def-sec'><div class='def-sec-title'>Une seule réalité, ou un esprit irréductible ?</div><div class='def-sec-body'>Spinoza ne voit qu'une substance, dont la pensée et l'étendue sont deux attributs : l'esprit et le corps sont une même chose exprimée de deux façons. Leibniz soutient qu'on ne trouvera jamais une perception en visitant une machine. Bergson tient la conscience pour solidaire du cerveau mais non réductible à lui. Putnam propose de définir l'esprit par ses fonctions, réalisables dans des matériaux différents : ce qui relance la question des machines qui pensent.</div></div></details>",
  sources: [
    "Lucrèce, <em>De la nature</em>, III",
    "Descartes, <em>Méditations métaphysiques</em>, II et VI (1641), texte de Wikisource (éd. Cousin) ; correspondance avec Élisabeth (1643)",
    "Spinoza, <em>Éthique</em>, II (1677)",
    "Leibniz, <em>Monadologie</em>, § 17 (1714), texte français de Leibniz",
    "Bergson, <em>L'Énergie spirituelle</em> (1919) ; <em>Matière et mémoire</em> (1896)",
    "Putnam, <em>Mind, Language and Reality</em> (1975), articles des années 1960",
    "John Searle, « Minds, Brains and Programs » (1980), l'argument de la chambre chinoise",
    "Programme de philosophie de terminale de 2003 (BO n° 25 du 19 juin 2003), où « La matière et l'esprit » était une notion",
  ],
  auteurs: [
    {
      n: "Lucrèce",
      ideas: [
        {
          w: "De la nature, III",
          i: "L'esprit et l'âme sont corporels : faits d'atomes très petits, très ronds, très mobiles, répandus dans tout le corps. La preuve : l'âme souffre avec le corps, s'enivre avec lui, s'affaiblit quand il vieillit. Elle naît avec lui et meurt avec lui ; il n'y a donc rien à craindre après la mort.",
          new: true,
          citations: ["L'esprit naît avec le corps, grandit avec lui et vieillit avec lui (III, 445-448, reformulé)"],
          fiche: "L'âme est faite d'atomes : elle naît, souffre, vieillit et meurt avec le corps.",
        },
      ],
    },
    {
      n: "Descartes",
      ideas: [
        {
          w: "Méditations métaphysiques, II et VI (1641) ; lettres à Élisabeth (1643)",
          i: "Je puis douter d'avoir un corps, non de penser : je suis donc une chose qui pense, réellement distincte du corps étendu. Mais la douleur, la faim, la soif m'apprennent que je ne suis pas logé dans mon corps comme un pilote dans son navire : je lui suis étroitement uni. Comment deux substances si différentes agissent-elles l'une sur l'autre ? Descartes avoue à Élisabeth que cette union se connaît par la vie et les sens plutôt que par l'entendement.",
          new: true,
          citations: [
            "« je ne suis pas seulement logé dans mon corps, ainsi qu'un pilote en son navire, mais, outre cela, [...] je lui suis conjoint très étroitement » (Méditation sixième)",
          ],
          fiche: "L'âme est une chose qui pense, distincte du corps ; pourtant elle lui est étroitement unie, non logée comme un pilote en son navire.",
        },
      ],
    },
    {
      n: "Spinoza",
      ideas: [
        {
          w: "Éthique, II (1677)",
          i: "Il n'y a qu'une substance, Dieu ou la Nature, dont la pensée et l'étendue sont deux attributs. L'esprit est l'idée du corps : esprit et corps sont une seule et même chose, exprimée de deux façons. Il n'y a donc pas d'action de l'un sur l'autre, mais une correspondance exacte : à tout ce qui arrive dans le corps répond une idée dans l'esprit.",
          new: true,
          citations: ["« L'ordre et la connexion des idées est le même que l'ordre et la connexion des choses » (II, 7)"],
          fiche: "Esprit et corps sont une même chose exprimée sous deux attributs : pas d'action de l'un sur l'autre, une correspondance.",
        },
      ],
    },
    {
      n: "Leibniz",
      ideas: [
        {
          w: "Monadologie, § 17 (1714)",
          i: "Imaginons une machine qui pense, agrandie au point qu'on puisse y entrer comme dans un moulin : on n'y verrait que des pièces qui se poussent, jamais une perception. La perception, donc l'esprit, ne s'explique pas par des raisons mécaniques (figures et mouvements) : il faut la chercher dans des substances simples, les monades.",
          new: true,
          citations: [
            "« on ne trouvera en la visitant au-dedans, que des pièces qui se poussent les unes les autres, et jamais de quoi expliquer une perception » (Monadologie, § 17)",
          ],
          fiche: "Dans une machine agrandie comme un moulin, on ne verrait que des pièces qui se poussent, jamais une perception.",
        },
      ],
    },
    {
      n: "Bergson",
      ideas: [
        {
          w: "L'Énergie spirituelle, « L'âme et le corps » (1919) ; Matière et mémoire (1896)",
          i: "Il y a une solidarité entre la conscience et le cerveau : une lésion cérébrale abolit des souvenirs ou des mots. Mais solidarité n'est pas équivalence : un vêtement dépend du clou auquel il est accroché, sans que le vêtement soit le clou. Le cerveau est un organe d'attention à la vie, qui trie ce qui sert l'action ; la conscience déborde l'activité cérébrale.",
          new: true,
          citations: ["Le cerveau est l'organe de l'attention à la vie (L'Énergie spirituelle, reformulé)"],
          fiche: "La conscience dépend du cerveau comme le vêtement du clou, sans s'y réduire : le cerveau est l'organe de l'attention à la vie.",
        },
      ],
    },
    {
      n: "Putnam",
      ideas: [
        {
          w: "Mind, Language and Reality (1975), articles des années 1960",
          i: "Un même état mental (avoir mal, croire qu'il pleut) peut être réalisé dans des matériaux très différents : un cerveau humain, celui d'une pieuvre, peut-être une machine. L'esprit se définit donc par ses fonctions (ses relations avec ce qui entre, ce qui sort et les autres états), non par sa matière : c'est le fonctionnalisme. Putnam l'a lancé, puis critiqué lui-même dans les années 1980.",
          new: true,
          citations: [
            "Un même état mental peut être réalisé par des matériaux différents (réalisabilité multiple, reformulé)",
          ],
          fiche: "Un même état mental peut être réalisé dans des matériaux différents : l'esprit se définit par ses fonctions (fonctionnalisme).",
        },
      ],
    },
  ],
  textes: [
    {
      new: true,
      n: "Descartes — Non comme un pilote en son navire (Méditations métaphysiques, VI, 1641)",
      t: "« La nature m'enseigne aussi par ces sentiments de douleur, de faim, de soif, etc., que je ne suis pas seulement logé dans mon corps, ainsi qu'un pilote en son navire, mais, outre cela, que je lui suis conjoint très étroitement, et tellement confondu et mêlé, que je compose comme un seul tout avec lui. » Texte de l'édition Cousin (Wikisource). Un pilote voit par les yeux qu'un navire est endommagé ; moi, je ne constate pas que mon corps est blessé : j'ai mal. Le dualisme de la deuxième Méditation doit faire place à une union qu'il ne sait pas vraiment expliquer.",
    },
  ],
  plans: [
    {
      new: true,
      q: "L'esprit est-il autre chose que la matière ?",
      intro: "Un médicament change l'humeur, un coup sur la tête efface des souvenirs, l'imagerie cérébrale montre quelles zones s'activent quand on calcule. Et pourtant, ce que je pense, je ne le vois pas dans les neurones : je le vis.",
      pb: "Si l'esprit n'est que l'activité de la matière, la pensée s'explique comme n'importe quel phénomène physique. Mais comment des mouvements de matière deviennent-ils une pensée ? Et si l'esprit est autre chose, comment agit-il sur le corps ?",
      axes: [
        {
          t: "L'esprit ne se réduit pas à la matière",
          sps: [
            {
              new: true,
              t: "La chose qui pense (Descartes)",
              args: "Je peux douter de mon corps, non de ma pensée : l'esprit est une substance distincte de l'étendue.",
              auteurs: "Descartes",
              ref: "Descartes, Méditations métaphysiques, II",
              limite: "Mais comment cette substance agit-elle sur le corps ?",
            },
            {
              new: true,
              t: "Le moulin (Leibniz)",
              args: "En visitant une machine qui pense, on ne trouverait que des pièces qui se poussent : la perception ne s'explique pas mécaniquement.",
              auteurs: "Leibniz",
              ref: "Leibniz, Monadologie, § 17",
              limite: "L'argument vaut contre une matière purement mécanique ; vaut-il contre le cerveau ?",
            },
          ],
          limite: "Séparer l'esprit du corps rend leur union incompréhensible.",
        },
        {
          t: "La matière semble suffire, ou du moins esprit et corps ne font qu'un",
          sps: [
            {
              new: true,
              t: "L'âme meurt avec le corps (Lucrèce)",
              args: "L'âme souffre, s'enivre et vieillit avec le corps : elle est corporelle. Les neurosciences prolongent cette observation.",
              auteurs: "Lucrèce",
              ref: "Lucrèce, De la nature, III",
              limite: "Constater une dépendance n'explique pas encore ce qu'est penser.",
            },
            {
              new: true,
              t: "Une même chose sous deux attributs (Spinoza)",
              args: "Esprit et corps ne sont pas deux choses qui agiraient l'une sur l'autre : l'ordre des idées est le même que l'ordre des choses.",
              auteurs: "Spinoza",
              ref: "Spinoza, Éthique, II, 7",
              limite: "",
            },
          ],
          limite: "Peut-on penser l'esprit autrement que comme une chose, matérielle ou non ?",
        },
        {
          t: "L'esprit comme fonction ou comme durée",
          sps: [
            {
              new: true,
              t: "Le fonctionnalisme (Putnam)",
              args: "Un état mental se définit par ce qu'il fait, et peut être réalisé dans divers matériaux : d'où la question des machines qui pensent.",
              auteurs: "Putnam",
              ref: "Putnam, Mind, Language and Reality",
              limite: "La chambre chinoise de Searle objecte que manipuler des symboles n'est pas comprendre.",
            },
            {
              new: true,
              t: "Le clou et le vêtement (Bergson)",
              args: "La conscience dépend du cerveau sans s'y réduire ; le cerveau trie ce qui sert l'action.",
              auteurs: "Bergson",
              ref: "Bergson, L'Énergie spirituelle",
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
      tag: "Médecine",
      tit: "Phineas Gage",
      body: "En septembre 1848, dans le Vermont, une barre de fer traverse le crâne de cet ouvrier des chemins de fer, détruisant une partie de son lobe frontal. Il survit, mais son médecin rapporte un changement de caractère si profond que ses proches disent qu'il « n'est plus Gage ». Le cas est devenu l'exemple classique de la dépendance de la personnalité envers le cerveau.",
      lien: "→ Conscience, Liberté",
    },
    {
      new: true,
      tag: "Technique",
      tit: "Une intelligence artificielle pense-t-elle ?",
      body: "Turing proposait en 1950 de dire qu'une machine pense si, dans une conversation écrite, on ne peut la distinguer d'un humain. Searle répond en 1980 par la chambre chinoise : un homme qui ne parle pas chinois, enfermé avec un manuel de règles, peut produire des réponses parfaites en chinois sans rien comprendre. Les assistants conversationnels actuels rendent la question très concrète.",
      lien: "→ Technique, Langage",
    },
  ],
  accroches: [
    {
      new: true,
      type: "Question",
      t: "Si l'on pouvait entrer dans un cerveau comme dans une usine, y verrait-on une pensée ?",
      src: "Leibniz, Monadologie, § 17",
    },
  ],
  liens: ["Conscience", "Science", "Vivant", "Religion", "Technique"],
  diss: [
    {new: true, q: "L'esprit est-il autre chose que la matière ?"},
    {new: true, q: "Une machine peut-elle penser ?"},
    {new: true, q: "Suis-je mon cerveau ?"},
    {new: true, q: "Peut-on expliquer la pensée ?"},
  ],
});
