/* Fiche de l'auteur Cicéron (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Cicéron", {
  new: true,
  bio: "Homme politique, orateur et philosophe romain (106–43 av. J.-C.), consul en 63, assassiné sur ordre d'Antoine. Il a transmis en latin la philosophie grecque (stoïciens, académiciens) et forgé une partie du vocabulaire philosophique latin.",
  courant: "Éclectisme / Stoïcisme romain",
  periode: "Antiquité romaine",
  themes: ["devoir (officium)", "res publica", "loi naturelle", "honnête et utile"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Platon",
      sujet: "la cité juste",
      desc: "Cicéron écrit De la République et Des Lois en écho explicite aux dialogues de Platon, mais pour penser une cité réelle, Rome, plutôt qu'une cité idéale.",
    },
  ],
});
