/* Fiche de l'auteur Popper (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Popper", {
  bio: "Philosophe des sciences austro-britannique (1902–1994). Il développe le principe de falsifiabilité (réfutabilité) comme critère de démarcation entre science et non-science.",
  courant: "Épistémologie critique",
  periode: "XXe siècle",
  themes: [
    "falsifiabilité",
    "conjectures et réfutations",
    "société ouverte",
    "démocratie",
    "critique du totalitarisme",
  ],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Kuhn",
      sujet: "progrès scientifique",
      desc: "Kuhn voit le progrès par révolutions de paradigmes ; Popper par conjectures et réfutations cumulatives.",
    },
    {
      dir: "oppose",
      auteur: "Marx",
      sujet: "scientificité",
      desc: "Popper juge le marxisme non-scientifique car non-réfutable : toute contre-évidence est réinterprétée pour confirmer la théorie.",
    },
  ],
});
