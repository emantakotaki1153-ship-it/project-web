# Pierre · Papier · Ciseaux — mini-projet web

Jeu **Rock, Paper, Scissors** en site web statique, réalisé dans le cadre du module
**Programmation Web 1** (Filière Informatique, S3, Groupe 2 — Faculté des Sciences
Semlalia, Université Cadi Ayyad).

## Équipe

| Membre | Apogée | Code |
| --- | --- | --- |
| Imane TAKERDOUST | 2226466 | G130691153 |
| Nizar TAJ DINE | 2333190 | G132615242 |

## Lancer le projet

Aucune installation n’est nécessaire :

1. ouvrir `index.html` dans un navigateur récent (Chrome, Edge, Firefox) ;
2. ou servir le dossier avec un petit serveur local :

```bash
python -m http.server 8000
```

puis ouvrir <http://localhost:8000>.

## Fonctionnalités

- choix de **Rock**, **Paper** ou **Scissors** avec les boutons ou les touches `R`, `P`, `S` ;
- tirage aléatoire du coup de l’ordinateur ;
- affichage du résultat (gagné, perdu, égalité) avec une animation de révélation ;
- compteur des victoires, des défaites et des égalités, avec remise à zéro ;
- série de victoires consécutives (badge « in a row ») ;
- interface responsive (ordinateur, tablette, téléphone) ;
- accessibilité : navigation au clavier, `aria-live`, respect de `prefers-reduced-motion`.

## Fichiers

```text
index.html                       structure de la page
style.css                        design, responsive, animations
script.js                        logique du jeu et interactions
assets/
  diagramme-cas-utilisation.svg  diagramme UML de cas d’utilisation (source)
  diagramme-cas-utilisation.png  export pour le rapport
  diagramme-sequence.svg         diagramme UML de séquence (source)
  diagramme-sequence.png         export pour le rapport
  logo-header.jpg                logo de l’université (page de garde du rapport)
screenshots/                     captures d’écran utilisées dans le rapport
Rapport_Mini_Projet_RPS.docx     rapport en français
```

## Technologies

- **HTML5** : structure sémantique, boutons, zones `aria-live` ;
- **CSS3** : variables, grilles, `clamp()`, animations, media queries ;
- **JavaScript (ES6)** : état de la partie, tirage aléatoire, arbitrage, DOM, minuteries ;
- aucune bibliothèque ni framework : le site fonctionne hors ligne (les polices
  Google Fonts ont un repli système) ;
- code volontairement compact et simple à expliquer : **49 lignes de JavaScript**
  et **213 lignes de CSS**.

## Tests

Les scénarios de victoire, défaite, égalité, clavier, série, aperçu, double-clic
rapide et réinitialisation ont été vérifiés dans Chrome. Le détail figure dans la
section « Tests et validation » du rapport.
