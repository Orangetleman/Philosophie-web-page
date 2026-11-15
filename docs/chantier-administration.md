# Chantier « Administration » : refonte du tri des propositions

> Cadrage du 15 novembre 2026. **Plan sans code.** Modèle : le système de
> remarques du planificateur Industrialist (lots S34 à S36, `src/tableau/`,
> `server/service.ts`, `src/ui/propositions*.ts`, maquette `maquette/tableau.html`).
> Rien ne se code avant les réponses au § 7 et une maquette validée.

## 1. Ce qu'on a aujourd'hui

Trois outils pour une seule tâche, écrits à trois époques, qui ne se ressemblent pas.

| Outil | Où | Ce qu'il fait | Ce qui coince |
|---|---|---|---|
| `aggregate.py` (15 commandes) | PC, terminal | ingest, list, show, dupes, export, mark, note, archive, purge, stats, pull-cloud, sync, push, review, dashboard | la moitié des commandes datent des `.txt` reçus par mail, canal qui n'existe plus |
| `dashboard.py` (Flask, 1 000 lignes) | PC, `localhost` | cartes, boutons Valider / Intégrer / Rejeter / Archiver, barre d'outils | HTML écrit en Python ; chaque clic recharge toute la page ; une seule colonne de cartes, pas de vue détail ; il faut lancer Python et le `.bat` |
| `triage/` (PWA, 480 lignes) | en ligne, téléphone | même tri, par contribution entière | autre code, autres filtres, autre vocabulaire ; pas de relecture IA ni d'export |

Le fond du problème est ailleurs que dans l'apparence :

- **Deux copies des données.** La base SQLite du PC (`proposals.db`) et Supabase
  (`aggregator_state`), recollées par `sync` en « dernière écriture gagne ». Oublier
  un `sync`, c'est trier deux fois ou perdre une note.
- **Deux grains différents.** Le PC trie par boîte, le téléphone par contribution :
  une contribution à moitié validée sur le PC est écrasée en bloc par le téléphone.
- **Le contributeur ne reçoit qu'un mot.** Un statut et une « explication » dans
  « Mes propositions », rien pour un envoi anonyme, et rien ne regroupe dix
  personnes qui demandent la même chose.
- **L'intégration est un détour.** Exporter un gros `.txt`, le coller dans une
  session Claude, recopier dans `contenu/`. Le site sait pourtant déjà écrire le
  code d'une boîte (`generateAjout`, `js/06-contribution.js`).
- **On ne sait pas qu'une proposition est arrivée** sans ouvrir un des outils.

## 2. Ce qu'Industrialist fait mieux, et qu'on reprend

| Idée | Chez Industrialist | Pour la philo |
|---|---|---|
| **Une seule interface** | `/tableau/`, la même page en ligne et en local (`npm run remarques` + proxy Vite) | une page `/admin/`, la même sur PC et téléphone, en ligne et en local |
| **Une seule source** | une base SQLite côté service, rien sur le PC | Supabase seul ; plus de `proposals.db`, plus de `sync` |
| **Boîte de réception** | liste à gauche, détail à droite (liste puis détail au téléphone), filtre « À traiter » par défaut, ouvrir = « Lue » | idem, avec les filtres catégorie / cible / notion / avis IA |
| **Sujets** | on range une remarque dans un sujet, le sujet compte ses demandes | utile pour les retours sur le site (`site-bug`, `site-fonction`) et les demandes de contenu qui reviennent (« ajoutez Simone Weil ») |
| **Répondre** | réponse à une remarque ou à tout un sujet, lue dans « Mes remarques » | réponse lue dans « Mes propositions » ; pour un anonyme, voir Q4 |
| **Page publique Propositions** | sujets publiés, état (proposé, prévu, fait, refusé), votes ▲ / ▼ | voir Q3 |
| **Rien de public sans un geste** | case « Publier » | idem |
| **Lien direct** | `/tableau/#14` ouvre la remarque 14 (lien du message Discord) | `/admin/#<id>` |
| **Prévenir l'auteur** | webhook Discord à chaque remarque | voir Q5 |
| **Erreurs en clair** | table `ERREURS` (« La session a expiré : entre à nouveau… ») | idem, plus jamais un message Supabase brut |
| **Clavier** | onglets aux flèches, Échap revient à la liste | idem, plus des raccourcis de tri (V, I, R) |
| **Logique testée à part** | `modele.ts` (filtres, dates, liens) + tests | `js/admin/modele.js` + essais dans le banc |
| **Maquette d'abord** | `maquette/tableau.html`, validée en deux tours | idem (lot A0) |

## 3. Ce qu'on ne reprend pas

