/* Fiche de l'auteur Maïmonide (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Maïmonide", {
  new: true,
  bio: "Moïse Maïmonide (1138–1204), rabbin, médecin et philosophe juif né à Cordoue, mort au Caire. Son Guide des égarés concilie la Loi juive et la philosophie d'Aristote ; il est lu par Thomas d'Aquin et par Spinoza.",
  courant: "Philosophie juive médiévale",
  periode: "Moyen Âge",
  naissance: 1138,
  mort: 1204,
  themes: ["théologie négative", "interprétation des Écritures", "foi et raison"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Aristote",
      sujet: "philosophie et Loi",
      desc: "Maïmonide suit Aristote pour le monde sublunaire, mais refuse sa thèse de l'éternité du monde, qu'aucune démonstration n'établit selon lui.",
    },
  ],
});
