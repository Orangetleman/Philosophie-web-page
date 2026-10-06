/* Fiche de l'auteur Averroès (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Averroès", {
  new: true,
  bio: "Ibn Rushd (1126–1198), juriste, médecin et philosophe de Cordoue. Ses commentaires d'Aristote lui valent, dans l'Europe latine, le surnom de « Commentateur ». Son Discours décisif défend le droit de la philosophie en terre d'islam.",
  courant: "Falsafa (aristotélisme arabe)",
  periode: "Moyen Âge",
  naissance: 1126,
  mort: 1198,
  themes: ["philosophie et Loi révélée", "interprétation", "unité de l'intellect"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Aristote",
      sujet: "commentaire d'Aristote",
      desc: "Averroès commente presque toute l'œuvre d'Aristote, qu'il tient pour le sommet de la raison humaine.",
    },
    {
      dir: "oppose",
      auteur: "Thomas d'Aquin",
      sujet: "l'unité de l'intellect",
      desc: "Thomas d'Aquin écrit en 1270 L'Unité de l'intellect contre les averroïstes : si l'intellect est unique pour tous les hommes, ce n'est plus cet homme-ci qui pense.",
    },
  ],
});
