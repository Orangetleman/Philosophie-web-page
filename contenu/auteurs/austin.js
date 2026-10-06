/* Fiche de l'auteur Austin (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Austin", {
  bio: "Philosophe britannique (1911–1960), fondateur de la philosophie du langage ordinaire. Sa distinction performatif/constatif révolutionne la conception du langage.",
  courant: "Philosophie analytique du langage",
  periode: "XXe siècle",
  themes: [
    "performatif/constatif",
    "actes de langage",
    "conditions de félicité",
    "langage ordinaire",
    "dire c'est faire",
  ],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Wittgenstein",
      sujet: "langage ordinaire",
      desc: "Austin partage avec le second Wittgenstein, celui des Recherches philosophiques (et non du Tractatus), l'idée que la signification se comprend par l'usage ordinaire des mots ; il a pourtant développé à Oxford sa propre méthode, en grande partie indépendamment de lui.",
      modified: true,
    },
    {
      dir: "repond",
      auteur: "Jakobson",
      sujet: "fonctions du langage",
      desc: "Jakobson catalogue les fonctions ; Austin montre que le langage peut être une action à part entière, pas seulement de la communication.",
    },
  ],
});
