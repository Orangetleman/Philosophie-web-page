/* Fiche de l'auteur Avicenne (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Avicenne", {
  new: true,
  bio: "Ibn Sīnā (980–1037), philosophe et médecin persan. Son Canon de la médecine fut enseigné en Europe jusqu'au XVIIe siècle ; son Livre de la guérison (al-Shifāʾ) réélabore toute la philosophie d'Aristote et marque profondément la scolastique latine.",
  courant: "Falsafa (aristotélisme arabe)",
  periode: "Moyen Âge",
  themes: ["homme volant", "âme et corps", "essence et existence", "intellect"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Aristote",
      sujet: "l'âme et l'intellect",
      desc: "Avicenne réécrit en encyclopédie la philosophie d'Aristote, mais il soutient, contre lui, que l'âme peut subsister sans le corps.",
    },
  ],
});
