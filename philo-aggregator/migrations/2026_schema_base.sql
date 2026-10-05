-- ════════════════════════════════════════════════════════════════════════
-- Schéma de BASE de la base Supabase du site (tables du compte et des
-- propositions) — RECONSTITUÉ depuis le code le 5 octobre 2026
-- ════════════════════════════════════════════════════════════════════════
-- Pourquoi : les tables `contributions`, `preferences`, `quiz_progress` et la
-- fonction `delete_own_account` avaient été créées à la main dans le tableau
-- de bord Supabase, sans trace dans le dépôt (diagnostic, § 2.4). Impossible
-- alors de reconstruire la base, ou de relire ses règles d'accès.
--
-- ⚠ CE FICHIER EST UNE RECONSTITUTION. Il décrit ce que le code lit et écrit
--   (index.html, triage/, philo-aggregator/), pas une copie de la base réelle.
--   AVANT de s'en servir :
--     1. lancer 2026_schema_lecture.sql (lecture seule) dans l'éditeur SQL ;
--     2. comparer avec ce fichier, et corriger CE FICHIER s'il diffère ;
--   NE PAS le lancer sur la base actuelle sans cette comparaison : des règles
--   d'accès (policies) de noms différents s'AJOUTERAIENT aux existantes.
--   Usage prévu : une nouvelle instance, puis, dans l'ordre,
--   2026_aggregator_state.sql, 2026_admin_mobile.sql, 2026_anon_contributions.sql.
--
-- Idempotent pour une base neuve (« if not exists », « drop … if exists »).
-- ════════════════════════════════════════════════════════════════════════


-- ── 1. contributions : les propositions de contenu ──────────────────────
-- Écrite par le site (sendProposalToSupabase, sendProposalAnonSupabase,
-- updateProposalInSupabase), lue par « Mes propositions » et par
-- l'agrégateur (supabase_client.py, clé service_role).
create table if not exists public.contributions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade,  -- NULL = envoi anonyme
  payload      jsonb not null,               -- le JSON philo-proposal/v3
  statut       text not null default 'en_attente'
               check (statut in ('en_attente','validee_en_cours','validee_integree','refusee')),
  explication  text,                         -- le mot du relecteur humain
  avis_ia      text,                         -- l'avis Gemini reformulé pour l'auteur
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
  -- aggregator_state / aggregator_updated_at : ajoutées par 2026_aggregator_state.sql
);
alter table public.contributions enable row level security;

-- Un compte lit SES propositions (« Mes propositions »).
drop policy if exists "own_select_contributions" on public.contributions;
create policy "own_select_contributions" on public.contributions
  for select to authenticated using (user_id = auth.uid());

-- Un compte insère une proposition à SON nom, au statut initial.
drop policy if exists "own_insert_contributions" on public.contributions;
create policy "own_insert_contributions" on public.contributions
  for insert to authenticated
  with check (user_id = auth.uid() and statut = 'en_attente');

-- Un compte modifie SA proposition tant qu'elle est « en attente »
-- (editMyContribution) ; une fois triée, elle ne bouge plus. Le site chaîne
-- .select('id') pour détecter un refus silencieux (0 ligne touchée).
drop policy if exists "own_update_pending_contributions" on public.contributions;
create policy "own_update_pending_contributions" on public.contributions
  for update to authenticated
  using (user_id = auth.uid() and statut = 'en_attente')
  with check (user_id = auth.uid() and statut = 'en_attente');

-- (La règle d'insertion ANONYME est dans 2026_anon_contributions.sql.)


-- ── 2. preferences : réglages et position, par compte ───────────────────
-- data = prefsBlobForSync() : {mode, tour, nav, drafts}. Une ligne par compte.
create table if not exists public.preferences (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  data        jsonb,
  updated_at  timestamptz not null default now()
);
alter table public.preferences enable row level security;
drop policy if exists "own_preferences" on public.preferences;
create policy "own_preferences" on public.preferences
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());


-- ── 3. quiz_progress : progression du quiz, par compte ──────────────────
-- data = l'objet philo-quiz entier (quizBlobForSync) ; fusionné carte par
-- carte par le site (mergeQuiz). updated_at sert de marqueur de synchro.
create table if not exists public.quiz_progress (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  data        jsonb,
  updated_at  timestamptz not null default now()
);
alter table public.quiz_progress enable row level security;
drop policy if exists "own_quiz_progress" on public.quiz_progress;
create policy "own_quiz_progress" on public.quiz_progress
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());


-- ── 4. delete_own_account() : suppression de SON compte ─────────────────
-- Appelée par authDeleteAccount (SB.rpc('delete_own_account')). Le client ne
-- peut pas supprimer un compte lui-même (il faudrait la clé secrète) : la
-- fonction tourne avec les droits de son propriétaire (security definer),
-- mais ne touche QUE les lignes de auth.uid().
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
  delete from public.contributions where user_id = uid;
  delete from public.quiz_progress  where user_id = uid;
  delete from public.preferences    where user_id = uid;
  delete from auth.users            where id = uid;
end;
$$;
revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
