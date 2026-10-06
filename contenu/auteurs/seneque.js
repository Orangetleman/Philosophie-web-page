/* Fiche de l'auteur Sénèque (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Sénèque", {
  bio: "Philosophe stoïcien, dramaturge et homme d'État romain (v. 4 av. J.-C.–65 ap. J.-C.), précepteur de Néron. Ses traités et ses Lettres à Lucilius font du stoïcisme une sagesse pratique : bien user du temps, se rendre maître de ses jugements, habiter le présent (De la brièveté de la vie).",
  courant: "Stoïcisme",
  periode: "Antiquité romaine",
  naissance: -4,
  mort: 65,
  datesApprox: true,
  themes: ["brièveté de la vie", "usage du temps", "présent", "tranquillité de l'âme", "sagesse stoïcienne"],
  dialogues: [
    {
      dir: "prolonge",
      auteur: "Épictète",
      sujet: "sagesse stoïcienne",
      desc: "Sénèque et Épictète partagent le stoïcisme romain : la sagesse consiste à distinguer ce qui dépend de nous (nos jugements, l'usage de notre temps) de ce qui n'en dépend pas.",
    },
    {
      dir: "prolonge",
      auteur: "Pascal",
      sujet: "agitation et fuite de soi",
      desc: "Sénèque dénonce les occupations vaines où l'on dilapide sa vie ; Pascal radicalisera l'analyse avec le divertissement — l'agitation comme fuite devant soi-même.",
    },
  ],
});
