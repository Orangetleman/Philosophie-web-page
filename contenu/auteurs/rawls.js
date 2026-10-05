/* Fiche de l'auteur Rawls (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Rawls", {
  bio: "Philosophe politique américain (1921–2002). Sa Théorie de la justice propose un modèle fondé sur le 'voile d'ignorance' et le principe de différence.",
  courant: "Libéralisme égalitaire",
  periode: "XXe siècle",
  themes: [
    "voile d'ignorance",
    "principe de différence",
    "équité",
    "désobéissance civile légitime",
    "justice comme équité",
  ],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Robert Nozick",
      sujet: "redistribution",
      desc: "Nozick défend la propriété absolue et refuse toute redistribution ; Rawls admet les inégalités si elles bénéficient aux plus défavorisés.",
    },
    {
      dir: "prolonge",
      auteur: "Kant",
      sujet: "universalisme moral",
      desc: "Le voile d'ignorance de Rawls est un dispositif kantien : trouver des principes que tout agent rationnel pourrait universaliser.",
    },
  ],
});
