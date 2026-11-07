// 1. LES DONNÉES DU JEU : pour chaque coup, son emoji, son nom, le coup qu'il bat et le verbe
const MOVES = {
  pierre:  { emoji: "✊", name: "La pierre",   beats: "ciseaux", verb: "écrase" },
  feuille: { emoji: "✋", name: "La feuille",  beats: "pierre",  verb: "recouvre" },
  ciseaux: { emoji: "✌️", name: "Les ciseaux", beats: "feuille", verb: "coupent" }
};
const KEYS = { p: "pierre", f: "feuille", c: "ciseaux" };

// 2. LES RACCOURCIS VERS LE HTML (des fonctions du navigateur qui retrouvent les balises)
const byId = (id) => document.getElementById(id);     // retrouve la balise qui porte id="...."
const root = document.documentElement;                // la balise <html> elle-même
const buttons = document.querySelectorAll(".choice");  // toutes les balises qui portent class="choice"

// Les variables du jeu (elles reçoivent leur valeur de départ dans resetGame)
let win, lose, draw, round, streak, busy, timer;

// 3. AFFICHE UNE MAIN : change l'emoji et le texte du joueur ("player") ou de l'ordinateur ("cpu")
function setHand(side, move, fallback = "En attente…") {
  const data = MOVES[move]; // les infos du coup (vaut undefined quand move est null)
  byId(side + "Hand").textContent = data ? data.emoji : "?";
  byId(side + "Hand").className = data ? "hand-emoji" : "hand-emoji is-unknown";
  byId(side + "Choice").textContent = data ? data.name : fallback;
  // classList.toggle() ajoute la classe si le booléen est vrai, et l'enlève sinon
  byId(side + "Choice").classList.toggle("is-known", Boolean(data));
}

// 4. AFFICHE LE TEXTE ET LES SCORES : la bannière du milieu et les trois compteurs
function updateScreen(status, title, sub) {
  byId("result").dataset.state = status;   // .dataset écrit dans data-state="" du HTML
  byId("resultTitle").textContent = title; // .textContent remplace le texte d'une balise
  byId("resultSub").textContent = sub;
  byId("playerScore").textContent = win;
  byId("cpuScore").textContent = lose;
  byId("drawScore").textContent = draw;
  byId("streakNum").textContent = streak;
  byId("streakPill").hidden = streak < 2;  // .hidden masque le badge tant qu'il y a moins de 2 victoires
}

// 5. JOUE UNE MANCHE : tout s'enchaîne de haut en bas à partir du coup choisi
function playRound(playerMove) {
  if (busy) return; // une seule manche à la fois
  busy = true;
  byId("roundNum").textContent = ++round; // ajoute 1 au compteur, puis affiche la nouvelle valeur

  // On montre le coup du joueur, on cache celui de l'ordinateur, on bloque les boutons
  setHand("player", playerMove);
  setHand("cpu", null, "Il réfléchit…");
  buttons.forEach((btn) => { // .forEach() est une boucle : le bloc s'exécute pour chaque bouton
    btn.disabled = true;     // .disabled grise le bouton et empêche de cliquer dessus
    btn.classList.toggle("is-selected", btn.dataset.move === playerMove);
  });

  updateScreen("idle", "Pierre… feuille… ciseaux…", "La machine choisit son coup.");
 
      streak++;
    document.getElementById("arena").classList.add("is-shaking"); // .classList.add() ajoute une classe CSS

    // setTimeout() est le minuteur du navigateur : il attend 650 ms, puis exécute le bloc
    // Remplacement de la fonction fléchée () => par une fonction classique
    timer = setTimeout(function() {
        
        // Décomposition du choix aléatoire pour que la logique soit plus claire
        let options = ["pierre", "feuille", "ciseaux"];
        let randomNum = Math.floor(Math.random() * 3);
        let cpuMove = options[randomNum];
        
        // Séparation des déclarations de variables (plus propre pour un débutant)
        let p = MOVES[playerMove];
        let c = MOVES[cpuMove];

        // On arrête de secouer les mains et on montre le coup de l'ordinateur
        document.getElementById("arena").classList.remove("is-shaking");
        setHand("cpu", cpuMove);

        // On compare les deux coups avec des if / else simples, puis on affiche le résultat
        if (playerMove === cpuMove) {
            draw = draw + 1;
            streak = 0;
            // Remplacement des `backticks` et ${...} par une simple concaténation avec le signe +
            updateScreen("draw", "Égalité !", "Vous avez tous les deux choisi " + p.name.toLowerCase() + ".");
        } else if (p.beats === cpuMove) {
            win = win + 1;
            streak = streak + 1;
            updateScreen("win", "Tu gagnes !", p.name + " " + p.verb + " " + c.name.toLowerCase() + ".");
        } else {
            lose = lose + 1;
            streak = 0;
            updateScreen("lose", "L'ordinateur gagne !", c.name + " " + c.verb + " " + p.name.toLowerCase() + ".");
        }
    }, 650); // Fin du setTimeout avec le délai

    busy = false;
    buttons.forEach((btn) => btn.disabled = false); // on débloque les boutons pour la manche suivante
  }, 650);
}

// 6. REMET LE JEU À ZÉRO : le minuteur, les scores et les mains repartent comme au début
function resetGame() {
  clearTimeout(timer); // annule le minuteur en cours, s'il y en a un
  win = lose = draw = round = streak = 0; // le 0 passe d'une variable à la suivante
  busy = false;

  buttons.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove("is-selected");
  });
  setHand("player", null);
  setHand("cpu", null);
  byId("roundNum").textContent = "—";
  byId("arena").classList.remove("is-shaking");
  updateScreen("idle", "À toi de jouer", "La pierre écrase les ciseaux, les ciseaux coupent la feuille, la feuille recouvre la pierre.");
}

// 7. CHANGE DE THÈME : bascule la page entre sombre et clair
function setTheme(theme) {
  root.dataset.theme = theme;
  byId("themeBtn").textContent = theme === "dark" ? "🌙 Sombre" : "☀️ Clair";
  // getComputedStyle() relit les variables CSS : la barre du navigateur prend la couleur du fond
  document.querySelector('meta[name="theme-color"]').content = getComputedStyle(root).getPropertyValue("--bg").trim();
}

// 8. LES BRANCHEMENTS : les clics, le clavier et le démarrage
buttons.forEach((btn) => btn.onclick = () => playRound(btn.dataset.move));
byId("themeBtn").onclick = () => setTheme(root.dataset.theme === "dark" ? "light" : "dark");
byId("resetBtn").onclick = resetGame;

// document.onkeydown se déclenche à chaque touche pressée, où que l'on soit sur la page
document.onkeydown = (e) => {
  const move = KEYS[e.key.toLowerCase()]; // .toLowerCase() met la lettre en minuscule ("P" devient "p")
  if (!move || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return; // touche inconnue, maintenue, ou raccourci du navigateur
  e.preventDefault(); // empêche le navigateur de faire son action habituelle sur cette touche
  playRound(move);
};

setTheme(root.dataset.theme);
resetGame();
