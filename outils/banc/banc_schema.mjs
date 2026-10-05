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
import path from 'path';
import { fileURLToPath } from 'url';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const MIG = process.argv[2] || path.join(ICI, '..', '..', 'philo-aggregator', 'migrations');
const ORDRE = ['2026_schema_base.sql', '2026_aggregator_state.sql', '2026_admin_mobile.sql',
               '2026_anon_contributions.sql', '2026_contributions_colonnes.sql'];
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
    temoin: remplace('2026_contributions_colonnes.sql', 'grant update (payload, updated_at)', 'grant update (updated_at)'),
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
    temoin: remplace('2026_schema_base.sql', 'delete from public.quiz_progress  where user_id = uid;', 'delete from public.quiz_progress;'),
    async f(db) {
      const a = await inscrire(db, 'a@x'), b = await inscrire(db, 'b@x');
      for (const u of [a, b]) await sous(db, u, tx => tx.query("insert into public.quiz_progress (user_id, data) values ($1, '{}')", [u]));
      await sous(db, a, tx => tx.query('select public.delete_own_account()'));
      const users = (await db.query('select id from auth.users')).rows.map(r => r.id);
      const qp = (await db.query('select user_id from public.quiz_progress')).rows.map(r => r.user_id);
      return users.length === 1 && users[0] === b && qp.length === 1 && qp[0] === b;
    } },
  { nom: 'un anonyme ne peut pas appeler delete_own_account',
    temoin: (f, s) => remplace('2026_schema_base.sql', "raise exception 'non connecté';", 'null;')(f,
      remplace('2026_schema_base.sql', 'revoke all on function public.delete_own_account() from public, anon;', 'grant execute on function public.delete_own_account() to anon;')(f, s)),
    async f(db) {
      return !(await tente(sous(db, 'anon', tx => tx.query('select public.delete_own_account()'))));
    } },
];

let ko = 0;
for (const e of ESSAIS) {
  const ok = await e.f(await base()).catch(err => { console.log('   erreur : ' + err.message); return false; });
  const vu = !(await e.f(await base(e.temoin)).catch(() => false));
  console.log(`${ok ? 'ok ' : 'KO '} ${e.nom}  ·  témoin ${vu ? 'vu' : 'PAS VU'}`);
  if (!ok || !vu) ko++;
}
console.log(ko ? '\nÀ CORRIGER' : '\ncohérent');
process.exit(ko ? 1 : 0);
