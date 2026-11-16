-- ===========================================================================
-- 2026_administration.sql — la base de la page /admin/ (lot A1 du chantier
-- « Administration », docs/chantier-administration.md, § 5, 8 et 9).
-- ===========================================================================
--
-- À passer UNE FOIS dans l'éditeur SQL de Supabase, après les migrations
-- précédentes (ordre : ORDRE du banc outils/banc/banc_schema.mjs). Rejouable.
--
-- ⚠ QUAND LA PASSER. À partir d'ici, l'état du tri vit dans la table
-- « boites », plus dans aggregator_state. Les anciens outils (triage/,
-- dashboard.py, sync, push) continuent d'écrire aggregator_state, que plus
-- personne ne lit. On la passe donc en production EN MÊME TEMPS que la mise
-- en ligne de /admin/ (lot A2), pas avant. La reprise des données (§ 6) recopie
-- dans « boites » le tri déjà fait : rien n'est perdu.
--
-- Ce qu'elle apporte :
--   1. boites : une ligne par boîte d'une proposition, avec son propre état
--      (décision Q6 : on trie boîte par boîte), sa note interne, sa réponse,
--      son sujet, l'avis de l'IA et la trace de son intégration ;
--   2. sujets et votes : regrouper les demandes, la page publique
--      Propositions (Q3 : votes réservés aux comptes) ;
--   3. suivi_empreinte : le numéro de suivi d'un envoi anonyme (Q4), gardé
--      seulement sous forme d'empreinte ;
--   4. le statut de la proposition, CALCULÉ depuis ses boîtes ;
--   5. les fonctions de /admin/ (réservées à is_admin()) et celles du public.
-- ===========================================================================


-- ── 1. sujets : les demandes regroupées ─────────────────────────────────────
-- Aucune donnée de personne : un titre, un texte, un état. Rien n'est public
-- tant que « publie » est faux.
create table if not exists public.sujets (
  id           bigint generated always as identity primary key,
  titre        text not null check (length(trim(titre)) between 1 and 300),
  description  text check (length(description) <= 2000),
  etat         text not null default 'propose'
               check (etat in ('propose','prevu','fait','refuse')),
  publie       boolean not null default false,
  reponse      text check (length(reponse) <= 2000),   -- réponse publique et commune
  cree_le      timestamptz not null default now(),
  maj_le       timestamptz not null default now()
);
alter table public.sujets enable row level security;
revoke all on public.sujets from anon, authenticated;   -- tout passe par les fonctions


-- ── 2. boites : l'état du tri, boîte par boîte ──────────────────────────────
-- Le CONTENU reste dans contributions.payload.boxes[rang] : on ne le
-- recopie pas. « id » est le n° montré dans /admin/ (« n° 47 »).
create table if not exists public.boites (
  id           bigint generated always as identity primary key,
  contribution uuid not null references public.contributions(id) on delete cascade,
  rang     integer not null check (rang >= 0),     -- 0 = première boîte (« position » est un mot réservé de SQL)
  statut       text not null default 'en_attente'
               check (statut in ('en_attente','validee','integree','refusee')),
  lue_le       timestamptz,                -- NULL = « nouvelle » dans /admin/
  note         text,                       -- note interne : jamais montrée au contributeur
  reponse      text check (length(reponse) <= 2000),   -- lue par le contributeur
  repondu_le   timestamptz,
  sujet        bigint references public.sujets(id) on delete set null,
  ia_verdict   text,                       -- avis de l'IA, interne (lot A4)
  ia_avis      text,
  ia_message   text,                       -- le même avis, rédigé pour le contributeur (lot A4)
  ia_le        timestamptz,
  integration  jsonb,                      -- {commit, fait_le, resultat, detail} (§ 9)
  cree_le      timestamptz not null default now(),
  maj_le       timestamptz not null default now(),
  unique (contribution, rang)
);
alter table public.boites enable row level security;
revoke all on public.boites from anon, authenticated;

-- Le contributeur connecté lit l'état et la réponse de SES boîtes (« 1 sur 3
-- validée »), pas la note interne ni l'avis interne de l'IA : droits colonne
-- par colonne, et la règle ne rend que les boîtes de ses propositions.
grant select (id, contribution, rang, statut, reponse, repondu_le)
  on public.boites to authenticated;
