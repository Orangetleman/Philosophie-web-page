# Protocole d'intégration des propositions

L'aller-retour entre `/admin/` et une session Claude (lot A5,
`docs/chantier-administration.md` § 9). Il est écrit pour Claude, et aussi
pour l'administrateur qui veut savoir ce qui se passe.

## 1. L'aller : l'export

Dans `/admin/`, onglet **À intégrer**, le bouton « 📤 Exporter les validées »
télécharge `philo-export-AAAA-MM-JJ.json`. On le donne à Claude en
l'ouvrant dans la conversation ou en le déposant dans le dépôt.

Format `philo-export/v1` :

```json
{ "format": "philo-export/v1", "cree_le": "2026-11-16T10:00:00.000Z",
  "boites": [ { "id": 47, "contribution": "…", "categorie": "notion",
    "cible": "exemple", "type": "ajout", "notion": "travail",
    "fichier": "contenu/notions/travail.js",
    "contenu": { "…": "les champs de la boîte" },
    "avis_ia": { "verdict": "valide", "avis": "…" },
    "note_interne": "consigne de l'administrateur, ou null",
    "doublons": [52] } ] }
```

L'export ne contient **aucune donnée personnelle** : ni pseudo, ni compte, ni
numéro de suivi, ni réponse déjà envoyée. `fichier` est une indication : pour un
auteur, le nom proposé peut être un alias (`AUTHOR_ALIASES`). Il faut donc
chercher la vraie fiche avant d'en créer une.

## 2. Le travail de Claude

Pour chaque boîte, dans l'ordre du fichier :

1. **Lire** le contenu, l'avis de l'IA, la note interne. La note interne de
   l'administrateur prime sur l'avis de l'IA.
2. **Vérifier** : selon `docs/protocole-contenu.md`. Sources acceptées ; une
   citation qu'on n'a pas pu vérifier n'entre pas entre « » : elle devient
   une reformulation, ce qui donne une boîte `retouchee`, ou elle reste dehors.
   Chercher les doublons dans le contenu existant et dans `doublons`.
3. **Intégrer** dans les sources (`contenu/…`), jamais dans les fichiers
   produits. Tout ajout porte `new:true`, toute correction `modified:true`.
   Un retour sur le site (`categorie: "site"`) touche `js/` ou `css/` : le
   faire seulement s'il est petit et sûr, sinon `non_integree` avec la raison.
4. **Construire** : `node outils/construire.mjs` doit finir sur « cohérent ».
5. **Commiter** l'intégration, puis écrire le compte rendu (§ 3) avec le
   hash de ce commit, et le commiter à son tour dans `integrations/`.

On n'invente rien que la boîte ne dit pas. Une boîte trop floue pour être
intégrée sans deviner reçoit `non_integree`, avec la question à poser au
contributeur dans `detail`.

## 3. Le retour : le compte rendu

Fichier `integrations/philo-integration-AAAA-MM-JJ.json` (si deux le même
jour : `-2`, `-3`…). Format `philo-integration/v1` :

```json
{ "format": "philo-integration/v1",
  "export": "philo-export-2026-11-16.json",
  "commit": "hash court du commit d'intégration",
  "fait_le": "2026-11-16",
  "boites": [
    { "id": 47, "resultat": "integree",
      "fichiers": ["contenu/notions/travail.js"],
      "detail": "Ajouté aux exemples du travail.",
      "reponse_proposee": "Merci ! Ton exemple est en ligne dans la notion Le travail." },
    { "id": 52, "resultat": "non_integree",
      "detail": "Doublon de la n° 47, déjà intégrée.", "fichiers": [] } ] }
```

- `resultat` : `integree` (telle quelle), `retouchee` (avec des changements,
  dits dans `detail`), `non_integree` (raison dans `detail`).
- `detail` est pour l'administrateur ; `reponse_proposee` est pour le
  contributeur : tutoiement, simple, sans jargon, et sans promettre ce qui
  n'est pas fait. Pas de réponse pour `non_integree` : l'administrateur
  décide lui-même quoi répondre.
- **Chaque boîte de l'export a sa ligne**, même non intégrée.
- Aucune donnée personnelle (le fichier est public, servi par le site).

## 4. L'import

1. Fusionner la branche et attendre le déploiement : le compte rendu doit
   répondre sur `https://philo.myprisme.fr/integrations/<fichier>`.
2. `/admin/`, onglet **À intégrer**, « 📥 Importer un compte rendu » : un
   aperçu montre une ligne par boîte. On corrige les réponses, on décoche ce
   qu'on refuse.
3. « Appliquer » reste grisé tant que le fichier n'est pas en ligne avec le
   même commit. Une fois appliqué :
   - `integree` et `retouchee` : la boîte passe « Intégrée », le commit est
     noté et la réponse est envoyée au contributeur ;
   - `non_integree` : la boîte repasse « En attente » et la raison va dans la
     note interne ;
   - une boîte inconnue, plus validée ou déjà appliquée est ignorée ;
     réimporter le même compte rendu ne change rien.

Contrôles : `node outils/essais_admin.mjs` (lecture du compte rendu côté
page) et le banc `outils/banc/` (`admin_importer_integration`).
