-- ════════════════════════════════════════════════════════════════════════
-- Migration Supabase — Synchro cross-plateforme de l'agrégateur (phase 6)
-- ════════════════════════════════════════════════════════════════════════
-- À LANCER UNE SEULE FOIS dans l'éditeur SQL de Supabase
-- (Dashboard Supabase → SQL Editor → coller → Run).
--
-- Pourquoi : l'état de travail du mainteneur (statut/note/avis IA de chaque
-- « boîte ») vivait UNIQUEMENT dans le SQLite local `proposals.db`, donc
-- invisible depuis une autre machine. On le miroite désormais dans la table
-- `contributions` pour qu'il soit consultable et récupérable partout
-- (commande `python aggregate.py sync` ou bouton « 🔄 Synchroniser »).
--
-- Idempotent : « IF NOT EXISTS » → relançable sans risque.

-- 1) L'état complet par contribution, sérialisé en JSON par l'agrégateur :
--    { "v":1, "updated_at":"…", "boxes":[ {position,status,note,
--      ai_verdict,ai_review,ai_user_message}, … ] }
ALTER TABLE contributions
    ADD COLUMN IF NOT EXISTS aggregator_state jsonb;

-- 2) Horodatage de la dernière écriture de cet état (arbitrage local/cloud :
--    « dernière écriture gagne »).
ALTER TABLE contributions
    ADD COLUMN IF NOT EXISTS aggregator_updated_at timestamptz;

-- 3) CONFIDENTIALITÉ : `aggregator_state` contient des notes internes et des
--    appréciations destinées au MAINTENEUR (jargon : « doublon probable »…).
--    On INTERDIT sa lecture aux rôles publics (le navigateur des
--    contributeurs) : seul le rôle `service_role` (la clé secrète, sur ton PC)
--    peut la lire/écrire. Le site n'a de toute façon JAMAIS besoin de cette
--    colonne (il lit id,payload,statut,explication,avis_ia,created_at).
REVOKE SELECT (aggregator_state)        ON contributions FROM anon, authenticated;
REVOKE SELECT (aggregator_updated_at)   ON contributions FROM anon, authenticated;

-- Vérification (facultatif) : lister les colonnes de la table.
--   SELECT column_name FROM information_schema.columns
--   WHERE table_name = 'contributions' ORDER BY ordinal_position;
