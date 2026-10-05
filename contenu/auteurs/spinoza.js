/* Fiche de l'auteur Spinoza (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Spinoza", {
  bio: "Philosophe néerlandais (1632–1677). Il développe un panthéisme rationnel : Dieu est identique à la Nature. Sa philosophie vise la libération par la connaissance.",
  courant: "Rationalisme / Panthéisme",
  periode: "XVIIe siècle",
  themes: ["Dieu-Nature", "liberté comme nécessité comprise", "conatus", "déterminisme", "Éthique"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Descartes",
      sujet: "rationalisme",
      desc: "Spinoza radicalise le rationalisme cartésien en éliminant le dualisme et en construisant une éthique more geometrico.",
    },
    {
      dir: "oppose",
      auteur: "Sartre",
      sujet: "liberté",
      desc: "Sartre affirme une liberté absolue ; Spinoza montre que le libre arbitre est une illusion née de l'ignorance des causes.",
    },
    {
      dir: "prolonge",
      auteur: "Engels",
      sujet: "liberté et nécessité",
      desc: "Engels reprend Spinoza : la liberté consiste dans la connaissance des nécessités naturelles, non dans leur absence.",
    },
  ],
});
