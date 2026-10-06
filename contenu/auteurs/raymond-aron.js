/* Fiche de l'auteur Raymond Aron (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Raymond Aron", {
  new: true,
  bio: "Raymond Aron (1905–1983), philosophe, sociologue et éditorialiste français. Camarade de Sartre à l'École normale, il devient son adversaire politique pendant la guerre froide. Il introduit Max Weber en France et défend une pensée libérale lucide.",
  courant: "Libéralisme politique / Sociologie",
  periode: "XXe siècle",
  naissance: 1905,
  mort: 1983,
  themes: ["philosophie critique de l'histoire", "religions séculières", "démocratie et totalitarisme"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Weber",
      sujet: "comprendre l'histoire et la société",
      desc: "Aron fait connaître Weber en France (La Sociologie allemande contemporaine, 1935) et reprend sa méthode : comprendre le sens que les acteurs donnent à leurs actions, sans prétendre à une loi de l'histoire.",
    },
    {
      dir: "oppose",
      auteur: "Sartre",
      sujet: "l'engagement et le marxisme",
      desc: "Contre Sartre, compagnon de route du communisme, Aron dénonce dans L'Opium des intellectuels (1955) la foi dans un sens de l'histoire.",
    },
  ],
});