- **Le service Node sur le Pi.** Le site philo est statique sur Vercel avec
  Supabase : les règles d'accès (`is_admin()`, fonctions `SECURITY DEFINER`) jouent
  déjà le rôle du service. On les étend, on n'ajoute pas de serveur.
- **Le mot de passe maison** (`scrypt`, cookie). On garde la connexion par compte
  Supabase et la table `app_admins`, déjà éprouvées par le banc.
- **DeepL et le bilingue** : le site est en français seulement.

## 4. Ce qu'on garde de l'existant

- La **relecture Gemini** (`review.py`) : elle a de la valeur, seule sa place change (Q2).
- La **détection des doublons** (signature + proximité des noms) : à porter en JS
  dans la page, pour afficher « ressemble à la n° 37 » dans le détail.
- Le **grain boîte** (une contribution = plusieurs boîtes) : c'est le bon niveau
  pour décider, la contribution prend un statut calculé (Q6).
- `triage/`, `dashboard.py` et la moitié des commandes disparaissent une fois
  `/admin/` en service (lot A6). Rien n'est supprimé avant.

## 5. Ce qu'on verrait dans `/admin/`

Trois onglets, comme le tableau d'Industrialist.

**Boîte de réception.** Liste : n°, catégorie et cible, notion, pseudo ou
« anonyme », « il y a 3 h », pastille de l'avis IA, pastille « doublon probable ».
Détail : le contenu de la boîte mis en forme comme sur le site (une idée
d'auteur ressemble à une idée d'auteur), l'avis IA dépliable, les doublons, puis
les gestes : Valider, Intégrer, Refuser, En attente ; une réponse au contributeur ;
une note interne ; « Ranger dans un sujet ».

**Sujets.** Titre, état (proposé, prévu, fait, refusé), nombre de demandes,
votes si Q3 dit oui, case « Publier », réponse commune envoyée à tous ceux qui
l'ont demandé.

**Intégration.** Les boîtes validées, regroupées par fichier de `contenu/`
(`notions/liberte.js`, `auteurs/weil.js`…). Pour chacune, le code prêt à coller
(`generateAjout` déjà écrit pour le site) avec un bouton Copier, et un export
groupé pour une session Claude quand il y a beaucoup à intégrer. Une fois
intégrée, la boîte passe en « intégrée » et le contributeur le voit.

**En local**, la même page servie par le serveur de prévisualisation
(`philo-static`), connectée à la même base. Un mode « base d'essai » (Q1)
permet de tout essayer sans toucher aux vraies propositions.

## 6. Les lots

| Lot | Contenu | Taille | Dépend de |
|---|---|---|---|
| A0 | Maquette `docs/maquettes/admin.html` : les trois onglets, ordinateur et téléphone, thème sombre du site. Validation avant tout code | moyenne | réponses au § 7 |
| A1 | Base : colonnes par boîte (statut, note, réponse, lue), table `sujets` (+ `votes` si Q3), fonctions admin étendues ; migration dans `ORDRE` du banc avec ses témoins ; déclaration dans `contenu/legal.js` | moyenne | A0 |
| A2 | `/admin/` : connexion, boîte de réception, détail, tri, réponse, `#id`, erreurs en clair, clavier | grosse | A1 |
| A3 | Sujets + (si Q3) page publique Propositions dans Explorer, votes | moyenne à grosse | A2 |
| A4 | Relecture IA à sa nouvelle place (Q2) et doublons dans le détail | moyenne | A2 |
| A5 | Onglet À intégrer : export `philo-export/v1`, protocole `docs/protocole-integration.md`, import du compte rendu `philo-integration/v1` avec ses contrôles (§ 9) ; prévenir de l'arrivée d'une proposition (Q5) | moyenne à grosse | A2 |
| A6 | Ménage : `triage/` redirige vers `/admin/`, `dashboard.py`, `sync`, `push`, `ingest` et la base SQLite retirés ; README, `architecture.md`, carte du projet à jour | petite | A2 à A5, parcours réel validé |

Chaque lot suit la règle du projet : build qui finit sur « cohérent », banc
Supabase vert, parcours réel dans le navigateur (PC et 375 px), carte mise à jour.

## 7. À trancher avant la maquette

**Q1. Local = quelle base ?** (a) la vraie base, comme en ligne ; (b) un
commutateur « base d'essai » vers un second projet Supabase gratuit ; (c) une base
d'essai jouée en mémoire (PGlite, comme le banc), sans compte. *Proposé : (a) pour
travailler, (c) pour les essais automatiques.*

**Q2. Où tourne la relecture Gemini ?** (a) une fonction Supabase (Edge Function)
appelée par un bouton de `/admin/`, la clé rangée dans les secrets Supabase : marche
depuis le téléphone ; (b) un petit script local qui lit et écrit directement
Supabase, sans base SQLite ; (c) on l'abandonne. *Proposé : (a).* Gemini devient
alors un tiers déclaré dans la notice légale, ce qu'il est déjà de fait.

