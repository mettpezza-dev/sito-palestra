import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAtTmXvO-Yw3QPVdYoJHzpD9fxkSa7Lh38",
  authDomain: "sito-palestra-cc12b.firebaseapp.com",
  projectId: "sito-palestra-cc12b",
  storageBucket: "sito-palestra-cc12b.firebasestorage.app",
  messagingSenderId: "1013413987903",
  appId: "1:1013413987903:web:4637a92569a50c78fbda8a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const docRef = doc(db, "utenti", "ragazza_data");

let schedaDefault = [
  { id: "ex1", esercizio: "Leg Press 45°", serie: "3", rep: "10-12", recupero: "90s", target: "Obiettivo: +1kg quando completi 12 reps nell'ultima serie" },
  { id: "ex2", esercizio: "Lat Machine avanti", serie: "3", rep: "10-12", recupero: "90s", target: "Obiettivo: Focus sulla contrazione schiena" },
  { id: "ex3", esercizio: "Push-up facilitati", serie: "3", rep: "8-10", recupero: "90s", target: "Obiettivo: Arriva a 10 reps pulite prima di caricare" },
  { id: "ex4", esercizio: "Pulley Basso", serie: "3", rep: "10-12", recupero: "90s", target: "Obiettivo: Mantieni petto aperto" },
  { id: "ex5", esercizio: "Plank addominale", serie: "3", rep: "30 sec", recupero: "60s", target: "Obiettivo: Aumenta di +5 sec ogni settimana" }
];

let appData = {
  scheda: schedaDefault,
  storicoCarichi: {}, // Struttura: { idEsercizio: [ {data: "2026-09-04", kg: "15"}, ... ] }
  workouts: []
};

document.getElementById("login-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "ragazza" && pass === "gym2026") {
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    await caricaDatiFirebase();
    caricaScheda();
    renderCalendario();
  } else {
    document.getElementById("login-error").textContent = "Credenziali errate!";
  }
});

async function caricaDatiFirebase() {
  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.scheda && data.scheda.length > 0) appData.scheda = data.scheda;
      if (data.storicoCarichi) appData.storicoCarichi = data.storicoCarichi;
      if (data.workouts) appData.workouts = data.workouts;
    }
  } catch (e) { console.error("Errore Firebase:", e); }
}

async function salvaDatiFirebase() {
  try { await setDoc(docRef, appData); } catch (e) { console.error("Errore salvataggio:", e); }
}

function caricaScheda() {
  const container = document.getElementById("workout-list");
  container.innerHTML = "";

  appData.scheda.forEach(item => {
    const storia = appData.storicoCarichi[item.id] || [];
    const ultimoPeso = storia.length > 0 ? storia[storia.length - 1].kg : "";

    let htmlStorico = storia.slice(-3).reverse().map(h => `<small style="display:block; color:#6B7280;">📅 ${h.data}: <strong>${h.kg} kg</strong></small>`).join("");

    const card = document.createElement("div");
    card.className = "exercise-card";
    card.innerHTML = `
      <div class="exercise-title">${item.esercizio}</div>
      <div class="exercise-specs">
        <span>🔄 ${item.serie} Serie</span>
        <span>🎯 ${item.rep} Reps</span>
      </div>
      ${item.target ? `<div style="font-size:11px; color:#4F46E5; font-weight:600; margin-bottom:8px;">🎯 ${item.target}</div>` : ''}
      <div class="tracker-row">
        <input type="number" id="input-${item.id}" placeholder="Kg oggi" value="${ultimoPeso}">
        <button class="btn-save" id="btn-save-${item.id}">Salva Sessione</button>
      </div>
      <div style="margin-top:8px;">${htmlStorico}</div>
      <span id="msg-${item.id}" class="saved-tag"></span>
    `;
    container.appendChild(card);

    document.getElementById(`btn-save-${item.id}`).addEventListener("click", () => salvaCarico(item.id));
  });
}

async function salvaCarico(id) {
  const valore = document.getElementById(`input-${id}`).value;
  if (valore !== "") {
    const today = new Date().toISOString().split('T')[0];
    if (!appData.storicoCarichi[id]) appData.storicoCarichi[id] = [];
    
    appData.storicoCarichi[id].push({ data: today, kg: valore });
    await salvaDatiFirebase();
    caricaScheda();
  }
}

function renderCalendario() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  
  document.getElementById("calendar-month-year").textContent = `${monthNames[month]} ${year}`;

  const todayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthCount = appData.workouts.filter(d => d.startsWith(currentMonthPrefix)).length;
  
  document.getElementById("workout-count").textContent = `${monthCount} allenamenti`;

  const completeBtn = document.getElementById("complete-btn");
  if (appData.workouts.includes(todayStr)) {
    completeBtn.textContent = "✓ Allenamento Oggi Registrato!";
    completeBtn.classList.add("done");
  } else {
    completeBtn.textContent = "✅ Completa Allenamento Oggi";
    completeBtn.classList.remove("done");
  }

  const grid = document.getElementById("calendar-days");
  grid.innerHTML = "";

  const firstDayIndex = new Date(year, month, 1).getDay();
  const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < adjustedFirstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "day-cell empty";
    grid.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayCell = document.createElement("div");
    dayCell.className = "day-cell";
    dayCell.textContent = day;

    if (day === now.getDate()) dayCell.classList.add("today");
    if (appData.workouts.includes(dayStr)) dayCell.classList.add("worked-out");

    grid.appendChild(dayCell);
  }
}

async function toggleTodayWorkout() {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  if (appData.workouts.includes(todayStr)) {
    appData.workouts = appData.workouts.filter(d => d !== todayStr);
  } else {
    appData.workouts.push(todayStr);
  }

  await salvaDatiFirebase();
  renderCalendario();
}

document.getElementById("complete-btn").addEventListener("click", toggleTodayWorkout);
document.getElementById("logout-btn").addEventListener("click", () => location.reload());
