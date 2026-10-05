/* Fiche de l'auteur Tocqueville (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Tocqueville", {
  bio: "Historien et philosophe politique français (1805–1859). Observateur lucide de la démocratie américaine, il met en garde contre le despotisme doux des démocraties modernes.",
  courant: "Libéralisme politique",
  periode: "XIXe siècle",
  themes: [
    "despotisme doux",
    "égalité des conditions",
    "individualisme démocratique",
    "liberté civile",
    "participation citoyenne",
  ],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Mill",
      sujet: "tyrannie de la majorité",
      desc: "Mill et Tocqueville convergent : la démocratie menace la liberté non seulement par la loi mais par la pression sociale de la majorité.",
    },
    {
      dir: "repond",
      auteur: "Rousseau",
      sujet: "démocratie réelle",
      desc: "Rousseau idéalise la volonté générale ; Tocqueville montre les dérives concrètes des démocraties réelles.",
    },
  ],
});
