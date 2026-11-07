// 1. LES DONNÉES DU JEU : pour chaque coup, son emoji, son nom, le coup qu'il bat et le verbe
const MOVES = {
  pierre:  { emoji: "✊", name: "La pierre",   beats: "ciseaux", verb: "écrase" },
  feuille: { emoji: "✋", name: "La feuille",  beats: "pierre",  verb: "recouvre" },
  ciseaux: { emoji: "✌️", name: "Les ciseaux", beats: "feuille", verb: "coupent" }
};
const KEYS = { p: "pierre", f: "feuille", c: "ciseaux" };

// 2. LES RACCOURCIS VERS LE HTML (des fonctions du navigateur qui retrouvent les balises)
const byId = (id) => document.getElementById(id);     // retrouve la balise qui porte id="..."
const root = document.documentElement;                // la balise <html> elle-même
const buttons = document.querySelectorAll(".choice");  // toutes les balises qui portent class="choice"

// Les variables du jeu (l'état)
let victoire = 0, defaite = 0, egalite = 0, manche = 0, serie = 0;
let enCours = false;   // vrai pendant qu'une manche est en cours

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
    document.getElementById("result").dataset.state = status; // .dataset écrit dans data-state="" du HTML
    document.getElementById("resultTitle").textContent = title; // .textContent remplace le texte d'une balise
    document.getElementById("resultSub").textContent = sub;
    document.getElementById("playerScore").textContent = win;
    document.getElementById("cpuScore").textContent = lose;
    document.getElementById("drawScore").textContent = draw;
    document.getElementById("streakNum").textContent = streak;
    
    // Remplacement du booléen direct par un if/else classique
    if (streak < 2) {
        document.getElementById("streakPill").hidden = true;
    } else {
        document.getElementById("streakPill").hidden = false;
    }
}

// 5. JOUE UNE MANCHE : tout s'enchaîne de haut en bas à partir du coup choisi
function playRound(playerMove) {
    if (busy === true) {
        return; // une seule manche à la fois
    }
    busy = true;
    
    // Décomposition de l'incrémentation (plus scolaire)
    round = round + 1;
    document.getElementById("roundNum").textContent = round;

    // On montre le coup du joueur, on cache celui de l'ordinateur, on bloque les boutons
    setHand("player", playerMove);
    setHand("cpu", null, "Il réfléchit...");
    
    // Remplacement du .forEach et de la fonction fléchée par une boucle "for" classique
    for (let i = 0; i < buttons.length; i++) {
        let btn = buttons[i];
        btn.disabled = true; // grise le bouton et empêche de cliquer dessus
        
        // Remplacement du classList.toggle(..., condition) par un if/else standard
        if (btn.dataset.move === playerMove) {
            btn.classList.add("is-selected");
        } else {
            btn.classList.remove("is-selected");
        }
    }

    updateScreen("idle", "Pierre… feuille… ciseaux…", "La machine choisit son coup.");
  byId("arena").classList.add("is-shaking"); // .classList.add() ajoute une classe CSS

  // setTimeout() est le minuteur du navigateur : il attend 650 ms, puis exécute le bloc
  timer = setTimeout(() => {
    // Math.random() donne un nombre entre 0 (inclus) et 1 (exclu) ; Math.floor() arrondit vers le bas : 0, 1 ou 2
    const cpuMove = ["pierre", "feuille", "ciseaux"][Math.floor(Math.random() * 3)];
    const p = MOVES[playerMove], c = MOVES[cpuMove];

    // On arrête de secouer les mains et on montre le coup de l'ordinateur
    byId("arena").classList.remove("is-shaking");
    setHand("cpu", cpuMove);

    // On compare les deux coups avec des if / else simples, puis on affiche le résultat
    if (playerMove === cpuMove) {
      draw++;
      streak = 0;
      updateScreen("draw", "Égalité !", `Vous avez tous les deux choisi ${p.name.toLowerCase()}.`);
    } else if (p.beats === cpuMove) {
      win++;
      streak++;
      updateScreen("win", "Tu gagnes !", `${p.name} ${p.verb} ${c.name.toLowerCase()}.`);
    } else {
      lose++;
      streak = 0;
      updateScreen("lose", "L'ordinateur gagne !", `${c.name} ${c.verb} ${p.name.toLowerCase()}.`);
    }

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
