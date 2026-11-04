# Notes de préparation — questions probables sur le code

Ce fichier est une aide pour l'oral. Il n'est pas dans la liste des livrables
du descriptif (index.html, style.css, script.js, les diagrammes, le rapport),
donc vous pouvez le garder hors du dossier à rendre.

---

## Les 11 questions les plus probables

**1. « Comment l'ordinateur choisit-il son coup ? »**
`Math.random()` donne un nombre entre 0 (inclus) et 1 (exclu). On le multiplie par 3
(le nombre de coups), on arrondit vers le bas avec `Math.floor()` — ce qui donne 0, 1
ou 2 — et on utilise ce nombre comme index dans le tableau
`["rock", "paper", "scissors"]`. Les trois coups ont donc exactement la même probabilité.

**2. « Comment tu détermines qui a gagné ? »**
Chaque coup connaît le coup qu'il bat : dans la table `MOVES`, `rock` porte
`beats: "scissors"`, `paper` porte `beats: "rock"`, `scissors` porte `beats: "paper"`.
La comparaison tient en trois tests, dans cet ordre : si les deux coups sont identiques
→ match nul ; sinon si `p.beats === cpuMove` → le joueur gagne ; sinon → l'ordinateur
gagne. Le troisième cas n'a pas besoin d'être testé : c'est tout ce qui reste.

**3. « Pourquoi le score ne repart-il pas à zéro à chaque manche ? »**
Ce n'est pas une partie avec une fin. On compte trois choses séparées : victoires,
défaites, égalités. Le bouton Reset est le seul endroit qui remet tout à zéro.

**4. « C'est quoi `data-move` / `data-state` / `data-theme` ? »**
Des attributs personnalisés posés sur un élément. En JavaScript on les lit avec
`element.dataset.move`, et en CSS on cible avec `[data-state="win"]`.
Le principe est toujours le même : **le JavaScript change une seule valeur,
le CSS décide de l'apparence.** Aucune couleur n'est écrite en JavaScript.

**5. « Pourquoi un `setTimeout` de 650 ms ? »**
Pour laisser le temps de voir l'animation de la main qui tremble avant de montrer
le coup de l'ordinateur. Sans ce délai, le résultat s'afficherait instantanément.
Pendant ce délai on bloque les boutons avec le drapeau `busy` pour empêcher un double-clic.

**6. « Pourquoi `clearTimeout` dans Reset ? »**
Si on clique Reset pendant l'animation, le tour en cours finirait quand même
650 ms plus tard et écrirait un résultat sur un tableau neuf. Annuler la minuterie
empêche ça.

**7. « Comment marche le bouton sombre / clair ? »**
`setTheme("dark")` écrit simplement `data-theme="dark"` sur la balise `<html>`.
Le CSS contient un bloc `:root[data-theme="light"]` qui remplace les valeurs de
toutes les variables de couleur. Donc changer le thème = changer une liste de
valeurs, et **aucune règle de la page n'est répétée** entre les deux thèmes.

**8. « Pourquoi pas `@media (prefers-color-scheme: light)` en CSS ? »**
Parce qu'une media query suit le réglage du système : on ne peut pas la contredire
avec un clic. On lit cette préférence **une seule fois**, dans le `<head>`
(`matchMedia("(prefers-color-scheme: light)")`), pour choisir la valeur de départ,
et ensuite c'est le bouton qui décide.

**9. « Pourquoi un petit `<script>` dans le `<head>` ? »**
Pour éviter le clignotement : sans lui, la page se peindrait d'abord en sombre
puis basculerait en clair une fois `script.js` chargé. Ce script est placé
**au-dessus** des `<link>` de feuilles de style, donc la valeur est déjà écrite
quand le navigateur applique le CSS.

**10. « C'est quoi `rgb(var(--teal-rgb) / .14)` ? »**
Une couleur stockée sous forme de **trois nombres** (`--teal-rgb: 62 224 196`)
au lieu d'une couleur finie. `rgb(62 224 196 / .14)` est la même chose que
`rgba(62, 224, 196, .14)`. Avantage : un seul nom donne la couleur pleine
**et** toutes ses versions transparentes, et un nouveau thème n'a que trois
nombres à changer.

**11. « À quoi sert `--accent` ? »**
C'est une variable posée **localement** sur un élément. `.hand-tile.is-player`
déclare `--accent: var(--teal-rgb)`, `.result[data-state="lose"]` déclare
`--accent: var(--coral-rgb)`, et une seule règle ensuite peint le fond, la
bordure, le trait vertical et le titre. Trois résultats qui ne différaient que
par leur couleur deviennent trois lignes d'une seule déclaration chacune.

