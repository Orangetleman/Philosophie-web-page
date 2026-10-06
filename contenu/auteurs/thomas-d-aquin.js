/* Fiche de l'auteur Thomas d'Aquin (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Thomas d'Aquin", {
  bio: "Théologien et philosophe italien dominicain (1224–1274). Sa Somme théologique (1266-1274) est la grande synthèse scolastique du christianisme et de l'aristotélisme. Docteur de l'Église, dit « Docteur angélique ».",
  courant: "Scolastique / Thomisme",
  periode: "Moyen Âge",
  naissance: 1224,
  mort: 1274,
  themes: [
    "raison et foi",
    "cinq voies",
    "analogie",
    "loi naturelle",
    "philosophia ancilla theologiae",
    "aristotélisme chrétien",
  ],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Aristote",
      sujet: "métaphysique et causes",
      desc: "Thomas christianise Aristote : il reprend la métaphysique aristotélicienne pour démontrer rationnellement l'existence de Dieu (cinq voies).",
    },
    {
      dir: "oppose",
      auteur: "Descartes",
      sujet: "autonomie de la raison",
      desc: "Thomas subordonne la philosophie à la théologie ; Descartes affirme l'autonomie de la raison philosophique vis-à-vis de la foi.",
    },
    {
      dir: "oppose",
      auteur: "Augustin",
      sujet: "raison et foi",
      desc: "Augustin : « crois pour comprendre » ; Thomas : la raison naturelle peut atteindre certaines vérités sur Dieu de manière autonome (cinq voies).",
    },
  ],
});
