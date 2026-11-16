# integrations/

Les comptes rendus d'intégration des propositions
(`philo-integration-AAAA-MM-JJ.json`, format `philo-integration/v1`).
Claude les écrit après chaque intégration, en suivant `docs/protocole-integration.md`.

Ils sont servis par le site, hors du service worker. `/admin/` vérifie qu'un
compte rendu est bien en ligne avant de passer ses boîtes en « Intégrée ».
Ils ne contiennent aucune donnée personnelle.
