/* Fiche de l'auteur Anscombe (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Anscombe", {
  new: true,
  bio: "Elizabeth Anscombe (1919–2001), philosophe britannique, élève, traductrice et exécutrice testamentaire de Wittgenstein. Elle renouvelle la philosophie de l'action (L'Intention, 1957) et relance l'éthique des vertus (La Philosophie morale moderne, 1958).",
  courant: "Philosophie analytique / Éthique des vertus",
  periode: "XXe siècle",
  themes: ["intention", "action et description", "critique du conséquentialisme", "éthique des vertus"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Wittgenstein",
      sujet: "l'analyse du langage de l'action",
      desc: "Anscombe applique la méthode de Wittgenstein à l'action : comprendre une intention, c'est voir quel usage nous faisons de la question pourquoi.",
    },
    {
      dir: "oppose",
      auteur: "Mill",
      sujet: "juger un acte",
      desc: "Anscombe forge le mot conséquentialisme pour critiquer les morales qui, après Mill, jugent un acte à ses seules conséquences.",
    },
  ],
});
