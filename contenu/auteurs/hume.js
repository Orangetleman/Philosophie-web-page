/* Fiche de l'auteur Hume (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Hume", {
  bio: "Philosophe écossais (1711–1776), figure centrale de l'empirisme. Il montre que nos certitudes rationnelles (causalité, substance, moi) ne sont que des habitudes psychologiques.",
  courant: "Empirisme / Scepticisme",
  periode: "XVIIIe siècle",
  themes: [
    "causalité comme habitude",
    "bundle theory du moi",
    "scepticisme",
    "raison esclave des passions",
    "induction",
  ],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Descartes",
      sujet: "certitudes rationnelles",
      desc: "Descartes fonde des certitudes sur la raison pure ; Hume montre que toute connaissance vient de l'expérience et que la causalité n'est qu'une habitude.",
    },
    {
      dir: "prolonge",
      auteur: "Locke",
      sujet: "empirisme",
      desc: "Hume radicalise l'empirisme de Locke en appliquant le même scepticisme à la notion de substance et au moi lui-même.",
    },
  ],
});
