/* ════════════════════════════════════════════════════════════════════════
   supabase/functions/prevenir/index.ts — un message Discord à chaque
   proposition nouvelle (lot A5 ; décision Q5 du chantier Administration).
   ────────────────────────────────────────────────────────────────────────
   Appelée par un « Database Webhook » de Supabase (Database › Webhooks) :
   INSERT sur public.boites, POST vers cette fonction, en-tête
   « x-prevenir » = le secret PREVENIR_SECRET. On ne prévient qu'une fois
   par proposition : à l'arrivée de sa première boîte (rang 0).

   Le message ne contient AUCUNE donnée personnelle ni le texte proposé :
   seulement le n° de la boîte et le lien /admin/#n°. Discord ne reçoit
   donc rien qui désigne quelqu'un.

   Secrets (`supabase secrets set …`) :
     DISCORD_WEBHOOK_URL  l'adresse du webhook créé dans le salon Discord ;
     PREVENIR_SECRET      une chaîne au hasard, recopiée dans l'en-tête du
                          Database Webhook (sans elle, la fonction refuse).
   Déploiement : `supabase functions deploy prevenir --no-verify-jwt`
   (le webhook n'envoie pas de jeton d'utilisateur ; le secret le remplace).
   ════════════════════════════════════════════════════════════════════════ */

const WEBHOOK = Deno.env.get('DISCORD_WEBHOOK_URL') ?? '';
const SECRET = Deno.env.get('PREVENIR_SECRET') ?? '';
const SITE = 'https://philo.myprisme.fr';

const repondre = (corps: unknown, statut = 200) =>
  new Response(JSON.stringify(corps), { status: statut, headers: { 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method !== 'POST') return repondre({ erreur: 'méthode' }, 405);
  // 1. Seul le webhook de la base, qui connaît le secret, peut nous appeler.
  if (!SECRET || req.headers.get('x-prevenir') !== SECRET) return repondre({ erreur: 'refuse' }, 401);
  if (!WEBHOOK) return repondre({ erreur: 'discord-absent' }, 500);

  // 2. La ligne insérée (format des Database Webhooks : {type, table, record}).
  const corps = await req.json().catch(() => ({}));
  const b = corps?.record;
  if (corps?.type !== 'INSERT' || corps?.table !== 'boites' || !b) return repondre({ ignore: 'pas une boîte nouvelle' });
  if (Number(b.rang) !== 0) return repondre({ ignore: 'boîte suivante de la même proposition' });

  // 3. Le message : un n° et un lien, rien d'autre.
  const id = Number(b.id);
  const r = await fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Graphe Philo',
      content: `📬 Nouvelle proposition, boîte n° ${id} : ${SITE}/admin/#${id}`,
      allowed_mentions: { parse: [] },
    }),
  });
  if (!r.ok) return repondre({ erreur: 'discord', statut: r.status }, 502);
  return repondre({ envoye: id });
});
