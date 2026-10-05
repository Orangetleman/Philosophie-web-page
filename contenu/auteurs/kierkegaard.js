/* Fiche de l'auteur Kierkegaard (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Kierkegaard", {
  bio: "Philosophe et théologien danois (1813–1855), considéré comme le père de l'existentialisme. Sa pensée explore la subjectivité, l'angoisse, le désespoir et le saut de la foi face à l'absurde.",
  courant: "Existentialisme chrétien",
  periode: "XIXe siècle",
  themes: ["foi", "angoisse", "saut", "stades existentiels", "subjectivité", "absurde", "chevalier de la foi"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Hegel",
      sujet: "subjectivité vs système",
      desc: "Kierkegaard refuse le système hégélien : la vérité est subjectivité, l'existence singulière échappe à la totalité dialectique.",
    },
    {
      dir: "prolonge",
      auteur: "Pascal",
      sujet: "angoisse et foi",
      desc: "Kierkegaard prolonge l'augustinisme pascalien : la foi n'est pas tranquille certitude mais saut dans l'angoisse, en l'absence de toute preuve rationnelle.",
    },
    {
      dir: "oppose",
      auteur: "Kant",
      sujet: "morale et foi",
      desc: "Kant subordonne la foi à la morale ; Kierkegaard affirme que la foi peut <em>suspendre</em> l'éthique générale au profit d'un absolu personnel (Abraham et Isaac).",
    },
  ],
});
