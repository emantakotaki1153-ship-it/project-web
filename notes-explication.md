# Notes pour la soutenance — Pierre · Feuille · Ciseaux

Ce fichier est une aide pour l'oral. Il n'est pas dans la liste des livrables du descriptif
(index.html, style.css, script.js, les diagrammes, le rapport), donc il peut rester hors du
dossier à rendre.

Trois fichiers, 437 lignes au total : `index.html` (164), `style.css` (148), `script.js` (125).
Tout ce qui se lit est en français : les textes de la page, les commentaires, et les chaînes de
caractères du JavaScript. Les noms de classes CSS et les noms de variables JavaScript restent en
anglais, parce que c'est l'usage et que le correcteur les lira comme du code.

---

## Les 12 questions les plus probables

**1. « Pourquoi `data-move` sur les boutons au lieu de trois fonctions ? »**
Parce qu'une seule ligne branche les trois boutons (script.js:112). Chaque bouton porte son coup
dans un attribut, et `btn.dataset.move` le lit au clic. Ajouter un coup, ce serait une ligne de
HTML et une entrée dans `MOVES` — pas un nouveau gestionnaire.

**2. « Comment l'ordinateur choisit-il son coup ? »**
`Math.random()` renvoie un nombre entre 0 (inclus) et 1 (exclu). Multiplié par 3, on obtient un
nombre entre 0 et juste en dessous de 3. `Math.floor()` arrondit vers le bas : 0, 1 ou 2, chacun
avec la même probabilité. Ce nombre sert d'indice dans le tableau `["pierre", "feuille", "ciseaux"]`.

**3. « Comment décidez-vous qui a gagné ? »**
Chaque coup connaît le coup qu'il bat, dans la propriété `beats`. Une seule comparaison suffit :
si `p.beats === cpuMove`, le joueur gagne. Sinon, et comme on a déjà vérifié que les deux coups ne
sont pas égaux, c'est l'ordinateur. Il n'y a ni tableau de 9 cases, ni calcul modulo : le troisième
cas n'a pas besoin d'être testé, c'est tout ce qui reste.

**4. « À quoi sert `busy` ? »**
À empêcher deux manches en même temps. Sans lui, on pourrait cliquer trois fois pendant les 650 ms
et lancer trois minuteurs. `busy = true` au début, `if (busy) return;` bloque tout appel suivant,
et `busy = false` à la fin du minuteur. Les boutons passent aussi à `disabled`, ce qui bloque déjà
la souris : `busy` couvre le clavier, lui, toujours actif.

**5. « Pourquoi un `setTimeout` de 650 ms ? »**
C'est la durée du suspense « pierre… feuille… ciseaux… ». Assez long pour sentir l'attente, assez
court pour ne pas agacer. C'est la deuxième valeur de `setTimeout(..., 650)` à script.js:83. Sans
ce délai, le résultat s'afficherait instantanément et l'animation ne servirait à rien.

**6. « Pourquoi `clearTimeout` dans la remise à zéro ? »**
Si on clique sur « Recommencer » pendant l'animation, la manche en cours finirait quand même
650 ms plus tard et écrirait un résultat sur un tableau neuf. Annuler le minuteur empêche ça, et la
manche interrompue n'est comptée dans aucun score.

**7. « Comment marche le bouton sombre / clair ? »**
Les mêmes noms de variables CSS, avec d'autres valeurs, dans `:root[data-theme="light"]`.
JavaScript n'écrit aucune couleur : il pose `data-theme="light"` sur la balise `<html>`
(script.js:105), et tout le CSS se relit tout seul. Changer de thème, c'est changer une liste de
neuf valeurs — aucune règle de la page n'est répétée.

**8. « Pourquoi pas `@media (prefers-color-scheme: light)` en CSS ? »**
Parce qu'une media query suit le réglage du système : on ne peut pas la contredire avec un clic.
On lit cette préférence **une seule fois**, dans le `<head>` de index.html:13, pour choisir la
valeur de départ, et ensuite c'est le bouton qui décide.

**9. « Pourquoi y a-t-il un petit `<script>` dans le `<head>` ? »**
Pour éviter le clignotement : sans lui, la page se peindrait d'abord en sombre puis basculerait en
clair une fois `script.js` chargé. Il est placé **au-dessus** des `<link>` de feuilles de style,
donc la valeur est déjà écrite quand le navigateur applique le CSS.