drop policy if exists "own_select_boites" on public.boites;
create policy "own_select_boites" on public.boites
  for select to authenticated
  using (exists (select 1 from public.contributions c
                  where c.id = contribution and c.user_id = auth.uid()));


-- ── 3. votes : un par compte et par sujet ───────────────────────────────────
-- Donnée de personne (le lien compte ↔ vote) : effacée avec le compte
-- (cascade), exportée par « Télécharger mes données ».
create table if not exists public.votes (
  sujet        bigint not null references public.sujets(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  valeur       smallint not null check (valeur in (-1, 1)),
  le           timestamptz not null default now(),
  primary key (sujet, user_id)
);
alter table public.votes enable row level security;
revoke all on public.votes from anon, authenticated;
-- Lire SES votes (export des données) ; voter passe par voter().
grant select (sujet, valeur, le) on public.votes to authenticated;
drop policy if exists "own_select_votes" on public.votes;
create policy "own_select_votes" on public.votes
  for select to authenticated using (user_id = auth.uid());


-- ── 4. Le numéro de suivi d'un envoi anonyme ────────────────────────────────
-- Le site tire un numéro au hasard (12 caractères, ~60 bits), le montre à la
-- personne, et n'envoie que son EMPREINTE (sha256, en hexadécimal, du numéro
-- en majuscules sans tirets ni espaces). Retrouver une proposition demande le
-- numéro lui-même : suivre(code) ci-dessous.
alter table public.contributions
  add column if not exists suivi_empreinte text;
alter table public.contributions
  drop constraint if exists contributions_suivi_empreinte_format;
alter table public.contributions
  add constraint contributions_suivi_empreinte_format
  check (suivi_empreinte is null or suivi_empreinte ~ '^[0-9a-f]{64}$');
create unique index if not exists contributions_suivi_empreinte_unique
  on public.contributions (suivi_empreinte) where suivi_empreinte is not null;
-- L'envoi anonyme peut la poser (droits colonne par colonne de
-- 2026_contributions_colonnes.sql, complétés).
grant insert (suivi_empreinte) on public.contributions to anon;


