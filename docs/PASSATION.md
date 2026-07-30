# Passation — travaux récents (Graphe Philosophie)

> Document de passation pour une session de **documentation précise**. Résume
> les travaux d'une session de développement. Branche `main`, tout poussé sur
> `origin/main` (dernier commit de la série : `a574c80`).
>
> **Hors périmètre** : les commits `carte/frise` (`7d52241`, `59fd3d7`,
> `b85d25b`) proviennent d'un travail parallèle et ne sont pas couverts ici.

---

## 1. Nouvelle app de **triage mobile** (`triage/`) — commit `bd8d60c`

Mini-PWA autonome pour trier les contributions depuis le téléphone.

- **Fichiers** : `triage/index.html`, `triage/manifest.webmanifest`,
  `triage/sw.js`, `triage/icon.svg` (icône vectorielle dédiée — `29381a6`).
- **Auth** : connexion au **compte perso** (Google + e-mail/mot de passe) via
  supabase-js + **clé anon uniquement**. La clé `service_role` n'y figure jamais.
- **Autorisation côté base** — 2 fonctions `SECURITY DEFINER` gardées par la
  table `app_admins` :
  - `admin_list_contributions()` — renvoie toutes les contributions (dont
    `aggregator_state`, normalement masqué aux comptes) ;
  - `admin_triage(id, statut, explication, état)` — écrit statut + note + état
    interne, horodaté.
  - **Migration SQL** : `philo-aggregator/migrations/2026_admin_mobile.sql`.
- **Statut affiché = état interne** (`aggregator_state.boxes`, priorité
  `integree > validee > rejetee > en_attente`), repli sur le statut contributeur
  (`297e2f3`).
- **Action « Archiver »** (5e bouton) + filtre « Archivées » ; « Actives » =
  tout sauf archivées (`1c87877`).
- **Écrit `aggregator_state` / `aggregator_updated_at` au format de la synchro
  PC** → cohérent avec `python aggregate.py sync` (dernière écriture gagne).
- Doc existante : section « Accès mobile » de `philo-aggregator/README.md` +
  note dans `CLAUDE.md`.

## 2. **PWA triage** — installation & icône (`d7b5566`, `6f5f6f1`)

- Le **service worker principal `sw.js` ignore `/triage/`** (sinon il capturait
  son manifeste/icône, cache-first) ; manifeste triage avec **`id:"/triage/"`**
  (identité d'appli distincte de l'appli principale).
- **Bug clé résolu** (`6f5f6f1`) : à l'URL `…/triage` **sans slash final**
  (comportement Vercel), les chemins relatifs se résolvaient vers la racine
  (`/icon.svg` = icône du site, `/manifest.webmanifest` → 404, `/sw.js` = SW
  principal). → **tous les chemins passés en ABSOLU** (`/triage/…`) :
  - dans `triage/index.html` : liens `manifest`/`icon`/`apple-touch-icon` +
    `navigator.serviceWorker.register('/triage/sw.js', {scope:'/triage/'})` ;
  - dans le manifeste : `start_url`/`scope`/`icon` en `/triage/…`.

## 3. **Envois anonymes → Supabase** (fin de PythonAnywhere) — `8b18451`, `fcb2c85`

- Contexte : la boîte anonyme **PythonAnywhere** (`orangentleman.pythonanywhere.com`)
  est **éteinte** (web app gratuite désactivée après 3 mois → page « Coming
  Soon »). Cassait à la fois l'envoi anonyme (site) et l'import anonyme (agrégateur).
- Le site route désormais les envois **non connectés** vers Supabase :
  `sendProposalAnonSupabase()` dans `index.html` (`user_id: null`), aiguillage
  dans `submitProposalOnline()` (PythonAnywhere = **repli ultime** seulement si
  le client Supabase `SB` est indisponible).
