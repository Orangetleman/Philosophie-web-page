/* Fiche de l'auteur D'Holbach (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("D'Holbach", {
  bio: "Philosophe français des Lumières (1723–1789). Il défend un matérialisme et un athéisme radical : la nature obéit à des lois mécaniques, et la liberté humaine est une illusion.",
  courant: "Matérialisme / Athéisme des Lumières",
  periode: "XVIIIe siècle",
  naissance: 1723,
  mort: 1789,
  themes: ["déterminisme physique", "matérialisme", "athéisme", "liberté illusoire", "nature mécaniste"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Descartes",
      sujet: "dualisme et liberté",
      desc: "Descartes maintient la liberté de l'âme ; D'Holbach étend le mécanisme cartésien à l'homme entier — il n'y a plus de place pour le libre arbitre.",
    },
    {
      dir: "prolonge",
      auteur: "Spinoza",
      sujet: "déterminisme",
      desc: "D'Holbach radicalise le déterminisme spinoziste en un matérialisme physique sans Dieu ni Substance.",
    },
  ],
});
