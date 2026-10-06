/* Fiche de l'auteur Freud (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Freud", {
  bio: "Neurologue autrichien (1856–1939), fondateur de la psychanalyse. Il découvre l'inconscient comme instance psychique déterminant nos actes à notre insu.",
  courant: "Psychanalyse",
  periode: "XIXe–XXe siècle",
  naissance: 1856,
  mort: 1939,
  themes: ["inconscient", "ça/moi/surmoi", "refoulement", "rêve", "pulsions"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Descartes",
      sujet: "souveraineté du cogito",
      desc: "Le cogito cartésien suppose que la conscience est transparente à elle-même — Freud montre que ce présupposé est faux.",
    },
    {
      dir: "repond",
      auteur: "Sartre",
      sujet: "liberté et inconscient",
      desc: "Sartre refuse l'inconscient freudien : la censure doit avoir conscience de ce qu'elle refoule, ce qui la rend de 'mauvaise foi'.",
    },
    {
      dir: "prolonge",
      auteur: "Nietzsche",
      sujet: "critique du sujet rationnel",
      desc: "Nietzsche annonce Freud en montrant que nos motivations réelles sont masquées par des rationalisations.",
    },
  ],
});
