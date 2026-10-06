/* Notion « Existence » : exister, est-ce seulement être là ?
   HORS PROGRAMME (étape 5) : notion du programme de 2003, absente de celui de 2019.
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("existence", {
  c: "#6B4A7A",
  l: "Existence",
  s: "Exister, est-ce seulement être là ?",
  def: "<span class='kw'>Exister</span> (du latin <em>ex-sistere</em>, se tenir hors de) : au sens courant, être réellement, par opposition à ce qui n'est qu'imaginé. Au sens que lui donnent Kierkegaard puis les philosophies de l'existence, c'est le mode d'être propre à l'homme : un être qui n'est pas fixé d'avance, qui se projette, choisit, se sait mortel. Question : exister, est-ce simplement être là, comme une pierre, ou avoir à devenir soi ?<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>L'existant singulier</div><div class='def-sec-body'>Pascal décrit l'homme perdu entre deux infinis, qui fuit dans le divertissement la pensée de sa condition. Kierkegaard reproche au système de Hegel d'expliquer tout, sauf l'individu concret qui doit décider de sa vie dans l'angoisse : on n'existe pas en général, on existe en choisissant.</div></div><div class='def-sec'><div class='def-sec-title'>L'existence précède l'essence</div><div class='def-sec-body'>Pour Heidegger, l'homme (le <em>Dasein</em>, l'être-là) a à être : il n'est pas une chose ; perdu d'abord dans le « on », il est rappelé à lui-même par l'angoisse devant sa mort. Sartre en tire une thèse célèbre : l'homme existe d'abord et se définit ensuite par ses actes ; pas de nature humaine, pas d'excuse, une liberté qu'on fuit parfois dans la mauvaise foi.</div></div><div class='def-sec'><div class='def-sec-title'>L'absurde et les situations-limites</div><div class='def-sec-body'>Camus situe l'absurde dans la confrontation entre l'homme qui demande un sens et le monde qui se tait ; il répond par la révolte lucide plutôt que par le suicide ou l'espoir. Jaspers montre que c'est en affrontant les situations-limites (la mort, la souffrance, le combat, la faute) que l'homme devient lui-même.</div></div></details>",
  sources: [
    "Pascal, <em>Pensées</em> (éd. Lafuma et Brunschvicg)",
    "Kierkegaard, <em>Le Concept d'angoisse</em> (1844) ; <em>Post-scriptum aux Miettes philosophiques</em> (1846)",
    "Heidegger, <em>Être et Temps</em> (1927), § 9 et 46-53",
    "Jaspers, <em>Philosophie</em>, II (1932)",
    "Sartre, <em>L'Être et le Néant</em> (1943) ; <em>L'existentialisme est un humanisme</em> (1946)",
    "Camus, <em>Le Mythe de Sisyphe</em> (1942)",
    "Programme de philosophie de terminale de 2003 (BO n° 25 du 19 juin 2003), où « L'existence et le temps » était une notion",
  ],
  auteurs: [
    {
      n: "Pascal",
      ideas: [
        {
          w: "Pensées (posthumes, 1670)",
          i: "Perdu entre deux infinis, l'homme ne sait ni d'où il vient ni où il va. Plutôt que de penser à sa condition (la mort, la misère, l'ignorance), il se divertit : la chasse, le jeu, la conversation, les affaires. Le divertissement le console de ses misères mais l'empêche de se penser. La phrase célèbre sur l'effroi des espaces infinis, Pascal la prête à l'incroyant qu'il veut réveiller.",
          new: true,
          citations: ["« Le silence éternel de ces espaces infinis m'effraie » (Pensées, Laf. 201, Br. 206)"],
          fiche: "Perdu entre deux infinis, l'homme fuit dans le divertissement la pensée de sa condition.",
        },
      ],
    },
    {
      n: "Kierkegaard",
      ideas: [
        {
          w: "Le Concept d'angoisse (1844) ; Post-scriptum (1846)",
          i: "Contre le système de Hegel, qui explique tout sauf l'individu qui pense, Kierkegaard défend l'existant singulier : on n'existe pas en général, on existe en décidant, dans l'angoisse devant le possible. Il distingue trois stades : esthétique (vivre pour l'instant), éthique (s'engager, assumer un devoir), religieux (le saut de la foi). Il cherchait, écrit-il dans son journal de 1835, une vérité pour laquelle vivre et mourir.",
          new: true,
          citations: ["La subjectivité est la vérité (Post-scriptum, reformulé)"],
          fiche: "On n'existe pas en général, on existe en décidant, dans l'angoisse du possible ; trois stades : esthétique, éthique, religieux.",
        },
      ],
    },
    {
      n: "Heidegger",
      ideas: [
        {
          w: "Être et Temps (1927)",
          i: "L'homme, ou <em>Dasein</em> (l'être-là), est le seul étant pour qui il y va de son être : il a à être, il n'est pas fixé comme une chose. Jeté dans un monde qu'il n'a pas choisi, il se perd d'abord dans le « on » (on dit, on fait). L'angoisse devant sa propre mort, que personne ne peut mourir à sa place, le rappelle à lui-même : exister authentiquement, c'est assumer son être-vers-la-mort.",
          new: true,
          citations: ["Le Dasein est un être-vers-la-mort (Être et Temps, § 46-53, reformulé)"],
          fiche: "Le Dasein a à être ; perdu dans le « on », il revient à lui par l'angoisse devant sa mort (authenticité).",
        },
      ],
    },
    {
      n: "Jaspers",
      ideas: [
        {
          w: "Philosophie, II (1932)",
          i: "Mort, souffrance, combat, culpabilité : des situations qu'on ne peut ni éviter ni changer. Elles font échouer le savoir objectif, qui ne dit rien de ce que j'ai à faire de ma vie. Mais c'est en les affrontant lucidement que l'homme accède à l'existence, au sens fort, et pas seulement à la vie biologique ou sociale.",
          new: true,
          citations: [
            "Mort, souffrance, combat, culpabilité : des situations-limites dont on ne peut sortir (reformulé)",
          ],
          fiche: "Les situations-limites font échouer le savoir ; en les affrontant, l'homme accède à l'existence.",
        },
      ],
    },
    {
      n: "Sartre",
      ideas: [
        {
          w: "L'existentialisme est un humanisme (1946) ; L'Être et le Néant (1943)",
          i: "Pour un objet fabriqué, un coupe-papier, l'essence (le concept, l'usage prévu) précède l'existence. Pour l'homme, c'est l'inverse : il existe d'abord, surgit dans le monde, et se définit ensuite par ses actes. Pas de nature humaine, pas d'excuse : l'homme est condamné à être libre et responsable de ce qu'il fait de lui. Se cacher cette liberté, c'est la mauvaise foi.",
          new: true,
          citations: ["« l'existence précède l'essence » (L'existentialisme est un humanisme)"],
          fiche: "L'existence précède l'essence : l'homme se fait par ses actes, sans nature ni excuse.",
        },
      ],
    },
    {
      n: "Camus",
      ideas: [
        {
          w: "Le Mythe de Sisyphe (1942)",
          i: "L'homme demande du sens ; le monde se tait. L'absurde n'est ni dans l'homme ni dans le monde, mais dans leur confrontation. Ni le suicide ni l'espoir religieux (le saut que Camus reproche à Kierkegaard) : il faut vivre sans appel, dans la révolte lucide. Sisyphe, qui sait sa tâche vaine et la reprend, est l'image de cette existence assumée.",
          new: true,
          citations: [
            "« L'absurde naît de cette confrontation entre l'appel humain et le silence déraisonnable du monde » (Le Mythe de Sisyphe)",
            "« Il faut imaginer Sisyphe heureux. » (Le Mythe de Sisyphe)",
          ],
          fiche: "L'absurde naît de la confrontation entre l'homme qui demande un sens et le monde qui se tait ; répondre par la révolte.",
        },
      ],
    },
  ],
  textes: [
    {
      new: true,
      n: "Sartre — L'existence précède l'essence (L'existentialisme est un humanisme, 1946)",
      t: "Sartre part d'un objet fabriqué, un coupe-papier : l'artisan en avait le concept (sa forme, son usage) avant de le produire ; pour lui, l'essence précède l'existence. Si Dieu n'existe pas, il n'y a pas de concept de l'homme dans un esprit créateur : l'homme existe d'abord, et ce qu'il est, il le sera par ce qu'il fait. D'où la formule « l'existence précède l'essence », et sa conséquence : l'homme est entièrement responsable de ce qu'il est, et en choisissant pour lui, il propose une image de l'homme pour tous. (Résumé ; seule la formule est citée.)",
    },
  ],
  plans: [
    {
      new: true,
      q: "Exister, est-ce seulement être là ?",
      intro: "Une pierre est là, un chat est là, et moi aussi. Pourtant nous disons d'une vie qu'elle est « vraiment vécue » ou au contraire qu'on « se contente d'exister » : le mot semble désigner tantôt un simple fait, tantôt une tâche.",
      pb: "Si exister, c'est seulement être réellement là, l'homme existe comme les choses. Mais l'homme est-il là comme une chose, ou a-t-il à devenir ce qu'il est ? Et cette tâche a-t-elle un sens, dans un monde qui ne lui en donne aucun ?",
      axes: [
        {
          t: "Exister, c'est d'abord être là, parmi les choses",
          sps: [
            {
              new: true,
              t: "L'existence n'est pas une qualité (Kant)",
              args: "Dire qu'une chose existe n'ajoute rien à son concept : cent thalers réels ne contiennent pas un thaler de plus que cent thalers possibles. Exister, c'est être posé dans la réalité.",
              auteurs: "Kant",
              ref: "Kant, Critique de la raison pure, Dialectique, réfutation de la preuve ontologique",
              limite: "Mais pour l'homme, être posé là ne dit pas encore qui il est.",
            },
            {
              new: true,
              t: "Un roseau dans l'univers (Pascal)",
              args: "L'homme est jeté dans un univers infini qu'il n'a pas choisi, comme un point dans l'espace. Il fuit cette pensée dans le divertissement.",
              auteurs: "Pascal",
              ref: "Pascal, Pensées",
              limite: "Mais il est un roseau pensant : il sait qu'il est là.",
            },
          ],
          limite: "L'homme est là d'une manière unique : il se sait là et doit faire quelque chose de sa présence.",
        },
        {
          t: "Mais l'homme a à être : exister, c'est se faire",
          sps: [
            {
              new: true,
              t: "Le Dasein et l'être-vers-la-mort (Heidegger)",
              args: "L'homme a à être ; l'angoisse devant sa mort l'arrache au « on » et l'appelle à exister authentiquement.",
              auteurs: "Heidegger",
              ref: "Heidegger, Être et Temps, § 46-53",
              limite: "",
            },
            {
              new: true,
              t: "L'existence précède l'essence (Sartre)",
              args: "Pas de nature humaine : l'homme se définit par ses actes et répond de ce qu'il fait de lui. Fuir cette liberté, c'est la mauvaise foi.",
              auteurs: "Sartre",
              ref: "Sartre, L'existentialisme est un humanisme",
              limite: "Encore faut-il qu'agir ait un sens.",
            },
          ],
          limite: "Se faire suppose de croire que sa vie peut avoir un sens ; or le monde n'en donne aucun.",
        },
        {
          t: "Exister, c'est assumer l'absurde et les limites",
          sps: [
            {
              new: true,
              t: "La révolte lucide (Camus)",
              args: "L'absurde naît de la confrontation entre l'appel humain et le silence du monde ; la réponse n'est ni le suicide ni l'espoir, mais la révolte. Il faut imaginer Sisyphe heureux.",
              auteurs: "Camus",
              ref: "Camus, Le Mythe de Sisyphe",
              limite: "",
            },
            {
              new: true,
              t: "Les situations-limites (Jaspers)",
              args: "La mort, la souffrance, la faute ne se résolvent pas ; c'est en les affrontant que l'on devient soi.",
              auteurs: "Jaspers",
              ref: "Jaspers, Philosophie, II",
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
      tag: "Littérature",
      tit: "La Mort d'Ivan Ilitch (Tolstoï, 1886)",
      body: "Un magistrat a mené une vie conforme à ce qu'« on » attend : carrière, mariage, salon bien meublé. La maladie l'oblige à regarder sa mort en face, et il découvre qu'il n'a jamais vraiment vécu. Heidegger cite la nouvelle dans <em>Être et Temps</em> à propos de la manière dont le « on » se protège de la mort.",
      lien: "→ Temps, Bonheur",
    },
    {
      new: true,
      tag: "Philosophie",
      tit: "Le garçon de café (Sartre)",
      body: "Dans <em>L'Être et le Néant</em>, Sartre décrit un garçon de café aux gestes un peu trop vifs, un peu trop précis : il joue à être garçon de café, comme si c'était sa nature. C'est l'exemple de la mauvaise foi : faire comme si l'on était une chose, pour se décharger de sa liberté.",
      lien: "→ Liberté, Conscience",
    },
  ],
  accroches: [
    {new: true, type: "Question", t: "Une pierre est. Un chien vit. Toi, tu existes : quelle différence ?"},
  ],
  liens: ["Liberté", "Temps", "Conscience", "Religion", "Bonheur"],
  diss: [
    {new: true, q: "Exister, est-ce seulement être là ?"},
    {new: true, q: "L'existence a-t-elle un sens ?"},
    {new: true, q: "Peut-on se choisir ?"},
    {new: true, q: "La pensée de la mort nous empêche-t-elle de vivre ?"},
  ],
});
