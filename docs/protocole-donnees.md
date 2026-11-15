# Données personnelles : le protocole (novembre 2026)

Ce document a deux parties. La **première** est le plan d'action du chantier
du 15 novembre 2026 (mise en conformité RGPD, refonte des Réglages), avec son
avancement. La **seconde** est une règle permanente : ce qu'on fait, à chaque
mise à jour du site, pour que la structure légale suive le code.

Je ne suis pas juriste : ce protocole applique les textes tels que la CNIL les
explique pour un petit site non commercial. En cas de doute sur un cas
nouveau, la référence reste cnil.fr.

## Partie 1. Le chantier du 15 novembre 2026

### 1.1 Ce que le site traite (état des lieux)

| Donnée | Où elle vit | Pour quoi |
|---|---|---|
| E-mail, mot de passe (haché), pseudo facultatif, identité Google | Supabase Auth (`auth.users`) | le compte |
| Préférences, brouillon de proposition, position de lecture | `public.preferences` | la synchro entre appareils |
| Progression du quiz | `public.quiz_progress` | la synchro entre appareils |
| Propositions (contenu + pseudo saisi, `payload.contributor`) | `public.contributions` | la contribution |
| Le compte administrateur | `public.app_admins` | le tri des propositions |
| Texte d'une proposition | Google Gemini, depuis `philo-aggregator` | la pré-relecture |
| Adresse IP, navigateur | journaux de Vercel, Supabase, jsDelivr | technique |
| Réglages, brouillons, progression (`philo-*`) | `localStorage` de l'appareil | le fonctionnement |

Aucun outil de statistiques, aucune publicité, aucun traceur. Tout ce qui est
dans `localStorage` est nécessaire au service demandé : **pas de bannière
cookies** (art. 82 de la loi Informatique et Libertés), mais une déclaration
dans la notice.

### 1.2 Les décisions de l'auteur (15 novembre 2026)

1. **Éditeur anonyme** : particulier non professionnel ; l'hébergeur (Vercel)
   détient son identité (LCEN, art. 6 III 2).
2. **Contact** : l'adresse des propositions (`PROPOSAL_EMAIL`).
3. **Suppression du compte** : on efface tout ce qui désigne la personne
   (compte, préférences, quiz, pseudo dans ses propositions), mais **les
   propositions restent**, anonymisées : elles sont devenues du contenu du site.
4. **Gemini** : on garde l'offre gratuite, mais rien qui désigne la personne
   n'est envoyé (ni pseudo, ni date, ni adresse e-mail glissée dans le texte).
5. **Les Réglages** sont refondus en suivant les leçons de l'interface de
   Fiches BUT (§ 1.4).

### 1.3 Les actions, dans l'ordre

| # | Action | Fichiers | État |
|---|---|---|---|
| A1 | Une **source unique** de la notice : `contenu/legal.js` (`LEGAL`), lue par l'app, par la page légale et par le vérificateur | `contenu/legal.js`, `outils/construire.mjs` | fait |
| A2 | La **page légale** générée : mentions légales, confidentialité, CGU, sur une page à sommaire | `outils/lib/legal.mjs` → `informations-legales/index.html` | fait |
| A3 | **Suppression du compte** : propositions conservées et anonymisées (`on delete set null`, pseudo remplacé par « anonyme ») | `philo-aggregator/migrations/2026_rgpd.sql`, `outils/banc/banc_schema.mjs` | fait (migration à passer, § 1.5) |
| A4 | **Purge des comptes inactifs** depuis 3 ans, automatique chaque mois (pg_cron) | `2026_rgpd.sql` | fait (avec la migration) |
| A5 | **Gemini sans identité** : `render_box(..., anonyme=True)` sans pseudo ni date, e-mails et numéros masqués dans le texte | `philo-aggregator/export.py`, `review.py` | fait |
| A6 | **Plus d'appel tiers inutile** : police Inter servie par le site, QR code calculé dans le navigateur | `polices/`, `lib/qrcode.js`, `css/01-base.css`, `js/10-partage.js`, `index.html` | fait |
| A7 | **Les droits en un clic** : télécharger ses données (JSON), effacer celles de l'appareil, supprimer son compte | `js/07-affichage-reglages.js`, `js/09-compte.js` | fait |
| A8 | **Acceptation des CGU** : case non cochée à la création du compte et à l'envoi d'une proposition ; version acceptée gardée dans le compte ; redemandée quand la notice change | `js/09-compte.js`, `js/06-contribution.js` | fait |
| A9 | **Refonte des Réglages** (§ 1.4) | `js/07-affichage-reglages.js`, `css/11-reglages.css` | fait |
| A10 | **Le contrôle** : question 15 du vérificateur (§ 2.3), avec son témoin | `outils/verifier_contenu.mjs` | fait |

### 1.4 La refonte des Réglages : ce qu'on reprend de Fiches BUT

