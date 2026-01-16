
let nombreSecret;
let essais = 0;
let startTime;
let playerNameGlobal;
document.addEventListener("DOMContentLoaded", () => {
    console.log("JS prêt !");
    const form = document.getElementById("startGameForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const inputName = document.getElementById("playerName");
            if (inputName && inputName.value.trim() !== "") {
                const name = inputName.value.trim();
             
                window.location.href = "jeu.html?player=" + encodeURIComponent(name);
            }
        });
    }
    const btnCaillou = document.getElementById("admireCaillou");
    if (btnCaillou) {
        btnCaillou.addEventListener("click", () => {
            window.location.href = "caillou.html";
        });
    }
    const playerSpan = document.getElementById("playerDisplay");
    if (playerSpan) {
        const params = new URLSearchParams(window.location.search);
        playerNameGlobal = params.get("player") || "Joueur";
        playerSpan.textContent = playerNameGlobal;
        updateScoreboard();
        document.getElementById("startGame").addEventListener("click", preparerJeu);
        document.getElementById("submitGuess").addEventListener("click", verifierDevinette);
        document.getElementById("guessInput").addEventListener("keypress", (e) => {
            if (e.key === "Enter") verifierDevinette();
        });
    }
});
function preparerJeu() {
    nombreSecret = Math.floor(Math.random() * 1000);
    essais = 0;
    startTime = performance.now();
    document.getElementById("gameZone").style.display = "block";
    document.getElementById("startGame").style.display = "none";
    document.getElementById("feedback").textContent = "";
    document.getElementById("guessInput").value = "";
    document.getElementById("guessInput").focus();
}
function verifierDevinette() {
    const input = document.getElementById("guessInput");
    const feedback = document.getElementById("feedback");
    const val = parseInt(input.value);
    if (isNaN(val)) return;
    essais++;
    if (val === nombreSecret) {
        const endTime = performance.now();
        const timeElapsed = ((endTime - startTime) / 1000).toFixed(3); 
        feedback.style.color = "green";
        feedback.textContent = `Bravo ! Trouvé en ${essais} essais et ${timeElapsed}s.`;
        saveScore(playerNameGlobal, parseFloat(timeElapsed));
        updateScoreboard();
        setTimeout(() => {
            document.getElementById("gameZone").style.display = "none";
            document.getElementById("startGame").style.display = "block";
            document.getElementById("startGame").textContent = "Rejouer";
        }, 3000);
    } else {
        feedback.style.color = "red";
        feedback.textContent = val > nombreSecret ? "C'est MOINS !" : "C'est PLUS !";
        input.value = "";
        input.focus();
    }
}
function saveScore(name, time) {
    let scores = JSON.parse(localStorage.getItem("topScores")) || [];
    const existingIndex = scores.findIndex(s => s.name.toLowerCase() === name.toLowerCase());
    if (existingIndex !== -1) {
        if (time < scores[existingIndex].time) {
            scores[existingIndex].time = time;
        }
    } else {
        scores.push({ name, time });
    }
    scores.sort((a, b) => a.time - b.time);
    localStorage.setItem("topScores", JSON.stringify(scores.slice(0, 100)));
}
function updateScoreboard() {
    const tbody = document.querySelector("#scoreboard tbody");
    if (!tbody) return;
    const scores = JSON.parse(localStorage.getItem("topScores")) || [];
    tbody.innerHTML = scores.map((s, i) => 
        `<tr><td>${i+1}</td><td>${s.name}</td><td>${s.time.toFixed(3)}s</td></tr>`
    ).join("");
}