---

## index.html

| Ce qui est utilisé | À quoi ça sert | S'ils insistent |
| --- | --- | --- |
| `<html lang="en">` | indique la langue de la page | les lecteurs d'écran et la coupure de mots s'en servent |
| `<meta charset="UTF-8">` | nécessaire pour les emojis et les accents | sans ça, les caractères spéciaux sont cassés |
| `<meta name="viewport" content="width=device-width, initial-scale=1">` | dit au téléphone d'utiliser sa vraie largeur | sans lui, le téléphone dessine une page de 980 px puis dézoome : le texte est minuscule |
| `<meta name="theme-color">` | colore la barre du navigateur sur mobile | sa valeur est mise à jour par `setTheme()` pour suivre le fond de la page |
| le `<script>` du `<head>` | choisit le thème avant le premier affichage | voir question 9 |
| `<link>` Google Fonts | charge les polices Outfit et Space Mono | chaque `font-family` déclare une police système en repli, donc le site marche hors ligne |
| `<header> <main> <section> <footer>` | balises sémantiques : elles décrivent le rôle de chaque zone | un `<div>` ferait la même chose visuellement, mais une page sémantique est compréhensible par une machine |
| `type="button"` | dit que le bouton n'envoie rien | utile surtout si on ajoutait un `<form>` plus tard |
| `data-move="rock"` | attache le coup au bouton | voir question 4 |
| `id="themeBtn"` avec le texte « 🌙 Dark » | le bouton de thème | son libellé est réécrit par `setTheme()`, il dit toujours le thème **actuel** |
| `aria-hidden="true"` | cache un élément décoratif aux lecteurs d'écran | l'emoji ✊ est décoratif, le mot « Rock » à côté suffit |
| `aria-label="Play Rock"` | donne un nom propre au bouton | sans ça le bouton se lit « Rock R », à cause de la touche `<kbd>R>` écrite dedans |
| `role="status"` + `aria-live="polite"` | annonce le résultat à un lecteur d'écran quand il change | la zone est mise à jour en JavaScript, donc sans `aria-live` un malvoyant ne saurait jamais s'il a gagné |
| `<kbd>` | balise dédiée à une touche du clavier | elle rend déjà avec un style, on l'a juste ajusté |
| `<span class="key-hint">` autour des `<kbd>` | regroupe l'indice clavier | ça permet de le cacher d'un seul coup sur téléphone, où il n'y a pas de clavier |
| `<svg>` du bouton Reset | l'icône est dessinée en vectoriel dans la page | pas d'image à charger, et la couleur suit le texte grâce à `currentColor` |
| `hidden` sur le badge série | cache le badge au départ | on le remet à `false` dès qu'il y a 2 victoires de suite |

---

## style.css

Le fichier est organisé dans cet ordre : **les variables → la page → les
composants → le thème clair → les petites fenêtres.** Le thème clair est
tout en bas, et c'est une liste de valeurs, pas une copie du fichier.

