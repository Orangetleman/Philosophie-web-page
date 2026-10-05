/* Fiche de l'auteur Épicure (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Épicure", {
  bio: "Philosophe grec (341–270 av. J.-C.), fondateur de l'épicurisme. Sa philosophie vise l'ataraxie (paix de l'âme) par le calcul raisonné des désirs et la retraite dans le jardin.",
  courant: "Épicurisme",
  periode: "Antiquité grecque",
  themes: ["ataraxie", "aponie", "classification des désirs", "amitié", "mort sans crainte"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Aristote",
      sujet: "vie bonne",
      desc: "Aristote fait du bonheur une activité vertueuse engagée dans la cité ; Épicure préfère le retrait dans le jardin et l'amitié.",
    },
    {
      dir: "oppose",
      auteur: "Kant",
      sujet: "morale et bonheur",
      desc: "Kant refuse que le bonheur fonde la morale ; Épicure en fait au contraire le guide suprême de toute conduite de vie.",
    },
  ],
});
