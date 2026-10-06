/* Fiche de l'auteur Lafargue (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Lafargue", {
  bio: "Journaliste et militant politique franco-cubain (1842–1911), gendre de Marx. Son pamphlet 'Le Droit à la paresse' dénonce le culte du travail.",
  courant: "Socialisme / Critique du travail",
  periode: "XIXe siècle",
  naissance: 1842,
  mort: 1911,
  themes: ["droit à la paresse", "culte du travail", "exploitation ouvrière", "temps libre", "émancipation"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Marx",
      sujet: "exploitation",
      desc: "Lafargue pousse la critique marxiste jusqu'au bout : si le travail aliène, c'est le travail lui-même qu'il faut refuser, pas seulement son exploitation.",
    },
    {
      dir: "repond",
      auteur: "Nietzsche",
      sujet: "travail et contrôle",
      desc: "Nietzsche voit le travail comme 'meilleure des polices' ; Lafargue converge : le travail est l'instrument d'une exploitation intériorisée.",
    },
  ],
});
