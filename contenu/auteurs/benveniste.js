/* Fiche de l'auteur Benveniste (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Benveniste", {
  bio: "Linguiste français d'origine syrienne (1902–1976). Spécialiste de linguistique générale et de linguistique indo-européenne, il développe une réflexion sur la subjectivité dans le langage.",
  courant: "Linguistique / Phénoménologie du langage",
  periode: "XXe siècle",
  themes: [
    "signal/symbole",
    "subjectivité dans le langage",
    "énonciation",
    "personne grammaticale",
    "intersubjectivité",
  ],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Saussure",
      sujet: "arbitraire et symbole",
      desc: "Benveniste nuance Saussure : le lien n'est pas arbitraire pour le locuteur natif (il est motivé psychologiquement). Et distingue signal/symbole.",
    },
    {
      dir: "repond",
      auteur: "Aristote",
      sujet: "logos et animal",
      desc: "Aristote distinguait logos et phone ; Benveniste formalise cette distinction avec signal/symbole.",
    },
  ],
});
