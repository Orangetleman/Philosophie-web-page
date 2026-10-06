/* Fiche de l'auteur Adam Smith (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Adam Smith", {
  new: true,
  bio: "Philosophe et économiste écossais (1723–1790), professeur de philosophie morale à Glasgow. Il fonde la morale sur la sympathie (Théorie des sentiments moraux, 1759) puis l'économie politique classique (Recherches sur la nature et les causes de la richesse des nations, 1776).",
  courant: "Lumières écossaises / Économie politique classique",
  periode: "XVIIIe siècle",
  naissance: 1723,
  mort: 1790,
  themes: ["division du travail", "intérêt et échange", "main invisible", "sympathie", "spectateur impartial"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Hume",
      sujet: "sympathie et morale",
      desc: "Ami proche de Hume, Smith reprend son idée que la morale vient du sentiment, non de la raison, et la développe autour de la sympathie.",
    },
  ],
});