| Ce qui est utilisé | À quoi ça sert | S'ils insistent |
| --- | --- | --- |
| `* { box-sizing: border-box }` | la largeur d'une boîte inclut son padding et sa bordure | sinon `padding: 18px` sur un panneau de 380px le ferait déborder |
| `:root { … }` : une seule grande liste | toutes les couleurs et toutes les mesures nommées une fois | c'est la source unique de vérité : changer `--teal-rgb` change la page entière, les deux thèmes compris |
| `--pad --gap --label --body --radius --pill` | 6 mesures globales | évite de répéter `18px` et `999px` partout ; un chiffre n'existe qu'à un seul endroit |
| `--teal-rgb: 62 224 196` + `rgb(var(--teal-rgb) / .14)` | couleur stockée en trois nombres | voir question 10 |
| `--panel-bg --wash --wash-strong --inset --chip-bg --vs-bg` | ce dont les boîtes sont peintes | un nom par **rôle** (« une boîte au repos », « la même survolée ») plutôt qu'un nom par couleur : le thème clair n'a qu'à redéfinir le rôle |
| `--edge: .55` | force du soulignement coloré d'une tuile | en clair on passe à `1` parce que les accents sont déjà foncés |
| `--accent` posé sur un élément | couleur locale d'un état ou d'un camp | voir question 11 |
| `:root[data-theme="light"] { … }` | le thème clair | **zéro sélecteur de la page** à l'intérieur : uniquement les mêmes noms avec des valeurs pâles. Si on ajoute une règle demain, elle marche dans les deux thèmes sans rien écrire de plus |
| `color-scheme: dark` / `light` | dit au navigateur que la page est sombre ou claire | ses contrôles — barre de défilement, sélection — suivent au lieu de rester blancs |
| `radial-gradient(...)` | halo de couleur en haut à gauche et en bas à droite | c'est ce qui donne le fond ; on peut le remplacer par une couleur plate sans casser le jeu |
| trois fonds séparés par des virgules | le premier est au-dessus, le dernier en dessous | l'ordre compte : les dégradés colorés passent avant le fond gris |
| `background-attachment: fixed` | le fond ne bouge pas quand on scrolle | repassé à `scroll` sous 900 px : `fixed` force le téléphone à redessiner tout le fond à chaque frame |
| `min-height: 100vh` | la page occupe au moins un écran | `vh` = hauteur du viewport, donc 100vh = une pleine hauteur d'écran |
| `max-width` + `margin: 0 auto` | limite la largeur et centre le bloc | c'est la façon classique de centrer un conteneur |
| `:focus-visible` | anneau de focus au clavier seulement | `:focus` l'afficherait aussi au clic de souris, ce qui est moche |
| `display: flex` | aligne des éléments sur une ligne ou une colonne | utilisé pour les barres, les en-têtes de panneau et les tuiles |
| `align-items` / `justify-content` | centrage vertical et horizontal dans un flex | les deux axes sont perpendiculaires |
| `gap` | espace entre les enfants d'un flex ou d'une grille | remplace les marges négatives et les `:last-child` |
| `flex: 1` | cet élément prend l'espace restant | dans l'aire de jeu, la zone des mains grandit et le résultat reste en bas |
| `flex-wrap: wrap` sur la topbar | la barre passe sur deux lignes si c'est trop étroit | c'est ce qui évite un débordement sur téléphone sans écrire de media query |
| `margin-top: auto` | pousse un élément flex tout en bas | c'est ce qui colle le conseil « Every round counts » au bas du panneau |
| `display: grid` + `grid-template-areas` | pose la page par noms de zones | trois panneaux empilés à gauche doivent s'aligner avec une seule aire haute à droite : avec des noms (`"score arena"`) c'est lisible |
| les mêmes noms réécrits en colonne sous 900 px | `"score" "arena" "choices" "rules"` | la disposition téléphone tient en 4 lignes, aucun HTML changé |
| `1fr` | une fraction de l'espace libre | `380px 1fr` = colonne gauche fixe, colonne droite qui prend le reste |
| `repeat(3, 1fr)` | trois colonnes égales | le score et les trois boutons |
| `position: relative` + `absolute` | place un enfant par rapport à son parent | c'est comment la petite touche `R` est collée en haut à droite du bouton |
| `[data-state="win"]` | cible l'élément selon son attribut | voir question 4 |
| `.result:not([data-state="idle"])` | tout sauf l'état initial | une seule règle peint les trois résultats ; « idle » garde son fond neutre |
| `.choice.is-selected` | un élément qui porte deux classes | met en évidence le bouton qu'on a cliqué |
| `.course-chip, .pill { … }` | deux classes dans un même sélecteur | ce sont exactement le même petit badge rond : on écrit ses mesures une fois, puis chaque classe n'ajoute que ce qui lui est propre |
| `:hover` / `:active` / `:disabled` | état survol / clic en cours / désactivé | le bouton se désactive pendant l'animation pour bloquer le double-clic |
| `min-height: 44px` sur les boutons (sous 900 px) | hauteur tactile minimale | 44 px est la taille recommandée pour une cible au doigt |
| `.word + .word` | seulement les mots qui suivent un autre mot | donne l'espacement entre les mots, mais pas avant le premier |
| `filter: drop-shadow()` | ombre qui épouse la forme de l'emoji | `box-shadow` dessinerait un rectangle ; un emoji n'est pas rectangulaire |
| `box-shadow: 0 30px 70px -42px` | ombre portée : décalage x, décalage y, flou, étalage négatif | la valeur négative rend l'ombre plus petite que la boîte |
| `inset 3px 0 0 rgb(var(--accent))` | ombre à l'intérieur de la boîte | c'est le trait vertical coloré sur le bord du résultat |
| `letter-spacing: -.035em` | resserre les lettres du grand titre | sur du texte très gros, l'espacement normal paraît trop large |
| `em` (dans `height: 1.12em`) | unité relative à la taille du texte | l'emoji garde la même proportion quelle que soit sa taille |
| `font: 600 13px/1 var(--display)` | raccourci : graisse, taille, interlignage, famille | les boutons n'héritent pas la police tout seuls, il faut la leur redonner |
| `font-variant-numeric: tabular-nums` | tous les chiffres ont la même largeur | sans ça le score « 11 » est plus étroit que « 00 » et les chiffres sautillent à chaque manche |
| `@keyframes` + `animation` | décrit une animation par étapes | `handShake` fait trembler les mains, `handReveal` fait apparaître le coup de l'ordinateur |
| `transition` | douce entre deux états, sans image clé | le survol du bouton, le changement de couleur du résultat |
| `border-radius: var(--pill)` (`999px`) | un rayon énorme donne une forme de pilule | plus simple que de calculer la moitié de la hauteur |
| `@media (max-width: 1080px)` | étape intermédiaire | il n'y a plus assez de place pour le grand titre à côté de l'intro : on le réduit seulement |
| `@media (max-width: 900px)` | la disposition téléphone | une colonne, gros chiffres réduits, indice clavier caché |
| `.streak-pill[hidden] { display: none }` | rend `hidden` efficace | **cette ligne est indispensable** : notre `.pill { display: inline-flex }` est plus prioritaire que la règle `hidden` du navigateur, donc sans elle le badge resterait visible |

