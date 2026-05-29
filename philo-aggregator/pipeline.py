"""
pipeline.py — orchestrations qui ENCHAÎNENT plusieurs étapes.

Certaines opérations combinent le réseau (mailbox_client) et l'ingestion
hors-ligne (ingest). On les place ici, à part, pour que :
  - `mailbox_client` reste un client réseau pur (il ne connaît pas la base) ;
  - `ingest` reste le cœur hors-ligne (il ne connaît pas le réseau).

Ainsi le même enchaînement est réutilisé par la commande CLI `pull`
ET par le bouton « Récupérer » du dashboard, sans copier-coller.
"""

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
