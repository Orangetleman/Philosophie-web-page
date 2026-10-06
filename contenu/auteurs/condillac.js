/* Fiche de l'auteur Condillac (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Condillac", {
  new: true,
  bio: "Étienne Bonnot de Condillac (1714–1780), abbé et philosophe. Il pousse l'empirisme de Locke jusqu'au bout : toutes nos facultés naissent de la sensation (Traité des sensations, 1754), et la pensée dépend des signes, donc du langage.",
  courant: "Empirisme / Sensualisme",
  periode: "XVIIIe siècle",
  themes: ["la statue", "sensations transformées", "langue bien faite", "signes et pensée"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Locke",
      sujet: "l'origine des idées",
      desc: "Condillac part de Locke, mais réduit encore ce que celui-ci accordait à l'esprit : même la réflexion n'est qu'une sensation transformée.",
    },
  ],
});
