# Charte graphique

Ce qui fait l'identité visuelle du site (piste A « Bibliothèque », nov. 2026)
et les règles à suivre quand on touche à l'interface. La maquette de
référence est `docs/maquettes/accueil-piste-a.html`.

## Couleurs et typographie

Thème sombre en bruns chauds, accent ocre. Les couleurs sont des variables
CSS définies dans `css/01-base.css` (`:root`, et `:root[data-theme="clair"]`
pour le thème clair) : on s'en sert, on n'écrit pas de couleur en dur dans
un nouveau style.

- fond : `--color-background-primary`, `--color-background-secondary`
- texte : `--color-text-primary` / `-secondary` / `-tertiary`
- accent : `--color-ocre` (et `--color-ocre-texte` pour du texte posé dessus)
- titres en Literata (`--font-titre`), texte courant en Inter, toutes deux
  servies depuis `polices/`.

## Icônes : jamais d'émoji

**Règle.** L'interface n'utilise aucun émoji (🎯, 💡, ⚙, 👤, 🎉…), ni comme
icône de bouton, ni comme décoration dans un titre ou un message. Un émoji
change d'aspect d'un système à l'autre (Windows, Android, iOS), arrive en
couleurs vives qui jurent avec les bruns et l'ocre, et se lit mal en petit.

À la place :

- **une icône du jeu du site** : `ico('nom')` (`js/00-icones.js`) rend une
  balise `<svg class="ico">`. Dans le HTML statique d'`index.html`, écrire
  `<i data-ico="nom"></i>` : `icosStatiques()` la remplace au démarrage.
  Page `/admin/` : `ico()` d'`admin/admin.js` (sa propre liste, `ICONES_ADMIN`).
- **ou rien** : un message de réussite n'a pas besoin de 🎉, un mot suffit.

Une icône qui manque se dessine et s'ajoute à `ICONES`, dans le même style :

- grille 24 × 24, au trait (`fill:none`), épaisseur 1.75, bouts et angles
  arrondis ;
- couleur du texte autour (`currentColor`) ; pour l'accent, la classe
  `ico-acc` (ocre) ;
- formes simples, lisibles à 14 px ; pas de dégradé ni de couleur propre.

L'icône est décorative (`aria-hidden`) : le sens passe par le libellé
voisin, ou un `aria-label`/`title` sur un bouton qui n'a que l'icône.

**Les signes d'interface aussi.** La règle vaut pour les flèches et
symboles qui servent de bouton ou de repère : ← (Retour), → (lien vers une
fiche, « Suivant »), ↗ (lien externe), ▸ ▾ ▶ ▼ ◀ (volets, visite guidée),
▲ ▼ (votes), ✓ ✕ (coche, fermer), ✎ (Modifié), ✦ (Nouveau), ↻ ↩ ↓ ☰ ⌘ ●.
Chacun a son icône dans `ICONES` (`flecheG`, `flecheD`, `externe`,
`chevronD/G/B/H`, `coche`, `fermer`, `crayon`, `etincelle`, `recommencer`,
`retourner`, `telecharger`, `menu`, `commande`…). Les chevrons des volets
`<details>` se dessinent en CSS (masque `--ico-chevron`,
`css/14-icones.css`), pas avec un caractère dans `content`.

Seules exceptions : un texte affiché sans HTML (une `<option>`, un champ
échappé) où une balise SVG ne passe pas, qui prend alors un mot ou une
virgule ; et les flèches dans la prose du contenu (`contenu/`), qui font
partie de la phrase. Les commentaires du code peuvent citer un signe pour
désigner un bouton.

L'icône du site (`icon.svg` : favicon, appli installée) suit la même règle :
un temple dessiné au trait ocre sur le fond brun.