**Q3. Une page publique « Propositions » avec votes ?** Chez Industrialist elle
montre ce qui est prévu et ce qui revient souvent. Ici elle servirait surtout aux
retours sur le site et aux grosses demandes de contenu. Votes : réservés aux
comptes (simple, rien à hacher) ou ouverts à tous (empreinte comme Industrialist,
à déclarer). *Proposé : oui, votes réservés aux comptes.*

**Q4. Répondre aux anonymes ?** Industrialist donne un numéro secret gardé dans le
navigateur. On peut faire pareil (« Mes propositions » sans compte, sur cet
appareil) ou garder la règle actuelle : pas de compte, pas de suivi. *Proposé :
numéro secret, c'est ce qui manque le plus.*

**Q5. Être prévenu d'une proposition nouvelle ?** (a) message Discord par webhook
(comme Industrialist) ; (b) e-mail ; (c) seulement un compteur sur l'icône de
l'appli `/admin/` installée. *Proposé : (a), si tu as un serveur où le poster.*

**Q6. Grain du tri.** Chaque boîte a son statut ; la contribution affiche « 2 sur
3 intégrées » au contributeur. Ou on garde un statut par contribution, comme le
téléphone aujourd'hui. *Proposé : par boîte.*

**Q7. Branche.** Le chantier part de `main` (RGPD fusionné, PR 24), sur une
branche `claude/administration`.

## 8. Réponses de l'auteur (15 novembre 2026)

| Q | Décision |
|---|---|
| Q1 | Oui : vraie base pour travailler, base d'essai en mémoire pour les tests. L'interface locale est refondue elle aussi : c'est `/admin/` elle-même, servie par le serveur de prévisualisation ; `dashboard.py` disparaît (A6) |
| Q2 | Relecture Gemini dans une fonction Supabase (Edge Function), lancée depuis `/admin/` |
| Q3 | Page publique Propositions, votes réservés aux comptes |
| Q4 | Numéro secret pour suivre une proposition anonyme |
| Q5 | Message Discord à chaque proposition nouvelle (webhook créé par l'auteur dans son salon, adresse rangée dans les secrets Supabase) |
| Q6 | Tri par boîte, statut de la contribution calculé |
| Q7 | Branche `claude/administration`, partie de `main` |

## 9. L'aller-retour d'intégration (demande du 15 novembre 2026)

« Validée » veut dire « à intégrer » : l'onglet *À intégrer* montre toutes les
boîtes validées, et seulement elles. Le contributeur y lit « Validée,
intégration en cours » (`validee_en_cours`, valeur qui existe déjà).

L'ancien export (`aggregate.py export`, un gros `.txt` à coller) est remplacé
par un aller-retour en deux fichiers.

**Aller : l'export** (`philo-export-AAAA-MM-JJ.json`, bouton « 📤 Exporter les
validées »). Format `philo-export/v1` :

```
{ format, cree_le, boites: [ { id, contribution, categorie, cible, notion,
  contenu, code, avis_ia, note_interne, doublons } ] }
```

`contenu` : les champs de la boîte ; `code` : ce que `generateAjout` propose ;
`note_interne` : ce que l'administrateur veut dire à Claude (« garder sans
guillemets »). **Aucune donnée personnelle** : ni pseudo, ni compte, ni e-mail.
Claude n'en a pas besoin pour intégrer.

