/* Fiche de l'auteur Marx (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Marx", {
  bio: "Philosophe et économiste allemand (1818–1883). Fondateur du matérialisme historique : les rapports de production déterminent la superstructure sociale, juridique et idéologique.",
  courant: "Matérialisme historique",
  periode: "XIXe siècle",
  naissance: 1818,
  mort: 1883,
  themes: [
    "aliénation",
    "plus-value",
    "infrastructure/superstructure",
    "lutte des classes",
    "dépérissement de l'État",
  ],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Hegel",
      sujet: "moteur de l'histoire",
      desc: "Marx renverse Hegel : ce n'est pas l'Esprit mais les conditions matérielles qui font l'histoire ('retourner Hegel sur ses pieds').",
    },
    {
      dir: "oppose",
      auteur: "Robert Nozick",
      sujet: "justice et propriété",
      desc: "Nozick défend la propriété individuelle absolue ; Marx voit dans la propriété privée la source même de l'exploitation.",
    },
    {
      dir: "prolonge",
      auteur: "Engels",
      sujet: "matérialisme dialectique",
      desc: "Engels co-construit le marxisme avec Marx et développe l'analyse de l'État comme instrument de domination de classe.",
    },
  ],
});
