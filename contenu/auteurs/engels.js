/* Fiche de l'auteur Engels (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Engels", {
  bio: "Philosophe et économiste allemand (1820–1895). Co-fondateur du marxisme avec Marx, il développe le matérialisme dialectique et l'analyse de l'État comme instrument de domination.",
  courant: "Matérialisme dialectique",
  periode: "XIXe siècle",
  naissance: 1820,
  mort: 1895,
  themes: [
    "matérialisme dialectique",
    "État et domination",
    "liberté et nécessité",
    "origine de la famille",
    "anti-Dühring",
  ],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Marx",
      sujet: "matérialisme historique",
      desc: "Engels co-construit le marxisme avec Marx et l'étend à la dialectique de la nature entière.",
    },
    {
      dir: "prolonge",
      auteur: "Spinoza",
      sujet: "liberté et nécessité",
      desc: "Engels reprend Spinoza : la liberté consiste dans la connaissance des nécessités naturelles — 'on commande à la nature en lui obéissant'.",
    },
  ],
});
