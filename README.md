# Graphe Philosophie — Terminale

Une application web interactive conçue pour les élèves de Terminale, permettant d'explorer les notions du programme de philosophie sous forme de graphe dynamique et de fiches de révision détaillées.

## 🚀 Fonctionnalités

*   **Visualisation Interactive** : Un graphe central permettant de naviguer visuellement entre les 17 notions clés (Art, Bonheur, Conscience, État, etc.).
*   **Base de Données Complète** : Chaque notion inclut :
    *   **Définitions** : Approches étymologiques et conceptuelles.
    *   **Auteurs & Œuvres** : Références majeures et contextes philosophiques.
    *   **Citations** : Phrases clés expliquées.
    *   **Axes de Dissertation** : Problématiques types pour le Bac.
    *   **Exemples & Résumés** : Cas concrets et synthèses d'ouvrages.
*   **Interface Moderne** : Design sombre (*Dark Mode*) avec effets de flou (*Glassmorphism*) et interface responsive.
*   **Moteur de Recherche** : Filtrage instantané des notions par nom.

## 🛠️ Pile Technique

*   **HTML5 / CSS3** : Structure et mise en page utilisant les variables CSS pour une gestion fluide des thèmes.
*   **JavaScript (Vanilla)** :
    *   Gestion de l'état de l'application (affichage liste vs détail).
    *   Manipulation dynamique du DOM pour injecter le contenu de la base de données `D`.
    *   Logique de filtrage pour la recherche en temps réel.

## 📂 Structure du Fichier

Le projet est contenu dans un fichier unique pour une portabilité maximale :

1.  **Styles (`<style>`)** : Définit l'identité visuelle et les animations.
2.  **Base de Données (`const D`)** : L'objet JavaScript contenant l'intégralité du savoir philosophique structuré.
3.  **Application (`<div id="app">`)** : Le conteneur principal injecté dynamiquement.
4.  **Scripts (`<script>`)** : La logique de rendu et d'interaction utilisateur.

## 📖 Utilisation

1.  Ouvrez le fichier `index.html` dans n'importe quel navigateur moderne.
2.  Cliquez sur une notion dans la liste ou utilisez la barre de recherche pour trouver un concept spécifique.
3.  Utilisez le bouton "Retour" pour revenir à la vue d'ensemble.
