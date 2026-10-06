/* Fiche de l'auteur Camus (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Camus", {
  bio: "Écrivain, dramaturge et philosophe français (1913–1960), prix Nobel de littérature 1957. Penseur de l'<strong>absurde</strong> (Le Mythe de Sisyphe, 1942) puis de la <strong>révolte</strong> (L'Homme révolté, 1951), il refusait l'étiquette d'« existentialiste ». Aussi romancier (L'Étranger, 1942 ; La Peste, 1947).",
  courant: "Philosophie de l'absurde",
  periode: "XXe siècle",
  naissance: 1913,
  mort: 1960,
  themes: ["absurde", "suicide", "révolte", "Sisyphe", "sens de l'existence"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Pascal",
      sujet: "l'espérance face au tragique",
      desc: "Là où Pascal mise sur Dieu et voit dans le divertissement une fuite, Camus refuse tout « saut » dans l'espérance religieuse : il faut vivre l'absurde avec lucidité, par la révolte, sans au-delà.",
    },
    {
      dir: "prolonge",
      auteur: "Nietzsche",
      sujet: "affirmation tragique de la vie",
      desc: "Comme Nietzsche avec l'amor fati et l'éternel retour, Camus invite à dire oui à une existence sans arrière-monde : « Il faut imaginer Sisyphe heureux. »",
    },
  ],
});
