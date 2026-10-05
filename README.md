# Graphe Philosophie — Terminale

Application web de révision pour le **baccalauréat de philosophie** (Terminale, programme français). On y explore les **17 notions** du programme, les auteurs, un glossaire de concepts, les repères et des plans de dissertation, puis on **révise activement** avec un quiz à répétition espacée. Interface sombre, responsive, installable et utilisable **hors-ligne**.

> Sans build ni dépendance : du HTML, du CSS et du JavaScript « vanilla ». Le contenu vit dans `data.js`, la logique dans `index.html`. Une mise à jour est en cours (octobre 2026) : son plan est dans [`docs/diagnostic-2026-10.md`](docs/diagnostic-2026-10.md).

## 🚀 Fonctionnalités

*   **17 notions du programme** : pour chacune, une définition approfondie (dépliable), les auteurs et leurs idées, des textes clés, des **plans de dissertation** (axes I/II/III et limites), des exemples, des accroches et des liens vers les notions voisines.
*   **Fiches auteurs** (83 auteurs) : biographie, courant, période, thèmes, citations, œuvres, et **dialogues** entre auteurs (qui s'oppose à qui, qui prolonge qui, sur quoi).
*   **Glossaire de 172 concepts** et **31 repères** du programme (les paires à distinguer : légal / légitime, en acte / en puissance…), avec leurs **relations** (oppose, prolonge, complète, distinction, implique).
*   **Méthodo** : un guide de la dissertation et de l'explication de texte, étape par étape.
*   **Liens dynamiques** : chaque notion, concept ou auteur cité dans un texte devient cliquable dès qu'une fiche existe (moteur `linkTerms`), sans balisage manuel.
*   **Recherche globale** (Ctrl/⌘ + K) sur les notions, auteurs, concepts et accroches.
*   **Quiz 🎯** : des cartes à **répétition espacée** (système de Leitner, 5 paliers de mémorisation) générées depuis les données : concept ↔ définition (le mot à trouver est masqué dans la définition), citation ↔ auteur (seules les citations exactes), notion → auteurs. Deux rythmes à progression indépendante (sprint ~2 semaines, long terme ~2 mois), cartes à retourner ou QCM, filtres, objectif du jour, série, XP et niveaux, badges, et un bouton « Relire la fiche » sur chaque carte.
*   **Compte (facultatif)** : connexion Google ou e-mail ; la progression du quiz, la position de lecture, les réglages et les brouillons de proposition suivent d'un appareil à l'autre. Le quiz fusionne carte par carte : ce qui est fait hors ligne n'est pas perdu.
*   **Proposer du contenu** : une modale permet à n'importe qui de suggérer un ajout, une correction ou une remarque. La proposition est envoyée en ligne (Supabase, avec ou sans compte) ; l'e-mail ne sert plus que de repli si l'envoi échoue. L'agrégateur (`philo-aggregator/`) les trie.
*   **Deux modes d'affichage** : *Révision* (épuré, par défaut) et *Édition* (révèle les boutons de contribution). Les badges « Nouveau » / « Modifié » sont visibles dans les deux. Un *mode fiche* (Réglages) compresse les cartes pour une lecture rapide.
*   **Responsive & PWA** : utilisable au téléphone (barre latérale en tiroir, fil d'Ariane cliquable), **installable** comme une application et **fonctionnel hors-ligne** grâce à un *service worker*.

## 🛠️ Pile technique

*   **HTML5 / CSS3** : variables CSS, *dark mode*, mise en page responsive (≤ 700 px).
*   **JavaScript (Vanilla)** : aucun framework, aucune étape de build. Rendu du DOM à la main, état en `localStorage`.
*   **Supabase** (comptes, synchronisation, propositions) via `supabase-js`, chargé depuis jsDelivr en **version figée avec empreinte d'intégrité**.
*   **PWA** : `manifest.json` + `sw.js` (*service worker* : le code HTML/JS en « réseau d'abord », le reste en « cache d'abord ») + `icon.svg`.
*   **Agrégateur** : scripts **Python** (dossier `philo-aggregator/`) et un tableau de bord local pour récupérer, relire (avec Gemini) et exporter les propositions. La page `triage/` permet de trier depuis le téléphone.

## 📂 Structure du projet

On ouvre `index.html` et ça marche.

| Fichier / dossier | Rôle |
|---|---|
| `index.html` | `<style>` (tout le CSS) + squelette HTML + `<script>` (toute la logique : normalisation des données, rendu, navigation, contribution, quiz, compte). |
| `data.js` | **Le contenu** : `const D` (notions), `AM` (métadonnées des auteurs), `CONCEPTS` (glossaire et repères). Chargé *avant* le script principal ; ces `const` deviennent globales. **C'est ici qu'on modifie le savoir.** |
| `manifest.json`, `sw.js`, `icon.svg` | Installation et fonctionnement hors-ligne (PWA). |
| `robots.txt`, `sitemap.xml` | Consignes pour les moteurs de recherche. |
| `triage/` | Mini-application de tri des propositions, pour le téléphone (accès administrateur). |
| `philo-aggregator/` | Outil Python pour traiter les propositions de contenu (voir son propre `README.md`). |
| `docs/` | Le diagnostic et le plan de la mise à jour, la passation, et la **carte du projet** (`docs/carte/`). |
| `CLAUDE.md` | Consignes de maintenance détaillées : structures de données, règles de modification, schéma des contributions, pièges connus. |

> ⚠️ En modifiant un fichier précaché (`index.html`, `data.js`…) ou en ajoutant un fichier statique, il faut l'ajouter au `PRECACHE` de `sw.js` si besoin **et** incrémenter la version du cache (`philo-vN`), sinon le mode hors-ligne servira une version périmée.

## 📖 Utilisation

1.  Ouvrir `index.html` dans un navigateur moderne (ou visiter la version déployée).
2.  Naviguer par **notion**, **auteur**, **concept**, **repère** ou **méthodo** depuis la barre latérale. Un clic sur un terme souligné ouvre sa fiche ; le **fil d'Ariane** en haut permet de remonter d'un clic.
3.  Cliquer sur **🎯 Réviser** pour lancer une session de quiz : la progression (paliers, série, niveau) est conservée d'une visite à l'autre, et sur tous les appareils si l'on est connecté.
4.  Passer en mode **Édition** (menu ⚙ Réglages) pour proposer du contenu.
5.  Sur mobile : « Ajouter à l'écran d'accueil » pour l'installer comme une appli ; elle fonctionne ensuite **sans connexion**.

## ✍️ Contribuer au contenu

Le bouton **« 💡 Proposer du contenu »** (visible en mode Édition) ouvre une modale où l'on empile une ou plusieurs « boîtes » : une **catégorie** (notion, auteur, concept, ou retour sur le site), une **cible** précise et un **type** (ajout, correction, remarque). La proposition est mise en forme automatiquement (texte + JSON) et envoyée en ligne. Côté mainteneur, `philo-aggregator/` rassemble, dédoublonne et relit ces propositions avant leur intégration dans `data.js`.
