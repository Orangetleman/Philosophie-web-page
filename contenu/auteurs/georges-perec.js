/* Fiche de l'auteur Georges Perec (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Georges Perec", {
  bio: "Écrivain français (1936–1982), membre majeur de l'OULIPO (Ouvroir de Littérature Potentielle, fondé par Queneau et Le Lionnais en 1960). La Disparition (1969) est un roman écrit sans la lettre 'e'.",
  courant: "OULIPO / Littérature à contraintes",
  periode: "XXe siècle",
  themes: ["lipogramme", "contrainte créatrice", "palindrome", "jeux littéraires", "langage comme matériau"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Tristan Tzara",
      sujet: "langage comme matériau",
      desc: "Tzara libérait le langage par le hasard, Perec par la contrainte radicale. Deux faces d'un même refus de la fonction utilitaire du langage.",
    },
    {
      dir: "oppose",
      auteur: "André Breton",
      sujet: "hasard vs contrainte",
      desc: "Le surréalisme cultive le hasard et l'automatisme ; l'OULIPO impose au contraire des règles formelles strictes. Pourtant les deux démarches révèlent que le langage peut être fin en soi.",
    },
  ],
});
