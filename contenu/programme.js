/* Le programme officiel de philosophie de terminale (voie générale) :
   BO spécial n° 8 du 25 juillet 2019. Sert à dire ce qui est AU PROGRAMME
   (étiquette « Au programme » sur les fiches d'auteur ; statuts de l'étape 5)
   et à contrôler que rien n'y manque (question 11 du vérificateur).

   notions : les clés de contenu/notions/ qui sont les 17 notions du programme.
   auteurs : la liste des 84 auteurs, par période, dans l'ordre du BO. Un nom
   seul est à la fois le nom du BO et celui de la fiche (AUTEUR("…")) ;
   sinon { bo: nom écrit par le BO, fiches: [nom(s) de fiche sur le site] }.
   Les repères n'y sont pas : ils sont déjà marqués (cat:'Repère', id rep-…). */
PROGRAMME({
  source: "Programme de philosophie de terminale, voie générale (BO spécial n° 8 du 25 juillet 2019)",
  notions: [
    "art", "bonheur", "conscience", "devoir", "etat", "inconscient", "justice", "langage", "liberte",
    "nature", "raison", "religion", "science", "technique", "temps", "travail", "verite",
  ],
  auteurs: {
    "Antiquité et Moyen Âge": [
      {bo: "Les présocratiques", fiches: ["Héraclite", "Parménide"]},
      "Platon", "Aristote", "Zhuangzi", "Épicure", "Cicéron", "Lucrèce", "Sénèque", "Épictète",
      "Marc Aurèle", "Nāgārjuna", "Sextus Empiricus", "Plotin", "Augustin", "Avicenne", "Anselme",
      "Averroès", "Maïmonide", "Thomas d'Aquin",
      {bo: "Guillaume d'Occam", fiches: ["Guillaume d'Ockham"]},
    ],
    "Période moderne": [
      "Machiavel", "Montaigne", "Bacon", "Hobbes", "Descartes", "Pascal", "Locke", "Spinoza",
      "Malebranche", "Leibniz", "Vico", "Berkeley", "Montesquieu", "Hume", "Rousseau", "Diderot",
      "Condillac", "Adam Smith", "Kant", "Bentham",
    ],
    "Période contemporaine": [
      "Hegel", "Schopenhauer", "Comte", "Cournot", "Feuerbach", "Tocqueville", "Mill", "Kierkegaard",
      "Marx", "Engels", "William James", "Nietzsche", "Freud", "Durkheim", "Bergson", "Husserl",
      "Weber", "Alain", "Mauss", "Russell", "Jaspers", "Bachelard", "Heidegger", "Wittgenstein",
      "Walter Benjamin", "Popper", "Jankélévitch", "Hans Jonas", "Raymond Aron", "Sartre",
      "Hannah Arendt", "Levinas", "Beauvoir", "Lévi-Strauss", "Merleau-Ponty", "Simone Weil",
      "Jeanne Hersch", "Ricœur", "Anscombe", "Iris Murdoch", "Rawls", "Simondon", "Foucault", "Putnam",
    ],
  },
});
