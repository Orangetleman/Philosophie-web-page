/* Fiche de l'auteur Einstein (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Einstein", {
  bio: "Physicien théoricien germano-américain (1879–1955), auteur de la théorie de la relativité restreinte (1905) et générale (1915), prix Nobel de physique 1921 (effet photoélectrique). Au-delà de la physique, il a beaucoup écrit sur la philosophie, la paix et la « religion cosmique » — un sentiment d'émerveillement face à l'ordre rationnel du monde, sans Dieu personnel.",
  courant: "Physique théorique / Spinozisme moderne",
  periode: "XIXe–XXe siècle",
  naissance: 1879,
  mort: 1955,
  themes: ["relativité", "religion cosmique", "spinozisme", "unification", "déterminisme"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Spinoza",
      sujet: "Dieu = Nature",
      desc: "Einstein revendique son spinozisme : pas de Dieu personnel mais une admiration rationnelle de l'ordre du monde — « Je crois au Dieu de Spinoza, qui se révèle dans l'harmonie de tout ce qui existe. »",
    },
    {
      dir: "repond",
      auteur: "Pascal",
      sujet: "sentiment religieux et science",
      desc: "Pour Einstein, le sentiment religieux le plus haut naît de la science elle-même — non du « Dieu sensible au cœur » de Pascal mais de la stupeur devant l'intelligibilité du cosmos.",
    },
  ],
});
