"""
ingest.py — ingestion des fichiers .txt déposés dans `inbox/`.

Pour chaque fichier :
  1. Lire le contenu (UTF-8).
  2. Extraire le bloc JSON entre les marqueurs
     [PHILO-PROPOSAL-JSON-START] / [PHILO-PROPOSAL-JSON-END].
  3. Parser et valider la structure (schémas philo-proposal/v1 ou v2).
  4. Calculer pour chaque boîte sa signature et son `key_term`
     (discriminant lisible).
  5. Insérer la soumission et ses boîtes en base.
  6. Déplacer le fichier vers `processed/` (succès) ou `quarantine/`
     (échec, avec un .err.txt à côté qui explique pourquoi).

Le format du fichier .txt est strict (généré par le site) : on n'a donc
pas besoin d'une validation très poussée au niveau des champs internes
de chaque boîte. La quarantaine sert surtout à attraper un bug éventuel
côté site (JSON cassé, marqueur absent, encodage bizarre).
"""

import re
import json
import hashlib
import unicodedata
import pathlib

import db


# ────────── Chemins ──────────

INBOX_DIR = db.SCRIPT_DIR / "inbox"
PROCESSED_DIR = db.SCRIPT_DIR / "processed"
QUARANTINE_DIR = db.SCRIPT_DIR / "quarantine"


# ────────── Extraction du bloc JSON ──────────

# Expression régulière pour repérer le bloc machine. `.*?` est "non
# gourmand" (le plus court match possible). `re.DOTALL` rend `.` capable
# de matcher les sauts de ligne aussi — sans ça, le `.` s'arrête à `\n`
# et le JSON multiligne ne serait pas capturé.
MARKER_RE = re.compile(
    r"\[PHILO-PROPOSAL-JSON-START\]\s*(.*?)\s*\[PHILO-PROPOSAL-JSON-END\]",
    re.DOTALL,
)


def extract_json_block(text):
    """
    Cherche le bloc JSON dans `text` et le renvoie sous forme de chaîne.
    Lève `ValueError` si aucun bloc n'est trouvé.
    """
    m = MARKER_RE.search(text)
    if not m:
        raise ValueError("Aucun bloc [PHILO-PROPOSAL-JSON-START]…END trouvé.")
    return m.group(1)


# ────────── Validation du schéma ──────────

SUPPORTED_SCHEMAS = ("philo-proposal/v1", "philo-proposal/v2", "philo-proposal/v3")


def validate_payload(payload):
    """
    Vérifie que l'objet JSON parsé respecte un schéma supporté
    (philo-proposal/v1 ou v2). Lève `ValueError` avec un message clair si
    quelque chose cloche.

    v1 → v2 : pour cible 'auteur', les champs d'idée (oeuvre, date, idee,
    citation, concepts) ne sont plus à plat dans `fields` mais dans le
    tableau `fields.ideas[]` (chaque entrée = un objet de champs).

    Validation volontairement souple sur les champs internes des boîtes
    (la source est de confiance).
    """
    if not isinstance(payload, dict):
        raise ValueError("Le JSON racine n'est pas un objet.")
    if payload.get("schema") not in SUPPORTED_SCHEMAS:
        raise ValueError(
            f"Champ 'schema' inconnu : {payload.get('schema')!r}. "
            f"Schémas supportés : {SUPPORTED_SCHEMAS}."
        )
    boxes = payload.get("boxes")
    if not isinstance(boxes, list):
        raise ValueError("Le champ 'boxes' doit être une liste.")
    if not boxes:
        raise ValueError("La liste 'boxes' est vide.")

    for i, b in enumerate(boxes):
        if not isinstance(b, dict):
            raise ValueError(f"Boîte #{i} : ce n'est pas un objet.")
        t = b.get("type")
        c = b.get("cible")
        if t not in db.TYPES:
            raise ValueError(
                f"Boîte #{i} : 'type' invalide ({t!r}). "
                f"Attendu : {db.TYPES}."
            )
        if c not in db.CIBLES:
            raise ValueError(
                f"Boîte #{i} : 'cible' invalide ({c!r}). "
                f"Attendu : {db.CIBLES}."
            )
        if not isinstance(b.get("fields"), dict):
            raise ValueError(f"Boîte #{i} : 'fields' doit être un objet.")


