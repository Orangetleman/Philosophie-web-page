# philo-aggregator

Ce dossier a longtemps contenu l'**agrégateur** : un programme Python sur le
PC qui récupérait les propositions, les rangeait dans une base SQLite, les
faisait relire par Gemini, et un tableau de bord Flask pour les trier. Le
chantier Administration (novembre 2026) l'a remplacé, et le lot A6 a retiré
son code (il reste dans l'historique git, avant le commit « Administration
A6 »).

Aujourd'hui, tout se passe en ligne :

| Besoin | Où |
|---|---|
| Trier les propositions, répondre, ranger dans un sujet | la page `/admin/` (en ligne, ou en local par `dashboard.bat`) |
| Avis de l'IA | bouton « 🤖 Relire avec l'IA » de `/admin/`, fonction Supabase `supabase/functions/relire` |
| Être prévenu d'une proposition | fonction Supabase `supabase/functions/prevenir` (message Discord) |
| Intégrer au site ce qui est validé | onglet « À intégrer » de `/admin/` et `docs/protocole-integration.md` |
| Trier depuis le téléphone | `/admin/` aussi (l'ancienne page `triage/` y redirige) |

Le dossier garde deux choses.

## `dashboard.bat`

Le raccourci du bureau. Il sert le site depuis ce PC (port 8123, sauf si un
serveur tourne déjà) et ouvre `http://localhost:8123/admin/`, sur la vraie
base. Ajouter `?essai` à l'adresse donne de fausses données. Pour la
connexion Google en local, `http://localhost:8123/admin/` doit figurer dans
les « Redirect URLs » de Supabase (Authentication › URL Configuration).

## `migrations/` : le schéma de la base Supabase

À passer dans l'éditeur SQL de Supabase (Dashboard › SQL Editor › coller ›
Run). Toutes sont rejouables. Pour une base neuve, dans l'ordre :

1. `2026_schema_base.sql` : tables du compte et des propositions,
   reconstituées depuis le code en oct. 2026. À comparer d'abord avec la
   base réelle grâce à `2026_schema_lecture.sql` (lecture seule).
2. `2026_aggregator_state.sql` : colonnes de travail de l'ancien agrégateur ;
   la migration 5 en reprend les données.
3. `2026_admin_mobile.sql` : `is_admin()`, table `app_admins`.
4. `2026_anon_contributions.sql` : envoi sans compte.
5. `2026_contributions_colonnes.sql` : droits colonne par colonne (le
   « REVOKE SELECT » de la migration 2 ne cachait rien).
6. `2026_rgpd.sql` : supprimer un compte garde ses propositions,
   anonymisées ; purge des comptes inactifs depuis trois ans
   (`docs/protocole-donnees.md`).
7. `2026_administration.sql` : boîtes, sujets, votes, suivi anonyme,
   fonctions `admin_*` (chantier Administration).
8. `2026_relecture.sql` : `admin_ecrire_avis`, pour la fonction `relire`.

Leurs règles d'accès sont éprouvées par le banc `outils/banc/`
(`npm ci && node banc_schema.mjs`, depuis ce dossier du banc). Une migration
nouvelle va dans `ORDRE` de `banc_schema.mjs`, avec ses essais.

Les fonctions `admin_list_contributions` et `admin_triage` de
`2026_admin_mobile.sql` ne servent plus (c'était l'ancienne page `triage/`).
Elles sont inoffensives, gardées par `is_admin()`, et restent dans la base.

## Ce qui peut traîner sur le PC

`proposals.db` (l'ancienne base SQLite), `.env` (clés de l'agrégateur) et
`__pycache__/` ne sont pas suivis par git. Tout ce que contenait
`proposals.db` venait de Supabase, où tout se trouve toujours. Ces fichiers
peuvent être supprimés à la main. La clé Gemini du `.env` est aussi posée
comme secret de la fonction `relire`.
