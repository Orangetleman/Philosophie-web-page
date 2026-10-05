-- ════════════════════════════════════════════════════════════════════════
-- LECTURE SEULE — photographie du schéma réel, pour le comparer à
-- 2026_schema_base.sql (reconstitué depuis le code).
-- ════════════════════════════════════════════════════════════════════════
-- À coller dans l'éditeur SQL de Supabase (SQL Editor → Run). Ne modifie
-- rien. Chaque requête affiche un tableau : les copier (ou une capture) et
-- corriger 2026_schema_base.sql là où il diffère.

-- 1) Colonnes des trois tables (nom, type, nullable, défaut).
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in ('contributions', 'preferences', 'quiz_progress', 'app_admins')
order by table_name, ordinal_position;

-- 2) Contraintes (clés primaires, étrangères, CHECK).
select conrelid::regclass as table_name, conname, pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid::regclass::text in ('contributions', 'preferences', 'quiz_progress', 'app_admins')
order by 1, 2;

-- 3) Règles d'accès (RLS) : nom, commande, rôles, conditions.
select tablename, policyname, cmd, roles, qual as using_expr, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 4) RLS activée sur chaque table ?
select relname as table_name, relrowsecurity as rls_active
from pg_class
where relnamespace = 'public'::regnamespace and relkind = 'r'
order by 1;

-- 5) Fonctions du schéma public (dont delete_own_account) et leur code.
select p.proname, p.prosecdef as security_definer, pg_get_functiondef(p.oid) as definition
from pg_proc p
where p.pronamespace = 'public'::regnamespace
order by 1;

-- 6) Droits des rôles publics sur la table contributions (table entière, puis
--    colonne par colonne). Avant 2026_contributions_colonnes.sql, « anon » et
--    « authenticated » ont TOUT sur la table : c'est le défaut corrigé.
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'contributions'
  and grantee in ('anon', 'authenticated')
order by grantee, privilege_type;

select grantee, privilege_type, column_name
from information_schema.column_privileges
where table_schema = 'public' and table_name = 'contributions'
  and grantee in ('anon', 'authenticated')
order by grantee, privilege_type, column_name;
