/* Fiche de l'auteur Malebranche (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Malebranche", {
  new: true,
  bio: "Nicolas Malebranche (1638–1715), prêtre de l'Oratoire, devenu philosophe en lisant le Traité de l'homme de Descartes. Dans De la recherche de la vérité (1674–1675), il concilie cartésianisme et augustinisme : Dieu seul est cause véritable, et nous voyons toutes choses en lui.",
  courant: "Cartésianisme / Occasionnalisme",
  periode: "XVIIe siècle",
  naissance: 1638,
  mort: 1715,
  themes: ["occasionnalisme", "vision en Dieu", "connaissance de l'âme par conscience", "erreurs des sens"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Descartes",
      sujet: "l'âme et le corps",
      desc: "Malebranche reprend la séparation cartésienne de l'âme et du corps, mais nie, contre Descartes, que nous ayons une idée claire de notre âme.",
    },
  ],
});
