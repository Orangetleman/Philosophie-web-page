/* ════════════════════════════════════════════════════════════════════
   banc_schema.mjs — banc d'essai des règles d'accès de la base Supabase
   ────────────────────────────────────────────────────────────────────
   Joue les migrations de philo-aggregator/migrations/ (dans l'ordre de
   ORDRE) sur PGlite, un PostgreSQL qui tourne dans Node, par-dessus
   decor_supabase.sql : ce que Supabase fournit d'office (rôles anon /
   authenticated / service_role, droits par défaut, schéma auth, auth.uid()).
   Le décor est repris du banc de Fiches BUT (essais/base/decor.sql).

   Chaque essai joue un scénario sous un rôle, comme PostgREST le ferait
   (jeton dans request.jwt.claims + « set local role »), puis son TÉMOIN :
   la même chose avec la règle retirée ou affaiblie, qui DOIT échouer.

     cd outils/banc && npm ci && node banc_schema.mjs
   (npm ci installe PGlite, version verrouillée, dans outils/banc/node_modules,
   ignoré par git. Aucun compte, aucun réseau ensuite.)

   Créé le 5 octobre 2026 ; c'est lui qui a montré que le « REVOKE SELECT
   (aggregator_state) » de 2026_aggregator_state.sql ne cachait rien
   (cf. 2026_contributions_colonnes.sql).
   ════════════════════════════════════════════════════════════════════ */
import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import crypto from 'crypto';   // empreinte du numéro de suivi (essai « suivi »)
import path from 'path';
import { fileURLToPath } from 'url';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const MIG = process.argv[2] || path.join(ICI, '..', '..', 'philo-aggregator', 'migrations');
const ORDRE = ['2026_schema_base.sql', '2026_aggregator_state.sql', '2026_admin_mobile.sql',
               '2026_anon_contributions.sql', '2026_contributions_colonnes.sql',
               '2026_rgpd.sql',    // nov. 2026 : suppression sans perte des propositions, purge
               '2026_administration.sql',    // nov. 2026 : boîtes, sujets, votes, suivi anonyme (/admin/)
               '2026_relecture.sql'];        // nov. 2026 : avis de l'IA écrit sans clé de service
const lire = f => fs.readFileSync(path.join(MIG, f), 'utf8').replace(/\r\n/g, '\n');   // fins de ligne Windows

async function base(sauf) {
  const db = new PGlite();
  await db.exec(fs.readFileSync(path.join(ICI, 'decor_supabase.sql'), 'utf8'));
  for (const f of ORDRE) {
    let sql = lire(f);
    if (sauf) sql = sauf(f, sql);
    if (sql) await db.exec(sql);
  }
  return db;
}
async function inscrire(db, email) {
  return (await db.query("insert into auth.users (email) values ($1) returning id", [email])).rows[0].id;
}
// Exécute fn(tx) sous un rôle, comme PostgREST : jeton dans request.jwt.claims + set local role.
async function sous(db, qui, fn) {
  return db.transaction(async tx => {
    const rev = qui === 'anon' ? { role: 'anon' } : qui === 'service_role' ? { role: 'service_role' } : { sub: qui, role: 'authenticated' };
    await tx.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify(rev)]);
    await tx.query(`set local role ${rev.role}`);
    return fn(tx);
  });
}
const tente = async p => { try { await p; return true; } catch (e) { return false; } };
const remplace = (fichier, a, b) => (f, s) => {
  if (f !== fichier) return s;
  if (!s.includes(a)) throw new Error(`témoin : « ${a.slice(0, 50)} » absent de ${fichier}`);
  return s.replace(a, b);
};
const sans = fichier => (f, s) => (f === fichier ? '' : s);

