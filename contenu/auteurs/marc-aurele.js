/* Fiche de l'auteur Marc Aurèle (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Marc Aurèle", {
  new: true,
  bio: "Empereur romain de 161 à 180, né en 121. Pendant ses campagnes sur le Danube, il écrit en grec, pour lui seul, des notes d'exercice spirituel, publiées sous le titre Pensées pour moi-même. C'est le dernier grand stoïcien.",
  courant: "Stoïcisme",
  periode: "Antiquité romaine",
  naissance: 121,
  mort: 180,
  themes: ["ce qui dépend de nous", "retraite intérieure", "présent", "mort"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Épictète",
      sujet: "ce qui dépend de nous",
      desc: "Marc Aurèle remercie son maître Rusticus de lui avoir fait lire les Entretiens d'Épictète (Pensées, I, 7) ; il en reprend la distinction entre ce qui dépend de nous et ce qui n'en dépend pas.",
    },
  ],
});