---

## script.js

Le fichier est numéroté de 1 à 8 dans le code, et c'est l'ordre à suivre à l'oral :
**1** les données du jeu → **2** les raccourcis vers le HTML → **3** l'affichage
d'une main → **4** l'affichage du texte et des scores → **5** le déroulement d'un
tour → **6** la remise à zéro → **7** le thème → **8** le branchement des boutons,
du clavier et le démarrage.

Il n'y a que **cinq fonctions** : `setHand`, `updateScreen`, `playRound`,
`resetGame`, `setTheme`. Tout le reste est du branchement.

| Ce qui est utilisé | À quoi ça sert | S'ils insistent |
| --- | --- | --- |
| `const` / `let` | `const` ne peut pas être réassigné, `let` le peut | `const` pour tout ce qui ne change jamais (la table `MOVES`, les raccourcis DOM) ; `let` pour les sept variables du jeu (`win, lose, draw, round, streak, busy, timer`) |
| `MOVES` (objet d'objets) | une seule table qui contient emoji, nom, ce que le coup bat, et le verbe | ça évite trois `if` différents pour chaque coup |
| `(id) => document.getElementById(id)` | fonction fléchée, écriture courte d'une fonction | équivalent à `function byId(id) { return document.getElementById(id); }` |
| `const root = document.documentElement` | la balise `<html>` | c'est elle qui porte `data-theme`, pour que toute la page change d'un coup |
| `querySelectorAll(".choice")` | les trois boutons d'un coup | ça renvoie une **NodeList**, pas un tableau ; elle possède déjà `.forEach()`, c'est tout ce qu'on lui demande |
| `byId(side + "Hand")` | construit le nom de l'élément | `side` vaut `"player"` ou `"cpu"`, donc une seule fonction `setHand()` s'occupe des deux mains au lieu d'en écrire deux |
| `const data = MOVES[move]` | lit la table | si `move` vaut `null`, `MOVES[null]` donne `undefined` sans erreur : c'est exactement ce qui distingue « la main est vide » de « la main est jouée » |
| `` `${p.name} ${p.verb} ${c.name.toLowerCase()}.` `` | modèle de chaîne : on insère des valeurs dans du texte | avec des `+` ça marcherait aussi, mais c'est plus lisible |
| `? ... : ...` (ternary) | un `if` court qui renvoie une valeur | `theme === "dark" ? "🌙 Dark" : "☀️ Light"` pour le libellé du bouton |
| `fallback = "Waiting…"` | valeur par défaut d'un paramètre | si l'appelant ne donne pas de texte, on prend celui-ci ; `setHand("cpu", null, "Thinking…")` en donne un autre |
| `Boolean(data)` | transforme n'importe quelle valeur en vrai/faux | `classList.toggle()` attend un booléen : `undefined` tout seul marcherait aussi, mais l'écrire dit clairement l'intention |
| `classList.toggle("is-known", Boolean(data))` | ajoute la classe si c'est vrai, l'enlève sinon | la version avec booléen remplace un `if / else` de quatre lignes |
| `++round` | ajoute 1 **puis** renvoie la nouvelle valeur | `byId("roundNum").textContent = ++round` fait le compte et l'affichage sur une seule ligne |
| `win = lose = draw = round = streak = 0` | affectation en chaîne | elle se lit de droite à gauche : le 0 passe d'une variable à la suivante. Une ligne au lieu de cinq |
| `.textContent` | change le texte d'un élément | on n'utilise jamais `innerHTML`, donc aucun risque d'injecter du HTML |
| `.className = "hand-emoji"` | remplace toute la liste des classes | plus simple que trois `classList.remove()` pour repartir d'un état propre |
| `btn.disabled = true` | grise le bouton | avec `busy`, c'est la double protection contre le double-clic |
| `timer = setTimeout(() => { … }, 650)` | lance un bloc de code plus tard, et garde son numéro | ce bloc se souvient de `playerMove` : c'est une fermeture (closure) |
| `clearTimeout(timer)` | annule le délai en attente | voir question 6 |
| `updateScreen(status, title, sub)` | une seule fonction pour la bannière **et** les scores | le JavaScript ne connaît aucune couleur : il écrit `data-state`, et c'est le CSS qui choisit le vert, le rouge ou l'or |
| `matchMedia("(prefers-color-scheme: light)").matches` | lit le réglage sombre/clair du système | utilisé une seule fois, dans le `<head>`, pour la valeur de départ |
| `getComputedStyle(root).getPropertyValue("--bg")` | relit une variable CSS depuis JavaScript | la barre du navigateur prend ainsi exactement la couleur du fond, sans écrire deux fois la valeur hexadécimale |
| `document.onkeydown = ...` | écoute le clavier sur toute la page | les touches R, P et S jouent un coup |
| `e.preventDefault()` | empêche le comportement par défaut de la touche | une lettre simple n'a presque pas d'effet par défaut ici : c'est une précaution, pour que le raccourci reste propre si on ajoutait un champ de saisie plus tard |
| `e.ctrlKey / metaKey / altKey` | détecte une touche de modification | sans ce contrôle, Ctrl+R (recharger) serait capté par notre raccourci « R » |
| `e.repeat` | vrai quand on garde la touche enfoncée | évite d'enchaîner les tours tout seuls |
| `if (!move \|\| e.repeat \|\| ...) return` | toutes les raisons d'ignorer la touche sur une seule ligne | `\|\|` s'arrête dès la première condition vraie (court-circuit) |
| `if (busy) return` | sortie anticipée | un tour à la fois ; le reste de la fonction ne s'exécute pas |

---

## Ce qu'on n'a volontairement pas utilisé

À dire si on vous demande pourquoi le code est simple :

- aucune bibliothèque ni framework : pas de jQuery, pas de Bootstrap, pas de build ;
- pas de `localStorage` : ni la partie ni le thème choisi ne survivent à un
  rechargement, c'est un choix assumé pour un mini-projet ;
- pas de `class`, pas de `async/await`, pas de `fetch` : rien à expliquer qui sorte du cours ;
- pas de `prefers-color-scheme` dans le CSS : il est lu une seule fois en JavaScript,
  sinon le bouton ne pourrait pas contredire le système (voir question 8) ;
- pas de `color-mix()` : c'est récent, et `rgb(var(--teal-rgb) / .14)` fait la même chose ;
- pas de `!important`, pas de sélecteurs par `nth-child`, pas de code commenté mort ;
- une déclaration par ligne, pour pouvoir pointer n'importe quelle ligne et dire ce qu'elle fait.

## Les limites à connaître

À énoncer vous-même avant qu'on vous les reproche — c'est ce qui montre que le
périmètre est maîtrisé :

1. **Le thème n'est pas mémorisé.** Un rechargement repart du réglage du système.
   Il faudrait `localStorage`, qu'on a écarté volontairement.
2. **La page ne suit pas un changement du système en direct.** La préférence est lue
   une fois au chargement. Écouter `matchMedia(...).addEventListener("change", …)`
   suffirait, mais ça écraserait un choix fait au bouton.
3. **Les polices viennent de Google Fonts.** Hors ligne, le repli système prend le
   relais et la mise en page reste correcte, mais le dessin des lettres change.
4. **Le jeu n'a pas de fin** : pas de score cible, pas de « meilleur des 5 ».
   Le compteur de série est la seule notion de progression.
5. **Aucun test automatisé.** La vérification est manuelle : les 9 combinaisons de
   coups, le clavier (R/P/S, majuscule, Ctrl+R, touche maintenue), les deux thèmes
   et six largeurs (1440, 1080, 900, 768, 390, 320 px).

Si on vous demande ce que vous ajouteriez en premier : mémoriser le thème, puis
un score cible avec un écran de fin.
