/* Fiche de l'auteur Russell (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Russell", {
  bio: "Philosophe, logicien et mathématicien britannique (1872–1970). Co-auteur des Principia Mathematica avec Whitehead, prix Nobel de littérature (1950), militant pacifiste. Critique radical de la religion (« Pourquoi je ne suis pas chrétien »), théoricien du problème de l'induction et de la « théière de Russell » comme image du fardeau de la preuve.",
  courant: "Philosophie analytique / Empirisme logique",
  periode: "XIXe–XXe siècle",
  naissance: 1872,
  mort: 1970,
  themes: ["problème de l'induction", "théière de Russell", "logique", "athéisme rationnel", "science et religion"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Pascal",
      sujet: "pari et croyance",
      desc: "Pascal défend le pari de la foi ; Russell renverse la charge de la preuve avec sa « théière » : c'est à celui qui affirme une entité (Dieu) d'en apporter la preuve, non à celui qui la nie.",
    },
    {
      dir: "prolonge",
      auteur: "Hume",
      sujet: "problème de l'induction",
      desc: "Russell radicalise la critique humienne de l'induction : aucune accumulation finie d'observations ne prouve une régularité future. Toute connaissance empirique est conjecturale.",
    },
    {
      dir: "repond",
      auteur: "Popper",
      sujet: "science et conjecture",
      desc: "Popper hérite du problème russellien : si l'induction ne prouve rien, c'est la réfutabilité (et non la confirmation) qui définit la science.",
    },
  ],
});
