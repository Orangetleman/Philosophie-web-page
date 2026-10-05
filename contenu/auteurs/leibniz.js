/* Fiche de l'auteur Leibniz (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Leibniz", {
  bio: "Philosophe, mathématicien et savant allemand (1646–1716), co-inventeur du calcul infinitésimal. <strong>Rationaliste</strong>, il fonde tout raisonnement sur deux grands principes : la <strong>non-contradiction</strong> et la <strong>raison suffisante</strong> (« rien n'est sans raison »). Auteur de la <em>Monadologie</em> (1714) et de la thèse du « meilleur des mondes possibles », que Voltaire raillera dans <em>Candide</em>.",
  courant: "Rationalisme",
  periode: "XVIIe–XVIIIe siècle",
  themes: ["principe de raison suffisante", "non-contradiction", "monade", "calcul", "meilleur des mondes"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Descartes",
      sujet: "le rationalisme",
      desc: "Leibniz prolonge le rationalisme cartésien mais ne se contente pas de l'évidence : tout ce qui est vrai a une raison — la raison suffisante gouverne les vérités de fait comme la non-contradiction gouverne les vérités de raison.",
    },
    {
      dir: "oppose",
      auteur: "Hume",
      sujet: "la causalité",
      desc: "Pour Leibniz tout fait a une raison nécessaire et déterminée ; Hume objecte que le lien de cause à effet n'est pas saisi par la raison mais né de l'habitude.",
    },
  ],
});
