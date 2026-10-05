/* Fiche de l'auteur Thoreau (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Thoreau", {
  bio: "Écrivain et philosophe américain (1817–1862). Partisan du retour à la nature (Walden) et inventeur du concept de désobéissance civile contre les lois injustes.",
  courant: "Transcendantalisme / Anarchisme pacifiste",
  periode: "XIXe siècle",
  themes: ["désobéissance civile", "nature", "simplicité volontaire", "résistance non-violente", "conscience morale"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Rawls",
      sujet: "désobéissance civile",
      desc: "Rawls formalise en théorie politique ce que Thoreau pratiquait : la désobéissance civile est légitime contre les lois injustes, sous conditions.",
    },
    {
      dir: "repond",
      auteur: "Platon",
      sujet: "obéissance aux lois",
      desc: "Platon (Criton) exige d'obéir même à une loi injuste ; Thoreau s'y oppose radicalement : obéir à une loi injuste, c'est en être complice.",
    },
  ],
});
