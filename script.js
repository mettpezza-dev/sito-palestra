const scheda = [
  { id: "ex1", esercizio: "Leg Press 45°", serie: "3", rep: "10-12", recupero: "90s" },
  { id: "ex2", esercizio: "Lat Machine avanti", serie: "3", rep: "10-12", recupero: "90s" },
  { id: "ex3", esercizio: "Push-up facilitati", serie: "3", rep: "8-10", recupero: "90s" },
  { id: "ex4", esercizio: "Pulley Basso", serie: "3", rep: "10-12", recupero: "90s" },
  { id: "ex5", esercizio: "Plank addominale", serie: "3", rep: "30 sec", recupero: "60s" }
];

document.getElementById("login-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "ragazza" && pass === "gym2026") {
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    caricaScheda();
  } else {
    document.getElementById("login-error").textContent = "Credenziali errate!";
  }
});

function caricaScheda() {
  const container = document.getElementById("workout-list");
  container.innerHTML = "";

  scheda.forEach(item => {
    // Recupera il carico precedentemente salvato, se esiste
    const caricoSalvato = localStorage.getItem(`carico_${item.id}`) || "";

    const card = document.createElement("div");
    card.className = "exercise-card";
    card.innerHTML = `
      <div class="exercise-title">${item.esercizio}</div>
      <div class="exercise-specs">
        <span>🔄 ${item.serie} Serie</span>
        <span>🎯 ${item.rep} Reps</span>
        <span>⏱️ ${item.recupero}</span>
      </div>
      <div class="tracker-row">
        <input type="number" id="input-${item.id}" placeholder="Kg usati" value="${caricoSalvato}">
        <button class="btn-save" onclick="salvaCarico('${item.id}')">Salva</button>
      </div>
      <span id="msg-${item.id}" class="saved-tag"></span>
    `;
    container.appendChild(card);
  });
}

function salvaCarico(id) {
  const valore = document.getElementById(`input-${id}`).value;
  if (valore !== "") {
    localStorage.setItem(`carico_${id}`, valore);
    const msg = document.getElementById(`msg-${id}`);
    msg.textContent = "✓ Carico salvato!";
    setTimeout(() => { msg.textContent = ""; }, 2000);
  }
}

document.getElementById("logout-btn").addEventListener("click", function() {
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("login-container").classList.remove("hidden");
});
