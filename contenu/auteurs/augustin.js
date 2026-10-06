/* Fiche de l'auteur Augustin (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Augustin", {
  bio: "Théologien et philosophe romain d'Afrique du Nord (354–430), Père et docteur de l'Église. Ses Confessions inaugurent l'autobiographie spirituelle ; sa Cité de Dieu fonde la philosophie chrétienne de l'histoire.",
  courant: "Patristique / Augustinisme",
  periode: "Antiquité tardive",
  naissance: 354,
  mort: 430,
  themes: [
    "foi",
    "sentiment de finitude",
    "amour de Dieu",
    "libre arbitre",
    "cité de Dieu",
    "intériorité",
    "temps comme distentio animi",
  ],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Platon",
      sujet: "intériorité et vérité",
      desc: "Augustin christianise le platonisme : la vérité ne se trouve pas hors de soi mais dans l'intériorité (« in interiore homine habitat veritas »).",
    },
    {
      dir: "oppose",
      auteur: "Pascal",
      sujet: "finitude et grâce",
      desc: "Pascal hérite de l'augustinisme (Port-Royal) la centralité du sentiment de finitude et de la grâce — mais radicalise le pari face à l'incertitude rationnelle.",
    },
    {
      dir: "oppose",
      auteur: "Feuerbach",
      sujet: "projection religieuse",
      desc: "Augustin affirme que l'âme cherche Dieu ; Feuerbach renverse : c'est l'homme qui projette en Dieu ses propres aspirations infinies.",
    },
  ],
});