# ────────── Normalisation et signature ──────────

def normalize(s):
    """
    Met une chaîne en forme canonique pour la comparaison :
    minuscules, sans accents, espaces compactés.

    `unicodedata.normalize('NFKD', …)` décompose chaque caractère
    accentué en deux : la lettre nue + l'accent en tant que caractère
    combinant séparé. On encode ensuite en ASCII en ignorant ce qui
    ne passe pas → l'accent disparaît.
    Exemple : 'École' → 'ecole'.
    """
    if not s:
        return ""
    s = s.lower().strip()
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return " ".join(s.split())


def compute_key_term(type_, cible, fields):
    """
    Renvoie le « discriminant » lisible de la boîte : nom de l'auteur,
    titre du texte, terme du concept, etc. Sert à la fois pour l'affichage
    (« [BOX 42] ajout • auteur "Sartre" ») et pour le calcul de signature.

    En correction/remarque, c'est l'élément ciblé qui fait office de
    discriminant (cibleref / remelement).
    """
    f = fields or {}
    # Retours sur le site : le discriminant est le résumé du bug / de l'idée.
    # À traiter AVANT les branches par type : ces boîtes portent type='remarque'
    # (le site masque le menu « type » pour la catégorie 'site'), or leur
    # discriminant n'est pas remelement mais leurs champs propres.
    if cible == "site-bug":
        s = (f.get("bugou") or f.get("bugdesc") or "").strip()
        return (s[:60] + "…") if len(s) > 60 else s
    if cible == "site-fonction":
        return (f.get("fonctitre") or "").strip()
    if type_ == "correction":
        return (f.get("cibleref") or "").strip()
    if type_ == "remarque":
        return (f.get("remelement") or "").strip()
    # type == 'ajout' : dépend de la cible.
    if cible == "notion":
        return (f.get("notion") or "").strip()
    # Toutes les sous-cibles auteur sont discriminées par le nom.
    if cible in ("auteur", "auteur-citation", "auteur-dialogue", "auteur-bio"):
        return (f.get("nom") or "").strip()
    if cible == "texte":
        return (f.get("titre") or "").strip()
    if cible == "plan":
        return (f.get("plan_q") or "").strip()
    if cible == "axe":
        return (f.get("axenom") or "").strip()
    if cible == "exemple":
        return (f.get("extitre") or f.get("excat") or "").strip()
    if cible == "dissertation":
        q = (f.get("question") or "").strip()
        return (q[:60] + "…") if len(q) > 60 else q
    # Concept (définition) et relation : discriminés par le terme.
    if cible in ("concept", "concept-relation"):
        return (f.get("cterme") or "").strip()
    return ""


def extract_notions(cible, fields):
    """
    Renvoie le tuple (notion_principale, extras_json) :
      - concept (définition) : 1re notion de `cnotions` (triée), les autres
        dans `extras_json`.
      - auteur (idée/œuvre, v3) : notions DISTINCTES des idées
        (`fields.ideas[].notion`) — 1re + extras.
      - autres cibles : `fields.notion` (chaîne), et None.
      - dialogue / bio / concept-relation : aucune notion (None, None).
      - retours site (site-bug / site-fonction) : aucune notion (None, None).

    Le tri rend l'ordre déterministe — deux soumissions identiques
    aboutissent à la même `notion_principale`.
    """
    f = fields or {}

    def pack(values):
        vs = sorted({str(x).strip() for x in values if str(x).strip()})
        if not vs:
            return (None, None)
        if len(vs) == 1:
            return (vs[0], None)
        return (vs[0], json.dumps(vs[1:], ensure_ascii=False))

    if cible == "concept":
        cn = f.get("cnotions")
        return pack(cn if isinstance(cn, list) else [])
    if cible == "auteur":
        # v3 : les notions sont portées par chaque idée.
        ideas = f.get("ideas") if isinstance(f.get("ideas"), list) else []
        notions = [it.get("notion") for it in ideas if isinstance(it, dict)]
        return pack(notions)
    if cible in ("auteur-dialogue", "auteur-bio", "concept-relation",
                 "site-bug", "site-fonction"):
        return (None, None)
    n = f.get("notion")
    if n is None or not str(n).strip():
        return (None, None)
    return (str(n).strip(), None)


