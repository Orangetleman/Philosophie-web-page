-- ===========================================================================
-- 2026_rgpd.sql — suppression de compte sans perte des propositions, et purge
-- des comptes inactifs (chantier RGPD du 15 novembre 2026,
-- docs/protocole-donnees.md, actions A3 et A4).
-- ===========================================================================
--
-- À passer UNE FOIS dans l'éditeur SQL de Supabase, après les migrations
-- précédentes (ordre : README de l'agrégateur, et ORDRE du banc
-- outils/banc/banc_schema.mjs). Rejouable sans risque.
--
-- Décision de l'auteur (15 nov. 2026) : quand une personne supprime son
-- compte, on efface TOUT ce qui la désigne (son compte, ses préférences, sa
-- progression, le pseudo de ses propositions), mais ses propositions RESTENT :
-- elles sont devenues du contenu du site. Elles deviennent indiscernables
-- d'un envoi anonyme (user_id NULL, contributor « anonyme »).
-- ===========================================================================


-- ── 1. La clé étrangère : « on delete set null » au lieu de « cascade » ────
-- Filet de sécurité : même un compte supprimé à la main dans le tableau de
-- bord Supabase (sans passer par la fonction ci-dessous) ne fait plus
-- disparaître ses propositions. Le pseudo, lui, n'est retiré que par la
-- fonction : c'est pourquoi on supprime toujours par elle.
alter table public.contributions
  drop constraint if exists contributions_user_id_fkey;
alter table public.contributions
  add constraint contributions_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete set null;


-- ── 2. effacer_compte(uid) : le cœur, partagé par les deux portes ─────────
-- Anonymise les propositions, efface préférences, progression, rôle
-- d'administrateur et le compte lui-même. Interne : personne ne l'appelle
-- directement (revoke ci-dessous), seules les deux fonctions suivantes.
create or replace function public.effacer_compte(uid uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Les propositions restent, sans plus rien qui désigne la personne :
  -- ni le lien au compte, ni le pseudo saisi (payload.contributor).
  update public.contributions
     set user_id = null,
         payload = jsonb_set(payload, '{contributor}', '"anonyme"'::jsonb, true),
         updated_at = now()
   where user_id = uid;
  delete from public.quiz_progress where user_id = uid;
  delete from public.preferences   where user_id = uid;
  delete from public.app_admins    where user_id = uid;
  delete from auth.users           where id = uid;
end;
$$;
revoke all on function public.effacer_compte(uuid) from public, anon, authenticated;


-- ── 3. delete_own_account() : la personne supprime SON compte ─────────────
-- Même nom et même signature qu'avant (le site l'appelle par
-- SB.rpc('delete_own_account')) ; seul le traitement des propositions change.
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'non connecté';
  end if;
  perform public.effacer_compte(uid);
end;
$$;
revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;


-- ── 4. purger_comptes_inactifs() : la durée de conservation ───────────────
-- La notice (contenu/legal.js) promet qu'un compte sans connexion depuis
-- TROIS ANS est supprimé. Cette fonction le fait, de la même façon qu'une
-- suppression demandée (propositions gardées, anonymisées). Renvoie le
-- nombre de comptes supprimés. Réservée à l'administrateur (is_admin(),
-- 2026_admin_mobile.sql), au rôle de service, et à l'éditeur SQL du tableau
-- de bord : là, aucun jeton n'est posé, donc auth.role() est NULL. Par
-- l'API (PostgREST), un jeton est TOUJOURS posé (anon ou authenticated) :
-- un compte ordinaire ne passe donc pas.
--
-- Lancée AUTOMATIQUEMENT chaque mois par pg_cron (section 5 ci-dessous).
-- À la main, au besoin : select public.purger_comptes_inactifs();
create or replace function public.purger_comptes_inactifs()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare u record; n integer := 0;
begin
  if auth.role() is not null and auth.role() <> 'service_role'
     and not public.is_admin() then
    raise exception 'réservé à l''administrateur';
  end if;
  for u in
    select id from auth.users
     where coalesce(last_sign_in_at, created_at) < now() - interval '3 years'
  loop
    perform public.effacer_compte(u.id);
    n := n + 1;
  end loop;
  return n;
end;
$$;
revoke all on function public.purger_comptes_inactifs() from public, anon;
grant execute on function public.purger_comptes_inactifs() to authenticated, service_role;


-- ── 5. La purge automatique (pg_cron) ─────────────────────────────────────
-- pg_cron est le planificateur de tâches de PostgreSQL, fourni par Supabase
-- (Database › Extensions). On l'active et on planifie la purge le 1er de
-- chaque mois à 4 h (UTC) : un compte dépasse donc les trois ans d'au plus
-- un mois. La tâche tourne sous le rôle postgres, sans jeton : auth.role()
-- est NULL, la garde de la fonction la laisse passer.
-- cron.schedule avec un NOM remplace la tâche du même nom : rejouable.
-- Gardé par un test : là où pg_cron n'existe pas (le banc PGlite), on saute.
-- Voir les passages : select * from cron.job_run_details order by start_time desc;
do $cron$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron') then
    create extension if not exists pg_cron;
    perform cron.schedule('purge-comptes-inactifs', '0 4 1 * *',
                          'select public.purger_comptes_inactifs()');
  else
    raise notice 'pg_cron absent : purge à lancer à la main';
  end if;
end;
$cron$;

-- Témoins (joués par le banc, outils/banc/banc_schema.mjs) :
--   • supprimer A garde ses propositions, sans user_id ni pseudo ; B intact ;
--   • un compte ordinaire ne peut pas lancer la purge ;
--   • la purge efface un compte inactif depuis 4 ans, pas un compte actif.
