# Graphe Philosophie — Terminale

Application web de révision pour le **baccalauréat de philosophie** (Terminale, programme français). Explorez les **17 notions** du programme, les auteurs, un glossaire de concepts et des plans de dissertation — puis **révisez activement** grâce à un mode quiz à répétition espacée. Interface sombre, responsive, installable et utilisable **hors-ligne**.

> Sans build ni dépendance : du HTML, du CSS et du JavaScript « vanilla ». Le contenu vit dans `data.js`, la logique dans `index.html`.

## 🚀 Fonctionnalités

*   **17 notions du programme** — chaque notion réunit : une définition approfondie (dépliable), les auteurs et leurs idées, des textes clés, des **plans de dissertation** détaillés (axes I/II/III + limites), des exemples et des liens vers les notions voisines.
*   **Fiches auteurs** — biographie, courant, période, thèmes, citations, et **dialogues** entre auteurs (qui s'oppose / prolonge / répond à qui, et sur quoi).
*   **Glossaire de plus de 160 concepts** — définition, notion(s) liée(s) et **relations** entre concepts (oppose / prolonge / complète / distinction / implique…).
*   **Liens dynamiques** — chaque notion, concept ou auteur cité dans un texte devient automatiquement cliquable dès qu'une fiche existe (moteur `linkTerms`), sans balisage manuel.
*   **Mode révision active (quiz) 🎯** — des cartes à **répétition espacée** (système de Leitner, 5 paliers de mémorisation) générées automatiquement depuis les données : concept ↔ définition, citation ↔ auteur, notion → auteurs. Deux rythmes à progression **indépendante** (sprint ~2 semaines / long ~2 mois), QCM, filtres, objectif quotidien, série (*streak*), XP/niveaux et badges. Toute la progression est sauvegardée localement.
*   **Proposer du contenu** — une modale permet à n'importe qui de suggérer un ajout, une correction ou une remarque ; la proposition est générée en texte lisible **+** un bloc JSON, puis envoyée par e-mail et traitée par l'agrégateur (voir plus bas).
*   **Deux modes d'affichage** — *Révision* (épuré, par défaut) et *Édition* (révèle les badges « nouveau »/« modifié » et les boutons de contribution).
*   **Responsive & PWA** — utilisable au téléphone (barre latérale en tiroir, fil d'Ariane cliquable), **installable** comme une application et **fonctionnel hors-ligne** grâce à un *service worker*.

## 🛠️ Pile technique

*   **HTML5 / CSS3** : variables CSS, *dark mode*, *glassmorphism*, mise en page responsive (≤ 700 px).
*   **JavaScript (Vanilla)** : aucun framework, aucune étape de build. Rendu du DOM à la main, état applicatif simple, persistance en `localStorage`.
*   **PWA** : `manifest.json` + `sw.js` (*service worker*, stratégie *cache-first*) + `icon.svg`.
*   **Agrégateur** : petits scripts **Python** (dossier `philo-aggregator/`) pour collecter, relire et exporter les propositions de contenu reçues par e-mail.

## 📂 Structure du projet

Le projet n'a **ni build ni dépendance** : on ouvre `index.html` et ça marche.

| Fichier / dossier | Rôle |
|---|---|
| `index.html` | `<style>` (tout le CSS) + squelette HTML + `<script>` (toute la logique : normalisation des données, rendu, navigation, contribution, quiz). |
| `data.js` | **Le contenu** : `const D` (notions), `AM` (métadonnées auteurs), `CONCEPTS` (glossaire). Chargé *avant* le script principal ; ces `const` deviennent globales. **C'est ici qu'on modifie le savoir.** |
| `manifest.json`, `sw.js`, `icon.svg` | Installation et fonctionnement hors-ligne (PWA). |
| `philo-aggregator/` | Outil Python en ligne de commande pour traiter les propositions de contenu (voir son propre `README.md`). |
| `CLAUDE.md` | Consignes de maintenance détaillées : structures de données, règles de modification, schéma des contributions, pièges connus. |

> ⚠️ En ajoutant un fichier statique (comme `data.js`), pensez à l'ajouter au `PRECACHE` de `sw.js` **et** à incrémenter la version du cache (`philo-vN`), sinon le mode hors-ligne continuera de servir une version périmée.

## 📖 Utilisation

1.  Ouvrez `index.html` dans un navigateur moderne (ou visitez la version déployée).
2.  Naviguez par **notion**, **auteur** ou **concept** depuis la barre latérale. Cliquez sur n'importe quel terme souligné pour sauter à sa fiche ; le **fil d'Ariane** en haut permet de remonter d'un clic, comme dans un explorateur de fichiers.
3.  Cliquez sur **🎯 Réviser** pour lancer une session de quiz : votre progression (paliers de mémorisation, série, niveau) est conservée d'une visite à l'autre.
4.  Passez en mode **Édition** (bas de la barre latérale) pour faire apparaître ce qui est récent/modifié et pour proposer du contenu.
5.  Sur mobile : « Ajouter à l'écran d'accueil » pour l'installer comme une appli ; elle fonctionne ensuite **sans connexion**.

## ✍️ Contribuer au contenu

Le bouton **« 💡 Proposer du contenu »** (visible en mode Édition) ouvre une modale où l'on empile une ou plusieurs « boîtes » : un **type** (ajout / correction / remarque) appliqué à une **cible** (notion / auteur / concept). La proposition est mise en forme automatiquement (texte + JSON) et envoyée par e-mail. Côté mainteneur, le dossier `philo-aggregator/` rassemble, dédoublonne et relit ces propositions avant intégration dans `data.js`.