Les leçons de `fiches-but/docs/interface.md` (U1 à U4), appliquées ici :

- **Le plus courant en haut** : Affichage (thème, taille), puis Révision
  (mode fiche, hors programme, mode édition), puis Compte, puis Mes données,
  puis À propos.
- **Un sommaire de pastilles** en tête : chaque section est à un geste.
- **Des cartes**, avec **l'état en première ligne** (« Sombre · texte
  normal »), une commande par réglage (interrupteur ou choix segmenté).
- **La prose repliée** dans un `<details>` nommé (« Ce que ça change ») :
  rien n'est supprimé, tout est rangé.
- **L'action risquée en dernier et à part** : la suppression du compte est la
  dernière commande, en rouge, avec confirmation.
- **Ce qu'on ne reprend pas** : le menu « moi » et la page « Mes demandes »
  (le site de philo est une seule page, et la modale Compte existe déjà).

### 1.5 Ce que l'auteur doit faire à la main

1. **Passer la migration** `philo-aggregator/migrations/2026_rgpd.sql` dans
   l'éditeur SQL de Supabase (une fois). Avant ça, la suppression d'un compte
   efface encore ses propositions.
2. **Accepter les contrats de sous-traitance (DPA)** de Supabase (tableau de
   bord › Organization › Legal documents) et de Vercel (ils sont inclus dans
   leurs conditions, rien à signer pour un compte gratuit ; vérifier).
3. **Vérifier la région** du projet Supabase (Settings › General) et, si elle
   n'est pas en Europe, le laisser tel quel : la notice parle déjà d'un
   transfert possible hors UE, encadré par les clauses types.
4. **Rien à faire pour la purge** : la migration planifie
   `purger_comptes_inactifs()` avec pg_cron, le 1er de chaque mois. Vérifier
   une fois qu'elle tourne : `select * from cron.job;` doit lister
   `purge-comptes-inactifs`.
5. **Répondre aux demandes** reçues à l'adresse de contact en **un mois** au
   plus. Pour une suppression, renvoyer d'abord vers le bouton ; s'il ne
   marche pas, supprimer à la main dans Supabase et confirmer.

## Partie 2. Le protocole de mise à jour (règle permanente)

### 2.1 Quand il s'applique

Dès qu'un changement touche **une** de ces choses :

- une donnée nouvelle, ou une donnée existante utilisée autrement
  (une colonne, un champ du `payload`, une clé `localStorage`) ;
- une table ou une fonction Supabase qui lit ou écrit une donnée de personne ;
- un **service tiers** nouveau (une adresse `https://…` chargée par le site,
  une API appelée par l'agrégateur) ;
- une durée de conservation, un destinataire, une finalité ;
- la façon de supprimer, d'exporter ou d'anonymiser.

En cas de doute : il s'applique.

### 2.2 Ce qu'on fait, dans l'ordre

1. **Mettre à jour `contenu/legal.js`** : la ligne de `traitements`,
   `stockage` ou `tiers` concernée. C'est la seule source : la page légale,
   l'onglet « Mes données » des Réglages et l'export s'en nourrissent.
2. **Ajouter une entrée à `historique`** : date du jour, un résumé d'une
   phrase compréhensible par un élève (« Le quiz garde maintenant… »), et
   l'empreinte que le vérificateur donne. Le site **redemande alors
   l'accord** aux comptes (la version acceptée ne correspond plus).
3. **Si le changement touche la suppression ou l'export** : mettre à jour
   `delete_own_account` (nouvelle migration), son essai dans le banc, et
   `exporterMesDonnees`. Une donnée qu'on ne sait pas effacer n'entre pas.
4. **Si c'est un nouveau tiers** : se demander d'abord s'il est
   indispensable (un fichier servi par le site vaut mieux qu'un appel
   extérieur), puis vérifier qu'il a un DPA et où vont les données.
5. **Lancer le build** : il doit finir sur « cohérent » (question 15).
6. **Le noter** dans `contenu/nouveautes.js` si le changement se voit.

### 2.3 Ce que le vérificateur garantit (question 15)

La question 15 de `outils/verifier_contenu.mjs` refuse le build quand :

- une clé `localStorage` `philo-…` du code n'est pas dans `LEGAL.stockage` ;
- une adresse externe (`https://…`) d'`index.html` ou de `js/` n'appartient
  à aucun `LEGAL.tiers` ;
- une table `public.…` d'une migration n'est citée par aucun
  `LEGAL.traitements` ;
- le contenu de `LEGAL` a changé sans nouvelle entrée datée dans
  `historique` (l'empreinte ne correspond plus), ou les dates ne se suivent pas.

Elle ne voit pas tout : une donnée nouvelle **dans une colonne existante**
(un champ de plus dans `payload`) ou un appel tiers dans l'agrégateur
Python lui échappent. Pour ceux-là, c'est la liste du § 2.1 qui fait foi.
