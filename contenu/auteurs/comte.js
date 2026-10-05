/* Fiche de l'auteur Comte (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Comte", {
  bio: "Philosophe français (1798–1857), fondateur du <strong>positivisme</strong> et inventeur du mot « sociologie ». Sa <em>loi des trois états</em> (théologique → métaphysique → positif) propose une philosophie de l'histoire où la science finit par remplacer la religion et la métaphysique dans l'explication du monde. Cours de philosophie positive (1830-1842), Système de politique positive (1851-1854).",
  courant: "Positivisme",
  periode: "XIXe siècle",
  themes: ["positivisme", "loi des trois états", "hiérarchie des sciences", "sociologie", "religion de l'Humanité"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Stephen Jay Gould",
      sujet: "science et religion",
      desc: "Comte voit la science remplacer la religion (loi des trois états) ; Gould plaide au contraire pour une coexistence des magistères (NOMA).",
    },
    {
      dir: "prolonge",
      auteur: "Durkheim",
      sujet: "sociologie scientifique",
      desc: "Durkheim réalise le programme positiviste de Comte en fondant une sociologie autonome traitant les faits sociaux « comme des choses ».",
    },
    {
      dir: "oppose",
      auteur: "Bachelard",
      sujet: "linéarité du progrès",
      desc: "Comte décrit une marche linéaire vers le savoir positif ; Bachelard montre que la science avance par <em>ruptures</em> avec ses propres états antérieurs, non par accumulation.",
    },
  ],
});
