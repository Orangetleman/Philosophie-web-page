/* Fiche de l'auteur Platon (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Platon", {
  bio: "Philosophe grec (v. 428–348 av. J.-C.), disciple de Socrate. Il développe la théorie des Idées : le monde sensible n'est que l'ombre d'un monde intelligible parfait.",
  courant: "Idéalisme platonicien",
  periode: "Antiquité grecque",
  naissance: -428,
  mort: -348,
  datesApprox: true,
  themes: ["théorie des Idées", "justice", "âme", "cité idéale", "imitation (mimésis)"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Aristote",
      sujet: "nature des Idées",
      desc: "Aristote refuse les Idées séparées de Platon : la forme est immanente à la matière concrète, non transcendante.",
    },
    {
      dir: "repond",
      auteur: "Rousseau",
      sujet: "contrat et cité",
      desc: "Rousseau hérite de Platon l'idée que l'État forme les citoyens, mais en renversant la hiérarchie : c'est le peuple qui est souverain.",
    },
  ],
});
