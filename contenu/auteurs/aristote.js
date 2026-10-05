/* Fiche de l'auteur Aristote (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Aristote", {
  bio: "Philosophe grec (384–322 av. J.-C.), disciple de Platon. Sa philosophie est empirique et encyclopédique — il fonde la logique, l'éthique et la politique sur l'observation du réel.",
  courant: "Empirisme antique / Aristotélisme",
  periode: "Antiquité grecque",
  themes: ["eudaimonia", "vertu", "forme/matière", "animal politique", "technê / main"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Platon",
      sujet: "théorie des Idées",
      desc: "Platon sépare le monde sensible du monde intelligible ; Aristote ancre les formes dans la matière concrète.",
    },
    {
      dir: "oppose",
      auteur: "Kant",
      sujet: "bonheur et morale",
      desc: "Aristote fait du bonheur (eudaimonia) la fin ultime ; Kant sépare radicalement bonheur et devoir moral.",
    },
  ],
});