-- ── 5. Le statut de la proposition, calculé depuis ses boîtes ───────────────
-- statut_depuis_boites(cid) :
--   toutes en attente                       → en_attente (corrigeable par l'auteur)
--   toutes refusées                         → refusee
--   toutes intégrées ou refusées, ≥ 1 intégrée → validee_integree
--   sinon                                   → validee_en_cours
-- La colonne statut peut être un texte ou une énumération selon la base
-- (cf. admin_triage, 2026_admin_mobile.sql) : on écrit avec son type réel.
create or replace function public.contribution_recalculer(cid uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  n int; n_att int; n_ref int; n_int int; v text; v_type text;
begin
  select count(*),
         count(*) filter (where statut = 'en_attente'),
         count(*) filter (where statut = 'refusee'),
         count(*) filter (where statut = 'integree')
    into n, n_att, n_ref, n_int
    from public.boites where contribution = cid;
  if n = 0 then return; end if;
  v := case
         when n_att = n then 'en_attente'
         when n_ref = n then 'refusee'
         when n_int + n_ref = n then 'validee_integree'
         else 'validee_en_cours'
       end;
  select atttypid::regtype::text into v_type
    from pg_attribute
   where attrelid = 'public.contributions'::regclass and attname = 'statut' and not attisdropped;
  execute format('update public.contributions set statut = $1::%s, updated_at = now()
                   where id = $2 and statut::text is distinct from $1', v_type)
    using v, cid;
end;
$$;
revoke all on function public.contribution_recalculer(uuid) from public, anon, authenticated;

create or replace function public.boites_apres_changement()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.contribution_recalculer(coalesce(new.contribution, old.contribution));
  return null;
end;
$$;
revoke all on function public.boites_apres_changement() from public, anon, authenticated;


-- ── 6. Les boîtes suivent la proposition ────────────────────────────────────
-- boites_aligner(cid) : une ligne par élément de payload.boxes (au moins une).
-- À l'envoi, toutes sont créées ; quand l'auteur corrige une proposition
-- encore en attente, on ajoute ou retire les boîtes en trop et on les remet
-- « nouvelles » (lue_le NULL) pour que la correction se voie dans /admin/.
create or replace function public.boites_aligner(cid uuid, correction boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare nb int;
begin
  select greatest(1, coalesce(jsonb_array_length(
           case when jsonb_typeof(payload->'boxes') = 'array' then payload->'boxes' end), 0))
    into nb from public.contributions where id = cid;
  if nb is null then return; end if;
  delete from public.boites where contribution = cid and rang >= nb;
  insert into public.boites (contribution, rang)
    select cid, p from generate_series(0, nb - 1) p
  on conflict (contribution, rang) do nothing;
  if correction then
    update public.boites set lue_le = null, maj_le = now() where contribution = cid;
  end if;
end;
$$;
revoke all on function public.boites_aligner(uuid, boolean) from public, anon, authenticated;

create or replace function public.contributions_apres_envoi()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    perform public.boites_aligner(new.id, false);
  elsif new.payload is distinct from old.payload
        and not exists (select 1 from public.boites
                         where contribution = new.id and statut <> 'en_attente') then
    -- Correction par l'auteur (la règle own_update_pending ne la permet
    -- qu'en attente) : seulement si aucune boîte n'a encore été triée.
    perform public.boites_aligner(new.id, true);
  end if;
  return null;
end;
$$;
revoke all on function public.contributions_apres_envoi() from public, anon, authenticated;


-- ── 7. Reprise des données : le tri déjà fait passe dans « boites » ─────────
-- aggregator_state.boxes[i].status (agrégateur et triage/) :
--   validee → validee ; integree, archivee → integree ; rejetee → refusee ;
-- à défaut d'état, le statut de la proposition. Tout ce qui existe déjà est
-- marqué lu (il a été vu dans les anciens outils). Rejouable : on conflict.
insert into public.boites (contribution, rang, statut, lue_le, note, ia_verdict, ia_avis, ia_message, ia_le)
select c.id, p.pos,
       case coalesce(st.b->>'status',
                     case c.statut::text when 'validee_en_cours' then 'validee'
                                         when 'validee_integree' then 'integree'
                                         when 'refusee' then 'rejetee' end)
         when 'validee' then 'validee'
         when 'integree' then 'integree'
         when 'archivee' then 'integree'
         when 'rejetee' then 'refusee'
         else 'en_attente' end,
       now(),
       nullif(st.b->>'note', ''),
       nullif(st.b->>'ai_verdict', ''),
       nullif(st.b->>'ai_review', ''),
       nullif(st.b->>'ai_user_message', ''),
       case when st.b->>'ai_verdict' is not null then c.aggregator_updated_at end
  from public.contributions c
  cross join lateral generate_series(0, greatest(1, coalesce(jsonb_array_length(
         case when jsonb_typeof(c.payload->'boxes') = 'array' then c.payload->'boxes' end), 0)) - 1) as p(pos)
  left join lateral (select c.aggregator_state->'boxes'->p.pos as b) st on true
on conflict (contribution, rang) do nothing;

-- Les déclencheurs viennent APRÈS la reprise : elle ne réécrit pas le statut
-- des propositions anciennes.
drop trigger if exists boites_statut on public.boites;
create trigger boites_statut
  after insert or update of statut or delete on public.boites
  for each row execute function public.boites_apres_changement();
drop trigger if exists contributions_boites on public.contributions;
create trigger contributions_boites
  after insert or update of payload on public.contributions
  for each row execute function public.contributions_apres_envoi();


-- ── 8. Les fonctions de /admin/ (réservées à l'administrateur) ──────────────
-- Toutes vérifient is_admin() (2026_admin_mobile.sql) et lèvent 42501 sinon.

-- admin_boites() : la boîte de réception entière, avec ce qu'il faut pour
-- l'afficher : le contenu de la boîte, le pseudo, le nombre de boîtes de la
-- proposition, et comment le contributeur lira la réponse.
create or replace function public.admin_boites()
returns table (
  id bigint, contribution uuid, rang integer, nb_boites integer,
  statut text, lue_le timestamptz, note text, reponse text, repondu_le timestamptz,
  sujet bigint, ia_verdict text, ia_avis text, ia_le timestamptz, integration jsonb,
  cree_le timestamptz, maj_le timestamptz,
  contenu jsonb, pseudo text, a_compte boolean, a_suivi boolean
)
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
    select b.id, b.contribution, b.rang,
           (select count(*)::int from public.boites x where x.contribution = b.contribution),
           b.statut, b.lue_le, b.note, b.reponse, b.repondu_le,
           b.sujet, b.ia_verdict, b.ia_avis, b.ia_le, b.integration,
           c.created_at, b.maj_le,
           c.payload->'boxes'->b.rang,
           nullif(c.payload->>'contributor', ''),
           c.user_id is not null,
           c.suivi_empreinte is not null
      from public.boites b
      join public.contributions c on c.id = b.contribution
     order by c.created_at desc, b.rang;
end;
$$;

-- admin_maj_boite(id, champs) : change ce que « champs » contient, et
-- seulement ça. Clés : statut, note, reponse, sujet, lue (booléen).
-- Une réponse non vide date repondu_le.
create or replace function public.admin_maj_boite(p_id bigint, p_champs jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès refusé : compte non administrateur.' using errcode = '42501';
  end if;
  if not exists (select 1 from public.boites where id = p_id) then
    raise exception 'boîte inconnue : %', p_id;
  end if;
  update public.boites set
    statut     = case when p_champs ? 'statut' then p_champs->>'statut' else statut end,
    note       = case when p_champs ? 'note' then nullif(p_champs->>'note', '') else note end,
    reponse    = case when p_champs ? 'reponse' then nullif(p_champs->>'reponse', '') else reponse end,
    repondu_le = case when p_champs ? 'reponse' then
                   case when nullif(p_champs->>'reponse', '') is null then null else now() end
                 else repondu_le end,
    sujet      = case when p_champs ? 'sujet' then (p_champs->>'sujet')::bigint else sujet end,
    lue_le     = case when p_champs ? 'lue' then
                   case when (p_champs->>'lue')::boolean then coalesce(lue_le, now()) end
                 else lue_le end,
    maj_le     = now()
  where id = p_id;
end;
$$;

-- admin_supprimer_boite(id) : abus. Définitif ; une proposition sans plus
-- aucune boîte est supprimée avec.
create or replace function public.admin_supprimer_boite(p_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare cid uuid;
begin
  if not public.is_admin() then
    raise exception 'Accès refusé : compte non administrateur.' using errcode = '42501';
  end if;
  delete from public.boites where id = p_id returning contribution into cid;
  if cid is not null and not exists (select 1 from public.boites where contribution = cid) then
    delete from public.contributions where id = cid;
  end if;
end;
$$;

-- admin_sujets() : tous les sujets, avec demandes (boîtes rangées), votes et
-- score = demandes + pour − contre.
create or replace function public.admin_sujets()
returns table (
  id bigint, titre text, description text, etat text, publie boolean, reponse text,
  cree_le timestamptz, maj_le timestamptz,
  demandes integer, pour integer, contre integer, score integer
)
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
    select s.id, s.titre, s.description, s.etat, s.publie, s.reponse, s.cree_le, s.maj_le,
           d.n, v.p, v.c, d.n + v.p - v.c
      from public.sujets s
      cross join lateral (select count(*)::int as n from public.boites b where b.sujet = s.id) d
      cross join lateral (select count(*) filter (where valeur = 1)::int as p,
                                 count(*) filter (where valeur = -1)::int as c
                            from public.votes w where w.sujet = s.id) v
     order by d.n + v.p - v.c desc, s.cree_le desc;
end;
$$;

-- admin_enregistrer_sujet(id, champs) : crée (id NULL) ou modifie un sujet ;
-- renvoie son id. Clés : titre, description, etat, publie, reponse.
create or replace function public.admin_enregistrer_sujet(p_id bigint, p_champs jsonb)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare nid bigint;
begin
  if not public.is_admin() then
    raise exception 'Accès refusé : compte non administrateur.' using errcode = '42501';
  end if;
  if p_id is null then
    insert into public.sujets (titre, description, etat, publie, reponse)
    values (p_champs->>'titre', nullif(p_champs->>'description', ''),
            coalesce(p_champs->>'etat', 'propose'),
            coalesce((p_champs->>'publie')::boolean, false),
            nullif(p_champs->>'reponse', ''))
    returning id into nid;
    return nid;
  end if;
  update public.sujets set
    titre       = case when p_champs ? 'titre' then p_champs->>'titre' else titre end,
    description = case when p_champs ? 'description' then nullif(p_champs->>'description', '') else description end,
    etat        = case when p_champs ? 'etat' then p_champs->>'etat' else etat end,
    publie      = case when p_champs ? 'publie' then (p_champs->>'publie')::boolean else publie end,
    reponse     = case when p_champs ? 'reponse' then nullif(p_champs->>'reponse', '') else reponse end,
    maj_le      = now()
  where id = p_id
  returning id into nid;
  if nid is null then raise exception 'sujet inconnu : %', p_id; end if;
  return nid;
end;
$$;

create or replace function public.admin_supprimer_sujet(p_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès refusé : compte non administrateur.' using errcode = '42501';
  end if;
  delete from public.sujets where id = p_id;   -- boîtes : sujet → NULL ; votes : effacés
end;
$$;

-- admin_importer_integration(rapport) : applique un compte rendu
-- philo-integration/v1 (§ 9 du cadrage), déjà relu dans l'aperçu de /admin/
-- (la page n'envoie que les lignes cochées, avec les réponses corrigées, et
-- seulement si le compte rendu est en ligne). Une ligne de résultat par boîte :
--   integree / retouchee  → boîte validée passée « integree », réponse posée ;
--   non_integree          → boîte validée repassée « en_attente », raison en note ;
--   « deja »    : même commit déjà appliqué (réimporter ne change rien) ;
--   « ignoree » : boîte qui n'est plus « validee » ;
--   « inconnue »: n° absent de la base.
create or replace function public.admin_importer_integration(p_rapport jsonb)
returns table (id bigint, resultat text, avant text, apres text)
language plpgsql
security definer
set search_path = public
as $$
declare
  it jsonb; bid bigint; b record; v_res text; v_commit text; v_le text;
begin
  if not public.is_admin() then
    raise exception 'Accès refusé : compte non administrateur.' using errcode = '42501';
  end if;
  if p_rapport->>'format' is distinct from 'philo-integration/v1' then
    raise exception 'format inconnu : % (attendu philo-integration/v1)', coalesce(p_rapport->>'format', 'absent');
  end if;
  v_commit := nullif(p_rapport->>'commit', '');
  v_le := coalesce(p_rapport->>'fait_le', now()::text);
  if v_commit is null then raise exception 'compte rendu sans commit'; end if;

  for it in select * from jsonb_array_elements(coalesce(p_rapport->'boites', '[]'::jsonb)) loop
    bid := (it->>'id')::bigint;
    v_res := it->>'resultat';
    select x.statut, x.integration into b from public.boites x where x.id = bid;
    if not found then
      id := bid; resultat := 'inconnue'; avant := null; apres := null; return next; continue;
    end if;
    if b.statut = 'integree' and b.integration->>'commit' = v_commit then
      id := bid; resultat := 'deja'; avant := b.statut; apres := b.statut; return next; continue;
    end if;
    if b.statut <> 'validee' or v_res not in ('integree','retouchee','non_integree') then
      id := bid; resultat := 'ignoree'; avant := b.statut; apres := b.statut; return next; continue;
    end if;
    if v_res = 'non_integree' then
      update public.boites x set
        statut = 'en_attente',
        note = concat_ws(E'\n', x.note, '[Intégration ' || left(v_le, 10) || ', non intégrée] ' || coalesce(it->>'detail', '')),
        maj_le = now()
      where x.id = bid;
      id := bid; resultat := v_res; avant := 'validee'; apres := 'en_attente'; return next;
    else
      update public.boites x set
        statut = 'integree',
        integration = jsonb_build_object('commit', v_commit, 'fait_le', v_le,
                                         'resultat', v_res, 'detail', it->>'detail'),
        reponse = coalesce(nullif(it->>'reponse', ''), x.reponse),
        repondu_le = case when nullif(it->>'reponse', '') is not null then now() else x.repondu_le end,
        maj_le = now()
      where x.id = bid;
      id := bid; resultat := v_res; avant := 'validee'; apres := 'integree'; return next;
    end if;
  end loop;
end;
$$;

revoke all on function public.admin_boites()                          from public, anon;
revoke all on function public.admin_maj_boite(bigint, jsonb)           from public, anon;
revoke all on function public.admin_supprimer_boite(bigint)            from public, anon;
revoke all on function public.admin_sujets()                          from public, anon;
revoke all on function public.admin_enregistrer_sujet(bigint, jsonb)   from public, anon;
revoke all on function public.admin_supprimer_sujet(bigint)            from public, anon;
revoke all on function public.admin_importer_integration(jsonb)        from public, anon;
grant execute on function public.admin_boites()                        to authenticated;
grant execute on function public.admin_maj_boite(bigint, jsonb)         to authenticated;
grant execute on function public.admin_supprimer_boite(bigint)          to authenticated;
grant execute on function public.admin_sujets()                        to authenticated;
grant execute on function public.admin_enregistrer_sujet(bigint, jsonb) to authenticated;
grant execute on function public.admin_supprimer_sujet(bigint)          to authenticated;
grant execute on function public.admin_importer_integration(jsonb)      to authenticated;


-- ── 9. Les fonctions du public ──────────────────────────────────────────────

-- propositions() : la page publique (onglet Propositions d'Explorer). Les
-- sujets PUBLIÉS seulement, avec leurs compteurs et, pour un compte, son vote.
create or replace function public.propositions()
returns table (
  id bigint, titre text, description text, etat text, reponse text, maj_le timestamptz,
  demandes integer, pour integer, contre integer, score integer, mon_vote smallint
)
language sql
stable
security definer
set search_path = public
as $$
  select s.id, s.titre, s.description, s.etat, s.reponse, s.maj_le,
         d.n, v.p, v.c, d.n + v.p - v.c,
         (select w.valeur from public.votes w where w.sujet = s.id and w.user_id = auth.uid())
    from public.sujets s
    cross join lateral (select count(*)::int as n from public.boites b where b.sujet = s.id) d
    cross join lateral (select count(*) filter (where valeur = 1)::int as p,
                               count(*) filter (where valeur = -1)::int as c
                          from public.votes w where w.sujet = s.id) v
   where s.publie
   order by d.n + v.p - v.c desc, s.maj_le desc;
$$;
revoke all on function public.propositions() from public;
grant execute on function public.propositions() to anon, authenticated;

-- voter(sujet, valeur) : 1 pour, -1 contre, 0 retire son vote. Comptes
-- seulement, sujets publiés seulement.
create or replace function public.voter(p_sujet bigint, p_valeur integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'non connecté' using errcode = '42501'; end if;
  if not exists (select 1 from public.sujets where id = p_sujet and publie) then
    raise exception 'sujet inconnu';
  end if;
  if p_valeur = 0 then
    delete from public.votes where sujet = p_sujet and user_id = uid;
  elsif p_valeur in (-1, 1) then
    insert into public.votes (sujet, user_id, valeur) values (p_sujet, uid, p_valeur)
    on conflict (sujet, user_id) do update set valeur = excluded.valeur, le = now();
  else
    raise exception 'vote invalide';
  end if;
end;
$$;
revoke all on function public.voter(bigint, integer) from public, anon;
grant execute on function public.voter(bigint, integer) to authenticated;

-- suivre(code) : retrouver un envoi anonyme par son numéro de suivi. Rend la
-- proposition, son statut et, boîte par boîte, l'état et la réponse ; jamais
-- la note interne. Un numéro faux ne rend rien.
create or replace function public.suivre(p_code text)
returns table (cree_le timestamptz, statut text, payload jsonb, boites jsonb)
language sql
stable
security definer
set search_path = public
as $$
  select c.created_at, c.statut::text, c.payload,
         (select coalesce(jsonb_agg(jsonb_build_object(
                   'rang', b.rang, 'statut', b.statut,
                   'reponse', b.reponse, 'repondu_le', b.repondu_le) order by b.rang), '[]'::jsonb)
            from public.boites b where b.contribution = c.id)
    from public.contributions c
   where length(regexp_replace(upper(coalesce(p_code, '')), '[^0-9A-Z]', '', 'g')) >= 12
     and c.suivi_empreinte = encode(sha256(convert_to(
           regexp_replace(upper(p_code), '[^0-9A-Z]', '', 'g'), 'UTF8')), 'hex');
$$;
revoke all on function public.suivre(text) from public;
grant execute on function public.suivre(text) to anon, authenticated;

-- Témoins (joués par le banc, outils/banc/banc_schema.mjs) :
--   • un envoi crée ses boîtes ; la reprise garde le tri déjà fait ;
--   • le statut de la proposition suit ses boîtes ;
--   • un compte lit l'état et la réponse de ses boîtes, pas la note interne ;
--   • les fonctions admin refusent un compte ordinaire ;
--   • importer un compte rendu deux fois ne change rien la seconde fois ;
--   • un sujet non publié est invisible, un vote par compte ;
--   • le numéro de suivi retrouve SA proposition, un faux ne rend rien.