const ESSAIS = [
  { nom: "un compte lit ses propositions, pas celles d'un autre",
    temoin: remplace('2026_schema_base.sql', 'for select to authenticated using (user_id = auth.uid());', 'for select to authenticated using (true);'),
    async f(db) {
      const a = await inscrire(db, 'a@x'), b = await inscrire(db, 'b@x');
      await sous(db, a, tx => tx.query("insert into public.contributions (user_id, payload) values ($1, '{}')", [a]));
      await sous(db, b, tx => tx.query("insert into public.contributions (user_id, payload) values ($1, '{}')", [b]));
      const vu = await sous(db, a, tx => tx.query("select user_id from public.contributions"));
      return vu.rows.length === 1 && vu.rows[0].user_id === a;
    } },
  { nom: "un compte ne peut pas insérer au nom d'un autre",
    temoin: remplace('2026_schema_base.sql', "with check (user_id = auth.uid() and statut = 'en_attente');", 'with check (true);'),
    async f(db) {
      const a = await inscrire(db, 'a@x'), b = await inscrire(db, 'b@x');
      return !(await tente(sous(db, a, tx => tx.query("insert into public.contributions (user_id, payload) values ($1, '{}')", [b]))));
    } },
  { nom: "une proposition se corrige en attente, plus une fois triée",
    temoin: remplace('2026_schema_base.sql', "using (user_id = auth.uid() and statut = 'en_attente')\n  with check (user_id = auth.uid() and statut = 'en_attente');", 'using (user_id = auth.uid())\n  with check (user_id = auth.uid());'),
    async f(db) {
      const a = await inscrire(db, 'a@x');
      await sous(db, a, tx => tx.query("insert into public.contributions (user_id, payload) values ($1, '{\"v\":1}')", [a]));
      const id = (await db.query('select id from public.contributions')).rows[0].id;
      const r1 = await sous(db, a, tx => tx.query("update public.contributions set payload='{\"v\":2}' where id=$1 returning id", [id]));
      await db.query("update public.contributions set statut='validee_en_cours' where id=$1", [id]);
      const r2 = await sous(db, a, tx => tx.query("update public.contributions set payload='{\"v\":3}' where id=$1 returning id", [id]));
      return r1.rows.length === 1 && r2.rows.length === 0;
    } },
  { nom: "un anonyme envoie une proposition sans compte, mais ne lit rien",
    temoin: (f, s) => f === '2026_anon_contributions.sql' ? s.replace(/create policy "anon_insert_contributions"[\s\S]*?\);\n/, '') : s,
    async f(db) {
      const ok = await tente(sous(db, 'anon', tx => tx.query("insert into public.contributions (user_id, payload) values (null, '{}')")));
      // Lire : soit refusé (droit retiré), soit aucune ligne (RLS). Jamais une ligne.
      const lignes = await sous(db, 'anon', tx => tx.query('select id from public.contributions')).then(r => r.rows.length, () => 0);
      return ok && lignes === 0;
    } },
  { nom: "l'état interne de l'agrégateur n'est pas lisible par un compte",
    temoin: sans('2026_contributions_colonnes.sql'),
    async f(db) {
      const a = await inscrire(db, 'a@x');
      await sous(db, a, tx => tx.query("insert into public.contributions (user_id, payload) values ($1, '{}')", [a]));
      return !(await tente(sous(db, a, tx => tx.query('select aggregator_state from public.contributions'))));
    } },
  { nom: "un compte n'écrit ni l'état interne ni l'avis, à l'envoi comme en correction",
    temoin: sans('2026_contributions_colonnes.sql'),
    async f(db) {
      const a = await inscrire(db, 'a@x');
      const ins = await tente(sous(db, a, tx => tx.query("insert into public.contributions (user_id, payload, aggregator_state) values ($1, '{}', '{\"v\":1}')", [a])));
      const id = (await db.query("insert into public.contributions (user_id, payload) values ($1, '{}') returning id", [a])).rows[0].id;
      const maj = await tente(sous(db, a, tx => tx.query("update public.contributions set avis_ia='parfait' where id=$1", [id])));
      return !ins && !maj;
    } },
  { nom: "le site garde ce qu'il lui faut : « Mes propositions » et la correction",
    temoin: remplace('2026_contributions_colonnes.sql', 'grant update (payload, updated_at) on public.contributions to authenticated;', 'grant update (updated_at) on public.contributions to authenticated;'),
    async f(db) {
      const a = await inscrire(db, 'a@x');
      await sous(db, a, tx => tx.query("insert into public.contributions (user_id, payload) values ($1, '{}')", [a]));
      const mes = await sous(db, a, tx => tx.query('select id,payload,statut,explication,avis_ia,created_at from public.contributions'));
      const id = mes.rows[0].id;
      const maj = await sous(db, a, tx => tx.query("update public.contributions set payload='{\"v\":2}' where id=$1 returning id", [id])).catch(() => ({ rows: [] }));
      return mes.rows.length === 1 && maj.rows.length === 1;
    } },
  { nom: 'préférences et progression du quiz : chacun la sienne',
    temoin: remplace('2026_schema_base.sql', 'create policy "own_quiz_progress" on public.quiz_progress\n  for all to authenticated\n  using (user_id = auth.uid()) with check (user_id = auth.uid());', 'create policy "own_quiz_progress" on public.quiz_progress\n  for all to authenticated using (true) with check (true);'),
    async f(db) {
      const a = await inscrire(db, 'a@x'), b = await inscrire(db, 'b@x');
      await sous(db, a, tx => tx.query("insert into public.quiz_progress (user_id, data) values ($1, '{}')", [a]));
      await sous(db, a, tx => tx.query("insert into public.preferences (user_id, data) values ($1, '{}')", [a]));
      const q = await sous(db, b, tx => tx.query('select * from public.quiz_progress'));
      const p = await sous(db, b, tx => tx.query('select * from public.preferences'));
      const ecrit = await tente(sous(db, b, tx => tx.query("insert into public.quiz_progress (user_id, data) values ($1, '{}')", [a])));
      return q.rows.length === 0 && p.rows.length === 0 && !ecrit;
    } },
  { nom: "delete_own_account efface SON compte et ses données, rien d'autre",
    temoin: remplace('2026_rgpd.sql', 'delete from public.quiz_progress where user_id = uid;', 'delete from public.quiz_progress;'),
    async f(db) {
      const a = await inscrire(db, 'a@x'), b = await inscrire(db, 'b@x');
      for (const u of [a, b]) await sous(db, u, tx => tx.query("insert into public.quiz_progress (user_id, data) values ($1, '{}')", [u]));
      await sous(db, a, tx => tx.query('select public.delete_own_account()'));
      const users = (await db.query('select id from auth.users')).rows.map(r => r.id);
      const qp = (await db.query('select user_id from public.quiz_progress')).rows.map(r => r.user_id);
      return users.length === 1 && users[0] === b && qp.length === 1 && qp[0] === b;
    } },
  /* RGPD (nov. 2026, 2026_rgpd.sql) : la suppression GARDE les propositions,
     mais sans plus rien qui désigne la personne (user_id NULL, pseudo
     « anonyme ») ; celles d'un autre compte ne bougent pas. */
  { nom: "supprimer son compte garde ses propositions, anonymisées",
    temoin: remplace('2026_rgpd.sql', `payload = jsonb_set(payload, '{contributor}', '"anonyme"'::jsonb, true),`, ''),
    async f(db) {
      const a = await inscrire(db, 'a@x'), b = await inscrire(db, 'b@x');
      await sous(db, a, tx => tx.query(`insert into public.contributions (user_id, payload) values ($1, '{"contributor":"Alice"}')`, [a]));
      await sous(db, b, tx => tx.query(`insert into public.contributions (user_id, payload) values ($1, '{"contributor":"Bob"}')`, [b]));
      await sous(db, a, tx => tx.query('select public.delete_own_account()'));
      const r = (await db.query("select user_id, payload->>'contributor' as c from public.contributions order by c")).rows;
      return r.length === 2 && r[0].c === 'Bob' && r[0].user_id === b && r[1].c === 'anonyme' && r[1].user_id === null;
    } },
  { nom: "un compte ordinaire ne peut pas lancer la purge des comptes inactifs",
    temoin: remplace('2026_rgpd.sql', "raise exception 'réservé à l''administrateur';", 'null;'),
    async f(db) {
      const a = await inscrire(db, 'a@x');
      return !(await tente(sous(db, a, tx => tx.query('select public.purger_comptes_inactifs()'))));
    } },
  { nom: "la purge efface un compte inactif depuis 3 ans, pas un compte actif",
    temoin: remplace('2026_rgpd.sql', "interval '3 years'", "interval '30 years'"),
    async f(db) {
      const vieux = await inscrire(db, 'vieux@x'), actif = await inscrire(db, 'actif@x');
      await db.query("update auth.users set last_sign_in_at = now() - interval '4 years' where id = $1", [vieux]);
      await db.query("update auth.users set last_sign_in_at = now() where id = $1", [actif]);
      await db.query(`insert into public.contributions (user_id, payload) values ($1, '{"contributor":"Vieux"}')`, [vieux]);
      const n = (await sous(db, 'service_role', tx => tx.query('select public.purger_comptes_inactifs() as n'))).rows[0].n;
      const users = (await db.query('select id from auth.users')).rows.map(r => r.id);
      const c = (await db.query("select payload->>'contributor' as c from public.contributions")).rows;
      return n === 1 && users.length === 1 && users[0] === actif && c.length === 1 && c[0].c === 'anonyme';
    } },
  { nom: 'un anonyme ne peut pas appeler delete_own_account',
    // Depuis nov. 2026, la fonction est redéfinie par 2026_rgpd.sql : c'est là qu'on glisse la faute.
    temoin: (f, s) => remplace('2026_rgpd.sql', "raise exception 'non connecté';", 'null;')(f,
      remplace('2026_rgpd.sql', 'revoke all on function public.delete_own_account() from public, anon;', 'grant execute on function public.delete_own_account() to anon;')(f, s)),
    async f(db) {
      return !(await tente(sous(db, 'anon', tx => tx.query('select public.delete_own_account()'))));
    } },

  /* ── Administration (nov. 2026, 2026_administration.sql) ──────────────
     L'état du tri vit boîte par boîte dans « boites » ; le statut de la
     proposition s'en calcule ; /admin/ passe par des fonctions réservées. */
  { nom: "un envoi crée une boîte par élément de payload.boxes",
    temoin: remplace('2026_administration.sql', 'perform public.boites_aligner(new.id, false);', 'null;'),
    async f(db) {
      await sous(db, 'anon', tx => tx.query(`insert into public.contributions (user_id, payload) values (null, '{"boxes":[{},{},{}]}')`));
      const r = (await db.query('select rang from public.boites order by rang')).rows.map(x => x.rang);
      return r.join() === '0,1,2';
    } },
  { nom: "corriger une proposition en attente réaligne ses boîtes, remises « nouvelles »",
    temoin: remplace('2026_administration.sql', 'perform public.boites_aligner(new.id, true);', 'null;'),
    async f(db) {
      const a = await inscrire(db, 'a@x');
      await sous(db, a, tx => tx.query(`insert into public.contributions (user_id, payload) values ($1, '{"boxes":[{}]}')`, [a]));
      await db.query('update public.boites set lue_le = now()');
      await sous(db, a, tx => tx.query(`update public.contributions set payload='{"boxes":[{},{}]}' where user_id=$1`, [a]));
      const r = (await db.query('select rang, lue_le from public.boites order by rang')).rows;
      return r.length === 2 && r.every(x => x.lue_le === null);
    } },
  { nom: "la reprise garde le tri déjà fait (archivée → intégrée, note, avis IA)",
    temoin: remplace('2026_administration.sql', "when 'archivee' then 'integree'", "when 'archivee' then 'en_attente'"),
    async f(db) { return true; },   // remplacé ci-dessous : la reprise se joue AVANT la migration
  },
  { nom: "le statut de la proposition suit celui de ses boîtes",
    temoin: remplace('2026_administration.sql', "when n_int + n_ref = n then 'validee_integree'", "when false then 'validee_integree'"),
    async f(db) {
      await db.query(`insert into public.contributions (user_id, payload) values (null, '{"boxes":[{},{}]}')`);
      const st = async () => (await db.query('select statut::text as s from public.contributions')).rows[0].s;
      const s0 = await st();
      await db.query("update public.boites set statut='validee' where rang=0");
      const s1 = await st();
      await db.query("update public.boites set statut='refusee' where rang=1");
      await db.query("update public.boites set statut='integree' where rang=0");
      const s2 = await st();
      return s0 === 'en_attente' && s1 === 'validee_en_cours' && s2 === 'validee_integree';
    } },
  { nom: "un compte lit l'état et la réponse de ses boîtes, ni la note interne ni celles d'un autre",
    temoin: remplace('2026_administration.sql', 'grant select (id, contribution, rang, statut, reponse, repondu_le)', 'grant select (id, contribution, rang, statut, reponse, repondu_le, note)'),
    async f(db) {
      const a = await inscrire(db, 'a@x'), b = await inscrire(db, 'b@x');
      for (const u of [a, b]) await sous(db, u, tx => tx.query(`insert into public.contributions (user_id, payload) values ($1, '{"boxes":[{}]}')`, [u]));
      await db.query("update public.boites set reponse='merci', note='secret'");
      const mes = await sous(db, a, tx => tx.query('select statut, reponse from public.boites'));
      const note = await tente(sous(db, a, tx => tx.query('select note from public.boites')));
      return mes.rows.length === 1 && mes.rows[0].reponse === 'merci' && !note;
    } },
  { nom: "les fonctions de /admin/ refusent un compte ordinaire, servent l'administrateur",
    // La garde d'admin_boites() retirée (c'est la seule suivie de « select b.id »).
    temoin: remplace('2026_administration.sql',
      "begin\n  if not public.is_admin() then\n    raise exception 'Accès refusé : compte non administrateur.' using errcode = '42501';\n  end if;\n  return query\n    select b.id",
      "begin\n  return query\n    select b.id"),
    async f(db) {
      const a = await inscrire(db, 'a@x'), adm = await inscrire(db, 'adm@x');
      await db.query('insert into public.app_admins (user_id) values ($1)', [adm]);
      await db.query(`insert into public.contributions (user_id, payload) values (null, '{"contributor":"Léa","boxes":[{"cible":"exemple"}]}')`);
      const refuse = !(await tente(sous(db, a, tx => tx.query('select * from public.admin_boites()'))));
      const vu = (await sous(db, adm, tx => tx.query('select pseudo, contenu, nb_boites from public.admin_boites()'))).rows;
      return refuse && vu.length === 1 && vu[0].pseudo === 'Léa' && vu[0].contenu.cible === 'exemple' && vu[0].nb_boites === 1;
    } },
  { nom: "importer un compte rendu deux fois ne change rien la seconde fois",
    temoin: remplace('2026_administration.sql', "if b.statut = 'integree' and b.integration->>'commit' = v_commit then", 'if false then'),
    async f(db) {
      const adm = await inscrire(db, 'adm@x');
      await db.query('insert into public.app_admins (user_id) values ($1)', [adm]);
      await db.query(`insert into public.contributions (user_id, payload) values (null, '{"boxes":[{},{}]}')`);
      const [b1, b2] = (await db.query('select id from public.boites order by rang')).rows.map(x => x.id);
      await db.query("update public.boites set statut='validee'");
      const cr = JSON.stringify({ format: 'philo-integration/v1', commit: 'abc1234', fait_le: '2026-11-16',
        boites: [{ id: b1, resultat: 'integree', reponse: 'Merci !' }, { id: b2, resultat: 'non_integree', detail: 'citation introuvable' }, { id: 999, resultat: 'integree' }] });
      const imp = async () => (await sous(db, adm, tx => tx.query('select * from public.admin_importer_integration($1::jsonb) order by id', [cr]))).rows.map(x => x.resultat).join();
      const r1 = await imp(), r2 = await imp();
      const bx = (await db.query('select statut, reponse, note from public.boites order by rang')).rows;
      return r1 === 'integree,non_integree,inconnue' && r2 === 'deja,ignoree,inconnue'
        && bx[0].statut === 'integree' && bx[0].reponse === 'Merci !'
        && bx[1].statut === 'en_attente' && (bx[1].note.match(/non intégrée/g) || []).length === 1;
    } },
  { nom: "Propositions ne montre que les sujets publiés ; un vote par compte",
    temoin: remplace('2026_administration.sql', '   where s.publie\n', '   where true\n'),
    async f(db) {
      const a = await inscrire(db, 'a@x'), b = await inscrire(db, 'b@x');
      const [pub, cache] = (await db.query("insert into public.sujets (titre, publie) values ('Weil', true), ('brouillon', false) returning id")).rows.map(x => x.id);
      await sous(db, a, tx => tx.query('select public.voter($1, 1)', [pub]));
      await sous(db, a, tx => tx.query('select public.voter($1, 1)', [pub]));   // revoter ne compte pas deux fois
      await sous(db, b, tx => tx.query('select public.voter($1, -1)', [pub]));
      const voteCache = await tente(sous(db, a, tx => tx.query('select public.voter($1, 1)', [cache])));
      const anonVote = await tente(sous(db, 'anon', tx => tx.query('select public.voter($1, 1)', [pub])));
      const vu = (await sous(db, 'anon', tx => tx.query('select titre, pour, contre, score from public.propositions()'))).rows;
      return vu.length === 1 && vu[0].titre === 'Weil' && vu[0].pour === 1 && vu[0].contre === 1 && vu[0].score === 0 && !voteCache && !anonVote;
    } },
  { nom: "supprimer son compte efface ses votes",
    temoin: remplace('2026_administration.sql', '  user_id      uuid not null references auth.users(id) on delete cascade,', '  user_id      uuid not null references auth.users(id),'),
    async f(db) {
      const a = await inscrire(db, 'a@x');
      const s = (await db.query("insert into public.sujets (titre, publie) values ('x', true) returning id")).rows[0].id;
      await sous(db, a, tx => tx.query('select public.voter($1, 1)', [s]));
      await sous(db, a, tx => tx.query('select public.delete_own_account()'));
      return (await db.query('select count(*)::int as n from public.votes')).rows[0].n === 0;
    } },
  { nom: "le numéro de suivi retrouve SA proposition anonyme ; un faux ne rend rien",
    temoin: remplace('2026_administration.sql', '     and c.suivi_empreinte = encode(', '     or c.suivi_empreinte = encode('),
    async f(db) {
      const emp = c => crypto.createHash('sha256').update(c).digest('hex');
      await sous(db, 'anon', tx => tx.query(`insert into public.contributions (user_id, payload, suivi_empreinte) values (null, '{"boxes":[{}],"n":1}', $1)`, [emp('K7Q4MD2XAB3C')]));
      await sous(db, 'anon', tx => tx.query(`insert into public.contributions (user_id, payload, suivi_empreinte) values (null, '{"boxes":[{}],"n":2}', $1)`, [emp('ZZZZZZZZZZZZ')]));
      await db.query("update public.boites set reponse='Ajouté, merci' where contribution in (select id from public.contributions where payload->>'n'='1')");
      const bon = (await sous(db, 'anon', tx => tx.query("select payload, boites from public.suivre('k7q-4md-2xa-b3c')"))).rows;
      const faux = (await sous(db, 'anon', tx => tx.query("select 1 from public.suivre('AAAA-BBBB-CCCC')"))).rows;
      return bon.length === 1 && bon[0].payload.n === 1 && bon[0].boites[0].reponse === 'Ajouté, merci' && faux.length === 0;
    } },
  { nom: "l'avis de l'IA : réservé à l'admin, « Partie n » pour le contributeur",
    temoin: remplace('2026_relecture.sql', "  if not public.is_admin() then\n    raise exception 'Accès refusé : compte non administrateur.' using errcode = '42501';\n  end if;\n  if p_verdict", '  if p_verdict'),
    async f(db) {
      const a = await inscrire(db, 'a@x'), adm = await inscrire(db, 'adm@x');
      await db.query('insert into public.app_admins (user_id) values ($1)', [adm]);
      await db.query(`insert into public.contributions (user_id, payload) values (null, '{"boxes":[{},{}]}')`);
      const [b1, b2] = (await db.query('select id from public.boites order by rang')).rows.map(x => x.id);
      const refuse = !(await tente(sous(db, a, tx => tx.query("select public.admin_ecrire_avis($1, 'valide', 'ok', 'Merci')", [b1]))));
      await sous(db, adm, tx => tx.query("select public.admin_ecrire_avis($1, 'valide', 'ok', 'A')", [b1]));
      await sous(db, adm, tx => tx.query("select public.admin_ecrire_avis($1, 'douteux', 'source ?', 'B')", [b2]));
      const avis = (await db.query('select avis_ia from public.contributions')).rows[0].avis_ia;
      return refuse && avis === 'Partie 1 : A\nPartie 2 : B';
    } },
];

