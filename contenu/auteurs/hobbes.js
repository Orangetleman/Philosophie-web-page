/* Fiche de l'auteur Hobbes (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Hobbes", {
  bio: "Philosophe anglais (1588–1679). Il théorise un État souverain absolu (le Léviathan) comme seul garant de la paix civile contre la violence de l'état de nature.",
  courant: "Contractualisme / Absolutisme",
  periode: "XVIIe siècle",
  themes: ["état de nature", "Léviathan", "contrat social", "sécurité", "guerre de tous contre tous"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Rousseau",
      sujet: "nature humaine",
      desc: "Rousseau renverse Hobbes : l'homme n'est pas naturellement violent — c'est la société et la propriété qui le corrompent.",
    },
    {
      dir: "oppose",
      auteur: "Locke",
      sujet: "étendue du contrat",
      desc: "Locke limite le contrat aux droits naturels à préserver ; Hobbes exige l'abandon total de la liberté naturelle au souverain.",
    },
  ],
});
