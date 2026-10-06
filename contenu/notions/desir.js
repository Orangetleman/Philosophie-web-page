/* Notion « Désir » : manque ou puissance ?
   HORS PROGRAMME (étape 5) : notion du programme de 2003, absente de celui de 2019.
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("desir", {
  c: "#B83A5E",
  l: "Désir",
  s: "Le désir est-il la marque de notre imperfection ?",
  def: "Le <span class='kw'>désir</span> est la tendance consciente vers un objet que l'on se représente comme source de satisfaction. Il se distingue du <strong>besoin</strong> : le besoin est biologique, il vise un objet déterminé et s'éteint quand il est satisfait (la faim) ; le désir passe par l'imagination, il choisit, idéalise, et renaît de sa satisfaction. Question : désirer, est-ce manquer de quelque chose, ou exprimer une puissance de vivre ?<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>Le désir comme manque</div><div class='def-sec-body'>Dans le <em>Banquet</em> de Platon, Socrate fait reconnaître qu'on ne désire que ce dont on manque. Le mythe d'Aristophane en donne une image : coupés en deux par Zeus, les humains cherchent leur moitié perdue. Schopenhauer en tire une conclusion pessimiste : tout vouloir naît d'une privation, donc d'une souffrance, et la satisfaction ne laisse que l'ennui.</div></div><div class='def-sec'><div class='def-sec-title'>Le désir comme puissance</div><div class='def-sec-body'>Pour Spinoza, chaque chose s'efforce de persévérer dans son être (le <strong>conatus</strong>), et le désir est cet effort chez l'homme, conscient de lui-même : il est « l'essence même de l'homme ». Le désir n'est plus un manque mais une force ; ce n'est pas la valeur de l'objet qui fait le désir, c'est le désir qui donne sa valeur à l'objet.</div></div><div class='def-sec'><div class='def-sec-title'>Désirer le désir de l’autre</div><div class='def-sec-body'>Hegel distingue le désir animal, qui consomme son objet, du désir humain, qui veut être reconnu par une autre conscience. René Girard (<em>Mensonge romantique et vérité romanesque</em>, 1961) parle de <strong>désir mimétique</strong> : nous désirons un objet parce qu'un modèle le désire. La publicité, qui montre quelqu'un désirant un produit, en vit.</div></div><div class='def-sec'><div class='def-sec-title'>Faut-il maîtriser ses désirs ?</div><div class='def-sec-body'>Épicure trie les désirs (naturels et nécessaires, naturels seulement, vides) pour viser l'absence de trouble. Les stoïciens ne veulent désirer que ce qui dépend de nous. Freud montre que nos désirs les plus forts peuvent nous être inconnus : refoulés, ils reviennent déguisés dans les rêves et les symptômes.</div></div></details>",
  sources: [
    "Platon, <em>Le Banquet</em>, 189 c - 212 a",
    "Épicure, <em>Lettre à Ménécée</em> ; <em>Maximes capitales</em>, XXIX",
    "Spinoza, <em>Éthique</em>, III (1677), définitions des affects",
    "Schopenhauer, <em>Le Monde comme volonté et comme représentation</em>, III, § 38 ; IV, § 57 (1819)",
    "Hegel, <em>Phénoménologie de l’esprit</em>, IV (1807)",
    "Freud, <em>L’Interprétation des rêves</em>, chap. IV (1900)",
    "René Girard, <em>Mensonge romantique et vérité romanesque</em> (1961)",
    "Programme de philosophie de terminale de 2003 (BO n° 25 du 19 juin 2003), où « Le désir » était une notion",
  ],
  auteurs: [
    {
      n: "Platon",
      ideas: [
        {
          w: "Le Banquet, 199 c - 212 a (vers 380 av. J.-C.)",
          i: "Socrate fait reconnaître à Agathon qu'on ne désire que ce dont on manque : ce que l'on n'a pas, ce que l'on n'est pas. Éros n'est donc ni beau ni bon, il est désir de la beauté qui lui fait défaut. Diotime en fait un intermédiaire, fils de Pénia (la pauvreté) et de Poros (l'expédient) : le désir peut s'élever des beaux corps aux belles âmes, jusqu'au Beau lui-même. Le mythe d'Aristophane en donne une autre image : chacun cherche sa moitié perdue.",
          new: true,
          citations: [
            "On ne désire que ce qu’on n’a pas, ce qu’on n’est pas, ce dont on manque (Le Banquet, 200 e, reformulé)",
          ],
          fiche: "On ne désire que ce dont on manque ; mais le désir peut s’élever, des beaux corps jusqu’au Beau lui-même.",
        },
      ],
    },
    {
      n: "Épicure",
      ideas: [
        {
          w: "Lettre à Ménécée ; Maximes capitales, XXIX",
          i: "Parmi les désirs, les uns sont naturels, les autres vides ; parmi les naturels, certains sont nécessaires (au bonheur, à la tranquillité du corps, à la vie), d'autres seulement naturels. Le sage satisfait les premiers, faciles à combler, use des seconds avec mesure, et écarte les désirs vides (richesse, gloire), qui n'ont pas de limite. Le plaisir visé n'est pas la débauche : c'est l'absence de douleur dans le corps et de trouble dans l'âme.",
          new: true,
          citations: [
            "Les désirs sont naturels et nécessaires, naturels seulement, ou vides (Lettre à Ménécée, reformulé)",
          ],
          fiche: "Trier ses désirs (naturels et nécessaires, naturels seulement, vides) pour viser l’absence de trouble.",
        },
      ],
    },
    {
      n: "Spinoza",
      ideas: [
        {
          w: "Éthique, III (1677)",
          i: "Chaque chose s'efforce de persévérer dans son être : c'est le <strong>conatus</strong>. Chez l'homme, cet effort conscient de lui-même s'appelle désir. Le désir n'est donc pas un manque mais l'expression même de notre puissance d'exister. Et ce n'est pas parce qu'une chose est bonne que nous la désirons : c'est parce que nous la désirons que nous la jugeons bonne. La liberté ne consiste pas à supprimer ses désirs mais à comprendre leurs causes.",
          new: true,
          citations: [
            "« Le désir est l’essence même de l’homme » (III, définitions des affects, 1)",
            "Nous ne désirons pas une chose parce que nous la jugeons bonne : nous la jugeons bonne parce que nous la désirons (III, 9, scolie, reformulé)",
          ],
          fiche: "Le désir est l’essence de l’homme, effort pour persévérer dans son être : une puissance, non un manque.",
        },
      ],
    },
    {
      n: "Schopenhauer",
      ideas: [
        {
          w: "Le Monde comme volonté et comme représentation, III, § 38 ; IV, § 57 (1819)",
          i: "Tout vouloir naît d'un manque, donc d'une souffrance. Satisfait, un désir laisse place à un autre, ou à l'ennui : la vie oscille entre la douleur et l'ennui. Le bonheur n'est que la suppression momentanée d'une souffrance. Seules la contemplation esthétique et le renoncement (la négation du vouloir-vivre) offrent un répit.",
          new: true,
          citations: [
            "« Tout vouloir procède d’un besoin, c’est-à-dire d’une privation, c’est-à-dire d’une souffrance » (III, § 38)",
          ],
          fiche: "Tout vouloir naît d’une privation ; satisfait, il laisse place à l’ennui : la vie oscille entre douleur et ennui.",
        },
      ],
    },
    {
      n: "Hegel",
      ideas: [
        {
          w: "Phénoménologie de l’esprit, IV (1807)",
          i: "Le désir animal se satisfait en consommant son objet. Le désir humain vise autre chose : une autre conscience qui le reconnaisse. Désirer, au sens humain, c'est vouloir être reconnu. Alexandre Kojève, dans ses leçons des années 1930, fera de ce désir de reconnaissance le moteur de l'histoire humaine.",
          new: true,
          citations: [
            "La conscience de soi est désir, et ne se satisfait que dans une autre conscience de soi (IV, reformulé)",
          ],
          fiche: "Le désir humain ne veut pas seulement des choses : il veut être reconnu par une autre conscience.",
        },
      ],
    },
    {
      n: "Freud",
      ideas: [
        {
          w: "L’Interprétation des rêves, chap. IV (1900)",
          i: "Nos désirs les plus forts peuvent nous être inconnus : refoulés parce qu'inacceptables, ils reviennent déguisés dans les rêves, les lapsus, les symptômes. Le rêve, même pénible, accomplit un désir. Le désir n'est donc pas transparent au sujet : on peut désirer ce qu'on croit refuser.",
          new: true,
          citations: ["« Le rêve est l’accomplissement (déguisé) d’un désir (réprimé, refoulé) » (chap. IV)"],
          fiche: "Le désir peut être inconscient : refoulé, il revient déguisé, et le rêve en est l’accomplissement.",
        },
      ],
    },
  ],
  textes: [
    {
      new: true,
      n: "Spinoza — Le désir, essence de l’homme (Éthique, III, 1677)",
      t: "« Le désir est l'essence même de l'homme » (définitions des affects, 1). Spinoza renverse l'idée commune selon laquelle désirer, c'est manquer : le désir est l'effort par lequel chaque être s'efforce de persévérer dans son être (le <em>conatus</em>), quand cet effort se connaît lui-même. Conséquence (III, 9, scolie) : nous ne désirons pas une chose parce que nous la jugeons bonne, nous la jugeons bonne parce que nous la désirons. La valeur des choses vient du désir, non l'inverse ; et se libérer ne consiste pas à étouffer ses désirs, mais à en connaître les causes.",
    },
  ],
  plans: [
    {
      new: true,
      q: "Le désir est-il la marque de notre imperfection ?",
      intro: "Désirer, c'est tendre vers ce qu'on n'a pas encore. Un être parfait, à qui rien ne manquerait, ne désirerait rien : le désir semble donc trahir notre incomplétude. Mais c'est aussi par lui que nous agissons, créons, aimons.",
      pb: "Si désirer, c'est manquer, le désir est la marque de notre imperfection et il faudrait s'en libérer. Mais le désir n'est-il pas aussi l'expression d'une puissance de vivre, ce qui fait de nous des êtres agissants plutôt que des êtres inachevés ?",
      axes: [
        {
          t: "Désirer, c’est manquer : le désir trahit notre imperfection",
          sps: [
            {
              new: true,
              t: "On ne désire que ce dont on manque (Platon)",
              args: "Socrate, dans le <em>Banquet</em> : on ne désire que ce qu'on n'a pas, ce qu'on n'est pas. Éros lui-même n'est ni beau ni bon : il désire la beauté qui lui manque.",
              auteurs: "Platon",
              ref: "Platon, Le Banquet, 199 c - 201 c",
              limite: "Mais chez Platon, ce manque élève : il conduit au Beau.",
            },
            {
              new: true,
              t: "Le pendule de la douleur et de l’ennui (Schopenhauer)",
              args: "Tout vouloir procède d'une privation, donc d'une souffrance ; satisfait, il laisse place à un autre désir ou à l'ennui. Le désir est sans fin, et le bonheur toujours négatif.",
              auteurs: "Schopenhauer",
              ref: "Schopenhauer, Le Monde comme volonté et comme représentation, III, § 38",
              limite: "Ce pessimisme ne dit pas pourquoi certains désirs comblent.",
            },
          ],
          limite: "Si le désir est manque, il faudrait apprendre à désirer moins, ou mieux.",
        },
        {
          t: "Il faut donc régler ses désirs pour être libre et heureux",
          sps: [
            {
              new: true,
              t: "Trier ses désirs (Épicure)",
              args: "Satisfaire les désirs naturels et nécessaires, user avec mesure des désirs seulement naturels, écarter les désirs vides, sans limite. Le bonheur est l'absence de trouble.",
              auteurs: "Épicure",
              ref: "Épicure, Lettre à Ménécée",
              limite: "Mais le désir réglé est encore pensé comme un danger à contenir.",
            },
            {
              new: true,
              t: "Ne désirer que ce qui dépend de nous (Épictète)",
              args: "Les choses extérieures ne dépendent pas de nous : désirer ce qui n'en dépend pas, c'est se condamner à la déception. Le sage règle son désir sur ce qui est en son pouvoir.",
              auteurs: "Épictète",
              ref: "Épictète, Manuel, 1 et 8",
              limite: "Cette maîtrise suppose qu'on connaisse ses désirs ; or Freud montre qu'ils peuvent être inconscients.",
            },
          ],
          limite: "Régler le désir suppose de le tenir pour une faiblesse ; et s'il était au contraire une force ?",
        },
        {
          t: "Le désir n’est pas un manque mais une puissance",
          sps: [
            {
              new: true,
              t: "Le désir, essence de l’homme (Spinoza)",
              args: "Le désir est l'effort pour persévérer dans son être. Nous ne désirons pas une chose parce qu'elle est bonne : nous la jugeons bonne parce que nous la désirons. Le désir est la puissance même d'exister.",
              auteurs: "Spinoza",
              ref: "Spinoza, Éthique, III",
              limite: "Encore faut-il comprendre les causes de ses désirs pour ne pas en être esclave.",
            },
            {
              new: true,
              t: "Le désir de reconnaissance fait l’humanité (Hegel)",
              args: "Le désir humain ne vise pas seulement des objets : il vise une autre conscience. C'est lui qui arrache l'homme à l'animalité et le fait entrer dans l'histoire.",
              auteurs: "Hegel",
              ref: "Hegel, Phénoménologie de l’esprit, IV",
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
      tag: "Société",
      tit: "Publicité et désir mimétique",
      body: "Une publicité montre rarement le produit seul : elle montre quelqu'un qui le désire ou en jouit. Selon René Girard, nous désirons selon le désir d'un modèle ; la publicité nous offre des modèles. L'objet compte moins que celui qui semble le désirer.",
      lien: "→ Autrui, Bonheur",
    },
    {
      new: true,
      tag: "Vie quotidienne",
      tit: "Le nouveau téléphone",
      body: "On l'attend des semaines, on l'achète, et quelques mois plus tard le désir s'est déjà déplacé vers le modèle suivant. Schopenhauer y verrait la confirmation que le désir ne s'éteint dans sa satisfaction que pour renaître ailleurs, ou laisser place à l'ennui.",
      lien: "→ Bonheur, Technique",
    },
  ],
  accroches: [
    {
      new: true,
      type: "Citation",
      t: "« Malheur à qui n'a plus rien à désirer ! » écrit Rousseau : faut-il donc souhaiter que nos désirs ne soient jamais tous comblés ?",
      src: "Rousseau, Julie ou la Nouvelle Héloïse, VI, 8",
    },
  ],
  liens: ["Bonheur", "Inconscient", "Liberté", "Autrui", "Conscience"],
  diss: [
    {new: true, q: "Le désir est-il la marque de notre imperfection ?"},
    {new: true, q: "Peut-on désirer ce qui ne nous manque pas ?"},
    {new: true, q: "Faut-il se libérer de ses désirs ?"},
    {new: true, q: "Désirons-nous les choses parce qu’elles sont bonnes ?"},
  ],
});
