/* Fiche de l'auteur Orwell (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Orwell", {
  bio: "Écrivain et journaliste britannique (1903–1950). Ses romans 1984 et La Ferme des animaux sont des analyses politiques du totalitarisme sous forme littéraire.",
  courant: "Littérature politique / Socialisme démocratique",
  periode: "XXe siècle",
  naissance: 1903,
  mort: 1950,
  themes: ["novlangue", "totalitarisme", "propagande", "langage et pouvoir", "doublethink"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Hegel",
      sujet: "langage et pensée",
      desc: "Hegel pose que c'est dans les mots que nous pensons ; Orwell tire la conséquence politique : contrôler les mots, c'est contrôler la pensée.",
    },
    {
      dir: "prolonge",
      auteur: "Hannah Arendt",
      sujet: "totalitarisme",
      desc: "Arendt analyse le totalitarisme politiquement ; Orwell le représente littérairement et insiste sur le rôle du langage dans sa propagation.",
    },
  ],
});
