// 1. GAME DATA: Each move's emoji, display name, what it beats, and action word
const MOVES = {
  rock:     { emoji: "✊", name: "Rock",     beats: "scissors", verb: "crushes" },
  paper:    { emoji: "✋", name: "Paper",    beats: "rock",     verb: "covers" },
  scissors: { emoji: "✌️", name: "Scissors", beats: "paper",    verb: "cut" }
};
const KEYS = { r: "rock", p: "paper", s: "scissors" };

// 2. HTML SHORTCUTS (Built-in DOM functions that grab elements from the webpage)
const byId = (id) => document.getElementById(id); // Finds an HTML tag by its id=""
const root = document.documentElement;            // Built-in reference to the <html> tag
const buttons = document.querySelectorAll(".choice"); // Finds all tags with class="choice"

// Game variables (given starting values inside resetGame)
let win, lose, draw, round, streak, busy, timer;

// 3. UPDATES HAND DISPLAY: Changes the emoji and text for "player" or "cpu"
function setHand(side, move, fallback = "Waiting…") {
  const data = MOVES[move]; // Gets move info from MOVES (or undefined if move is null)
  byId(side + "Hand").textContent = data ? data.emoji : "?";
  byId(side + "Hand").className = data ? "hand-emoji" : "hand-emoji is-unknown";
  byId(side + "Choice").textContent = data ? data.name : fallback;
  // classList.toggle() is a built-in method: adds class "is-known" if data exists, removes it if not
  byId(side + "Choice").classList.toggle("is-known", Boolean(data));
}

// 4. UPDATES TEXT & SCORES: Changes the center banner and scoreboard numbers
function updateScreen(status, title, sub) {
  byId("result").dataset.state = status;   // .dataset writes to data-state="" in HTML
  byId("resultTitle").textContent = title; // .textContent changes the text inside a tag
  byId("resultSub").textContent = sub;
  byId("playerScore").textContent = win;
  byId("cpuScore").textContent = lose;
  byId("drawScore").textContent = draw;
  byId("streakNum").textContent = streak;
  byId("streakPill").hidden = streak < 2;  // .hidden is a built-in property that hides an element when true
}

// 5. PLAYS A ROUND: Runs top-to-bottom when a player picks a move
function playRound(playerMove) {
  if (busy) return; // Stop if a round is already running
  busy = true;
  byId("roundNum").textContent = ++round; // Adds 1 to round and displays it

  // Show player move, hide computer move, and disable buttons during animation
  setHand("player", playerMove);
  setHand("cpu", null, "Thinking…");
  buttons.forEach((btn) => { // .forEach() is a built-in loop that runs on each button
    btn.disabled = true;     // .disabled is a built-in property that locks a button
    btn.classList.toggle("is-selected", btn.dataset.move === playerMove);
  });

  updateScreen("idle", "Rock… paper… scissors…", "The machine is making its move.");
  byId("arena").classList.add("is-shaking"); // .classList.add() attaches a CSS class

  // setTimeout() is a built-in JS timer: waits 650ms, then runs the code inside
  timer = setTimeout(() => {
    // Math.random() makes a random decimal (0 up to, but never, 1); Math.floor() rounds down to 0, 1, or 2
    const cpuMove = ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)];
    const p = MOVES[playerMove], c = MOVES[cpuMove];

    // Stop shaking and show the computer's chosen hand
    byId("arena").classList.remove("is-shaking");
    setHand("cpu", cpuMove);
    byId("cpuHand").classList.add("is-revealed");

    // Compare moves using simple if/else statements and update the screen
    if (playerMove === cpuMove) {
      draw++;
      streak = 0;
      updateScreen("draw", "It’s a draw!", `Both of you chose ${p.name.toLowerCase()}.`);
    } else if (p.beats === cpuMove) {
      win++;
      streak++;
      updateScreen("win", "You win!", `${p.name} ${p.verb} ${c.name.toLowerCase()}.`);
    } else {
      lose++;
      streak = 0;
      updateScreen("lose", "Computer wins!", `${c.name} ${c.verb} ${p.name.toLowerCase()}.`);
    }

    busy = false;
    buttons.forEach((btn) => btn.disabled = false); // Unlock buttons for the next round
  }, 650);
}

// 6. RESETS THE GAME: Clears timers, scores, and hands back to the start
function resetGame() {
  clearTimeout(timer); // Built-in JS function that stops a running setTimeout timer
  win = lose = draw = round = streak = 0;
  busy = false;

  buttons.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove("is-selected");
  });
  setHand("player", null);
  setHand("cpu", null);
  byId("roundNum").textContent = "—";
  byId("arena").classList.remove("is-shaking");
  updateScreen("idle", "Make your move", "Rock beats scissors, scissors beat paper, paper beats rock.");
}

// 7. CHANGES THEME: Switches between dark and light mode
function setTheme(theme) {
  root.dataset.theme = theme;
  byId("themeBtn").textContent = theme === "dark" ? "🌙 Dark" : "☀️ Light";
  // getComputedStyle() is a built-in function that reads active CSS variables (like --bg)
  document.querySelector('meta[name="theme-color"]').content = getComputedStyle(root).getPropertyValue("--bg").trim();
}

// 8. BUTTON CLICKS, KEYBOARD SHORTCUTS & STARTUP
buttons.forEach((btn) => btn.onclick = () => playRound(btn.dataset.move));
byId("themeBtn").onclick = () => setTheme(root.dataset.theme === "dark" ? "light" : "dark");
byId("resetBtn").onclick = resetGame;

// document.onkeydown is a built-in listener that triggers whenever any key is pressed
document.onkeydown = (e) => {
  const move = KEYS[e.key.toLowerCase()]; // .toLowerCase() is a built-in string method ("R" -> "r")
  if (!move || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  e.preventDefault(); // Built-in method that stops the browser's default action for that key
  playRound(move);
};

setTheme(root.dataset.theme);
resetGame();
