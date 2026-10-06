/* Fiche de l'auteur Bacon (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Bacon", {
  new: true,
  bio: "Francis Bacon (1561–1626), juriste et chancelier d'Angleterre. Son Novum Organum (1620), « nouvel instrument » opposé à l'Organon d'Aristote, propose une méthode expérimentale et fait de la science un moyen de puissance sur la nature.",
  courant: "Empirisme",
  periode: "XVIIe siècle",
  naissance: 1561,
  mort: 1626,
  themes: ["induction", "idoles", "savoir et pouvoir", "méthode expérimentale"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Aristote",
      sujet: "la méthode des sciences",
      desc: "Contre la logique d'Aristote, qui tire des conséquences de principes trop vite admis, Bacon veut remonter lentement de l'expérience aux lois par une induction méthodique.",
    },
  ],
});
