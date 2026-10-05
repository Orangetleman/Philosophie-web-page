/* Fiche de l'auteur Robert Nozick (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Robert Nozick", {
  bio: "Philosophe américain (1938–2002), défenseur du libertarianisme. Il soutient que l'État minimal est le seul légitime et que toute redistribution viole les droits individuels.",
  courant: "Libertarianisme",
  periode: "XXe siècle",
  themes: ["État minimal", "droits individuels", "propriété", "anti-redistribution", "titres légitimes"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Rawls",
      sujet: "redistribution",
      desc: "Rawls justifie la redistribution par le voile d'ignorance ; Nozick y voit une violation des droits — on ne peut pas prendre à Pierre pour donner à Paul.",
    },
    {
      dir: "oppose",
      auteur: "Marx",
      sujet: "propriété",
      desc: "Marx voit dans la propriété privée la source de l'exploitation ; Nozick en fait au contraire le fondement inviolable de la justice.",
    },
  ],
});