def compute_signature(type_, cible, notion, key_term):
    """
    Empreinte SHA-256 (16 premiers caractères) qui identifie une boîte
    de façon canonique. Deux boîtes avec la même signature sont
    probablement la même proposition (même type, même cible, même
    notion, même discriminant, indépendamment des accents et de la casse).

    On garde 16 caractères — c'est 64 bits, largement suffisant pour
    qu'il n'y ait pas de collision par hasard dans notre volume.
    """
    raw = f"{type_}|{cible}|{normalize(notion)}|{normalize(key_term)}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:16]


# ────────── Traitement d'un fichier ──────────

def ingest_text(raw_text, source_file):
    """
    Ingère une proposition déjà en mémoire (chaîne de caractères) au lieu
    d'un fichier sur disque. C'est le cœur partagé de l'ingestion :
    `process_file` lit un .txt puis appelle cette fonction ; l'API en
    ligne (mailbox) et le `pull` local l'appelleront, eux, directement
    avec le corps reçu — sans jamais écrire de fichier intermédiaire.

    `source_file` : étiquette de provenance rangée dans la submission
    (nom du .txt, « api », « pull »…), pour la traçabilité.

    Renvoie un dico de résultat :
      {'status': 'ok',         'submission_id': N, 'boxes_inserted': K,
                               'dupes_detected': D}
      {'status': 'quarantine', 'reason': '...'}
    """
    # 1) Extraire le bloc JSON.
    try:
        raw_json = extract_json_block(raw_text)
    except ValueError as e:
        return {"status": "quarantine", "reason": str(e)}

    # 2) Parser le JSON.
    try:
        payload = json.loads(raw_json)
    except json.JSONDecodeError as e:
        return {"status": "quarantine",
                "reason": f"JSON invalide : {e}"}

    # 3) Valider le schéma.
    try:
        validate_payload(payload)
    except ValueError as e:
        return {"status": "quarantine", "reason": str(e)}

    # 4) Préparer les métadonnées de la soumission.
    received_at = str(payload.get("date") or db.now_iso())
    contributor = str(payload.get("contributor") or "anonyme").strip() or "anonyme"

    # 5) Insérer en base — submission + chaque boîte. On fait tout
    #    dans un seul `with` pour que ce soit transactionnel : si une
    #    insertion plante au milieu, le `with` rollback automatiquement
    #    et la base reste cohérente (pas de submission orpheline).
    dupes_detected = 0
    with db.connect() as conn:
        submission_id = db.insert_submission(
            conn, received_at, contributor, str(source_file),
            raw_text, raw_json,
        )
        for i, b in enumerate(payload["boxes"]):
            type_ = b["type"]
            cible = b["cible"]
            fields = b.get("fields") or {}
            notion, extras = extract_notions(cible, fields)
            key_term = compute_key_term(type_, cible, fields)
            signature = compute_signature(type_, cible, notion, key_term)

            # Combien de boîtes ont déjà cette signature ? (avant
            # insertion, pour ne pas se compter soi-même).
            if db.count_boxes_with_signature(conn, signature) > 0:
                dupes_detected += 1

            db.insert_box(
                conn, submission_id, i, type_, cible, notion, extras,
                key_term, json.dumps(fields, ensure_ascii=False),
                signature,
            )

    return {
        "status": "ok",
        "submission_id": submission_id,
        "boxes_inserted": len(payload["boxes"]),
        "dupes_detected": dupes_detected,
    }


def process_file(path):
    """
    Traite un fichier .txt : lit son contenu en UTF-8, puis délègue tout
    le reste à `ingest_text`. Renvoie le même dico de résultat.

    La lecture du fichier reste ici car c'est la seule partie propre au
    disque : l'encodage doit être forcé en UTF-8 — le site génère en
    UTF-8 et il ne faut pas laisser Python retomber sur l'encodage par
    défaut qui, sur Windows, peut être cp1252. En cas d'erreur, l'appelant
    (`run`) déplacera le fichier en quarantaine ; ici on se contente de
    signaler.
    """
    try:
        raw_text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError as e:
        return {"status": "quarantine",
                "reason": f"Fichier non-UTF-8 : {e}"}
    return ingest_text(raw_text, path.name)