/* La reprise des données se joue PENDANT la migration : il faut une
   proposition déjà triée par les anciens outils avant 2026_administration.sql.
   L'essai remplace donc la fabrique de la base (anciens = SQL glissé avant). */
const ANCIENS = `insert into public.contributions (user_id, payload, statut, aggregator_state)
  values (null, '{"boxes":[{},{}]}', 'validee_integree',
          '{"v":1,"boxes":[{"position":0,"status":"archivee","note":"vu"},{"position":1,"status":"rejetee","ai_verdict":"douteux","ai_review":"source ?","ai_user_message":"Merci !"}]}');\n`;
const reprise = ESSAIS.find(e => e.nom.startsWith('la reprise'));
const avecAnciens = sauf => (f, s) => {
  const t = sauf ? sauf(f, s) : s;
  return f === '2026_administration.sql' ? ANCIENS + t : t;
};
reprise.base = sauf => base(avecAnciens(sauf));
reprise.f = async db => {
  const r = (await db.query('select statut, note, ia_verdict, ia_message, lue_le from public.boites order by rang')).rows;
  const c = (await db.query('select statut::text as s from public.contributions')).rows[0].s;
  return r.length === 2 && r[0].statut === 'integree' && r[0].note === 'vu' && r[1].statut === 'refusee'
    && r[1].ia_verdict === 'douteux' && r[1].ia_message === 'Merci !' && r.every(x => x.lue_le) && c === 'validee_integree';
};

let ko = 0;
for (const e of ESSAIS) {
  const fab = e.base || base;   // un essai peut fabriquer sa base autrement (la reprise)
  const ok = await e.f(await fab()).catch(err => { console.log('   erreur : ' + err.message); return false; });
  const vu = !(await e.f(await fab(e.temoin)).catch(() => false));
  console.log(`${ok ? 'ok ' : 'KO '} ${e.nom}  ·  témoin ${vu ? 'vu' : 'PAS VU'}`);
  if (!ok || !vu) ko++;
}
console.log(ko ? '\nÀ CORRIGER' : '\ncohérent');
process.exit(ko ? 1 : 0);