**10. « Comment le clavier est-il filtré ? »**
Quatre conditions à script.js:119 : touche inconnue (`!move`), touche maintenue enfoncée
(`e.repeat`), et les trois touches de modification (`e.ctrlKey`, `e.metaKey`, `e.altKey`) pour ne
pas voler Ctrl+P ou Cmd+C. Ensuite `e.preventDefault()` empêche l'action habituelle de la touche.
`||` s'arrête dès la première condition vraie, donc une touche inconnue ne coûte rien.

**11. « Comment les couleurs du résultat sont-elles choisies ? »**
JavaScript n'écrit aucune couleur non plus. Il met `data-state` à `win`, `lose`, `draw` ou `idle`
(script.js:29), et le CSS a une règle par valeur pour la bordure de gauche, plus une ligne qui
regroupe les trois titres colorés (style.css:41–43). Le principe est toujours le même :
**le JavaScript change une seule valeur, le CSS décide de l'apparence.**

**12. « À quoi servent `role="status"`, `aria-live` et `aria-hidden` ? »**
`role="status"` avec `aria-live="polite"` : un lecteur d'écran annonce le texte de la bannière dès
qu'il change, sans que l'utilisateur ait à aller le chercher — sinon il ne saurait jamais s'il a
gagné. À l'inverse, `aria-hidden="true"` sur les emojis dit au lecteur de les ignorer : « ✊ » n'a
rien à dire à voix haute, et le nom du coup est déjà écrit juste en dessous.

---

## index.html — 164 lignes

| Lignes | Ce que c'est | Ce qu'on peut en dire |
| --- | --- | --- |
| 1–2 | `<!DOCTYPE html>` et `<html lang="fr">` | Le doctype fait passer le navigateur en mode standard. `lang="fr"` sert à la prononciation du lecteur d'écran et à la coupure des mots. |
| 4–7 | Les trois `<meta>` et le `<title>` | `charset="UTF-8"` pour que « é », « à » et les emojis s'affichent. `viewport` pour que le téléphone n'affiche pas une page d'ordinateur réduite. `theme-color` colore la barre du navigateur. |
| 11–14 | Le petit script du thème | Le seul JavaScript écrit dans le HTML. Il pose le thème avant l'affichage (questions 8 et 9). |
| 16–17 | Les deux `<link>` | La feuille de style et l'icône. L'icône est un SVG écrit à la main, dans `assets/favicon.svg` : un ✊ sur un carré arrondi. |
| 23–41 | La barre du haut | `header.topbar` : le nom du jeu à gauche, le badge du cours et les deux boutons à droite. Les boutons portent un `id` parce que script.js doit les retrouver. |
| 33–37 | Le `<svg>` de « Recommencer » | Deux `<path>` : un arc de cercle et une flèche. `stroke="currentColor"` prend la couleur du texte du bouton, donc le dessin suit le thème tout seul. Aucune image à charger. |
| 45–58 | L'intro | Le `h1` est coupé en trois `<span>` pour pouvoir colorer « Feuille. » et « Ciseaux. » séparément. Le rappel des touches utilise `<kbd>`, la balise prévue pour une touche de clavier. |
| 62 | `<div class="game-grid">` | Le conteneur des quatre panneaux. Le HTML ne décide d'aucune place : c'est style.css qui range. |
| 64–79 | Le panneau des scores | Trois `<div>` identiques : un libellé et un `<strong>` avec un `id`. `<strong>` et pas `<span>`, parce que c'est la donnée la plus importante de la page. |
| 81–108 | L'arène | Les deux badges de manche, les deux tuiles de main, le « VS » et la bannière de résultat. |
| 84 | Le badge de série | Il porte `hidden` dès le départ : il n'apparaîtra qu'à partir de 2 victoires d'affilée. |
| 104 | La bannière de résultat | `data-state="idle"` est l'état de départ, que le JavaScript remplacera. `role="status"` et `aria-live="polite"` pour l'annonce vocale. |
| 110–139 | Le panneau des coups | Trois `<button class="choice">` avec `data-move`, un `aria-label`, l'emoji, le nom et la touche. L'`aria-label` existe parce que le contenu brut du bouton se lirait « ✊ Pierre P », sans sens. |
| 135–138 | Le conseil | Le seul paragraphe qui dit qu'il n'y a pas de ligne d'arrivée, et qui renvoie vers « Recommencer ». |
| 141–151 | Le panneau des règles | Trois `<li>`, chacun avec les deux emojis puis la phrase. C'est un rappel : JavaScript n'y touche jamais. |
| 156–159 | Le pied de page | Deux `<span>` dans un conteneur `flex` : l'un à gauche, l'autre à droite. |
| 162 | `<script src="script.js">` | Tout en bas du `<body>`, donc le HTML existe déjà quand le script s'exécute. C'est pour ça qu'il n'y a pas d'événement `DOMContentLoaded`. |

