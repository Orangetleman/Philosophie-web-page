/* Journal des nouveautés du site, le plus récent en premier (étape 6, oct.
   2026). Remplace, pour les visiteurs, les badges « Nouveau » sans date :
   affiché dans Explorer › Nouveautés. Une entrée par mise en ligne notable :
   date (AAAA-MM-JJ), titre, texte, et des liens vers les pages concernées
   (adresses #/… du site). Le vérificateur (question 14) contrôle dates et
   adresses. */
NOUVEAUTES([
  {date: "2026-11-15", titre: "Des Réglages plus clairs, et tes données entre tes mains",
    texte: "Les ⚙ Réglages sont rangés en cinq cartes, avec un sommaire et des interrupteurs. Une nouvelle carte « Mes données » permet de télécharger tout ce que le site garde sur toi, de l'effacer de ton appareil ou de supprimer ton compte. Le site ne contacte plus aucun service extérieur pour s'afficher (police et QR code servis par lui-même). Mentions légales, données personnelles et conditions d'utilisation : lien « Informations légales » en bas de la barre latérale.",
    liens: []},
  {date: "2026-10-06", titre: "Thème clair, frise, graphe et sujets du bac",
    texte: "Un thème clair sur fond papier et trois tailles de texte (⚙ Réglages). Un nouvel onglet Explorer : la frise des auteurs, le graphe des idées et les sujets tombés au bac depuis 2021. Moins de liens dans les textes, et utilisables au clavier. Chaque notion se télécharge en fiche imprimable.",
    liens: [{l: "Frise des auteurs", h: "#/explorer/frise"}, {l: "Graphe des idées", h: "#/explorer/graphe"}, {l: "Sujets du bac", h: "#/explorer/sujets"}]},
  {date: "2026-10-06", titre: "Tout le programme de 2003, en hors programme",
    texte: "Sept notions de plus, celles de l'ancien programme : la perception, l'existence, le vivant, la matière et l'esprit, l'interprétation, la démonstration, la société.",
    liens: [{l: "Perception", h: "#/notion/perception"}, {l: "Existence", h: "#/notion/existence"}, {l: "Société", h: "#/notion/societe"}]},
  {date: "2026-10-06", titre: "Le hors programme : Autrui, le Désir, l'Histoire",
    texte: "Des notions au-delà du bac, clairement marquées « Hors programme » et masquables dans les Réglages. Chaque auteur porte son statut : au programme, hors liste, hors programme.",
    liens: [{l: "Autrui", h: "#/notion/autrui"}, {l: "Désir", h: "#/notion/desir"}, {l: "Histoire", h: "#/notion/histoire"}]},
  {date: "2026-10-06", titre: "Les 84 auteurs de la liste officielle",
    texte: "Les 39 auteurs du programme qui manquaient ont leur fiche (Montaigne, Machiavel, Beauvoir, Wittgenstein…), avec l'étiquette « Au programme ». 72 citations ont été corrigées (référence fausse, phrase retouchée, formule moderne prêtée à un ancien).",
    liens: [{l: "Montaigne", h: "#/auteur/Montaigne"}, {l: "Beauvoir", h: "#/auteur/Beauvoir"}]},
  {date: "2026-10-05", titre: "Une adresse par page, une recherche dans tout le contenu",
    texte: "Chaque notion, fiche ou concept a son adresse : on peut la partager, et le bouton « précédent » du navigateur marche. La recherche (Ctrl+K) trouve aussi les citations, les œuvres, les sujets, les textes et les exemples.",
    liens: []},
  {date: "2026-10-05", titre: "Le quiz réparé",
    texte: "Les sessions mélangent enfin notions et types de cartes, la question ne donne plus la réponse, la progression ne glisse plus d'une carte à l'autre et se synchronise sans perte entre appareils.",
    liens: []},
]);
