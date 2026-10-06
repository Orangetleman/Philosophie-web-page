/* Fiche de l'auteur Feuerbach (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Feuerbach", {
  bio: "Philosophe allemand (1804–1872), élève critique de Hegel. Sa thèse de la projection religieuse fait de la théologie une anthropologie déguisée — Dieu = essence humaine projetée hors de soi. Inspirera directement Marx.",
  courant: "Hégélianisme de gauche / Matérialisme anthropologique",
  periode: "XIXe siècle",
  naissance: 1804,
  mort: 1872,
  themes: [
    "aliénation religieuse",
    "projection",
    "essence humaine",
    "matérialisme anthropologique",
    "critique de Hegel",
    "sensualisme",
  ],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Hegel",
      sujet: "aliénation",
      desc: "Feuerbach hérite de Hegel le concept d'aliénation, mais le retourne contre la religion : ce n'est pas l'Esprit qui s'aliène, c'est l'homme qui s'aliène en Dieu.",
    },
    {
      dir: "prolonge",
      auteur: "Marx",
      sujet: "critique de la religion",
      desc: "Marx s'inspire directement de Feuerbach — mais lui reproche de rester abstrait : il faut analyser les conditions sociales qui produisent la projection religieuse.",
    },
    {
      dir: "oppose",
      auteur: "Augustin",
      sujet: "essence du divin",
      desc: "Augustin : Dieu est l'absolu vers lequel l'âme humaine s'élève ; Feuerbach renverse : Dieu est la projection des qualités humaines absolutisées.",
    },
  ],
});
