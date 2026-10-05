-- ===========================================================================
-- Le décor Supabase : ce que la PLATEFORME fournit avant nos migrations
-- ===========================================================================
--
-- Rien ici ne décide de qui lit quoi. Ce fichier reconstitue ce qu'un projet
-- Supabase neuf contient déjà quand on colle une migration dans l'éditeur
-- SQL : les rôles, le schéma « auth », auth.uid(), et — c'est le point qui
-- compte — les privilèges PAR DÉFAUT du schéma public.
--
-- Supabase accorde d'office TOUT sur toute nouvelle table, fonction et
-- séquence de « public » à anon et authenticated. C'est pourquoi nos
-- migrations commencent chaque table par « revoke all … from anon,
-- authenticated ». Si le décor n'accordait rien, un « revoke » oublié
-- passerait inaperçu ici alors qu'il ouvre la table en production : le banc
-- serait plus sévère que la vraie base, donc aveugle à la faute qui compte.
--
-- Les définitions de auth.uid(), auth.role(), auth.jwt() sont celles de
-- Supabase : elles lisent les revendications du jeton que PostgREST pose
-- dans « request.jwt.claims » avant chaque requête.
-- ===========================================================================

-- Les rôles. anon et authenticated ne se connectent pas : PostgREST entre
-- sous « authenticator » et en change (set role) d'après le jeton.
create role anon nologin noinherit;
create role authenticated nologin noinherit;
create role service_role nologin noinherit bypassrls;
create role authenticator login noinherit;
create role supabase_admin login superuser;
create role supabase_auth_admin login noinherit createrole;
grant anon, authenticated, service_role to authenticator;

-- Les privilèges par défaut de Supabase sur « public ».
grant usage on schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;


-- ---------------------------------------------------------------------------
-- Le schéma auth
-- ---------------------------------------------------------------------------
create schema auth authorization supabase_auth_admin;
grant usage on schema auth to anon, authenticated, service_role, supabase_auth_admin;

-- Les colonnes que nos migrations lisent, et celles que Supabase remplit à
-- l'inscription. Ni anon ni authenticated n'y ont accès : c'est là que
-- vivent les adresses.
create table auth.users (
  instance_id          uuid,
  id                   uuid primary key default gen_random_uuid(),
  aud                  text default 'authenticated',
  role                 text default 'authenticated',
  email                text,
  encrypted_password   text,
  email_confirmed_at   timestamptz,
  last_sign_in_at      timestamptz,
  raw_app_meta_data    jsonb default '{}'::jsonb,
  raw_user_meta_data   jsonb default '{}'::jsonb,
  is_anonymous         boolean not null default false,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now(),
  deleted_at           timestamptz
);
alter table auth.users owner to supabase_auth_admin;
grant all on auth.users to postgres, service_role;

create function auth.uid() returns uuid language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;

create function auth.role() returns text language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;

create function auth.email() returns text language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;

create function auth.jwt() returns jsonb language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim', true), ''),
    nullif(current_setting('request.jwt.claims', true), '')
  )::jsonb
$$;

grant execute on function auth.uid(), auth.role(), auth.email(), auth.jwt()
  to anon, authenticated, service_role, supabase_auth_admin;


-- ---------------------------------------------------------------------------
-- Le temps réel
-- ---------------------------------------------------------------------------
-- La publication que Supabase crée d'office, et le strict nécessaire du
-- schéma « realtime » pour que 2026_temps_reel.sql y pose ses règles :
-- la table des messages de canal et realtime.topic(), qui renvoie le nom du
-- canal que le serveur temps réel pose dans « realtime.topic ».
create publication supabase_realtime;

create schema realtime;
grant usage on schema realtime to anon, authenticated, service_role;

create table realtime.messages (
  id          bigserial primary key,
  topic       text not null,
  extension   text not null,
  payload     jsonb,
  event       text,
  private     boolean default false,
  inserted_at timestamptz not null default now()
);
alter table realtime.messages enable row level security;
grant select, insert on realtime.messages to anon, authenticated;
grant usage on sequence realtime.messages_id_seq to anon, authenticated;

create function realtime.topic() returns text language sql stable as $$
  select nullif(current_setting('realtime.topic', true), '')::text
$$;
grant execute on function realtime.topic() to anon, authenticated, service_role;
