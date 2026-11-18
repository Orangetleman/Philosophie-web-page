/* ══════════════════════════════════════════════════════════════════════
   00-icones.js — le jeu d'icônes du site (nov. 2026)
   ──────────────────────────────────────────────────────────────────────
   Règle de la charte (docs/charte-graphique.md) : pas d'émoji dans
   l'interface. Un émoji change d'aspect d'un système à l'autre, jure avec
   les bruns et l'ocre de la DA et se lit mal en petit. On dessine donc
   chaque icône ici, en SVG au trait (grille 24, trait 1.75, bouts ronds),
   dans la couleur du texte qui l'entoure (currentColor).

   Premier morceau de app.js (00-) : ICONES existe avant tout code de
   premier niveau des autres morceaux.
   ══════════════════════════════════════════════════════════════════════ */

/* ICONES — nom → contenu SVG (chemins seuls, sans la balise <svg>). */
const ICONES={
  cible:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  idee:'<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.3 1.1 2.2h5c0-.9.5-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>',
  reglages:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  personne:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  diplome:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/><path d="M22 9v6"/>',
  imprimer:'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
  alerte:'<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  fete:'<path d="M4 20l5-14 9 9z"/><path d="M14 4l1-2"/><path d="M19 9l2-1"/><path d="M17 4l-1 3 3-1"/>',
  ia:'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4"/><circle cx="12" cy="3" r="1"/><path d="M9 13v1"/><path d="M15 13v1"/><path d="M2 13v2"/><path d="M22 13v2"/>',
  carte:'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14"/><path d="M15 6v14"/>',
  horloge:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  temple:'<path d="M3 21h18"/><path d="M4 18h16"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 9l9-6 9 6z"/>',
  lien:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  partager:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4"/><path d="M15.4 6.5l-6.8 4"/>',
  eclair:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  calendrier:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/>',
  cartes:'<rect x="7" y="3" width="13" height="17" rx="2"/><path d="M4 7v12a2 2 0 0 0 2 2h9"/>',
  qcm:'<path d="M9 6h11"/><path d="M9 12h11"/><path d="M9 18h11"/><path d="M3.5 6l1 1 2-2"/><circle cx="5" cy="12" r="1.5"/><circle cx="5" cy="18" r="1.5"/>',
  flamme:'<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-9-1 2-2 3-3.5 3.5C11 7 11 5 10 3c-2 3-5 6-5 12a7 7 0 0 0 7 7z"/>',
  pouce:'<path d="M7 10v11"/><path d="M15 5.9L14 10h5.8a2 2 0 0 1 2 2.3l-1.4 7A2 2 0 0 1 18.4 21H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3l4-7a2.5 2.5 0 0 1 4 2.9z"/>',
  liste:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M9 10h6"/><path d="M9 14h6"/><path d="M9 18h3"/>',
  outils:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
  cle:'<circle cx="7.5" cy="15.5" r="4.5"/><path d="M11 12l9-9"/><path d="M16 7l3 3"/><path d="M14 9l2 2"/>',
  oeil:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  oeilBarre:'<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.7"/><path d="M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  medaille:'<circle cx="12" cy="15" r="6"/><path d="M8.5 10L6 2h4l2 4 2-4h4l-2.5 8"/><path d="M12 12.5l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3z"/>',
  cadenas:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  plus:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8"/><path d="M8 12h8"/>',
  etoile:'<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
  question:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 2.2-2.4 3.7"/><path d="M12 17h.01"/>',
  disquette:'<path d="M5 3h11l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M7 3v5h8V3"/><rect x="7" y="13" width="10" height="8"/>',
  appareils:'<rect x="2" y="5" width="13" height="10" rx="1.5"/><path d="M6 19h5"/><path d="M8.5 15v4"/><rect x="17" y="8" width="5" height="12" rx="1"/>',
  non:'<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6"/><path d="M15 9l-6 6"/>',
  oui:'<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.5L16 9.5"/>',
  livre:'<path d="M2 5h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 5h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/>',
  loupe:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  // Signes d'interface (anciens ← → ↗ ▸ ▾ ✓ ✕ ✎ ✦ ↻ ↩ ↓ ▲ ▼ ☰ ⌘)
  flecheG:'<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>',
  flecheD:'<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  externe:'<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  chevronD:'<path d="M9 6l6 6-6 6"/>',
  chevronG:'<path d="M15 6l-6 6 6 6"/>',
  chevronB:'<path d="M6 9l6 6 6-6"/>',
  chevronH:'<path d="M6 15l6-6 6 6"/>',
  fermer:'<path d="M6 6l12 12"/><path d="M18 6L6 18"/>',
  coche:'<path d="M5 12.5l4.5 4.5L19 7"/>',
  crayon:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  etincelle:'<path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z"/>',
  recommencer:'<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  retourner:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
  telecharger:'<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>',
  lecture:'<path d="M7 4l13 8-13 8z"/>',
  menu:'<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  commande:'<path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z"/>'
};

/* ico(nom, classe?) — balise <svg> de l'icône `nom`, décorative
   (aria-hidden) : le texte voisin ou un aria-label porte le sens.
   Un nom inconnu rend une chaîne vide plutôt qu'une icône cassée. */
function ico(nom, classe){
  const c=ICONES[nom]; if(!c) return '';
  return '<svg class="ico'+(classe?' '+classe:'')+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+c+'</svg>';
}

/* icosStatiques(racine) — remplit les <i data-ico="nom"></i> écrits dans
   index.html (le HTML statique ne peut pas appeler ico()). Appelé au
   démarrage ; sans effet sur un élément déjà rempli. */
function icosStatiques(racine){
  (racine||document).querySelectorAll('i[data-ico]:empty').forEach(el=>{ el.outerHTML=ico(el.dataset.ico); });
}