Balises sémantiques utilisées : `header`, `main`, `section`, `footer`. Un `<div>` ferait la même
chose visuellement, mais une page sémantique est compréhensible par une machine, et c'est ce qui
permet au lecteur d'écran de naviguer de zone en zone.

---

## style.css — 148 lignes, 14 sections numérotées

L'ordre du fichier va du général au particulier : on réinitialise, on pose les couleurs, on habille
la page, puis on descend panneau par panneau, et on termine par l'animation et le téléphone.

| Section | Lignes | Ce qu'elle fait |
| --- | --- | --- |
| 1. Réinitialisation | 1–4 | `* { box-sizing: border-box; margin: 0; }` : le padding et la bordure restent comptés dans la largeur, et les marges posées par le navigateur disparaissent. `button { font: inherit; }` : un bouton ne reprend pas la police de la page tout seul. |
| 2. Les couleurs | 6–34 | Neuf variables de couleur dans `:root`, plus `color-scheme`, puis les neuf mêmes noms avec d'autres valeurs dans `:root[data-theme="light"]`. Chaque couleur est écrite une seule fois dans tout le fichier. |
| 3. La page | 36–38 | La police du système, le fond, la couleur du texte, et `.page` qui limite à 1150 px puis centre avec `margin: 0 auto`. |
| 4. Les couleurs partagées | 40–47 | Une ligne par couleur, qui liste tous les éléments qui la portent. Une quatrième ligne regroupe tout le texte secondaire : gris et 13 px. |
| 5. Les lignes | 49–59 | Une seule règle `flex` pour les neuf éléments qui alignent leurs enfants sur une ligne, avec `space-between`. `flex-wrap: wrap` sur les deux barres du haut pour qu'elles passent à la ligne au lieu de déborder. |
| 6. Badges, boutons, touches | 61–72 | Le même petit rectangle arrondi pour `.course-chip`, `.pill`, `.btn` et `<kbd>`. `border-radius: 99px` donne la forme de pilule, quelle que soit la taille de l'élément. |
| 7. Le titre | 74–77 | La marge du bloc d'intro, sa taille de 54 px, et une largeur maximale pour la phrase de droite. |
| 8. La grille | 79–94 | `grid-template-columns: 360px 1fr` et `grid-template-areas`, qui donne un nom à chaque case. Puis la règle `.panel` : la même boîte pour les quatre panneaux. |
| 9. Trois colonnes égales | 96–98 | `repeat(3, 1fr)` sert deux fois : pour les trois scores et pour les trois boutons. |
| 10. Les boutons de coup | 100–116 | `position: relative` comme point de repère, la petite touche en `position: absolute` collée en haut à droite, puis `:hover`, `.is-selected` et `:disabled`. |
| 11. L'arène | 118–124 | Une grille `1fr auto 1fr` : la main du joueur, le « VS », la main de l'ordinateur. Chaque camp a sa couleur sous sa tuile, via `border-bottom`. |
| 12. Bannière et pied | 126–133 | Une bordure gauche de 4 px dont la couleur dépend de `data-state`. |
| 13. L'animation | 135–137 | `@keyframes shake` avec une seule étape, à 50 % : la main monte de 10 px puis redescend. `.arena.is-shaking` la déclenche en boucle. |
| 14. Le téléphone | 139–148 | Sous 850 px : une seule colonne, les touches de clavier disparaissent, les boutons grandissent pour le doigt, et les mains rétrécissent. |

