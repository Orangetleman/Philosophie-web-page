/* Fiche de l'auteur Iris Murdoch (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Iris Murdoch", {
  new: true,
  bio: "Philosophe et romancière britannique (1919–1999), enseignante à Oxford, autrice de vingt-six romans. Dans La Souveraineté du bien (1970), elle s'oppose aux morales du choix et place au cœur de la vie morale l'attention portée au réel.",
  courant: "Platonisme moral",
  periode: "XXe siècle",
  naissance: 1919,
  mort: 1999,
  themes: ["attention", "décentrement", "le Bien", "art et vertu"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Simone Weil",
      sujet: "l'attention",
      desc: "Murdoch dit emprunter à Simone Weil le mot attention : un regard juste et aimant porté sur une réalité individuelle.",
    },
    {
      dir: "oppose",
      auteur: "Sartre",
      sujet: "la morale du choix",
      desc: "Murdoch, qui a consacré à Sartre son premier livre (1953), critique l'image d'un sujet moral réduit à une volonté qui choisit dans le vide.",
    },
  ],
});
