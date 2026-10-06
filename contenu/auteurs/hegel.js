/* Fiche de l'auteur Hegel (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Hegel", {
  bio: "Philosophe allemand (1770–1831), figure majeure de l'idéalisme. Sa dialectique (thèse/antithèse/synthèse) est une méthode pour comprendre le devenir de l'Esprit dans l'histoire.",
  courant: "Idéalisme allemand",
  periode: "XVIIIe–XIXe siècle",
  naissance: 1770,
  mort: 1831,
  themes: ["dialectique", "maître/esclave", "Esprit", "liberté objective", "État éthique"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Kant",
      sujet: "liberté et institutions",
      desc: "Kant place la liberté dans la raison individuelle ; Hegel la situe dans les institutions concrètes (famille, société civile, État).",
    },
    {
      dir: "oppose",
      auteur: "Marx",
      sujet: "moteur de l'histoire",
      desc: "Marx 'retourne' Hegel sur ses pieds : ce n'est pas l'Esprit mais les conditions matérielles qui font l'histoire.",
    },
    {
      dir: "repond",
      auteur: "Rousseau",
      sujet: "volonté générale",
      desc: "Hegel reprend la volonté générale de Rousseau mais la réalise dans l'État comme vie éthique concrète, non comme contrat abstrait.",
    },
  ],
});
