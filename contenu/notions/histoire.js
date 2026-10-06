/* Notion « Histoire » : les hommes font-ils leur histoire ?
   HORS PROGRAMME (étape 5) : notion du programme de 2003, absente de celui de 2019.
   Format : CLAUDE.md, « Notion (objet dans D) ». Tout ajout porte new:true.
   Assemblé dans data.js par outils/construire.mjs. */
NOTION("histoire", {
  c: "#7D6F4A",
  l: "Histoire",
  s: "L’histoire a-t-elle un sens ?",
  def: "L'<span class='kw'>histoire</span> désigne deux choses : le <strong>devenir</strong> des sociétés humaines (ce qui est arrivé) et la <strong>connaissance</strong> qu'on en prend (du grec <em>historia</em>, l'enquête). Question : l'histoire a-t-elle un sens, c'est-à-dire une direction et une signification, ou n'est-elle qu'une suite d'événements ? Et les hommes font-ils leur histoire, ou la subissent-ils ?<details><summary>Approfondir la notion</summary><div class='def-sec'><div class='def-sec-title'>Connaître le passé</div><div class='def-sec-body'>Hérodote, au Ve siècle av. J.-C., appelle son œuvre <em>Enquêtes</em> : l'historien n'observe pas le passé, il le reconstruit à partir de traces (documents, témoignages, vestiges), qu'il doit critiquer. Raymond Aron montre qu'il n'y a pas d'histoire objective au sens où il y a une physique : l'historien appartient à l'histoire qu'il étudie et l'interroge depuis son présent. Mais pluralité des interprétations ne veut pas dire arbitraire : la critique des sources fixe des limites.</div></div><div class='def-sec'><div class='def-sec-title'>Les philosophies de l’histoire</div><div class='def-sec-body'>Kant fait l'hypothèse d'un dessein de la nature : l'<strong>insociable sociabilité</strong> des hommes les pousse à rivaliser, donc à progresser, jusqu'à une société juste et une paix entre les États. Pour Hegel, la raison gouverne le monde ; l'histoire est le progrès de la conscience de la liberté, et la raison se sert des passions des grands hommes (la <strong>ruse de la raison</strong>). Marx garde l'idée d'un sens mais le fonde sur les conditions matérielles : l'histoire est celle des luttes de classes.</div></div><div class='def-sec'><div class='def-sec-title'>Le sens de l’histoire en question</div><div class='def-sec-body'>Nietzsche met en garde contre l'excès d'histoire, qui paralyse la vie. Lévi-Strauss montre que juger une société « en retard » dépend du point de vue de l'observateur. Walter Benjamin voit dans le progrès une tempête qui accumule les ruines, et demande de sauver la mémoire des vaincus. Après les guerres mondiales et la Shoah, la croyance en un progrès nécessaire de l'humanité est devenue difficile à tenir.</div></div></details>",
  sources: [
    "Hérodote, <em>Enquêtes</em>, préambule",
    "Kant, <em>Idée d’une histoire universelle au point de vue cosmopolitique</em> (1784)",
    "Hegel, <em>La Raison dans l’histoire</em> (leçons publiées en 1837)",
    "Marx et Engels, <em>Manifeste du parti communiste</em> (1848) ; Marx, <em>Le Dix-huit Brumaire de Louis Bonaparte</em> (1852)",
    "Nietzsche, <em>Seconde considération inactuelle</em> (1874)",
    "Lévi-Strauss, <em>Race et histoire</em> (1952), chap. 5 et 6",
    "Raymond Aron, <em>Introduction à la philosophie de l’histoire</em> (1938)",
    "Walter Benjamin, <em>Sur le concept d’histoire</em> (1940)",
    "Programme de philosophie de terminale de 2003 (BO n° 25 du 19 juin 2003), où « L’histoire » était une notion",
  ],
  auteurs: [
    {
      n: "Kant",
      ideas: [
        {
          w: "Idée d’une histoire universelle au point de vue cosmopolitique (1784)",
          i: "Vue de près, l'histoire n'est qu'un tissu de folies et de violences. Mais on peut faire l'hypothèse d'un dessein de la nature : l'<strong>insociable sociabilité</strong> des hommes (ils ont besoin les uns des autres mais veulent tout plier à leur volonté) les pousse à rivaliser, donc à développer leurs talents, puis à se donner des lois. L'histoire tend vers une société civile juste et une paix entre les États. C'est une idée qui oriente l'action, non une connaissance.",
          new: true,
          citations: ["« J’entends ici par antagonisme l’insociable sociabilité des hommes » (quatrième proposition)"],
          fiche: "L’insociable sociabilité pousse les hommes à progresser : l’histoire tend vers le droit et la paix (idée régulatrice).",
        },
      ],
    },
    {
      n: "Hegel",
      ideas: [
        {
          w: "La Raison dans l’histoire (leçons de 1822-1830, publiées en 1837)",
          i: "La raison gouverne le monde, et l'histoire universelle est le progrès de la conscience de la liberté : d'un Orient où un seul est libre, au monde grec et romain où quelques-uns le sont, jusqu'au monde moderne où l'homme comme tel est reconnu libre. Les grands hommes (César, Napoléon) agissent par passion et intérêt ; mais à travers eux la raison accomplit ses fins : c'est la <strong>ruse de la raison</strong>.",
          new: true,
          citations: ["Rien de grand ne s’est accompli dans le monde sans passion (reformulé ; la traduction varie)"],
          fiche: "L’histoire est le progrès de la conscience de la liberté ; la raison se sert des passions des grands hommes (ruse de la raison).",
        },
      ],
    },
    {
      n: "Marx",
      ideas: [
        {
          w: "Manifeste du parti communiste (1848) ; Le Dix-huit Brumaire de Louis Bonaparte (1852)",
          i: "Le moteur de l'histoire n'est pas l'esprit mais les conditions matérielles de la vie : la manière de produire détermine les rapports sociaux, le droit, les idées. L'histoire est celle de luttes entre classes (hommes libres et esclaves, seigneurs et serfs, bourgeois et prolétaires), et elle doit aboutir à une société sans classes. Mais les hommes ne font pas l'histoire n'importe comment : ils la font dans des conditions héritées du passé.",
          new: true,
          citations: [
            "« L’histoire de toute société jusqu’à nos jours n’a été que l’histoire de luttes de classes » (Manifeste, chap. I)",
            "« Les hommes font leur propre histoire, mais ils ne la font pas arbitrairement, dans les conditions choisies par eux, mais dans des conditions directement données et héritées du passé » (Le Dix-huit Brumaire, chap. I)",
          ],
          fiche: "L’histoire est celle des luttes de classes ; les hommes la font, mais dans des conditions héritées du passé.",
        },
      ],
    },
    {
      n: "Nietzsche",
      ideas: [
        {
          w: "Seconde considération inactuelle : De l’utilité et de l’inconvénient de l’histoire pour la vie (1874)",
          i: "L'animal vit sans mémoire, dans l'instant ; l'homme ploie sous le poids du passé. L'histoire sert la vie quand elle donne des modèles (histoire monumentale), conserve ce qu'on aime (histoire antiquaire), ou juge et condamne le passé (histoire critique). Mais l'excès d'histoire, la culture historique de son siècle, paralyse l'action : il faut aussi savoir oublier.",
          new: true,
          citations: [
            "« Il y a un degré d’insomnie, de rumination, de sens historique, au-delà duquel l’être vivant se trouve ébranlé et finalement détruit » (§ 1)",
          ],
          fiche: "L’histoire doit servir la vie ; son excès paralyse l’action : il faut savoir oublier.",
        },
      ],
    },
    {
      n: "Lévi-Strauss",
      ideas: [
        {
          w: "Race et histoire, chap. 5 et 6 (1952)",
          i: "Nous appelons « stationnaires » les sociétés dont l'histoire ne va pas dans le même sens que la nôtre, comme le voyageur d'un train juge des autres trains d'après sa propre vitesse. L'opposition entre histoire cumulative (qui accumule les inventions) et histoire stationnaire dépend donc du point de vue de l'observateur. Toutes les sociétés ont une histoire aussi longue ; le progrès, quand il existe, naît de la coopération des cultures.",
          new: true,
          citations: [
            "L’opposition entre histoire cumulative et histoire stationnaire dépend du point de vue de l’observateur (chap. 6, reformulé)",
          ],
          fiche: "Histoire cumulative ou stationnaire : le jugement dépend du point de vue ; le progrès naît de la coopération des cultures.",
        },
      ],
    },
    {
      n: "Raymond Aron",
      ideas: [
        {
          w: "Introduction à la philosophie de l’histoire (1938) ; Dimensions de la conscience historique (1961)",
          i: "L'historien n'est pas un pur spectateur : il appartient à l'histoire qu'il étudie et reconstruit le passé à partir des questions de son présent. D'où une pluralité d'interprétations, mais pas n'importe lesquelles : la critique des sources impose ses exigences. Quant au sens de l'histoire, aucune doctrine ne peut le connaître d'avance : l'avenir reste ouvert, fait de choix humains.",
          new: true,
          citations: [
            "Aucun sens de l’histoire n’est connu d’avance : l’avenir reste ouvert aux choix des hommes (reformulé)",
          ],
          fiche: "L’historien reconstruit le passé depuis son présent ; aucun sens de l’histoire n’est connu d’avance.",
        },
      ],
    },
  ],
  textes: [
    {
      new: true,
      n: "Marx — Les hommes font leur propre histoire (Le Dix-huit Brumaire de Louis Bonaparte, 1852)",
      t: "« Les hommes font leur propre histoire, mais ils ne la font pas arbitrairement, dans les conditions choisies par eux, mais dans des conditions directement données et héritées du passé. La tradition de toutes les générations mortes pèse d'un poids très lourd sur le cerveau des vivants. » Écrit juste après le coup d'État du 2 décembre 1851, le texte tient ensemble les deux faces de la question : les hommes sont bien les acteurs de l'histoire (rien n'y arrive sans eux), mais ils agissent dans une situation qu'ils n'ont pas choisie, et souvent avec les mots et les costumes du passé.",
    },
  ],
  plans: [
    {
      new: true,
      q: "L’histoire a-t-elle un sens ?",
      intro: "On parle d'être « du bon côté de l'histoire », ou d'un progrès qu'on ne pourrait pas arrêter. Ces expressions supposent que l'histoire va quelque part. Mais le XXe siècle, avec ses guerres mondiales et ses génocides, a rendu cette confiance difficile.",
      pb: "Le mot sens a deux sens : une direction et une signification. Si l'histoire va vers un but, ses violences prennent un sens ; mais n'est-ce pas les justifier ? Et si elle n'en a aucun, que reste-t-il à l'action humaine ?",
      axes: [
        {
          t: "L’histoire a un sens : elle progresse vers la liberté",
          sps: [
            {
              new: true,
              t: "Un dessein de la nature (Kant)",
              args: "L'insociable sociabilité pousse les hommes à rivaliser, donc à développer leurs talents et à se donner des lois. On peut lire l'histoire comme un progrès vers le droit et la paix entre les États.",
              auteurs: "Kant",
              ref: "Kant, Idée d’une histoire universelle, 4e et 7e propositions",
              limite: "Kant le présente comme une idée qui guide, non comme un savoir.",
            },
            {
              new: true,
              t: "La ruse de la raison (Hegel)",
              args: "L'histoire est le progrès de la conscience de la liberté. Les passions des grands hommes servent, sans qu'ils le sachent, des fins rationnelles.",
              auteurs: "Hegel",
              ref: "Hegel, La Raison dans l’histoire",
              limite: "Mais justifier tout ce qui est arrivé, c'est faire de l'histoire un tribunal sans appel, au mépris des victimes.",
            },
          ],
          limite: "Ce sens est-il dans les idées, ou dans les conditions matérielles ?",
        },
        {
          t: "Ce sens n’est pas écrit d’avance : les hommes font l’histoire, dans des conditions données",
          sps: [
            {
              new: true,
              t: "Les luttes de classes (Marx)",
              args: "L'histoire est celle des luttes de classes, et le communisme doit y mettre fin. Mais les hommes font leur propre histoire dans des conditions héritées du passé : rien n'arrive sans leur action.",
              auteurs: "Marx",
              ref: "Marx, Manifeste ; Le Dix-huit Brumaire",
              limite: "Prétendre connaître la fin de l'histoire a servi à justifier des régimes oppresseurs (Aron, L'Opium des intellectuels).",
            },
            {
              new: true,
              t: "Une histoire ouverte (Aron)",
              args: "L'historien reconstruit le passé depuis son présent ; aucun sens n'est connu d'avance. L'avenir dépend de décisions prises dans l'incertitude.",
              auteurs: "Raymond Aron",
              ref: "Aron, Introduction à la philosophie de l’histoire",
              limite: "Reste à savoir si l'idée même de progrès tient encore.",
            },
          ],
          limite: "Si le sens n'est pas donné, peut-on encore juger qu'une société est en avance sur une autre ?",
        },
        {
          t: "Le sens de l’histoire est une question de point de vue, et de mémoire",
          sps: [
            {
              new: true,
              t: "Histoire cumulative ou stationnaire (Lévi-Strauss)",
              args: "Nous jugeons les autres sociétés d'après notre propre direction, comme le voyageur d'un train juge des autres trains. Le progrès n'est pas une ligne unique : il naît de la coopération des cultures.",
              auteurs: "Lévi-Strauss",
              ref: "Lévi-Strauss, Race et histoire, chap. 6",
              limite: "Le relativisme ne doit pas interdire de juger les crimes.",
            },
            {
              new: true,
              t: "Servir la vie et sauver les vaincus (Nietzsche, Benjamin)",
              args: "Nietzsche veut une histoire qui serve la vie au lieu de l'écraser ; Benjamin demande de sauver la mémoire des vaincus que l'idée de progrès efface.",
              auteurs: "Nietzsche, Walter Benjamin",
              ref: "Nietzsche, Seconde considération inactuelle ; Benjamin, Sur le concept d’histoire",
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
      tag: "Histoire",
      tit: "Napoléon, « l’âme du monde à cheval »",
      body: "En 1806, à Iéna, Hegel voit passer Napoléon et écrit à un ami qu'il a vu « l'âme du monde » à cheval. L'ambition d'un homme sert, selon lui, une fin qui le dépasse : la diffusion du Code civil et des principes de la Révolution. C'est l'exemple type de la ruse de la raison, et aussi de ce qu'on peut lui reprocher : les morts des guerres napoléoniennes deviennent le prix d'un progrès.",
      lien: "→ État, Liberté",
    },
    {
      new: true,
      tag: "Mémoire",
      tit: "Les lois mémorielles et le travail de l’historien",
      body: "Quand une loi qualifie un événement passé (en France, la loi Gayssot de 1990 sur le négationnisme, ou la loi de 2001 reconnaissant la traite et l'esclavage comme crime contre l'humanité), elle soulève un débat : la mémoire d'une société et la recherche historique ont-elles les mêmes exigences ? Aron rappellerait que l'histoire se fait par la critique des sources, pas par décret.",
      lien: "→ Vérité, Justice",
    },
  ],
  accroches: [
    {
      new: true,
      type: "Citation",
      t: "Marx corrige Hegel : les grands événements se répètent, « la première fois comme tragédie, la seconde fois comme farce ». L'histoire bégaie-t-elle ?",
      src: "Marx, Le Dix-huit Brumaire de Louis Bonaparte, chap. I",
    },
  ],
  liens: ["Temps", "Vérité", "État", "Liberté", "Raison"],
  diss: [
    {new: true, q: "L’histoire a-t-elle un sens ?"},
    {new: true, q: "Les hommes font-ils l’histoire ?"},
    {new: true, q: "L’historien peut-il être impartial ?"},
    {new: true, q: "Faut-il oublier le passé pour agir ?"},
  ],
});
