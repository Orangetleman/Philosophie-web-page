/* Fiche de l'auteur Descartes (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Descartes", {
  bio: "Philosophe et mathématicien français (1596–1650). Fondateur du rationalisme moderne, il cherche à atteindre des vérités certaines par le doute méthodique.",
  courant: "Rationalisme",
  periode: "XVIIe siècle",
  naissance: 1596,
  mort: 1650,
  themes: ["cogito", "dualisme corps/âme", "méthode", "maîtrise de la nature", "certitude"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Hume",
      sujet: "certitudes de la raison",
      desc: "Hume montre qu'aucune relation causale n'est nécessaire : ce que Descartes tenait pour certain n'est qu'une habitude psychologique.",
    },
    {
      dir: "oppose",
      auteur: "Freud",
      sujet: "transparence de la conscience",
      desc: "Freud renverse le cogito : le moi n'est pas maître en sa propre maison — l'inconscient détermine nos actes à notre insu.",
    },
    {
      dir: "prolonge",
      auteur: "Spinoza",
      sujet: "rationalisme",
      desc: "Spinoza radicalise Descartes en éliminant le dualisme corps/âme et en identifiant Dieu, la Nature et la Substance.",
    },
  ],
});
