/* Fiche de l'auteur Rousseau (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Rousseau", {
  bio: "Philosophe genevois (1712–1778). Il théorise le contrat social et la volonté générale, et soutient que l'homme est naturellement bon mais corrompu par la société.",
  courant: "Lumières / Contractualisme",
  periode: "XVIIIe siècle",
  themes: ["contrat social", "volonté générale", "liberté civile", "état de nature", "inégalité"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Hobbes",
      sujet: "état de nature",
      desc: "Hobbes voit l'état de nature comme une guerre de tous contre tous ; Rousseau le voit comme un état de bonheur naturel corrompu par la propriété.",
    },
    {
      dir: "oppose",
      auteur: "Locke",
      sujet: "propriété et contrat",
      desc: "Locke fonde le contrat pour protéger la propriété naturelle ; Rousseau voit dans la propriété l'origine de l'inégalité.",
    },
    {
      dir: "prolonge",
      auteur: "Kant",
      sujet: "autonomie et loi",
      desc: "Kant s'inspire de Rousseau pour penser l'autonomie morale : se donner sa propre loi, c'est obéir à la loi qu'on s'est prescrite.",
    },
  ],
});
