/* Fiche de l'auteur Nietzsche (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Nietzsche", {
  bio: "Philosophe allemand (1844–1900). Critique radical de la morale chrétienne et du rationalisme occidental. Il annonce la 'mort de Dieu' et propose la figure du 'surhomme'.",
  courant: "Généalogie / Philosophie de la vie",
  periode: "XIXe siècle",
  naissance: 1844,
  mort: 1900,
  themes: [
    "volonté de puissance",
    "mort de Dieu",
    "éternel retour",
    "généalogie de la morale",
    "travail comme police",
  ],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Kant",
      sujet: "morale universelle",
      desc: "Kant fonde une morale universelle ; Nietzsche la déconstruit par la généalogie : les valeurs morales expriment des rapports de force.",
    },
    {
      dir: "prolonge",
      auteur: "Schopenhauer",
      sujet: "volonté",
      desc: "Nietzsche hérite de Schopenhauer la centralité de la volonté, mais la réinterprète positivement comme volonté de puissance.",
    },
    {
      dir: "oppose",
      auteur: "Freud",
      sujet: "inconscient",
      desc: "Nietzsche anticipe Freud en montrant les rationalisations masquant nos motivations réelles, mais sans le cadre clinique.",
    },
  ],
});