Trois règles à savoir expliquer en détail, parce qu'elles concentrent le peu de technique du CSS :

- **`grid-template-areas: "score arena" "choices arena" "rules arena"`** — chaque chaîne de
  caractères est une ligne de la grille, chaque mot est une case. « arena » apparaît trois fois,
  donc le panneau de droite s'étale sur les trois lignes. Chaque panneau dit ensuite où il va avec
  `grid-area: score;`. L'intérêt : on lit la mise en page comme un dessin, et la media query du
  téléphone n'a qu'à réécrire les quatre noms sur une seule colonne, sans toucher au HTML.
- **`.choice-key { position: absolute; top: 6px; right: 6px; }`** — un élément en `absolute` se
  place par rapport à son premier ancêtre en `position: relative`, ici `.choice`. Sans ce `relative`
  sur le bouton, la petite touche irait se coller au coin de la page.
- **`@keyframes shake { 50% { transform: translateY(-10px); } }`** — les étapes 0 % et 100 % ne
  sont pas écrites : le navigateur reprend la position de départ. On ne décrit donc que le milieu,
  la main monte puis revient. `animation: shake 0.3s infinite` la rejoue tant que la classe
  `is-shaking` est posée, et c'est le JavaScript qui l'enlève.

Quatre noms de variables à connaître par cœur, parce qu'ils reviennent partout : `--bg` (le fond de
la page), `--panel` (les quatre grands panneaux), `--box` (ce qu'il y a dedans : boutons, badges,
mains), `--line` (les bordures). En thème sombre, ces trois derniers sont du blanc plus ou moins
transparent posé sur le fond. En thème clair ils sont redéfinis avec des valeurs opaques : du blanc
transparent sur un fond déjà blanc ne se verrait pas.

---

## script.js — 125 lignes, 8 blocs numérotés

Les blocs 1 et 2 sont les données et les raccourcis, les blocs 3 à 7 sont les cinq fonctions, et le
bloc 8 branche le tout. Une fonction est toujours définie avant d'être appelée, donc l'ordre du
fichier est aussi l'ordre de lecture à suivre à l'oral.

| Bloc | Lignes | Ce qu'il fait |
| --- | --- | --- |
| 1. Les données du jeu | 1–7 | `MOVES` : pour chaque coup, son emoji, son nom, le coup qu'il bat et le verbe. `KEYS` : la lettre du clavier vers le coup. |
| 2. Les raccourcis | 9–15 | `byId`, `root`, `buttons`, puis les sept variables du jeu déclarées sur une seule ligne. |
| 3. `setHand` | 17–25 | Affiche une main : l'emoji, le nom, et les deux classes `is-unknown` / `is-known`. |
| 4. `updateScreen` | 27–37 | Écrit l'état, le titre, la phrase, les trois scores et le badge de série. |
| 5. `playRound` | 39–84 | Toute la manche : verrou, compteur, mains, boutons bloqués, minuteur, tirage, comparaison, résultat. |
| 6. `resetGame` | 86–101 | Annule le minuteur en cours et remet tout à zéro. |
| 7. `setTheme` | 103–109 | Pose `data-theme`, change le texte du bouton, recopie la couleur de fond dans le `<meta>`. |
| 8. Les branchements | 111–125 | Les trois clics, le clavier, puis les deux appels de démarrage. |

Il n'y a donc que **cinq fonctions** : `setHand`, `updateScreen`, `playRound`, `resetGame`,
`setTheme`. Tout le reste est du branchement.

- **`setHand(side, move, fallback)`** — `side` vaut `"player"` ou `"cpu"`, et `side + "Hand"`
  fabrique `"playerHand"` : c'est donc exactement le même code pour les deux camps. Si `move` est
  `null`, `MOVES[null]` vaut `undefined` sans erreur, d'où le test `data ? ... : "?"` sur chaque
  ligne. Le paramètre `fallback = "En attente…"` est une valeur par défaut, utilisée une seule fois
  pour afficher « Il réfléchit… ».
- **`updateScreen(status, title, sub)`** — le seul endroit du fichier qui écrit dans la bannière et
  dans les scores. Les trois branches de `playRound` et `resetGame` ne font que l'appeler, donc on
  ne peut pas oublier de mettre un compteur à jour.
