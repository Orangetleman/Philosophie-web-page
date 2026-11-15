/* La notice légale du site : mentions légales, données personnelles, CGU
   (chantier RGPD du 15 novembre 2026, docs/protocole-donnees.md).

   C'est la SEULE source. Le build en fait la globale LEGAL de data.js (lue
   par l'onglet « Mes données » des Réglages et par l'export) et la page
   /informations-legales/ (outils/lib/legal.mjs). Le vérificateur (question
   15) refuse le build si une clé localStorage, une adresse externe ou une
   table Supabase du code n'est pas déclarée ici.

   Changer quoi que ce soit ici (hors `historique`) demande une NOUVELLE
   entrée datée dans `historique`, avec un résumé lisible par un élève et
   l'empreinte que le vérificateur affiche : c'est ce qui fait redemander
   l'accord aux comptes (protocole § 2.2). Les textes s'adressent à
   l'élève, au tutoiement, comme le reste du site. */
LEGAL({
  site: "https://philo.myprisme.fr",
  nom: "Graphe Philosophie (révision de philosophie, Terminale)",

  // ── Mentions légales (LCEN, art. 6) ───────────────────────────────────
  // Décision du 15 nov. 2026 : éditeur anonyme. La loi le permet à un
  // particulier non professionnel, l'hébergeur détenant son identité.
  editeur: "Site édité par un particulier, à titre non professionnel et sans but lucratif. Conformément à l'article 6 III 2 de la loi pour la confiance dans l'économie numérique, l'éditeur a choisi de ne pas publier son identité : ses coordonnées ont été communiquées à l'hébergeur.",
  directeur: "Le directeur de la publication est l'éditeur du site.",
  contact: "compte.secondaire.toi@gmail.com",
  hebergeur: {nom: "Vercel Inc.", adresse: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis", site: "https://vercel.com"},
  propriete: "Les fiches rédigées pour ce site sont publiées sous licence Creative Commons BY-SA 4.0 : tu peux les reprendre et les modifier en citant le site et en gardant la même licence. Les citations d'auteurs sont reproduites au titre du droit de citation (article L122-5 du code de la propriété intellectuelle), courtes et avec leur source.",

  // ── Les traitements de données personnelles (RGPD, art. 13 et 30) ─────
  // `tables` : les tables Supabase concernées. Toute table public.… créée
  // par une migration doit figurer dans l'une d'elles (question 15).
  responsable: "L'éditeur du site, joignable à l'adresse de contact ci-dessus.",
  traitements: [
    {id: "compte", titre: "Ton compte (facultatif)",
      donnees: ["ton adresse e-mail", "ton mot de passe, enregistré sous forme chiffrée (personne ne peut le lire)", "le pseudo que tu choisis (facultatif)", "si tu te connectes avec Google : l'adresse et le nom que Google nous transmet", "la date à laquelle tu as accepté ces conditions, et leur version"],
      finalite: "Te reconnaître d'un appareil à l'autre, pour retrouver ta progression, tes réglages et tes propositions.",
      base: "L'exécution du service que tu demandes en créant un compte (article 6.1.b du RGPD). Le compte n'est jamais obligatoire : tout le site marche sans.",
      duree: "Jusqu'à ce que tu le supprimes (un bouton dans ⚙ Réglages). Un compte sans aucune connexion depuis trois ans est supprimé d'office.",
      tables: ["auth.users", "public.app_admins"], tiers: ["supabase", "google-connexion"]},
    {id: "synchro", titre: "Ta progression et tes réglages (avec un compte)",
      donnees: ["ta progression dans le quiz", "tes réglages d'affichage (thème, taille du texte, modes)", "le brouillon de proposition en cours", "la dernière page ouverte, pour reprendre où tu en étais"],
      finalite: "Synchroniser ta révision entre tes appareils.",
      base: "L'exécution du service (article 6.1.b du RGPD).",
      duree: "Aussi longtemps que ton compte existe ; effacé avec lui.",
      tables: ["public.preferences", "public.quiz_progress"], tiers: ["supabase"]},
    {id: "propositions", titre: "Tes propositions de contenu",
      donnees: ["le contenu que tu proposes", "le pseudo que tu choisis d'indiquer (facultatif)", "si tu es connecté : le lien avec ton compte, pour suivre la réponse", "si tu envoies sans compte : une empreinte de ton numéro de suivi (le numéro lui-même n'est gardé que par toi)", "l'état de chaque partie de ta proposition et la réponse de l'éditeur"],
      finalite: "Relire ta proposition, l'intégrer au site si elle est retenue, te répondre, et regrouper les demandes qui reviennent (la page Propositions n'en montre qu'un titre et un nombre, jamais ton texte ni ton pseudo).",
      base: "Les conditions d'utilisation que tu acceptes en envoyant (article 6.1.b du RGPD) ; la pré-relecture automatique repose sur l'intérêt légitime de l'éditeur à trier vite (article 6.1.f).",
      duree: "Le contenu reste : il fait partie du site. Si tu supprimes ton compte, ton pseudo et le lien avec ton compte sont effacés, la proposition devient anonyme.",
      tables: ["public.contributions", "public.boites", "public.sujets"], tiers: ["supabase", "gemini"]},
    {id: "votes", titre: "Tes votes sur la page Propositions (avec un compte)",
      donnees: ["les sujets pour lesquels tu as voté, pour ou contre"],
      finalite: "Compter un seul vote par personne, et te montrer le tien.",
      base: "L'exécution du service que tu demandes en votant (article 6.1.b du RGPD).",
      duree: "Jusqu'à ce que tu retires ton vote ; effacés avec ton compte.",
      tables: ["public.votes"], tiers: ["supabase"]},
    {id: "technique", titre: "Les journaux techniques",
      donnees: ["l'adresse IP de ton appareil", "le type de navigateur", "la page demandée et l'heure"],
      finalite: "Faire fonctionner le site et le protéger des abus. Aucune statistique de visite, aucune publicité, aucun traceur.",
      base: "L'intérêt légitime de l'éditeur à faire fonctionner un site sûr (article 6.1.f du RGPD).",
      duree: "Celle des hébergeurs, de quelques jours à 30 jours. L'éditeur ne les consulte qu'en cas de panne ou d'abus.",
      tables: [], tiers: ["vercel", "supabase"]},
    {id: "courriel", titre: "Si tu écris par e-mail",
      donnees: ["ton adresse e-mail", "le contenu de ton message"],
      finalite: "Te répondre, ou traiter une proposition envoyée par e-mail.",
      base: "L'intérêt légitime de l'éditeur à répondre aux messages qu'il reçoit (article 6.1.f du RGPD).",
      duree: "Le temps de traiter ta demande, puis un an au plus.",
      tables: [], tiers: ["google-mail"]},
  ],

  // ── Les destinataires (sous-traitants et services tiers) ───────────────
  // `domaines` : les adresses externes que le site charge ou appelle. Toute
  // adresse https://… d'index.html ou de js/ doit appartenir à un tiers
  // déclaré, ou à `domainesNeutres` (question 15).
  tiers: [
    {id: "vercel", nom: "Vercel Inc.", role: "Héberge et sert le site.",
      pays: "États-Unis", garanties: "Contrat de sous-traitance (DPA) de Vercel ; Vercel adhère au cadre de protection des données UE-États-Unis (Data Privacy Framework).",
      domaines: ["philo.myprisme.fr", "vercel.app"]},
    {id: "supabase", nom: "Supabase Inc.", role: "Héberge la base de données : comptes, progression, propositions.",
      pays: "États-Unis (société) ; les données sont stockées dans la région choisie pour le projet", garanties: "Contrat de sous-traitance (DPA) de Supabase, avec les clauses contractuelles types de la Commission européenne.",
      domaines: ["supabase.co"]},
    {id: "google-connexion", nom: "Google (connexion)", role: "Seulement si tu choisis « Continuer avec Google » : Google confirme ton identité et nous transmet ton adresse et ton nom.",
      pays: "États-Unis", garanties: "Google adhère au Data Privacy Framework UE-États-Unis.",
      domaines: ["accounts.google.com"]},
    {id: "gemini", nom: "Google (Gemini)", role: "Pré-relit automatiquement les propositions, pour aider au tri. Gemini ne reçoit que le texte proposé : ni pseudo, ni date, ni compte, et les adresses e-mail ou numéros glissés dans le texte sont masqués. L'offre gratuite utilisée permet à Google de se servir de ces textes pour améliorer ses services. La décision reste toujours humaine.",
      pays: "États-Unis", garanties: "Google adhère au Data Privacy Framework UE-États-Unis.",
      domaines: []},
    {id: "google-mail", nom: "Google (Gmail)", role: "Reçoit les e-mails envoyés à l'adresse de contact.",
      pays: "États-Unis", garanties: "Google adhère au Data Privacy Framework UE-États-Unis.",
      domaines: []},
  ],
  // Adresses qui n'envoient rien à personne : espaces de noms XML, schémas.
  domainesNeutres: ["www.w3.org", "schema.org", "creativecommons.org", "www.legifrance.gouv.fr", "www.cnil.fr"],

  // ── Ce que le site garde sur ton appareil (localStorage) ───────────────
  // Rien de tout ça n'est un traceur : c'est nécessaire au service demandé,
  // donc sans consentement à recueillir (loi Informatique et Libertés,
  // art. 82). Chaque clé philo-… du code doit être ici (question 15).
  stockage: [
    {cle: "philo-theme", role: "le thème choisi (sombre, clair, automatique)"},
    {cle: "philo-texte", role: "la taille du texte"},
    {cle: "philo-mode", role: "le mode révision ou édition"},
    {cle: "philo-fiche", role: "le mode fiche (lecture compressée)"},
    {cle: "philo-hp", role: "afficher ou masquer le hors programme"},
    {cle: "philo-hp-choix", role: "tu as déjà répondu à la question du hors programme"},
    {cle: "philo-hp-replie", role: "la section hors programme repliée dans la barre latérale"},
    {cle: "philo-quiz", role: "ta progression dans le quiz"},
    {cle: "philo-quiz-hp", role: "inclure le hors programme dans le quiz"},
    {cle: "philo-nav", role: "la dernière page ouverte"},
    {cle: "philo-navhist", role: "l'historique de navigation dans le site (boutons précédent et suivant)"},
    {cle: "philo-drafts", role: "le brouillon de proposition en cours (il peut contenir ton pseudo)"},
    {cle: "philo-tour-v1", role: "tu as déjà vu la visite guidée"},
    {cle: "philo-sync", role: "avec un compte : l'identifiant du compte et l'heure de la dernière synchronisation"},
    {cle: "philo-legal", role: "la version des conditions déjà acceptée sur cet appareil"},
    {cle: "sb-…-auth-token", role: "avec un compte : ta session de connexion (posée par Supabase)"},
  ],

  // ── Tes droits (RGPD, art. 15 à 21) ──────────────────────────────────
  droits: [
    {titre: "Voir et emporter tes données", texte: "⚙ Réglages › Mes données › « Télécharger mes données » : un fichier avec tout ce que le site garde sur toi (compte, progression, réglages, propositions et leurs réponses, votes)."},
    {titre: "Corriger", texte: "Ton pseudo se change dans 👤 Mon compte ; tes propositions en attente se corrigent depuis « Mes propositions »."},
    {titre: "Effacer", texte: "⚙ Réglages › Mes données : « Effacer les données de cet appareil », et avec un compte « Supprimer mon compte ». La suppression est immédiate et définitive."},
    {titre: "T'opposer, limiter", texte: "Écris à l'adresse de contact. Réponse sous un mois au plus."},
    {titre: "Réclamer", texte: "Si tu estimes que tes droits ne sont pas respectés, tu peux saisir la CNIL (cnil.fr, rubrique « Adresser une plainte »)."},
  ],
  mineurs: "Le site s'adresse aussi à des élèves mineurs. Il ne repose jamais sur ton consentement pour traiter tes données (seulement sur le service que tu demandes), et il n'y a ni publicité ni profilage : l'accord d'un parent n'est donc pas exigé, même avant 15 ans. Si tu as un doute, parles-en à un adulte avant de créer un compte.",

  // ── Conditions générales d'utilisation ────────────────────────────────
  cgu: [
    {titre: "Objet", texte: "Le site est un outil gratuit de révision de la philosophie pour la Terminale. L'utiliser vaut acceptation de ces conditions ; créer un compte ou envoyer une proposition demande de les accepter expressément."},
    {titre: "Accès", texte: "Le site est libre d'accès, sans compte. L'éditeur peut le modifier, l'interrompre ou le fermer à tout moment, sans préavis : c'est un projet personnel, sans garantie de disponibilité."},
    {titre: "Ce que vaut le contenu", texte: "Les fiches sont une aide à la révision, rédigées avec soin mais sans garantie d'exactitude. Elles ne remplacent ni le cours de ton professeur ni les textes eux-mêmes. Signale une erreur en proposant une correction."},
    {titre: "Ton compte", texte: "Tu es responsable de ton mot de passe. Un seul compte par personne, sans usurper l'identité de quelqu'un. L'éditeur peut supprimer un compte utilisé contre ces règles."},
    {titre: "Tes propositions", texte: "En envoyant une proposition, tu affirmes en être l'auteur (ou citer tes sources) et tu acceptes qu'elle soit publiée sous licence Creative Commons BY-SA 4.0 : l'éditeur peut la relire, la corriger, l'intégrer au site ou la refuser, sans obligation de la publier. Elle reste sur le site même si tu supprimes ton compte (elle devient alors anonyme). N'y mets aucune donnée personnelle, ni la tienne ni celle de quelqu'un d'autre."},
    {titre: "Ce qui est interdit", texte: "Les contenus illicites, injurieux, haineux ou publicitaires, le plagiat, et toute tentative de perturber le site ou d'accéder aux données des autres."},
    {titre: "Responsabilité", texte: "L'éditeur ne répond pas des conséquences d'une erreur dans le contenu ni d'une indisponibilité du site. Les liens vers d'autres sites sont donnés pour information."},
    {titre: "Changements", texte: "Ces conditions peuvent évoluer. Chaque version est datée ; quand elles changent, le site te le signale et, si tu as un compte, te redemande ton accord."},
    {titre: "Droit applicable", texte: "Le droit français s'applique. En cas de désaccord, écris d'abord à l'adresse de contact : on cherchera une solution à l'amiable."},
  ],

  // ── Les versions de la notice (la dernière = la version en vigueur) ────
  // Une entrée par changement : date, résumé d'une phrase, empreinte donnée
  // par le vérificateur (question 15). Ne jamais modifier une entrée passée.
  historique: [
    {version: "2026-11-15", resume: "Première version : mentions légales, données personnelles et conditions d'utilisation.", empreinte: "429fc389cc7a"},
    // Chantier Administration (lot A1) : à redater au jour de la mise en ligne de /admin/.
    {version: "2026-11-16", resume: "Tu peux suivre une proposition envoyée sans compte grâce à un numéro de suivi, lire la réponse à chaque partie de ta proposition, et voter, avec un compte, sur la page Propositions.", empreinte: "73da7bc77d3c"},
  ],
});