**Le travail de Claude** suit un protocole écrit (`docs/protocole-integration.md`,
lot A5) : lire l'export, intégrer chaque boîte selon `docs/protocole-contenu.md`
(une citation non vérifiée n'entre pas comme citation), `new:true`, build qui
finit sur « cohérent », un commit, et écrire le compte rendu.

**Retour : le compte rendu** (`philo-integration-AAAA-MM-JJ.json`, rangé aussi
dans le dépôt pour l'historique). Format `philo-integration/v1` :

```
{ format, export: "philo-export-…json", commit, fait_le,
  boites: [ { id, resultat, fichiers, detail, reponse_proposee } ] }
```

`resultat` vaut `integree` (telle quelle), `retouchee` (intégrée avec des
changements, dits dans `detail`) ou `non_integree` (raison dans `detail`).

**L'import** (bouton « 📥 Importer un compte rendu ») n'applique rien d'un
coup : il montre d'abord une ligne par boîte, avec le résultat, le détail et la
réponse proposée, modifiable. On décoche ce qu'on refuse, puis « Appliquer » :

- `integree` et `retouchee` → statut « Intégrée », réponse envoyée au
  contributeur, commit noté dans la boîte ;
- `non_integree` → retour en « En attente » avec la raison en note interne :
  c'est à l'administrateur de refuser ou de corriger, jamais au fichier ;
- une boîte inconnue, déjà intégrée ou plus validée est signalée et ignorée ;
- importer deux fois le même compte rendu ne change rien la seconde fois.

**« Intégrée » seulement une fois en ligne.** Le compte rendu est commité avec
l'intégration, dans `integrations/` (servi par le site, hors précache). À
l'import, la page demande `/integrations/<nom du fichier>` au site en ligne :
s'il répond, l'intégration est publiée. Sinon les boîtes restent « Validée » et
l'import le dit (« pas encore en ligne : réimporte après la fusion »).

## 10. Avancement

- **A0** (15 novembre 2026) : maquette [`docs/maquettes/admin.html`](maquettes/admin.html),
  à ouvrir par le serveur de prévisualisation (`/docs/maquettes/admin.html`).
  Quatre écrans (`/admin/`, Propositions publique, suivi anonyme, message
  Discord), ordinateur et 375 px. **En attente de validation.**
- **A1** (15 novembre 2026) : `philo-aggregator/migrations/2026_administration.sql`.
  Tables `boites` (une ligne par boîte, n° montré dans /admin/ ; colonne `rang`,
  car `position` est un mot réservé), `sujets`, `votes` ; colonne
  `contributions.suivi_empreinte` ; statut de la proposition calculé par
  déclencheur ; reprise du tri déjà fait depuis `aggregator_state` ; fonctions
  `admin_*` (gardées par `is_admin()`), `propositions()`, `voter()`, `suivre()`.
  Banc : 10 essais nouveaux, chacun avec son témoin vu (23 en tout, « cohérent »).
  Notice : traitement « votes », tables déclarées, entrée d'historique datée du
  2026-11-16, **à redater au jour de la mise en ligne**. Export « Mes données » :
  réponses par boîte et votes. **Pas encore passée sur la vraie base** : elle
  part avec A2 (les anciens outils n'écrivent pas dans `boites`).
- **A2** (15 novembre 2026) : la page [`admin/`](../admin/index.html). Connexion
  (Google ou e-mail), écran « compte non administrateur » avec l'UID à coller,
  boîte de réception (filtres catégorie, état, avis IA, recherche ; « À
  traiter » par défaut ; « nouvelle » tant que pas ouverte), détail mis en
  forme champ par champ, boîtes envoyées ensemble et ce que voit le
  contributeur, état (En attente, Validée, Refusée ; « Marquer intégrée » à la
  main en attendant A5), ranger dans un sujet ou en créer un, réponse, note
  interne, suppression confirmée, `/admin/#n°`, clavier (V, R, A, J, K, /,
  Échap), erreurs en clair. `/admin/?essai` : la même page sur de fausses
  données (`admin/essai.js`). Logique dans `admin/modele.js`, 12 essais avec
  témoin (`node outils/essais_admin.mjs`). Hors du service worker et de
  `robots.txt`. Vérifiée en mode essai (ordinateur et 375 px, console vide) ;
  **pas encore essayée sur la vraie base** : il faut d'abord y passer
  `2026_administration.sql`. En local, la connexion Google demande d'ajouter
  `http://localhost:8123/admin/` aux « Redirect URLs » de Supabase ; l'e-mail
  et le mot de passe marchent sans réglage.
- **Reste à placer** : côté site, « Mes propositions » boîte par boîte et le
  suivi par numéro (Q4) n'ont pas encore de lot. Proposé : avec A3 (ce que
  voit le public).
- **A3** (15 novembre 2026). `/admin/` : onglet **Sujets** (liste par score,
  état, titre, description, réponse publique, publication, réponse copiée dans
  les boîtes rangées sans réponse, suppression ; ← → entre les onglets). Site :
  onglet **Propositions** d'Explorer (`#/explorer/propositions` : sujets
  publiés, votes ▲ / ▼ pour un compte, second clic = retrait) ; **numéro de
  suivi** à l'envoi sans compte (12 caractères, seule l'empreinte sha256 part
  en base, le numéro est gardé dans `philo-suivis`) ; **« Mes propositions »**
  boîte par boîte, avec ou sans compte, et « Retrouver » un numéro venu
  d'ailleurs. Essais : 14 dans `essais_admin.mjs`, dont l'accord site ↔
  /admin/ sur ce que voit le contributeur ; empreinte du navigateur identique
  à celle du banc. Notice : clé `philo-suivis` (entrée 2026-11-16 mise à jour,
  pas encore publiée). Vérifié en mode essai et, côté site, sans rien envoyer :
  **avant la migration, la base répond 404 à `propositions()` et `suivre()`**,
  et la page le dit (« Impossible de charger… »). Tout part donc ensemble :
  migration, puis mise en ligne.
