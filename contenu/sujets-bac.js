/* Sujets réellement tombés au bac de philosophie, France métropolitaine,
   depuis le programme de 2019 (première session : 2021). Étape 6, oct. 2026.
   Chaque session : deux sujets de dissertation (trois en 2021) et un texte à
   expliquer, pour la voie générale et la voie technologique.
   notions : les notions du site qu'un élève mobilise d'abord pour ce sujet
   (choix éditorial ; vide quand le sujet de l'explication ne se devine pas
   d'après la seule œuvre). auteur : le nom de sa fiche sur le site.
   Ajouter une session : recouper au moins deux sources, puis la question 14
   du vérificateur contrôle notions et auteurs. */
SUJETS_BAC({
  sources: [
    "aufutur.fr, pages « Les sujets du bac de philo » des sessions 2021 à 2025",
    "nomadeducation.fr et digischool.fr, sujets de la session du 15 juin 2026",
    "diplomeo.com et letudiant.fr, pour recouper les sessions 2022 à 2025",
  ],
  sessions: [
    {annee: 2021, date: "17 juin 2021", voie: "générale",
      dissertations: [
        {q: "Discuter, est-ce renoncer à la violence ?", notions: ["langage", "raison", "etat"]},
        {q: "L'inconscient échappe-t-il à toute forme de connaissance ?", notions: ["inconscient", "science", "verite"]},
        {q: "Sommes-nous responsables de l'avenir ?", notions: ["devoir", "temps", "technique"]},
      ],
      explication: {auteur: "Durkheim", oeuvre: "De la division du travail social (1893)", notions: ["travail"]}},
    {annee: 2021, date: "17 juin 2021", voie: "technologique",
      dissertations: [
        {q: "Est-il injuste de désobéir aux lois ?", notions: ["justice", "devoir", "etat"]},
        {q: "Savoir, est-ce ne rien croire ?", notions: ["verite", "religion", "science"]},
        {q: "La technique nous libère-t-elle de la nature ?", notions: ["technique", "nature", "liberte"]},
      ],
      explication: {auteur: "Freud", oeuvre: "Le Poète et l'activité de fantaisie (1907)", notions: ["art", "inconscient"]}},
    {annee: 2022, date: "15 juin 2022", voie: "générale",
      dissertations: [
        {q: "Les pratiques artistiques transforment-elles le monde ?", notions: ["art", "technique", "travail"]},
        {q: "Revient-il à l'État de décider de ce qui est juste ?", notions: ["etat", "justice"]},
      ],
      explication: {auteur: "Cournot", oeuvre: "Essai sur les fondements de nos connaissances et sur les caractères de la critique philosophique (1851)", notions: []}},
    {annee: 2022, date: "15 juin 2022", voie: "technologique",
      dissertations: [
        {q: "La liberté consiste-t-elle à n'obéir à personne ?", notions: ["liberte", "devoir", "etat"]},
        {q: "Est-il juste de défendre ses droits par tous les moyens ?", notions: ["justice", "devoir"]},
      ],
      explication: {auteur: "Diderot", oeuvre: "Encyclopédie (1751-1772)", notions: []}},
    {annee: 2023, date: "14 juin 2023", voie: "générale",
      dissertations: [
        {q: "Le bonheur est-il une affaire de raison ?", notions: ["bonheur", "raison"]},
        {q: "Vouloir la paix, est-ce vouloir la justice ?", notions: ["justice", "etat"]},
      ],
      explication: {auteur: "Lévi-Strauss", oeuvre: "La Pensée sauvage (1962)", notions: []}},
    {annee: 2023, date: "14 juin 2023", voie: "technologique",
      dissertations: [
        {q: "L'art nous apprend-il quelque chose ?", notions: ["art", "verite"]},
        {q: "Transformer la nature, est-ce gagner en liberté ?", notions: ["nature", "technique", "liberte"]},
      ],
      explication: {auteur: "Adam Smith", oeuvre: "Théorie des sentiments moraux (1759)", notions: ["devoir"]}},
    {annee: 2024, date: "18 juin 2024", voie: "générale",
      dissertations: [
        {q: "La science peut-elle satisfaire notre besoin de vérité ?", notions: ["science", "verite"]},
        {q: "L'État nous doit-il quelque chose ?", notions: ["etat", "justice", "devoir"]},
      ],
      explication: {auteur: "Simone Weil", oeuvre: "La Condition ouvrière (1951)", notions: ["travail"]}},
    {annee: 2024, date: "18 juin 2024", voie: "technologique",
      dissertations: [
        {q: "La nature est-elle hostile à l'homme ?", notions: ["nature", "technique"]},
        {q: "L'artiste est-il maître de son travail ?", notions: ["art", "travail"]},
      ],
      explication: {auteur: "Platon", oeuvre: "Les Lois, IX", notions: ["etat", "justice"]}},
    {annee: 2025, date: "16 juin 2025", voie: "générale",
      dissertations: [
        {q: "Notre avenir dépend-il de la technique ?", notions: ["technique", "temps"]},
        {q: "La vérité est-elle toujours convaincante ?", notions: ["verite", "langage", "raison"]},
      ],
      explication: {auteur: "Rawls", oeuvre: "Théorie de la justice (1971)", notions: ["justice", "etat"]}},
    {annee: 2025, date: "16 juin 2025", voie: "technologique",
      dissertations: [
        {q: "Sommes-nous libres en toutes circonstances ?", notions: ["liberte"]},
        {q: "Avons-nous besoin d'art ?", notions: ["art"]},
      ],
      explication: {auteur: "Adam Smith", oeuvre: "Théorie des sentiments moraux (1759)", notions: ["devoir"]}},
    {annee: 2026, date: "15 juin 2026", voie: "générale",
      dissertations: [
        {q: "Avons-nous la maîtrise de nos paroles ?", notions: ["langage", "liberte", "conscience"]},
        {q: "Peut-on être heureux quand les autres ne le sont pas ?", notions: ["bonheur", "devoir", "autrui"]},
      ],
      explication: {auteur: "Nietzsche", oeuvre: "Humain, trop humain (1878)", notions: []}},
    {annee: 2026, date: "15 juin 2026", voie: "technologique",
      dissertations: [
        {q: "Débattre, est-ce chercher la vérité ?", notions: ["verite", "langage", "raison"]},
        {q: "La technique peut-elle être mauvaise ?", notions: ["technique", "devoir"]},
      ],
      explication: {auteur: "Ricœur", oeuvre: "Le Juste (1995)", notions: ["justice"]}},
  ],
});
