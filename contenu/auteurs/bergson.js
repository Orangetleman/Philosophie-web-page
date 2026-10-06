/* Fiche de l'auteur Bergson (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Bergson", {
  bio: "Philosophe français (1859–1941). Il développe une philosophie de la durée et de l'élan vital, en opposition au mécanisme et au déterminisme scientiste.",
  courant: "Vitalisme / Philosophie de la durée",
  periode: "XIXe–XXe siècle",
  naissance: 1859,
  mort: 1941,
  themes: ["durée", "élan vital", "homo faber", "mémoire", "intuition"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Descartes",
      sujet: "mécanisme",
      desc: "Descartes réduit le corps à une machine ; Bergson oppose à ce mécanisme la durée vécue, irréductible à l'espace et au calcul.",
    },
    {
      dir: "prolonge",
      auteur: "Aristote",
      sujet: "évolution et finalité",
      desc: "Bergson reprend l'idée d'une finalité dans la nature mais la dynamise : l'élan vital est créateur, imprévisible, non téléologique.",
    },
  ],
});
