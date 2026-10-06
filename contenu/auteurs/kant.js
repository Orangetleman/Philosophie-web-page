/* Fiche de l'auteur Kant (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Kant", {
  bio: "Philosophe allemand (1724–1804), auteur des trois Critiques. Sa 'révolution copernicienne' : c'est le sujet qui structure l'expérience possible, non l'inverse.",
  courant: "Idéalisme transcendantal",
  periode: "XVIIIe siècle",
  naissance: 1724,
  mort: 1804,
  themes: ["impératif catégorique", "autonomie morale", "beau sans concept", "génie", "devoir"],
  dialogues: [
    {
      dir: "repond",
      auteur: "Hume",
      sujet: "fondements de la connaissance",
      desc: "Hume réveille Kant de son 'sommeil dogmatique' — en réponse, Kant montre que la causalité est une catégorie a priori de l'entendement.",
    },
    {
      dir: "oppose",
      auteur: "Mill",
      sujet: "fondements de la morale",
      desc: "Mill fonde la morale sur le bonheur ; Kant refuse tout fondement empirique — le devoir est inconditionnel, indépendant des conséquences.",
    },
    {
      dir: "oppose",
      auteur: "Aristote",
      sujet: "bonheur et morale",
      desc: "Aristote fait du bonheur la fin ultime ; Kant les sépare radicalement — le bonheur ne peut fonder la morale.",
    },
  ],
});
