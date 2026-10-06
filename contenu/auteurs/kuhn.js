/* Fiche de l'auteur Kuhn (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Kuhn", {
  bio: "Historien et philosophe des sciences américain (1922–1996). Sa notion de 'paradigme' et de 'révolution scientifique' a transformé l'épistémologie.",
  courant: "Histoire et philosophie des sciences",
  periode: "XXe siècle",
  naissance: 1922,
  mort: 1996,
  themes: ["paradigme", "révolution scientifique", "incommensurabilité", "science normale", "communauté scientifique"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Popper",
      sujet: "progrès scientifique",
      desc: "Popper voit la science comme progrès rationnel cumulatif ; Kuhn montre des ruptures paradigmatiques incommensurables.",
    },
    {
      dir: "prolonge",
      auteur: "Bachelard",
      sujet: "ruptures épistémologiques",
      desc: "Bachelard avait déjà analysé les 'obstacles épistémologiques' ; Kuhn formalise cette rupture dans la notion de révolution.",
    },
  ],
});
