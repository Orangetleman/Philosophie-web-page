# Protocole du contenu philosophique

Ce que fait celui qui ajoute ou corrige du contenu dans `data.js` (une
personne, ou une IA à qui on le demande), écrit une fois pour toutes. Inspiré
de `docs/protocole-sources.md` de Fiches BUT. Les règles techniques de format
restent dans `CLAUDE.md` ; ce document dit **d'où vient le contenu, à quelle
condition il entre, et comment on le prouve**.

Le message de départ suffisant :

> Ajoute Montaigne (ou : la notion « Autrui », ou : ces trois citations).
> Protocole habituel (`docs/protocole-contenu.md`).

## 1. Pourquoi

Le site veut être une présentation **agrégée, sourcée et fiable**, lue par
des élèves de terminale mais aussi par des novices et des connaisseurs. Le
diagnostic d'octobre 2026 (`docs/diagnostic-2026-10.md`, § 2.3) a montré ce
qui arrive sans règle : une citation de Descartes rangée sous la mauvaise
œuvre, 32 « citations » qui n'étaient que des résumés, 67 renvois au recueil
de textes d'un cours, des concepts en double. Chaque règle ci-dessous répond
à l'un de ces défauts, et `outils/verifier_contenu.mjs` en contrôle la
plupart.

## 2. D'où vient le contenu

| Source | Ce qu'on en fait |
|---|---|
| **L'œuvre elle-même** (traduction française publiée, ou texte original libre de droits : Wikisource, Gallica, Les Classiques des sciences sociales) | la source de toute citation exacte ; on note l'œuvre, la partie ou le paragraphe |
| **Vocabulaire technique et critique de la philosophie** (Lalande), dictionnaires de philosophie | les définitions de concepts et de notions |
| **Encyclopédies de référence** (Stanford Encyclopedia of Philosophy, Internet Encyclopedia of Philosophy, Encyclopædia Universalis) | le cadrage d'un auteur, d'une doctrine, d'un débat ; les dates |
| **Wikidata / Wikipédia** | vérifier une date, un titre, une graphie de nom ; jamais seule source d'une thèse |
| **Programme officiel** (BO spécial n° 8 du 25 juillet 2019) | le périmètre et les statuts (§ 3), jamais le contenu |
| **Manuels, supports de cours, fiches d'un professeur** | une **table des matières** : ils disent ce qui compte, pas ce qu'on écrit. Jamais cités, jamais de « TEXTE 9 » ni de « vu en cours » |
| **Une IA (y compris celle qui rédige)** | une aide à la rédaction. Elle peut produire une phrase plausible jamais écrite par l'auteur : tout ce qu'elle propose comme citation passe par la règle du § 4.2 |

## 3. Les trois statuts

Le programme de terminale fixe **17 notions**, **31 repères** et **84
auteurs** (liste par période). La liste des auteurs ne joue que pour
l'**explication de texte** : en dissertation, on peut citer qui on veut.
D'où trois statuts (décision de l'auteur du 5 octobre 2026) :

| Statut | Ce qu'il couvre |
|---|---|
| **Programme** | les 17 notions, les 31 repères, les 84 auteurs de la liste |
| **Hors liste** | un auteur absent de la liste mais traité dans une notion du programme (Camus, Tisseron…) : citable en dissertation, pas en explication de texte |
| **Hors programme** | une notion nouvelle, et tout ce qui n'apparaît que sous elle |

Le statut se **calcule** à partir des listes officielles et des notions où
l'élément apparaît ; il ne s'écrit pas à la main (mise en place à l'étape 5
de la feuille de route). Le hors programme est visible par défaut, et le site
propose de le masquer à la première visite.

## 4. Les règles d'écriture

### 4.1 Avant d'écrire

- **Chercher ce qui existe** (`grep` dans `data.js`) : l'auteur sous un autre
  nom (« Weil » / « Simone Weil »), le concept sous un autre `id`, la
  citation sous une autre notion. On **complète** l'existant plutôt que de le
  doubler.
- Pour un auteur, **réutiliser le nom exact** déjà employé ; à défaut, le
  nom d'usage le plus courant, et une entrée dans `AUTHOR_ALIASES` pour les
  autres formes.

### 4.2 Les citations

- Une **citation exacte** s'écrit entre guillemets français :
  `« Je pense, donc je suis »`. Elle n'entre que si l'on a pu la
  **retrouver** dans l'œuvre (ou dans une source secondaire sérieuse qui
  donne la référence), avec l'œuvre exacte dans le champ `w` de l'idée.
- Une **reformulation** s'écrit sans guillemets. Elle reste utile (elle
  résume une thèse), mais le quiz ne la pose pas en « Qui a dit cela ? ».
- Une phrase **attribuée** mais introuvable (la « citation Internet ») ne
  s'écrit pas comme citation. Si elle est célèbre, on peut la mentionner en
  prose en disant qu'elle est attribuée.
- Une formule moderne qui résume un ancien (« croyance vraie justifiée »
  pour Platon) n'est **pas** une citation de cet ancien.

### 4.3 Les auteurs

- Toute entrée d'auteur dans une notion a **sa fiche `AM` sous le même
  nom** : biographie (dates, nationalité, ce qui le caractérise en une ou
  deux phrases), courant, période, thèmes, dialogues.
- Un dialogue (`oppose`, `prolonge`, `repond`) doit être **établi** : l'un
  répond explicitement à l'autre, ou la filiation est reconnue. Pas de
  dialogue « par affinité ».

### 4.4 Les concepts et repères

- `id` et terme **uniques** (le quiz en fait une carte par `id`).
- Une définition qui donne au moins un exemple (`<em>Ex.</em>`), et qui
  n'emploie le terme que s'il le faut : le quiz masque le terme dans la
  définition, mais une définition qui ne tient que par lui devient opaque.
- Les relations visent un concept existant (`to`) ou un terme libre
  (`term`) ; jamais le champ `tensions` (ancien format).

### 4.5 Les notions

Une notion nouvelle (hors programme, à partir de l'étape 5) ne se publie
qu'avec un minimum : une définition avec sa section « Approfondir », 3 à 6
auteurs avec au moins une idée chacun, ses concepts, un plan de
dissertation, des exemples, des liens vers les notions voisines, et ses
sources.

### 4.6 Marquage

Tout élément ajouté porte `new:true` ; un élément corrigé, `modified:true`
(cf. `CLAUDE.md`).

## 5. Vérifier

Dans cet ordre, avant de livrer :

1. `node outils/verifier_contenu.mjs` : doit finir par « cohérent ». Les
   avertissements se lisent (reformulations, dialogues vers un auteur sans
   fiche) ; ils ne bloquent pas, mais un avertissement nouveau doit être
   voulu.
2. Après une modification du vérificateur lui-même :
   `node outils/verifier_contenu.mjs --temoins` (chaque faute glissée exprès
   doit être « vue »).
3. La syntaxe du `<script>` d'`index.html` si on y a touché (cf. `CLAUDE.md`,
   pièges connus).
4. Ouvrir le site et regarder ce qu'on a ajouté : la fiche s'affiche, les
   liens se font, la carte de quiz est lisible.

## 6. Rendre compte

Le compte rendu d'un ajout dit, en quelques lignes : ce qui a été ajouté ou
corrigé, **les sources utilisées** pour chaque citation et chaque date, ce
qui n'a pas pu être vérifié (et donc n'est pas entré, ou est entré comme
reformulation), et le résultat du vérificateur.
