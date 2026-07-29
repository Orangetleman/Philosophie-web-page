-- ════════════════════════════════════════════════════════════════════════
-- Migration Supabase — Envois ANONYMES via Supabase (remplacent PythonAnywhere)
-- ════════════════════════════════════════════════════════════════════════
-- À LANCER UNE FOIS dans l'éditeur SQL de Supabase (SQL Editor → coller → Run).
--
-- Pourquoi : la boîte anonyme PythonAnywhere (envois des visiteurs NON connectés)
-- est fragile (l'app gratuite se désactive tous les 3 mois). On fait donc passer
-- les envois anonymes par la table `contributions`, comme les envois connectés —
-- plus aucune dépendance à PythonAnywhere.
--
-- Sécurité : le rôle « anon » (clé publique du site) ne peut QU'INSÉRER une
-- contribution NON liée à un compte (user_id IS NULL), au statut « en_attente »,
-- SANS pré-remplir l'état interne. Il ne peut RIEN LIRE (la policy SELECT
-- existante exige user_id = auth.uid() → NULL pour un anonyme → aucune ligne).
-- Le tri reste réservé à l'admin (app mobile / agrégateur via service_role).
--
-- Idempotent : « drop policy if exists » avant « create ».

alter table public.contributions enable row level security;

-- Le rôle anon a normalement déjà l'INSERT (grants Supabase par défaut) ; on le
-- pose explicitement par sécurité (sans effet s'il existe déjà).
grant insert on public.contributions to anon;

-- Policy d'insertion anonyme, avec garde-fous : pas de compte, statut initial
-- imposé, et aucun champ interne pré-rempli (anti-abus).
drop policy if exists "anon_insert_contributions" on public.contributions;
create policy "anon_insert_contributions"
  on public.contributions
  for insert
  to anon
  with check (
    user_id is null
    and statut = 'en_attente'
    and aggregator_state is null
    and aggregator_updated_at is null
    and explication is null
    and avis_ia is null
  );

-- Vérification (facultatif) : lister les policies de la table.
--   select policyname, cmd, roles from pg_policies where tablename = 'contributions';
