/* Fiche de l'auteur Barthes (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Barthes", {
  bio: "Sémiologue, critique et théoricien de la littérature français (1915–1980). Héritier de Saussure, il étend l'analyse des signes à toute la culture (Mythologies, 1957) avant d'explorer, dans une écriture plus intime, le sujet et ses affects (Fragments d'un discours amoureux, 1977 ; La Chambre claire, 1980).",
  courant: "Structuralisme / Sémiologie",
  periode: "XXe siècle",
  themes: ["sémiologie", "mythologies", "discours amoureux", "temps vécu de l'attente", "écriture"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Saussure",
      sujet: "science des signes",
      desc: "Barthes étend la linguistique de Saussure à tous les systèmes de signification (mode, publicité, mythes modernes) : la sémiologie devient une lecture critique de la culture.",
    },
    {
      dir: "prolonge",
      auteur: "Bergson",
      sujet: "temps vécu",
      desc: "L'attente amoureuse décrite par Barthes illustre la durée bergsonienne : un temps qualitatif, étiré ou contracté par l'affect, irréductible au temps mesuré de l'horloge.",
    },
  ],
});
