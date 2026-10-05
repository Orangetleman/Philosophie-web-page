/* Fiche de l'auteur Bachelard (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Bachelard", {
  bio: "Philosophe et épistémologue français (1884–1962), philosophe à la fois des sciences et de l'imagination poétique. Penseur de la rupture épistémologique et des obstacles à la connaissance.",
  courant: "Épistémologie historique / Phénoménologie poétique",
  periode: "XXe siècle",
  themes: [
    "obstacle épistémologique",
    "rupture épistémologique",
    "nouvel esprit scientifique",
    "imagination matérielle",
    "rationalisme appliqué",
  ],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Kuhn",
      sujet: "révolutions scientifiques",
      desc: "Bachelard anticipe Kuhn : il analyse les ruptures dans l'histoire des sciences (passage de la chimie pré-lavoisienne à la chimie moderne) avant que Kuhn ne formalise la notion de révolution paradigmatique.",
    },
    {
      dir: "oppose",
      auteur: "Locke",
      sujet: "empirisme naïf",
      desc: "Locke fonde la connaissance sur l'expérience sensible immédiate ; Bachelard montre au contraire que la science exige une <em>rupture</em> avec l'expérience commune et l'opinion.",
    },
    {
      dir: "prolonge",
      auteur: "Popper",
      sujet: "science contre l'opinion",
      desc: "Bachelard et Popper convergent : la science n'est pas accumulation de certitudes mais dépassement perpétuel — Bachelard par la rupture, Popper par la réfutation.",
    },
  ],
});