- **Migration SQL** : `philo-aggregator/migrations/2026_anon_contributions.sql` :
  - policy RLS `anon_insert_contributions` (insert `user_id NULL`,
    `statut='en_attente'`, aucun champ interne pré-rempli — anti-abus) ;
  - `ALTER TABLE contributions ALTER COLUMN user_id DROP NOT NULL` (ajouté en
    `fcb2c85` : la contrainte NOT NULL bloquait l'insert anonyme).
- Dashboard : **bouton « ⬇ Récupérer (anonyme) » retiré** (`9e839b7`) ; la route
  `/pull` et la commande CLI `pull` sont **conservées** pour un rattrapage
  éventuel d'anciens envois si l'app PythonAnywhere est un jour réactivée.

## 4. **Filtre Catégorie → cible** (cascade) — `eec42ee`

Calqué sur le formulaire de proposition (Catégorie : notion/auteur/concept/site
→ cible : texte, plan, citation, dialogue, bug, fonctionnalité…), sur **les
deux** surfaces :

- `philo-aggregator/db.py` : mapping `CIBLE_CAT` / `cible_cat()` + `CATEGORIES`.
- `philo-aggregator/dashboard.py` : rangées de filtres **Catégorie** + **Cible**
  (cascade — la rangée cible n'apparaît que si une catégorie précise est
  choisie), préservation des filtres centralisée dans `_redirect_back` + champs
  cachés des cartes / de la barre d'outils.
- `triage/index.html` : mêmes rangées ; une contribution matche si **au moins
  une de ses boîtes** correspond (`box.categorie`, repli sur `CIBLE_CAT[cible]`).

## 5. **Dashboard agrégateur** — divers

- Boutons « ☁ Récupérer (Supabase) » et « ⬇ Récupérer (anonyme) » regroupés,
  « 🔄 Synchroniser » placé après (`e406cb8`) — puis le bouton anonyme retiré
  (cf. §3).
- **Arrêt auto à la fermeture de l'onglet** (`a574c80`) : mécanique de
  « battement de cœur » — la page ping `POST /heartbeat` toutes les 3 s ; un
  watchdog (thread démon lancé dans `run()`) fait `os._exit(0)` si plus de ping
  pendant `IDLE_TIMEOUT_S = 10` s. Un rafraîchissement / une action POST ne
  coupe le ping qu'une seconde → le serveur survit. **Interrupteur** :
  `DASHBOARD_AUTOCLOSE=0` dans `.env` pour désactiver.

## 6. **Contenu `data.js`** — intégration de propositions

- `130caa1` : Épictète (notion **bonheur**, 2 idées), dialogue **Sartre oppose
  Spinoza** (dans `AM`), concepts **Antinomie** (Kant) et **Arraisonnement de la
  nature** (Heidegger — traduction du *Gestell*).
- `d31203b` : idée 2 d'Épictète reformulée en **« mithridatisation »** (*Manuel*
  §3 + §11) — correction demandée par le contributeur (référence interne « BOX 56 »).

---

## ⚠️ Prérequis de déploiement (migrations Supabase)

> Déjà exécutés par le mainteneur pour l'instance courante. À documenter comme
> **prérequis pour toute nouvelle instance / réinstallation**.

1. `philo-aggregator/migrations/2026_admin_mobile.sql` **+**
   `insert into public.app_admins (user_id) values ('<UID affiché par la page triage>')`.
2. `philo-aggregator/migrations/2026_anon_contributions.sql` (inclut le
   `DROP NOT NULL` sur `contributions.user_id`).
3. Rappel : le dashboard local tourne en Flask `debug=False` (pas de reload
   auto) → **redémarrer** après toute modif de code Python.

## Notes / pièges pour la doc

- **Versions de cache** `sw.js` : incrémentées à chaque changement d'un fichier
  précaché → actuellement **`philo-v59`** ; `triage/sw.js` à **`triage-v6`**.
- **Vocabulaire des statuts** : **local**
  (`en_attente / validee / integree / rejetee / archivee`) ↔ **contributeur**
  (`en_attente / validee_en_cours / validee_integree / refusee`) — mapping dans
  `philo-aggregator/supabase_client.py` (`LOCAL_TO_REMOTE` / `REMOTE_TO_LOCAL`).
- **Synchro** : `sync` ne pousse que `aggregator_state` (pas le `statut`
  contributeur) ; réconciliation par horodatage « dernière écriture gagne ». Un
  cas legacy **sans horodatage des deux côtés** reste « inchangé » (non
  réconcilié) — comportement connu.
- **Sécurité clés** : seule la clé **anon** (publique) vit côté navigateur (site
  + page triage) ; la clé **`service_role`** reste uniquement dans le `.env` du
  PC de l'agrégateur. Les fonctions `admin_*` (SECURITY DEFINER) permettent au
  triage mobile d'agir sans cette clé.
