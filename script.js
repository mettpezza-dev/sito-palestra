import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAtTmXvO-Yw3QPVdYoJHzpD9fxkSa7Lh38",
  authDomain: "sito-palestra-cc12b.firebaseapp.com",
  projectId: "sito-palestra-cc12b",
  storageBucket: "sito-palestra-cc12b.firebasestorage.app",
  messagingSenderId: "1013413987903",
  appId: "1:1013413987903:web:4637a92569a50c78fbda8a",
  measurementId: "G-W6ZT9KG5EZ"
};

// Inizializza Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const scheda = [
  { id: "ex1", esercizio: "Leg Press 45°", serie: "3", rep: "10-12", recupero: "90s" },
  { id: "ex2", esercizio: "Lat Machine avanti", serie: "3", rep: "10-12", recupero: "90s" },
  { id: "ex3", esercizio: "Push-up facilitati", serie: "3", rep: "8-10", recupero: "90s" },
  { id: "ex4", esercizio: "Pulley Basso", serie: "3", rep: "10-12", recupero: "90s" },
  { id: "ex5", esercizio: "Plank addominale", serie: "3", rep: "30 sec", recupero: "60s" }
];

let appData = {
  carichi: {},
  workouts: []
};

// Riferimento al documento del database per la tua ragazza
const docRef = doc(db, "utenti", "ragazza_data");

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

// Carica i dati salvati su Firebase Firestore
async function caricaDatiFirebase() {
  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      appData = snap.data();
      if (!appData.carichi) appData.carichi = {};
      if (!appData.workouts) appData.workouts = [];
    }
  } catch (e) {
    console.error("Errore caricamento dati Firebase:", e);
  }
}

// Salva lo stato corrente su Firebase
async function salvaDatiFirebase() {
  try {
    await setDoc(docRef, appData);
  } catch (e) {
    console.error("Errore salvataggio Firebase:", e);
  }
}

function caricaScheda() {
  const container = document.getElementById("workout-list");
  container.innerHTML = "";

  scheda.forEach(item => {
    const caricoSalvato = appData.carichi[item.id] || "";

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
        <input type="number" id="input-${item.id}" placeholder="Kg" value="${caricoSalvato}">
        <button class="btn-save" id="btn-save-${item.id}">Salva</button>
      </div>
      <span id="msg-${item.id}" class="saved-tag"></span>
    `;
    container.appendChild(card);

    document.getElementById(`btn-save-${item.id}`).addEventListener("click", () => salvaCarico(item.id));
  });
}

async function salvaCarico(id) {
  const valore = document.getElementById(`input-${id}`).value;
  if (valore !== "") {
    appData.carichi[id] = valore;
    await salvaDatiFirebase();
    const msg = document.getElementById(`msg-${id}`);
    msg.textContent = "✓ Salvato su Cloud!";
    setTimeout(() => { msg.textContent = ""; }, 2000);
  }
}

function renderCalendario() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", 
                      "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  
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

function exportToIPhoneCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  const startDate = `${year}${month}${day}T180000`;
  const endDate = `${year}${month}${day}T193000`;

  const icsData = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FitTracker//IT
BEGIN:VEVENT
SUMMARY:🏋️‍♀️ Allenamento Total Body - Gym
DESCRIPTION:Sessione di allenamento completata tramite FitTracker App.
DTSTART:${startDate}
DTEND:${endDate}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'allenamento.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById("complete-btn").addEventListener("click", toggleTodayWorkout);
document.getElementById("export-ics-btn").addEventListener("click", exportToIPhoneCalendar);

document.getElementById("logout-btn").addEventListener("click", function() {
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("login-container").classList.remove("hidden");
});
