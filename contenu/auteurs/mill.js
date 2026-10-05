/* Fiche de l'auteur Mill (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Mill", {
  bio: "Philosophe et économiste britannique (1806–1873). Chef de file de l'utilitarisme, il défend aussi les libertés individuelles contre la 'tyrannie de la majorité'.",
  courant: "Utilitarisme / Libéralisme",
  periode: "XIXe siècle",
  themes: [
    "principe de non-nuisance",
    "bonheur du plus grand nombre",
    "liberté d'expression",
    "utilitarisme",
    "plaisirs inférieurs/supérieurs",
  ],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Kant",
      sujet: "fondements de la morale",
      desc: "Kant fonde la morale sur le devoir rationnel ; Mill la fonde sur les conséquences (bonheur produit).",
    },
    {
      dir: "prolonge",
      auteur: "Locke",
      sujet: "libertés individuelles",
      desc: "Mill hérite de Locke et radicalise la défense des libertés individuelles, notamment la liberté d'expression absolue.",
    },
  ],
});
