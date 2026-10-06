/* Fiche de l'auteur Montaigne (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Montaigne", {
  new: true,
  bio: "Michel de Montaigne (1533–1592), magistrat bordelais, maire de Bordeaux, ami de La Boétie. Retiré dans sa « librairie », il invente un genre, l'essai : ses Essais (1580–1595) font de l'examen de soi une enquête sur l'humaine condition.",
  courant: "Humanisme de la Renaissance",
  periode: "XVIe siècle",
  naissance: 1533,
  mort: 1592,
  themes: [
    "connaissance de soi",
    "scepticisme (Que sais-je ?)",
    "coutume et barbarie",
    "apprendre à mourir",
    "amitié",
  ],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Sextus Empiricus",
      sujet: "le doute sceptique",
      desc: "Montaigne fait graver des maximes de Sextus aux poutres de sa librairie et nourrit l'Apologie de Raimond Sebond de ses arguments contre la raison dogmatique.",
    },
  ],
});
