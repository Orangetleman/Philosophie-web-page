/* Fiche de l'auteur Pascal (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Pascal", {
  bio: "Mathématicien, physicien et philosophe français (1623–1662). Sa pensée oscille entre l'apologétique chrétienne et une lucidité radicale sur la condition humaine ('roseau pensant').",
  courant: "Augustinisme / Apologétique",
  periode: "XVIIe siècle",
  themes: ["roseau pensant", "divertissement", "misère et grandeur de l'homme", "pari", "cœur et raison"],
  dialogues: [
    {
      dir: "repond",
      auteur: "Descartes",
      sujet: "raison et finitude",
      desc: "Descartes fonde tout sur la raison ; Pascal montre ses limites — le cœur a ses raisons que la raison ne connaît point.",
    },
    {
      dir: "prolonge",
      auteur: "Nietzsche",
      sujet: "divertissement et travail",
      desc: "Pascal analyse le divertissement comme fuite de soi ; Nietzsche prolonge cette idée en montrant que le travail est la 'meilleure des polices'.",
    },
  ],
});
