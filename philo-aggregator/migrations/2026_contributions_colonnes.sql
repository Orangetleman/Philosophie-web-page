-- ════════════════════════════════════════════════════════════════════════
-- Migration Supabase — droits COLONNE PAR COLONNE sur `contributions`
-- (5 octobre 2026, à lancer APRÈS 2026_aggregator_state.sql et
--  2026_anon_contributions.sql)
-- ════════════════════════════════════════════════════════════════════════
-- À LANCER UNE FOIS dans l'éditeur SQL de Supabase (SQL Editor → Run).
--
-- Le défaut corrigé : 2026_aggregator_state.sql croyait cacher l'état interne
-- de l'agrégateur par « REVOKE SELECT (aggregator_state) … FROM authenticated ».
-- En PostgreSQL, retirer un droit sur une COLONNE ne retire rien tant que le
-- rôle garde le droit sur la TABLE entière — et Supabase accorde d'office tous
-- les droits sur toute table de « public » à anon et authenticated. Une
-- personne connectée pouvait donc lire (sur SES propositions, la RLS restant
-- en place) les notes internes du tri, et même ÉCRIRE dans aggregator_state,
-- explication ou avis_ia tant que sa proposition était « en attente ».
-- Constaté sur un banc d'essai PGlite reproduisant les droits de Supabase.
--
-- Le remède : retirer les droits sur la table, puis rendre colonne par colonne
-- ce dont le site a besoin, et rien d'autre :
--   • lire (« Mes propositions », relecture après modification) :
--     id, user_id, payload, statut, explication, avis_ia, created_at, updated_at ;
--   • insérer (envoi connecté ou anonyme) : user_id, payload ;
--   • modifier (correction d'un envoi en attente) : payload, updated_at.
-- Les règles RLS (qui voit quelles LIGNES) ne changent pas. La page de triage
-- passe par des fonctions SECURITY DEFINER et l'agrégateur par la clé
-- service_role : ni l'une ni l'autre ne sont concernées.
--
-- Idempotent : relançable sans risque.

revoke all on public.contributions from anon, authenticated;

grant select (id, user_id, payload, statut, explication, avis_ia, created_at, updated_at)
  on public.contributions to authenticated;
grant insert (user_id, payload) on public.contributions to anon, authenticated;
grant update (payload, updated_at) on public.contributions to authenticated;

-- Vérification (facultatif) : les droits restants, colonne par colonne.
--   select grantee, privilege_type, column_name
--   from information_schema.column_privileges
--   where table_name = 'contributions' and grantee in ('anon','authenticated')
--   order by grantee, privilege_type, column_name;
