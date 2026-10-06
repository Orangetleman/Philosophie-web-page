/* Fiche de l'auteur Anselme (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Anselme", {
  new: true,
  bio: "Anselme de Cantorbéry (1033–1109), moine bénédictin né à Aoste, abbé du Bec en Normandie puis archevêque de Cantorbéry. Il veut comprendre par la raison ce que la foi croit ; son Proslogion contient la preuve de l'existence de Dieu que Kant appellera « ontologique ».",
  courant: "Scolastique / Augustinisme",
  periode: "Moyen Âge",
  themes: ["preuve ontologique", "foi et raison", "credo ut intelligam"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Augustin",
      sujet: "la foi qui cherche à comprendre",
      desc: "Anselme affirme ne rien dire qui ne s'accorde avec Augustin ; il reprend son idée que la foi précède et appelle l'intelligence.",
    },
    {
      dir: "oppose",
      auteur: "Thomas d'Aquin",
      sujet: "la preuve ontologique",
      desc: "Thomas d'Aquin refuse la preuve d'Anselme : de ce que le mot « Dieu » signifie, il ne suit pas qu'il existe hors de l'esprit ; l'existence de Dieu se prouve à partir de ses effets.",
    },
  ],
});
