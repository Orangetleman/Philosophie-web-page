/* Fiche de l'auteur Jaspers (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Jaspers", {
  new: true,
  bio: "Karl Jaspers (1883–1969), psychiatre puis philosophe allemand. Écarté de l'enseignement sous le nazisme (sa femme était juive), il pose après la guerre la question de la culpabilité allemande. Il fut le directeur de thèse et l'ami d'Hannah Arendt.",
  courant: "Philosophie de l'existence",
  periode: "XXe siècle",
  naissance: 1883,
  mort: 1969,
  themes: ["situations-limites", "existence", "communication", "foi philosophique", "culpabilité"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Kierkegaard",
      sujet: "l'existence",
      desc: "Jaspers reconnaît en Kierkegaard (et en Nietzsche) celui qui a fait de l'existence individuelle, irréductible au système, la question philosophique.",
    },
  ],
});
