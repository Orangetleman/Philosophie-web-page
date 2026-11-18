-- ===========================================================================
-- 2026_relecture.sql — écrire l'avis de l'IA sans clé de service (lot A4).
-- ===========================================================================
-- À passer UNE FOIS dans l'éditeur SQL de Supabase, APRÈS
-- 2026_administration.sql. Rejouable.
--
-- Pourquoi : la fonction Supabase « relire » vérifiait l'administrateur et
-- écrivait avec la clé de service ; sur ce projet (nouvelles clés
-- sb_publishable / sb_secret), elle ne voyait pas app_admins (15 nov. 2026 :
-- « ne reconnaît pas ce compte comme administrateur »). Elle agit désormais
-- avec le JETON de l'administrateur connecté, comme /admin/ : lecture par
-- admin_boites(), écriture par admin_ecrire_avis() ci-dessous, gardée par
-- is_admin(). Plus aucune clé secrète dans la fonction.
-- ===========================================================================

-- La colonne ia_message (l'avis rédigé pour le contributeur) a été ajoutée
-- au « create table boites » de 2026_administration.sql APRÈS que la vraie
-- base l'avait déjà créée : le « if not exists » ne l'ajoute donc pas.
-- (16 nov. 2026 : « column "ia_message" of relation "boites" does not exist ».)
alter table public.boites add column if not exists ia_message text;

-- admin_ecrire_avis(id, verdict, avis, message) : l'avis de l'IA sur une
-- boîte, puis l'avis pour le contributeur (contributions.avis_ia) refait
-- depuis toutes les boîtes relues de la proposition : le message seul s'il
-- n'y a qu'une boîte, sinon « Partie n : … » par boîte (comme
-- avisContributeur de supabase/functions/relire/relecture.js).
create or replace function public.admin_ecrire_avis(p_id bigint, p_verdict text, p_avis text, p_message text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare cid uuid; n int; txt text;
begin
  if not public.is_admin() then
    raise exception 'Accès refusé : compte non administrateur.' using errcode = '42501';
  end if;
  if p_verdict not in ('valide', 'douteux', 'rejet') then
    raise exception 'verdict inconnu : %', p_verdict;
  end if;
  update public.boites
     set ia_verdict = p_verdict, ia_avis = nullif(p_avis, ''), ia_message = nullif(p_message, ''),
         ia_le = now(), maj_le = now()
   where id = p_id
  returning contribution into cid;
  if cid is null then raise exception 'boîte inconnue : %', p_id; end if;
  select count(*) into n from public.boites where contribution = cid;
  select case when n = 1 then max(ia_message)
              else string_agg('Partie ' || (rang + 1) || ' : ' || ia_message, E'\n' order by rang) end
    into txt
    from public.boites where contribution = cid and coalesce(ia_message, '') <> '';
  update public.contributions set avis_ia = txt, updated_at = now() where id = cid;
end;
$$;
revoke all on function public.admin_ecrire_avis(bigint, text, text, text) from public, anon;
grant execute on function public.admin_ecrire_avis(bigint, text, text, text) to authenticated;

-- Témoins (banc) : un compte ordinaire est refusé ; l'avis d'une
-- proposition à deux boîtes devient « Partie 1 : … / Partie 2 : … ».