- **`playRound(playerMove)`** — le déroulé d'une manche, de haut en bas, sans aucun retour en
  arrière. Le seul morceau qui n'est pas immédiat est le `setTimeout` : tout ce qui est dans son
  bloc s'exécute 650 ms plus tard, et ce bloc se souvient de `playerMove` — c'est une fermeture.
- **`resetGame()`** — sert à la fois au bouton « Recommencer » et au démarrage (script.js:125).
  C'est pour ça que les sept variables sont déclarées sans valeur à la ligne 15 : elles reçoivent
  toutes leur valeur de départ ici, à un seul endroit.
- **`setTheme(theme)`** — ne contient aucune couleur. Elle pose l'état sur `<html>`, met le texte
  du bouton d'accord avec lui, et relit `--bg` avec `getComputedStyle()` pour le `<meta>`.

Le démarrage, dans l'ordre (script.js:124–125) : `setTheme(root.dataset.theme)` relit le thème que
le petit script du `<head>` a déjà posé, puis met le bouton et le `<meta>` d'accord avec lui.
`resetGame()` donne aux sept variables leur valeur de départ et affiche la page vide.

Écritures JavaScript à reconnaître si on vous les fait remarquer :

| Ce qui est utilisé | À quoi ça sert |
| --- | --- |
| `const` / `let` | `const` ne peut pas être réassigné (la table `MOVES`, les trois raccourcis) ; `let` le peut (les sept variables du jeu). |
| `(id) => document.getElementById(id)` | Fonction fléchée : équivalent à `function byId(id) { return document.getElementById(id); }`. |
| `querySelectorAll(".choice")` | Renvoie une **NodeList**, pas un tableau. Elle possède `.forEach()`, qui est tout ce qu'on lui demande ; elle n'a ni `.map()` ni `.filter()`. |
| `MOVES[move]` | Lit la table : le nom du coup entre crochets est la clé de l'objet. |
| Modèle de chaîne avec des accents graves | On insère des valeurs dans du texte, par exemple le nom du coup et son verbe. Avec des `+` ça marcherait aussi, mais c'est moins lisible. |
| `? ... : ...` | Un `if` court qui renvoie une valeur, utilisé pour le libellé du bouton de thème. |
| `Boolean(data)` | Transforme n'importe quelle valeur en vrai/faux. `classList.toggle()` attend un booléen : `undefined` tout seul marcherait aussi, mais l'écrire dit clairement l'intention. |
| `classList.toggle("is-selected", condition)` | Ajoute la classe si la condition est vraie, l'enlève sinon. Remplace un `if / else` de quatre lignes. |
| `++round` | Ajoute 1 **puis** renvoie la nouvelle valeur : le compte et l'affichage tiennent sur une ligne. |
| `win = lose = draw = round = streak = 0` | Affectation en chaîne, qui se lit de droite à gauche : le 0 passe d'une variable à la suivante. Une ligne au lieu de cinq. |
| `.textContent` | Change le texte d'un élément. On n'utilise jamais `innerHTML`, donc aucun risque d'injecter du HTML. |
| `.className = "hand-emoji"` | Remplace toute la liste des classes d'un coup, plus simple que trois `classList.remove()`. |
| `.dataset.state` / `.dataset.move` | Lit et écrit les attributs `data-state` et `data-move` du HTML. |
| `.hidden = true` | Pose l'attribut `hidden` du HTML, sans avoir besoin d'une règle CSS. |
| `getComputedStyle(root).getPropertyValue("--bg")` | Relit une variable CSS depuis JavaScript : la barre du navigateur prend exactement la couleur du fond, sans écrire deux fois la valeur hexadécimale. |

---

## Ce qu'on n'a volontairement pas utilisé

À dire si on demande pourquoi le code est aussi court :

- aucune bibliothèque ni framework : pas de jQuery, pas de Bootstrap, pas d'étape de compilation,
  et pas de police téléchargée sur Internet — la page fonctionne entièrement hors ligne ;
- pas de `localStorage` : ni la partie ni le thème choisi ne survivent à un rechargement, c'est un
  choix assumé pour un mini-projet, et cela évite tout un bloc de code à défendre ;
