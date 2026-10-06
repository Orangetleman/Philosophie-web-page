/* Fiche de l'auteur Beauvoir (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Beauvoir", {
  new: true,
  bio: "Simone de Beauvoir (1908–1986), philosophe et romancière française, figure de l'existentialisme avec Sartre. Le Deuxième Sexe (1949) analyse la condition des femmes comme une construction sociale et fonde le féminisme moderne.",
  courant: "Existentialisme / Féminisme",
  periode: "XXe siècle",
  naissance: 1908,
  mort: 1986,
  themes: ["on ne naît pas femme", "l'Autre", "situation et liberté", "morale de l'ambiguïté"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Sartre",
      sujet: "liberté et situation",
      desc: "Beauvoir partage avec Sartre l'idée que l'existence précède l'essence, mais insiste davantage sur le poids de la situation : on ne choisit pas librement d'être opprimée.",
    },
  ],
});
