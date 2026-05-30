"""
pipeline.py — orchestrations qui ENCHAÎNENT plusieurs étapes.

Certaines opérations combinent le réseau (mailbox_client) et l'ingestion
hors-ligne (ingest). On les place ici, à part, pour que :
  - `mailbox_client` reste un client réseau pur (il ne connaît pas la base) ;
  - `ingest` reste le cœur hors-ligne (il ne connaît pas le réseau).

Ainsi le même enchaînement est réutilisé par la commande CLI `pull`
ET par le bouton « Récupérer » du dashboard, sans copier-coller.
"""

import db
import ingest
import mailbox_client


def pull_and_ingest(limit=200):
    """
    Récupère les propositions de la boîte en ligne, les ingère en base,
    puis confirme (ack) tous les ids récupérés.

    Renvoie un dico récapitulatif (utilisé tel quel par le CLI pour
    l'affichage et par le dashboard pour un message flash) :
      {
        "items": nb d'items récupérés,
        "ok": nb ingérés avec succès,
        "quarantine": nb mis en quarantaine (corps mal formé),
        "boxes": nb total de boîtes insérées,
        "dupes": nb de doublons probables détectés,
        "acked": nb confirmés auprès de la boîte,
        "details": liste de tuples par item (pour un log détaillé),
      }

    On confirme (ack) MÊME les items mis en quarantaine : ils sont déjà
    sauvegardés sur le disque (ingest.quarantine_text), inutile de les
    re-télécharger à chaque pull.
    """
    items = mailbox_client.pull(limit=limit)
    summary = {
        "items": len(items), "ok": 0, "quarantine": 0,
        "boxes": 0, "dupes": 0, "acked": 0, "details": [],
    }
    acked_ids = []
    for it in items:
        body = it.get("body") or ""
        box_id = it.get("id")
        result = ingest.ingest_text(body, f"pull#{box_id}")
        if result["status"] == "ok":
            summary["ok"] += 1
            summary["boxes"] += result["boxes_inserted"]
            summary["dupes"] += result["dupes_detected"]
            summary["details"].append(
                (box_id, "ok", result["boxes_inserted"], result["dupes_detected"])
            )
        else:
            # Mal formé : on sauvegarde sur le disque pour ne rien perdre.
            ingest.quarantine_text(body, f"pull-{box_id}", result["reason"])
            summary["quarantine"] += 1
            summary["details"].append((box_id, "quarantine", result["reason"]))
        acked_ids.append(box_id)

    summary["acked"] = mailbox_client.ack(acked_ids)
    return summary


# ── Source Supabase (phase 4) ────────────────────────────────────────────
# Les contributeurs CONNECTÉS écrivent directement dans la table
# `contributions` de Supabase. Le cerveau local vient la lire (pull) et y
# réécrit le statut (write-back). On garde `supabase_client` en import
# LOCAL (dans la fonction) : seules ces orchestrations parlent à Supabase,
# inutile de charger ce module pour les commandes hors-ligne.


def pull_cloud_and_ingest(limit=200):
    """
    Récupère les contributions « en_attente » depuis Supabase et les ingère
    en base locale. À la différence de la boîte PythonAnywhere, on ne
    « consomme » rien en ligne : la ligne reste « en_attente » côté Supabase
    tant qu'on n'a pas tranché. Le pull est donc REJOUABLE — on dédoublonne
    sur `remote_id` (déjà ingéré ⇒ ignoré).

    Renvoie un dico récapitulatif :
      {
        "items": nb de contributions reçues,
        "ok": nb ingérées avec succès,
        "skipped": nb ignorées (déjà en base),
        "quarantine": nb mises en quarantaine (payload mal formé),
        "boxes": nb total de boîtes insérées,
        "dupes": nb de doublons probables détectés,
        "details": liste de tuples par item (pour un log détaillé),
      }
    """
    import supabase_client

    items = supabase_client.pull_pending(limit=limit)
    summary = {
        "items": len(items), "ok": 0, "skipped": 0, "quarantine": 0,
        "boxes": 0, "dupes": 0, "details": [],
    }
    for it in items:
        remote_id = it.get("id")
        # Déjà récupérée lors d'un pull précédent ? On saute (idempotence).
        with db.connect() as conn:
            if db.remote_exists(conn, remote_id):
                summary["skipped"] += 1
                summary["details"].append((remote_id, "skip"))
                continue

        payload = it.get("payload")
        label = f"supabase#{str(remote_id)[:8]}"
        result = ingest.ingest_payload(payload, label, remote_id=remote_id)
        if result["status"] == "ok":
            summary["ok"] += 1
            summary["boxes"] += result["boxes_inserted"]
            summary["dupes"] += result["dupes_detected"]
            summary["details"].append(
                (remote_id, "ok", result["boxes_inserted"], result["dupes_detected"])
            )
        else:
            # Payload mal formé : on sauvegarde sur le disque pour ne rien
            # perdre (texte = le JSON reçu, pour diagnostic).
            import json
            raw = json.dumps(payload, ensure_ascii=False, indent=2)
            ingest.quarantine_text(raw, f"supabase-{remote_id}", result["reason"])
            summary["quarantine"] += 1
            summary["details"].append((remote_id, "quarantine", result["reason"]))

    return summary


# Ordre de priorité pour déduire le statut « contributeur » d'une
# contribution à partir des statuts de SES boîtes (une contribution = une
# soumission = plusieurs boîtes triées séparément). On prend le statut le
# plus « avancé » présent : intégrée l'emporte sur retenue, etc. 'archivee'
# est ignoré (rangement interne, pas un verdict montrable au contributeur).
_STATUS_PRIORITY = ("integree", "validee", "rejetee", "en_attente")


def derive_local_status(box_statuses):
    """
    Déduit le statut local représentatif d'une contribution à partir des
    statuts de ses boîtes. Renvoie None s'il n'y a rien de représentable
    (aucune boîte, ou uniquement des 'archivee').
    """
    present = set(box_statuses or [])
    for s in _STATUS_PRIORITY:
        if s in present:
            return s
    return None


def push_contribution_status(submission_id, explication=None):
    """
    Écrit en retour, vers Supabase, le statut d'une contribution (déduit des
    statuts de ses boîtes locales) + une explication facultative. C'est ce
    qui fait avancer la mention vue par le contributeur dans « Mes
    propositions ».

    Renvoie un dico :
      {"pushed": True,  "remote_id": …, "statut": "validee_en_cours"}  ou
      {"pushed": False, "reason": "…"}  (pas de pendant en ligne, statut non
      publiable, etc.).
    """
    import supabase_client

    with db.connect() as conn:
        remote_id = next(iter(
            [r["remote_id"] for r in conn.execute(
                "SELECT remote_id FROM submissions WHERE id = ?",
                (submission_id,))]), None)
        statuses = db.get_submission_box_statuses(conn, submission_id)

    if not remote_id:
        return {"pushed": False, "reason": "contribution locale (pas de remote_id)"}

    local = derive_local_status(statuses)
    remote = supabase_client.remote_status_for(local) if local else None
    if not remote:
        return {"pushed": False,
                "reason": f"statut local non publiable ({local!r})"}

    supabase_client.set_status(remote_id, remote, explication=explication)
    return {"pushed": True, "remote_id": remote_id, "statut": remote}
