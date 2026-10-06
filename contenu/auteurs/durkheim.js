/* Fiche de l'auteur Durkheim (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Durkheim", {
  bio: "Sociologue français (1858–1917), fondateur de la sociologie française moderne. Son analyse du sacré, du suicide et de la division du travail établit la sociologie comme science autonome.",
  courant: "Sociologie positiviste",
  periode: "XIXe–XXe siècle",
  naissance: 1858,
  mort: 1917,
  themes: [
    "sacré/profane",
    "fait social",
    "conscience collective",
    "anomie",
    "solidarité organique",
    "forme élémentaire de la vie religieuse",
  ],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Comte",
      sujet: "sociologie scientifique",
      desc: "Durkheim réalise le programme positiviste de Comte : faire de la sociologie une science autonome traitant les faits sociaux « comme des choses ».",
    },
    {
      dir: "oppose",
      auteur: "Freud",
      sujet: "origine de la religion",
      desc: "Freud explique la religion par des dynamiques inconscientes individuelles (meurtre du père) ; Durkheim par des dynamiques collectives (la société qui s'adore elle-même).",
    },
    {
      dir: "prolonge",
      auteur: "Marx",
      sujet: "fonction sociale",
      desc: "Comme Marx, Durkheim cherche la fonction sociale de la religion — mais il l'analyse comme cohésion (solidarité), non comme aliénation à dépasser.",
    },
  ],
});
