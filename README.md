# Graphe Philosophie — Terminale

Une application web interactive conçue pour les élèves de Terminale, permettant d'explorer les notions du programme de philosophie sous forme de graphe dynamique et de fiches de révision détaillées.[cite: 4]

## 🚀 Fonctionnalités

*   **Visualisation Interactive** : Un graphe central permettant de naviguer visuellement entre les 17 notions clés (Art, Bonheur, Conscience, État, etc.).[cite: 4]
*   **Base de Données Complète** : Chaque notion inclut :[cite: 4]
    *   **Définitions** : Approches étymologiques et conceptuelles.[cite: 4]
    *   **Auteurs & Œuvres** : Références majeures et contextes philosophiques.[cite: 4]
    *   **Citations** : Phrases clés expliquées.[cite: 4]
    *   **Axes de Dissertation** : Problématiques types pour le Bac.[cite: 4]
    *   **Exemples & Résumés** : Cas concrets et synthèses d'ouvrages.[cite: 4]
*   **Interface Moderne** : Design sombre (*Dark Mode*) avec effets de flou (*Glassmorphism*) et interface responsive.[cite: 4]
*   **Moteur de Recherche** : Filtrage instantané des notions par nom.[cite: 4]

## 🛠️ Pile Technique

*   **HTML5 / CSS3** : Structure et mise en page utilisant les variables CSS pour une gestion fluide des thèmes.[cite: 4]
*   **JavaScript (Vanilla)** :[cite: 4]
    *   Gestion de l'état de l'application (affichage liste vs détail).[cite: 4]
    *   Manipulation dynamique du DOM pour injecter le contenu de la base de données `D`.[cite: 4]
    *   Logique de filtrage pour la recherche en temps réel.[cite: 4]

## 📂 Structure du Fichier

Le projet est contenu dans un fichier unique pour une portabilité maximale :[cite: 4]

1.  **Styles (`<style>`)** : Définit l'identité visuelle et les animations.[cite: 4]
2.  **Base de Données (`const D`)** : L'objet JavaScript contenant l'intégralité du savoir philosophique structuré.[cite: 4]
3.  **Application (`<div id="app">`)** : Le conteneur principal injecté dynamiquement.[cite: 4]
4.  **Scripts (`<script>`)** : La logique de rendu et d'interaction utilisateur.[cite: 4]

## 📖 Utilisation

1.  Ouvrez le fichier `index.html` dans n'importe quel navigateur moderne.[cite: 4]
2.  Cliquez sur une notion dans la liste ou utilisez la barre de recherche pour trouver un concept spécifique.[cite: 4]
3.  Utilisez le bouton "Retour" pour revenir à la vue d'ensemble.[cite: 4]
