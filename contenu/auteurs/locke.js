/* Fiche de l'auteur Locke (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Locke", {
  bio: "Philosophe anglais (1632–1704). Père du libéralisme politique, il défend les droits naturels inaliénables et la légitimité de la révolution contre un gouvernement tyrannique.",
  courant: "Empirisme / Libéralisme",
  periode: "XVIIe siècle",
  themes: ["droits naturels", "contrat révocable", "propriété", "identité mémorielle", "tolérance"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Hobbes",
      sujet: "souveraineté",
      desc: "Hobbes veut un souverain absolu irrévocable ; Locke pose que le contrat est révocable si le gouvernement viole les droits naturels.",
    },
    {
      dir: "prolonge",
      auteur: "Mill",
      sujet: "libéralisme",
      desc: "Mill hérite de Locke le souci de protéger les libertés individuelles contre l'État et la tyrannie de la majorité.",
    },
  ],
});