- pas de `class`, pas de `async/await`, pas de `fetch`, pas de `Promise`, pas d'événement
  `DOMContentLoaded` : rien à expliquer qui sorte du cours ;
- pas de `prefers-color-scheme` dans le CSS : il est lu une seule fois en JavaScript, sinon le
  bouton ne pourrait pas contredire le système (question 8) ;
- pas de `!important`, pas de `nth-child`, pas de `calc()`, pas de `transition`, pas de dégradé,
  pas d'ombre portée, et pas de code commenté laissé mort dans un coin ;
- neuf variables CSS, et uniquement des couleurs : les tailles sont écrites là où elles servent, ce
  qui évite une couche d'abstraction supplémentaire à justifier ;
- une instruction par ligne, pour pouvoir pointer n'importe quelle ligne et dire ce qu'elle fait.

---

## Les limites à connaître

À énoncer vous-même avant qu'on vous les reproche — c'est ce qui montre que le périmètre est
maîtrisé :

1. **Pas de sauvegarde.** Un rechargement remet les scores à zéro et le thème au réglage du
   système. Il faudrait `localStorage` avec `setItem()` et `getItem()`, ce qui ajouterait un bloc
   et des cas à gérer : données absentes, données illisibles, ancien format à migrer.
2. **La page ne suit pas un changement du système en direct.** La préférence est lue une fois au
   chargement. Écouter le changement avec `matchMedia(...).addEventListener("change", …)`
   suffirait, mais cela écraserait un choix fait au bouton.
3. **L'ordinateur joue au hasard pur.** Il n'apprend rien et ne triche pas : il ne garde aucune
   mémoire des coups du joueur. Un adversaire plus intéressant demanderait de l'historique, donc
   plus d'état à expliquer.
4. **Le jeu n'a pas de fin.** Le score monte indéfiniment, il n'y a pas de « meilleur des 5 ». Une
   partie avec un score cible demanderait une condition d'arrêt, un écran de fin, et un bouton pour
   rejouer. Le compteur de série est la seule notion de progression.
5. **Les emojis comme seuls graphismes.** Ils ne sont pas dessinés de la même façon sur Windows,
   macOS et Android : la main « ✌️ » n'a pas le même style d'un appareil à l'autre. Des images SVG
   régleraient ça, au prix de trois fichiers et de trois balises `<img>` à charger.
6. **Une seule coupure responsive.** La media query coupe à 850 px, et la mise en page a été
   vérifiée de 280 px à 1440 px. En dessous de 280 px, elle n'est pas testée.
7. **Aucun test automatisé.** La vérification est faite à la main : les 9 combinaisons de coups, le
   clavier (P/F/C, majuscule, Ctrl+P, touche maintenue), les deux thèmes, la remise à zéro en pleine
   manche, et seize largeurs de 280 px à 1440 px.

Si on vous demande ce que vous ajouteriez en premier : mémoriser la partie avec `localStorage`,
puis un score cible avec un écran de fin.

---

## Si on vous demande de modifier quelque chose en direct

Quatre demandes probables, et exactement où toucher :

- **« Changez la durée de l'animation. »** — Une seule valeur : le `650` de script.js:83. Le CSS
  suit tout seul, parce que l'animation est en `infinite` tant que la classe `is-shaking` est posée.
- **« Rendez le texte plus grand. »** — `.hero-title` à style.css:76, et `.hand-emoji` à
  style.css:122. Pour tout le texte secondaire d'un coup, c'est aussi une seule ligne : le
  `font-size: 13px` de style.css:46.
- **« Changez une couleur. »** — Une ligne dans `:root` (style.css:10–18), plus sa jumelle dans
  `:root[data-theme="light"]` (style.css:25–33). Rien d'autre à chercher : aucun élément ne porte
  de couleur écrite en dur.
- **« Ajoutez le coup Puits. »** — Une entrée dans `MOVES`, une lettre dans `KEYS`, un bouton dans
  le HTML, et `repeat(3, 1fr)` devient `repeat(4, 1fr)` à style.css:97. La réponse honnête à donner
  ensuite : avec quatre coups, une seule propriété `beats` ne suffit plus à tout décider, il
  faudrait comparer une liste de coups battus — c'est le vrai prix de cette demande.
