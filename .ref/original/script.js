"use strict";
// Each move: [emoji, label, move it beats, verb]
const MOVES = { rock: ["✊", "Rock", "scissors", "crushes"], paper: ["✋", "Paper", "rock", "covers"], scissors: ["✌️", "Scissors", "paper", "cuts"] };
const NAMES = Object.keys(MOVES), SHORTCUTS = { r: "rock", p: "paper", s: "scissors" };
const $ = (id) => document.getElementById(id), buttons = [...document.querySelectorAll(".choice")];
const state = { win: 0, lose: 0, draw: 0, round: 0, streak: 0, busy: false };
let timer;
const randomMove = () => NAMES[Math.floor(Math.random() * 3)];
const judge = (a, b) => (a === b ? "draw" : MOVES[a][2] === b ? "win" : "lose");
// Show a move in one hand (move = null → hidden hand).
function show(side, move, text = "Waiting…") {
  const hand = $(side + "Hand"), label = $(side + "Choice");
  hand.textContent = move ? MOVES[move][0] : "?";
  hand.className = "hand-emoji" + (move ? "" : " is-unknown");
  label.textContent = move ? MOVES[move][1] : text;
  label.classList.toggle("is-known", Boolean(move));
}
function updateScore() {
  $("playerScore").textContent = state.win; $("cpuScore").textContent = state.lose; $("drawScore").textContent = state.draw;
  $("streakNum").textContent = state.streak; $("streakPill").hidden = state.streak < 2;
}
function finishRound(player) {
  const cpu = randomMove(), outcome = judge(player, cpu);
  state[outcome]++; state.streak = outcome === "win" ? state.streak + 1 : 0;
  $("arena").classList.remove("is-shaking"); show("cpu", cpu); $("cpuHand").classList.add("is-revealed");
  const [winner, loser] = outcome === "win" ? [player, cpu] : [cpu, player];
  $("result").dataset.state = outcome;
  $("resultTitle").textContent = outcome === "win" ? "You win!" : outcome === "lose" ? "Computer wins!" : "It’s a draw!";
  $("resultSub").textContent = outcome === "draw" ? `Both of you chose ${MOVES[player][1].toLowerCase()}.` : `${MOVES[winner][1]} ${MOVES[winner][3]} ${MOVES[loser][1].toLowerCase()}.`;
  updateScore(); state.busy = false; buttons.forEach((b) => (b.disabled = false));
}
function playRound(move) {
  if (state.busy) return;
  state.busy = true; state.round++; $("roundNum").textContent = state.round;
  show("player", move); show("cpu", null, "Thinking…");
  buttons.forEach((b) => { b.disabled = true; b.classList.toggle("is-selected", b.dataset.move === move); });
  $("result").dataset.state = "idle"; $("resultTitle").textContent = "Rock… paper… scissors…"; $("resultSub").textContent = "The machine is making its move.";
  $("arena").classList.add("is-shaking"); timer = setTimeout(() => finishRound(move), 650);
}
function resetGame() {
  clearTimeout(timer); Object.assign(state, { win: 0, lose: 0, draw: 0, round: 0, streak: 0, busy: false });
  buttons.forEach((b) => { b.disabled = false; b.classList.remove("is-selected"); });
  show("player", null); show("cpu", null); $("roundNum").textContent = "—"; $("arena").classList.remove("is-shaking");
  $("result").dataset.state = "idle"; $("resultTitle").textContent = "Make your move"; $("resultSub").textContent = "Rock beats scissors, scissors beat paper, paper beats rock."; updateScore();
}
buttons.forEach((b) => { b.onclick = () => playRound(b.dataset.move); });
document.onkeydown = (e) => { const move = SHORTCUTS[e.key.toLowerCase()]; if (move && !e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); playRound(move); } };
$("resetBtn").onclick = resetGame; resetGame();
