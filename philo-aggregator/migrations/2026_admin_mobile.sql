-- ════════════════════════════════════════════════════════════════════════
-- Migration Supabase — Accès MOBILE à l'agrégateur (triage depuis le téléphone)
-- ════════════════════════════════════════════════════════════════════════
-- À LANCER DANS l'éditeur SQL de Supabase (Dashboard → SQL Editor → coller → Run).
--
-- Pourquoi : permettre de TRIER les contributions (valider / intégrer / rejeter
-- + note) depuis un téléphone, en se connectant avec SON PROPRE compte — SANS
-- jamais exposer la clé secrète `service_role`. La page mobile n'utilise que la
-- clé « anon » (publique) ; c'est Supabase qui vérifie ici, côté base, que la
-- personne connectée est bien l'ADMIN avant d'autoriser quoi que ce soit.
--
-- Mécanique : les colonnes internes (`aggregator_state`) sont INTERDITES aux
-- comptes normaux (cf. 2026_aggregator_state.sql). On passe donc par deux
-- fonctions `SECURITY DEFINER` (elles s'exécutent avec les droits du
-- propriétaire, donc voient tout) MAIS qui REFUSENT quiconque n'est pas admin.
-- Même principe que la fonction de suppression de compte.
--
-- Idempotent : « if not exists » / « create or replace » → relançable sans risque.

-- ── 1) Qui est admin ? ────────────────────────────────────────────────────
-- Table minuscule : un UID par mainteneur autorisé à trier. Aucune policy RLS
-- n'est créée dessus → elle est donc INACCESSIBLE via l'API publique
-- (anon/authenticated). Seul le rôle service_role (clé secrète) ou l'éditeur
-- SQL de Supabase peut la lire/écrire.
create table if not exists public.app_admins (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.app_admins enable row level security;

-- ⚠ ÉTAPE À FAIRE UNE FOIS : déclare TON compte comme admin.
--   1. Connecte-toi une première fois sur la page de triage : elle affiche ton
--      « UID » (identifiant de compte). Copie-le.
--   2. Décommente la ligne ci-dessous, colle ton UID à la place, et relance ce
--      script (ou exécute juste cette ligne).
--
-- insert into public.app_admins (user_id) values ('COLLE-TON-UID-ICI')
--   on conflict (user_id) do nothing;

-- ── 2) Helper : la personne connectée est-elle admin ? ─────────────────────
-- `auth.uid()` lit l'identité portée par le jeton de connexion (JWT). stable +
-- security definer pour pouvoir lire app_admins malgré RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.app_admins where user_id = auth.uid());
$$;

-- ── 3) Lister TOUTES les contributions (admin seulement) ───────────────────
-- Renvoie la ligne entière (y compris aggregator_state, normalement masqué aux
-- comptes) : la page mobile en a besoin pour préserver les notes/avis déjà posés.
create or replace function public.admin_list_contributions()
returns setof public.contributions
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès refusé : compte non administrateur.' using errcode = '42501';
  end if;
  return query
    select * from public.contributions order by created_at desc;
end;
$$;

-- ── 4) Trier UNE contribution (admin seulement) ────────────────────────────
-- Écrit le statut « contributeur » (visible dans « Mes propositions »), une
-- explication facultative, et l'état de tri interne (aggregator_state) +
-- l'horodatage. Cet horodatage permet à la synchro du PC (« dernière écriture
-- gagne ») de récupérer ce qui a été trié au téléphone.
--
-- Le type de la colonne `statut` (texte OU enum selon ta base) est détecté à la
-- volée : on caste `p_statut` vers ce type exact → robuste dans les deux cas.
create or replace function public.admin_triage(
  p_id          uuid,
  p_statut      text,
  p_explication text,
  p_state       jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_coltype text;
begin
  if not public.is_admin() then
    raise exception 'Accès refusé : compte non administrateur.' using errcode = '42501';
  end if;

  -- Type réel de la colonne statut (ex. « text » ou « contribution_statut »).
  select atttypid::regtype::text
    into v_coltype
    from pg_attribute
   where attrelid = 'public.contributions'::regclass
     and attname  = 'statut'
     and not attisdropped;

  execute format(
    'update public.contributions
        set statut                = $1::%s,
            explication           = coalesce($2, explication),
            aggregator_state      = $3,
            aggregator_updated_at = now(),
            updated_at            = now()
      where id = $4',
    v_coltype
  )
  using p_statut, nullif(p_explication, ''), p_state, p_id;
end;
$$;

-- ── 5) Droits d'exécution ──────────────────────────────────────────────────
-- Réservées aux comptes connectés (la garde is_admin() fait le tri fin).
revoke all on function public.is_admin()                  from public, anon;
revoke all on function public.admin_list_contributions()  from public, anon;
revoke all on function public.admin_triage(uuid,text,text,jsonb) from public, anon;
grant execute on function public.admin_list_contributions()  to authenticated;
grant execute on function public.admin_triage(uuid,text,text,jsonb) to authenticated;

-- Vérification (facultatif) :
--   select public.is_admin();                       -- true si tu es admin
--   select count(*) from public.admin_list_contributions();
