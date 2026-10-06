/* Fiche de l'auteur Sartre (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Sartre", {
  bio: "Philosophe français (1905–1980), chef de file de l'existentialisme. Sa thèse centrale : l'existence précède l'essence — l'homme se définit uniquement par ses actes.",
  courant: "Existentialisme / Phénoménologie",
  periode: "XXe siècle",
  naissance: 1905,
  mort: 1980,
  themes: ["liberté radicale", "mauvaise foi", "existence précède l'essence", "intersubjectivité", "engagement"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Freud",
      sujet: "inconscient et liberté",
      desc: "Sartre refuse l'inconscient : admettre des forces qui nous déterminent à notre insu, c'est être de mauvaise foi.",
    },
    {
      dir: "repond",
      auteur: "Bourdieu",
      sujet: "déterminisme social et liberté",
      desc: "Bourdieu répond à Sartre : la liberté n'est pas pure spontanéité — elle est conditionnée par les structures sociales, mais leur connaissance la rend possible.",
    },
    {
      dir: "prolonge",
      auteur: "Hegel",
      sujet: "conscience de soi",
      desc: "Sartre hérite de Hegel la structure de la conscience (pour-soi/en-soi) mais refuse la réconciliation dialectique finale.",
    },
    {
      dir: "oppose",
      auteur: "Spinoza",
      sujet: "liberté et déterminisme",
      desc: "Sartre fait de l'homme l'auteur radical de ses actes, « condamné à être libre » ; Spinoza tient au contraire le libre arbitre pour une illusion née de l'ignorance des causes qui nous déterminent.",
    },
  ],
});