# ────────── Déplacement de fichiers ──────────

def move_unique(src, dst_dir):
    """
    Déplace `src` vers `dst_dir` en évitant l'écrasement : si un fichier
    de même nom existe déjà, on suffixe avec _1, _2, … jusqu'à trouver
    un nom libre.
    """
    dst_dir.mkdir(parents=True, exist_ok=True)
    dst = dst_dir / src.name
    i = 1
    while dst.exists():
        dst = dst_dir / f"{src.stem}_{i}{src.suffix}"
        i += 1
    src.rename(dst)
    return dst


def write_err_file(dst_txt, reason, src_name):
    """
    Écrit un fichier .err.txt à côté du fichier mis en quarantaine,
    avec la raison du rejet. Utile pour diagnostiquer un bug du site.
    """
    err_path = dst_txt.with_name(dst_txt.stem + ".err.txt")
    err_path.write_text(
        f"Quarantaine — {db.now_iso()}\n"
        f"Fichier d'origine : {src_name}\n"
        f"Raison :\n{reason}\n",
        encoding="utf-8",
    )
    return err_path


def quarantine_text(raw_text, label, reason):
    """
    Sauvegarde en quarantaine une proposition reçue SANS fichier d'origine
    (cas du `pull` depuis la boîte en ligne, qui travaille en mémoire).

    On écrit deux fichiers dans QUARANTINE_DIR : un `.txt` avec le corps
    brut reçu, et un `.err.txt` avec la raison — exactement comme pour un
    fichier déposé manuellement. Ainsi rien n'est perdu : une proposition
    mal formée reste consultable et diagnosticable sur le disque.

    `label` sert à nommer le fichier (ex. « pull-12 »). On nettoie les
    caractères gênants pour un nom de fichier.
    """
    QUARANTINE_DIR.mkdir(parents=True, exist_ok=True)
    safe = "".join(c if c.isalnum() or c in "-_" else "_" for c in label)
    dst = QUARANTINE_DIR / f"{safe}.txt"
    # Réutilise move_unique-like : éviter d'écraser un homonyme.
    i = 1
    while dst.exists():
        dst = QUARANTINE_DIR / f"{safe}_{i}.txt"
        i += 1
    dst.write_text(raw_text, encoding="utf-8")
    write_err_file(dst, reason, label)
    return dst


# ────────── Point d'entrée du module ──────────

def run(dir_arg=None):
    """
    Parcourt le dossier d'entrée, ingère chaque .txt et déplace.

    `dir_arg` : pathlib.Path optionnel pour surcharger INBOX_DIR (utile
    pour tester avec un dossier différent).
    """
    inbox = pathlib.Path(dir_arg) if dir_arg else INBOX_DIR
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    QUARANTINE_DIR.mkdir(parents=True, exist_ok=True)
    db.init_db()

    files = sorted(p for p in inbox.glob("*.txt") if p.is_file())
    if not files:
        print(f"(rien à ingérer dans {inbox})")
        return

    n_ok = 0
    n_quarantine = 0
    n_boxes = 0
    n_dupes = 0

    for p in files:
        result = process_file(p)
        if result["status"] == "ok":
            dst = move_unique(p, PROCESSED_DIR)
            n_ok += 1
            n_boxes += result["boxes_inserted"]
            n_dupes += result["dupes_detected"]
            extra = (f" ({result['dupes_detected']} doublon(s) probable(s))"
                     if result["dupes_detected"] else "")
            print(f"  OK   {p.name} -> {result['boxes_inserted']} boîte(s){extra}")
        else:
            dst = move_unique(p, QUARANTINE_DIR)
            write_err_file(dst, result["reason"], p.name)
            n_quarantine += 1
            print(f"  KO   {p.name} -> quarantaine : {result['reason']}")

    print()
    print(f"Ingestion terminée : {n_ok} OK, {n_quarantine} en quarantaine.")
    print(f"Boîtes ajoutées : {n_boxes} (dont {n_dupes} doublon(s) probable(s)).")
