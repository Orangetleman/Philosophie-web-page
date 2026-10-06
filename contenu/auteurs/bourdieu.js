/* Fiche de l'auteur Bourdieu (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Bourdieu", {
  bio: "Sociologue français (1930–2002). Il analyse les mécanismes de reproduction sociale et développe les concepts d'habitus, de capital culturel et de violence symbolique.",
  courant: "Sociologie critique",
  periode: "XXe siècle",
  naissance: 1930,
  mort: 2002,
  themes: ["habitus", "capital culturel", "violence symbolique", "reproduction sociale", "goût de classe"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Sartre",
      sujet: "liberté et déterminisme",
      desc: "Sartre affirme une liberté radicale ; Bourdieu montre que nos choix sont conditionnés par l'habitus — mais la connaissance des déterminismes ouvre un espace de liberté.",
    },
    {
      dir: "prolonge",
      auteur: "Marx",
      sujet: "domination",
      desc: "Bourdieu prolonge Marx en ajoutant la dimension symbolique : la domination culturelle reproduit les inégalités de classe.",
    },
  ],
});
