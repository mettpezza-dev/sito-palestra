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

let schedaVistaCorrente = "Giorno 1";
let dataSelezionata = new Date().toISOString().split('T')[0];

let appData = {
  schede: {
    "Giorno 1": [
      { id: "g1_ex1", esercizio: "Leg Press 45°", serie: "3", rep: "10-12", recupero: "90s", descrizione: "Focus sui quadricipiti. Spingi con tutto il piede senza staccare i talloni." },
      { id: "g1_ex2", esercizio: "Lat Machine Avanti", serie: "3", rep: "10-12", recupero: "90s", descrizione: "Tira la sbarra al petto petto in fuori, controlla il ritorno lento." }
    ],
    "Giorno 2": [
      { id: "g2_ex1", esercizio: "Push-up Facilitati", serie: "3", rep: "8-10", recupero: "90s", descrizione: "Mani poco più larghe delle spalle, addome e glutei contratti." },
      { id: "g2_ex2", esercizio: "Pulley Basso", serie: "3", rep: "10-12", recupero: "90s", descrizione: "Mantieni la schiena dritta e adduci le scapole alla fine del movimento." }
    ],
    "Giorno 3": [
      { id: "g3_ex1", esercizio: "Affondi sul posto", serie: "3", rep: "10", recupero: "90s", descrizione: "Passo lungo, ginocchio posteriore sfiora il pavimento." },
      { id: "g3_ex2", esercizio: "Plank Addominale", serie: "3", rep: "30 sec", recupero: "60s", descrizione: "Mantenere linea retta testa-bacino-talloni." }
    ]
  },
  storicoCarichi: {},
  calendarEvents: {} // Struttura: { "2026-09-04": "Giorno 1" }
};

document.getElementById("login-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  if (document.getElementById("username").value === "ragazza" && document.getElementById("password").value === "gym2026") {
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
      if (data.schede) appData.schede = data.schede;
      if (data.storicoCarichi) appData.storicoCarichi = data.storicoCarichi;
      if (data.calendarEvents) appData.calendarEvents = data.calendarEvents;
    }
  } catch (e) { console.error("Errore caricamento:", e); }
}

async function salvaDatiFirebase() {
  try { await setDoc(docRef, appData); } catch (e) { console.error("Errore salvataggio:", e); }
}

window.cambiaSchedaVista = (giorno) => {
  schedaVistaCorrente = giorno;
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  document.getElementById("current-tab-label").textContent = giorno;
  caricaScheda();
};

function caricaScheda() {
  const container = document.getElementById("workout-list");
  container.innerHTML = "";

  const listaEsercizi = appData.schede[schedaVistaCorrente] || [];

  listaEsercizi.forEach(item => {
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
        <span>⏱️ ${item.recupero}</span>
      </div>
      ${item.descrizione ? `<p style="font-size:12px; color:#4B5563; margin-bottom:8px; line-height:1.4;">📖 <em>${item.descrizione}</em></p>` : ''}
      <div class="tracker-row">
        <input type="number" id="input-${item.id}" placeholder="Kg oggi" value="${ultimoPeso}">
        <button class="btn-save" id="btn-save-${item.id}">Salva Peso</button>
      </div>
      <div style="margin-top:8px;">${htmlStorico}</div>
    `;
    container.appendChild(card);

    document.getElementById(`btn-save-${item.id}`).addEventListener("click", () => salvaCarico(item.id));
  });
}

async function salvaCarico(id) {
  const valore = document.getElementById(`input-${id}`).value;
  if (valore !== "") {
    if (!appData.storicoCarichi[id]) appData.storicoCarichi[id] = [];
    appData.storicoCarichi[id].push({ data: dataSelezionata, kg: valore });
    await salvaDatiFirebase();
    caricaScheda();
  }
}

/* LOGICA CALENDARIO DINAMICO INTERATTIVO */
function renderCalendario() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  
  document.getElementById("calendar-month-year").textContent = `${monthNames[month]} ${year}`;

  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const totalMonthWorkouts = Object.keys(appData.calendarEvents).filter(d => d.startsWith(currentMonthPrefix)).length;
  document.getElementById("workout-count").textContent = `${totalMonthWorkouts} allenamenti`;

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
    dayCell.innerHTML = `<span>${day}</span>`;

    if (dayStr === dataSelezionata) dayCell.classList.add("selected");
    
    if (appData.calendarEvents[dayStr]) {
      dayCell.classList.add("worked-out");
      dayCell.innerHTML += `<span class="tag-giorno">${appData.calendarEvents[dayStr]}</span>`;
    }

    dayCell.addEventListener("click", () => selezionaDataCalendario(dayStr));
    grid.appendChild(dayCell);
  }

  aggiornaUISelezioneData();
}

function selezionaDataCalendario(dateStr) {
  dataSelezionata = dateStr;
  renderCalendario();
}

function aggiornaUISelezioneData() {
  document.getElementById("selected-date-label").textContent = dataSelezionata;
  const workoutPresente = appData.calendarEvents[dataSelezionata];
  const removeBtn = document.getElementById("remove-workout-btn");

  if (workoutPresente) {
    removeBtn.style.display = "block";
    removeBtn.textContent = `❌ Rimuovi ${workoutPresente} da questa data`;
  } else {
    removeBtn.style.display = "none";
  }
}

window.registraWorkoutInData = async (giornoNome) => {
  appData.calendarEvents[dataSelezionata] = giornoNome;
  await salvaDatiFirebase();
  renderCalendario();
};

window.rimuoviWorkoutInData = async () => {
  delete appData.calendarEvents[dataSelezionata];
  await salvaDatiFirebase();
  renderCalendario();
};

document.getElementById("logout-btn").addEventListener("click", () => location.reload());
