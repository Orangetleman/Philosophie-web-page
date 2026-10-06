/* Fiche de l'auteur Schopenhauer (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Schopenhauer", {
  bio: "Philosophe allemand (1788–1860). Il développe un pessimisme métaphysique fondé sur la 'volonté de vivre' — force aveugle et insatiable à l'origine de toute souffrance.",
  courant: "Pessimisme / Volontarisme",
  periode: "XIXe siècle",
  naissance: 1788,
  mort: 1860,
  themes: ["volonté de vivre", "pessimisme", "désir insatiable", "art comme salut", "ascèse"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Aristote",
      sujet: "bonheur",
      desc: "Aristote croit au bonheur comme fin accessible ; Schopenhauer montre que la satisfaction est toujours provisoire — le désir est infini.",
    },
    {
      dir: "prolonge",
      auteur: "Nietzsche",
      sujet: "volonté",
      desc: "Nietzsche hérite de Schopenhauer la centralité de la volonté, mais la réinterprète positivement comme volonté de puissance.",
    },
  ],
});
