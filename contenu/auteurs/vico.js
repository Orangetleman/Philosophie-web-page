/* Fiche de l'auteur Vico (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Vico", {
  new: true,
  bio: "Giambattista Vico (1668–1744), professeur de rhétorique à Naples. Contre Descartes, il soutient qu'on ne connaît vraiment que ce qu'on a fait ; sa Science nouvelle (1725, refondue en 1744) en tire une science de l'histoire des nations.",
  courant: "Philosophie de l'histoire",
  periode: "XVIIIe siècle",
  themes: ["verum factum", "science de l'histoire", "trois âges", "corsi e ricorsi"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Descartes",
      sujet: "le critère du vrai",
      desc: "Vico refuse le critère cartésien de l'idée claire et distincte : l'esprit se perçoit sans se faire, donc sans se connaître vraiment ; le critère du vrai est de l'avoir fait.",
    },
  ],
});
