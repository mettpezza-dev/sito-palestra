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
let timerInterval = null;
let chartInstance = null;
let serieCompletate = {}; // Traccia le serie per esercizio

let appData = {
  schede: {
    "Giorno 1": [
      { id: "g1_warmup", esercizio: "🔥 RISCALDAMENTO & MOBILITÀ", serie: "1", rep: "10 min", recupero: "-", descrizione: "Tapis roulant 3-5 min + 90/90 Hip Switches (10/lato) + Monster Walks con mini-band (15/lato). Esegui 2 serie di avvicinamento prima dell'esercizio 1." },
      { id: "g1_ex1", esercizio: "B-Stance Hip Thrust al Cavo/Bilanciere", serie: "3", rep: "8-10", recupero: "120s", descrizione: "Posizione asimmetrica. Mentone incassato nello sterno, blocco finale in retroversione del bacino per massimizzare la tensione sul grande gluteo." },
      { id: "g1_ex2", esercizio: "Deficit Bulgarian Split Squat (Busto 45°)", serie: "3", rep: "10-12", recupero: "90s", descrizione: "Piede anteriore su disco da 5kg. Busto inclinato a 45° per sovraccaricare lo stiro profondo del gluteo riducendo lo stress al ginocchio." },
      { id: "g1_ex3", esercizio: "Lat Machine Presa Supina Inversa", serie: "3", rep: "10-12", recupero: "90s", descrizione: "Presa palmi rivolti a te alla larghezza spalle. Tira al petto deprimendo le scapole per attivare le fibre inferiori del gran dorsale." },
      { id: "g1_ex4", esercizio: "Cable Standing Hip Abduction (a 30°)", serie: "3", rep: "12-15", recupero: "60s", descrizione: "Sposta la gamba indietro-diagonale a 30° per ingaggiare il fascio medio del gluteo lungo la sua reale linea anatomica." },
      { id: "g1_ex5", esercizio: "Single-Leg RDL con Manubrio", serie: "3", rep: "10", recupero: "75s", descrizione: "Lavoro monolaterale di stabilità dell'anca per eliminare le asimmetrie di forza tra le due gambe." },
      { id: "g1_ex6", esercizio: "Frog Pumps con Elastico (Finisher)", serie: "3", rep: "20-25", recupero: "45s", descrizione: "Piedi a contatto, ginocchia in fuori con mini-band. Contrazione metabolica veloce ad alto numero di ripetizioni per esaurire il gluteo." },
      { id: "g1_cooldown", esercizio: "🧘 DEFATICAMENTO & RESET", serie: "1", rep: "5 min", recupero: "-", descrizione: "Respirazione diaframmatica a terra (2 min) + Couch Stretch (60s/lato) per decontrarre i flessori dell'anca." }
    ],
    "Giorno 2": [
      { id: "g2_warmup", esercizio: "🔥 RISCALDAMENTO & MOBILITÀ", serie: "1", rep: "10 min", recupero: "-", descrizione: "Cyclette 3 min + Thoracic Rotations (8/lato) + Arm Circles. Esegui 2 serie di avvicinamento prima dell'esercizio 1." },
      { id: "g2_ex1", esercizio: "Incline Chest-Supported Row (Grip Neutro)", serie: "3", rep: "8-10", recupero: "90s", descrizione: "Sdraiata a pancia in giù su panca 30°. Tira i manubri guidando coi gomiti. Tensione isolata su trapezio e romboidi senza carico lombare." },
      { id: "g2_ex2", esercizio: "Landmine Press Monolaterale", serie: "3", rep: "10-12", recupero: "90s", descrizione: "Spinta obliqua con bilanciere ad angolo. Protegge la cuffia dei rotatori e isola la testa anteriore e laterale del deltoide." },
      { id: "g2_ex3", esercizio: "Romanian Deadlift (RDL) al Cavo/Bilanciere", serie: "3", rep: "8-10", recupero: "120s", descrizione: "Hip hinge puro: spingi il bacino indietro mantenendo la schiena neutra. Tensione massimale in allungamento su ischiocrurali e glutei." },
      { id: "g2_ex4", esercizio: "Cable Y-Raise su Panca Inclinata", serie: "3", rep: "12-15", recupero: "60s", descrizione: "Solleva i cavi incrociati a forma di Y sul piano scapolare per isolare i deltoidi senza compressione articolare." },
      { id: "g2_ex5", esercizio: "Face Pulls al Cavo Alto con Extra-Rotazione", serie: "3", rep: "15", recupero: "60s", descrizione: "Tira la corda verso la fronte aprendo i pugni all'esterno. Esercizio posturale per correggere l'atteggiamento di spalle chiuse." },
      { id: "g2_ex6", esercizio: "Overhead Dumbbell Triceps Extension 60°", serie: "3", rep: "12-15", recupero: "60s", descrizione: "Estensione sopra la testa su panca inclinata per porre il capo lungo del tricipite in massimo allungamento anatomico." },
      { id: "g2_cooldown", esercizio: "🧘 DEFATICAMENTO & RESET", serie: "1", rep: "5 min", recupero: "-", descrizione: "Decompressione alla sbarra (Hang passivo 45s) + Stretch pettorali alla parete." }
    ],
    "Giorno 3": [
      { id: "g3_warmup", esercizio: "🔥 RISCALDAMENTO & MOBILITÀ", serie: "1", rep: "10 min", recupero: "-", descrizione: "Camminata inclinata 5 min + 90/90 Hip Switches + Bodyweight Lunges dinamici." },
      { id: "g3_ex1", esercizio: "Zercher Reverse Lunge su Step", serie: "3", rep: "10-12", recupero: "90s", descrizione: "Bilanciere all'incavo dei gomiti, passo indietro da uno step di 5cm. Attivazione sistemica di core, glutei e stabilizzatori." },
      { id: "g3_ex2", esercizio: "Chest Press Bipolare al Cavo", serie: "3", rep: "10-12", recupero: "90s", descrizione: "Spinta controllata con tensione costante su tutto il ROM. Mantiene lo stimolo ipertrofico al petto senza sollecitare le articolazioni." },
      { id: "g3_ex3", esercizio: "Hip Thrust Classico al Bilanciere", serie: "3", rep: "10-12", recupero: "90s", descrizione: "Esercizio cardine di spinta orizzontale per sovraccaricare la massa dei glutei nella fase di accorciamento." },
      { id: "g3_ex4", esercizio: "Cable Lateral Raise (Alzate Laterali Cavo)", serie: "3", rep: "12-15", recupero: "60s", descrizione: "Tensione costante dal basso verso l'alto per massimizzare il lavoro sul deltoide mediale." },
      { id: "g3_ex5", esercizio: "Pallof Press Dinamico Anti-Rotazionale", serie: "3", rep: "12", recupero: "60s", descrizione: "Spingi la maniglia del cavo in avanti stabilizzando il core contro la trazione laterale per la definizione addominale." },
      { id: "g3_ex6", esercizio: "Hammer Curl ai Cavi o Manubri", serie: "3", rep: "12-15", recupero: "60s", descrizione: "Presa neutra a martello per sviluppare il muscolo brachiale e donare forma e definizione alle braccia." },
      { id: "g3_cooldown", esercizio: "🧘 DEFATICAMENTO & RESET", serie: "1", rep: "5 min", recupero: "-", descrizione: "Child's Pose (Posizione del bambino) per 90 secondi + allungamento adduttori." }
    ]
  },
  storicoCarichi: {},
  calendarEvents: {},
  noteEsercizi: {}
};

document.getElementById("login-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  if (document.getElementById("username").value === "Gioia" && document.getElementById("password").value === "gioia2026") {
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
      if (data.storicoCarichi) appData.storicoCarichi = data.storicoCarichi;
      if (data.calendarEvents) appData.calendarEvents = data.calendarEvents;
      if (data.noteEsercizi) appData.noteEsercizi = data.noteEsercizi;
    }
  } catch (e) { console.error("Errore caricamento:", e); }
}

async function salvaDatiFirebase() {
  try { await setDoc(docRef, appData); } catch (e) { console.error("Errore salvataggio:", e); }
}

window.cambiaSchedaVista = (giorno, element) => {
  schedaVistaCorrente = giorno;
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  if (element) element.classList.add("active");
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
    const notaCorrente = appData.noteEsercizi ? (appData.noteEsercizi[item.id] || "") : "";
    const fatte = serieCompletate[item.id] || 0;
    const totali = parseInt(item.serie) || 1;

    let htmlStorico = storia.slice(-3).reverse().map(h => `<small style="display:block; color:#6B7280;">📅 ${h.data}: <strong>${h.kg} kg</strong></small>`).join("");

    const isInfoBlock = item.id.includes("warmup") || item.id.includes("cooldown");
    const querySearch = encodeURIComponent(item.esercizio + " esecuzione corretta biomeccanica");
    const videoSearchUrl = `https://www.youtube.com/results?search_query=${querySearch}`;

    const card = document.createElement("div");
    card.className = "exercise-card";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div class="exercise-title">${item.esercizio}</div>
        ${!isInfoBlock ? `<button class="btn-sm" id="btn-chart-${item.id}" style="background:#EEF2FF; color:#4F46E5; border:1px solid #C7D2FE;">📈 Grafico</button>` : ''}
      </div>
      <div class="exercise-specs">
        <span>🔄 ${item.serie} Serie</span>
        <span>🎯 ${item.rep} Reps</span>
        <span>⏱️ ${item.recupero}</span>
      </div>
      ${item.descrizione ? `<p style="font-size:12px; color:#4B5563; margin-top:6px; margin-bottom:8px; line-height:1.4;">📖 <em>${item.descrizione}</em></p>` : ''}
      
      <div style="margin-bottom:10px;">
        <a href="${videoSearchUrl}" target="_blank" style="display:block; width:100%; text-align:center; background:#4F46E5; color:white; font-weight:600; font-size:12px; padding:8px 0; border-radius:8px; text-decoration:none;">
          🎬 Guarda Video Esecuzione e Angoli ➔
        </a>
      </div>

      ${!isInfoBlock ? `
        <div style="background:#F9FAFB; padding:8px; border-radius:8px; margin-bottom:8px; border:1px solid #E5E7EB;">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600; color:#374151; margin-bottom:4px;">
            <span>Progresso Serie:</span>
            <span id="series-count-${item.id}" style="color:#4F46E5;">${fatte} di ${totali} completate</span>
          </div>
        </div>

        <div class="tracker-row">
          <input type="number" id="input-${item.id}" placeholder="Kg oggi" value="${ultimoPeso}">
          <button class="btn-save" id="btn-save-${item.id}">Salva Serie & Timer ⏱️</button>
          <button type="button" class="btn-reset-serie" onclick="resettaSerieEsercizio('${esercizio.id}')" title="Annulla/Resetta serie" style="background:#f3f4f6; border:1px solid #d1d5db; border-radius:50%; width:32px; height:32px; cursor:pointer; margin-left:8px; font-size:16px;">↺</button>
        </div>
        
        <div style="margin-top:8px;">
          <input type="text" id="note-${item.id}" placeholder="📝 Note macchinario / sensazioni..." value="${notaCorrente}" style="width:100%; padding:6px 10px; font-size:12px; border:1px solid #D1D5DB; border-radius:6px; margin-bottom:6px;">
        </div>

        <div style="margin-top:4px;">${htmlStorico}</div>
      ` : ''}
    `;
    container.appendChild(card);

    if (!isInfoBlock) {
      document.getElementById(`btn-save-${item.id}`).addEventListener("click", () => salvaCaricoETimer(item.id, item.recupero, totali));
      document.getElementById(`btn-chart-${item.id}`).addEventListener("click", () => apriGrafico(item.id, item.esercizio));
      
      document.getElementById(`note-${item.id}`).addEventListener("change", async (e) => {
        if (!appData.noteEsercizi) appData.noteEsercizi = {};
        appData.noteEsercizi[item.id] = e.target.value;
        await salvaDatiFirebase();
      });
    }
  });
}

async function salvaCaricoETimer(id, recuperoStr, totaliSerie) {
  const valore = document.getElementById(`input-${id}`).value;
  
  // Incrementa contatore serie
  if (!serieCompletate[id]) serieCompletate[id] = 0;
  serieCompletate[id] += 1;

  const countLabel = document.getElementById(`series-count-${id}`);
  if (countLabel) {
    const rimaste = totaliSerie - serieCompletate[id];
    countLabel.textContent = serieCompletate[id] >= totaliSerie 
      ? `✅ Completato (${totaliSerie}/${totaliSerie})` 
      : `${serieCompletate[id]} di ${totaliSerie} completate (mancano ${rimaste})`;
  }

  if (valore !== "") {
    if (!appData.storicoCarichi[id]) appData.storicoCarichi[id] = [];
    appData.storicoCarichi[id].push({ data: dataSelezionata, kg: valore });
    await salvaDatiFirebase();
  }

  let secondi = parseInt(recuperoStr);
  if (isNaN(secondi)) secondi = 90;

  avviaTimer(secondi, serieCompletate[id], totaliSerie);
}

// Funzione Suono Acustico Forte
function riproduciSuonoFineTimer() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const playBeep = (freq, delay, duration) => {
      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      }, delay);
    };

    // 3 Bip di completamento
    playBeep(880, 0, 0.2);
    playBeep(880, 300, 0.2);
    playBeep(1200, 600, 0.4);
  } catch (e) {
    console.error("Audio non supportato:", e);
  }
}

function avviaTimer(secondi, serieAttuale, totaliSerie) {
  clearInterval(timerInterval);
  const timerBox = document.getElementById("timer-box");
  const display = document.getElementById("timer-display");
  
  timerBox.style.display = "flex";
  let tempoRimanente = secondi;

  function aggiornaDisplay() {
    let m = Math.floor(tempoRimanente / 60);
    let s = tempoRimanente % 60;
    display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  aggiornaDisplay();

  timerInterval = setInterval(() => {
    tempoRimanente--;
    if (tempoRimanente >= 0) {
      aggiornaDisplay();
    } else {
      clearInterval(timerInterval);
      display.textContent = "RECUPERO FINITO! 🔥";
      riproduciSuonoFineTimer();

      setTimeout(() => { timerBox.style.display = "none"; }, 3500);
    }
  }, 1000);
}

document.getElementById("stop-timer-btn").addEventListener("click", () => {
  clearInterval(timerInterval);
  document.getElementById("timer-box").style.display = "none";
});

function apriGrafico(id, nomeEsercizio) {
  const modal = document.getElementById("chart-modal");
  document.getElementById("chart-title").textContent = `Progressione: ${nomeEsercizio}`;
  
  modal.classList.remove("hidden");
  modal.style.display = "flex";

  const storia = appData.storicoCarichi[id] || [];
  const date = storia.map(h => h.data);
  const carichi = storia.map(h => parseFloat(h.kg));

  const ctx = document.getElementById("progressionChart").getContext("2d");
  
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: date.length > 0 ? date : ["Nessun dato"],
      datasets: [{
        label: 'Kg Sollevati',
        data: carichi.length > 0 ? carichi : [0],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 6,
        pointBackgroundColor: '#4F46E5'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

document.getElementById("close-chart-btn").addEventListener("click", () => {
  const modal = document.getElementById("chart-modal");
  modal.classList.add("hidden");
  modal.style.display = "none";
});

/* GENERAZIONE GRIGLIA CALENDARIO QUADRATINI */
function renderCalendario() {
  const container = document.getElementById("calendar-days");
  if (!container) return;

  container.innerHTML = "";

  const ora = new Date();
  const anno = ora.getFullYear();
  const mese = ora.getMonth();

  const nomiMesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  
  const calendarTitle = document.getElementById("calendar-month-year");
  if (calendarTitle) calendarTitle.textContent = `${nomiMesi[mese]} ${anno}`;

  const currentMonthPrefix = `${anno}-${String(mese + 1).padStart(2, '0')}`;
  const totalMonthWorkouts = Object.keys(appData.calendarEvents || {}).filter(d => d.startsWith(currentMonthPrefix)).length;
  
  const workoutCountLabel = document.getElementById("workout-count");
  if (workoutCountLabel) workoutCountLabel.textContent = `${totalMonthWorkouts} allenamenti`;

  const primoGiorno = new Date(anno, mese, 1);
  const ultimoGiorno = new Date(anno, mese + 1, 0).getDate();

  let giornoInizio = primoGiorno.getDay() - 1;
  if (giornoInizio === -1) giornoInizio = 6;

  for (let i = 0; i < giornoInizio; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "day-cell empty";
    container.appendChild(emptyCell);
  }

  for (let giorno = 1; giorno <= ultimoGiorno; giorno++) {
    const dateStr = `${anno}-${String(mese + 1).padStart(2, '0')}-${String(giorno).padStart(2, '0')}`;
    
    const cell = document.createElement("div");
    cell.className = "day-cell";
    cell.innerHTML = `<span>${giorno}</span>`;

    if (dateStr === dataSelezionata) cell.classList.add("selected");

    if (appData.calendarEvents && appData.calendarEvents[dateStr]) {
      cell.classList.add("worked-out");
      cell.innerHTML += `<span class="tag-giorno">${appData.calendarEvents[dateStr]}</span>`;
    }

    cell.addEventListener("click", () => selezionaDataCalendario(dateStr));
    container.appendChild(cell);
  }

  aggiornaUISelezioneData();
}

function selezionaDataCalendario(dateStr) {
  dataSelezionata = dateStr;
  renderCalendario();
}

function aggiornaUISelezioneData() {
  const selectedLabel = document.getElementById("selected-date-label");
  if (selectedLabel) selectedLabel.textContent = dataSelezionata;

  const workoutPresente = appData.calendarEvents ? appData.calendarEvents[dataSelezionata] : null;
  const removeBtn = document.getElementById("remove-workout-btn");

  if (removeBtn) {
    if (workoutPresente) {
      removeBtn.style.display = "block";
      removeBtn.textContent = `❌ Rimuovi ${workoutPresente} da questa data`;
    } else {
      removeBtn.style.display = "none";
    }
  }
}

window.registraWorkoutInData = async (giornoNome) => {
  if (!appData.calendarEvents) appData.calendarEvents = {};
  appData.calendarEvents[dataSelezionata] = giornoNome;
  await salvaDatiFirebase();
  renderCalendario();
};

window.rimuoviWorkoutInData = async () => {
  if (appData.calendarEvents) {
    delete appData.calendarEvents[dataSelezionata];
    await salvaDatiFirebase();
    renderCalendario();
  }
};

document.getElementById("logout-btn").addEventListener("click", () => location.reload());

/* --- ESPORTAZIONE CALENDARIO IPHONE (.ICS) --- */
// Imposta di default la data e ora attuale nel campo di input
document.addEventListener("DOMContentLoaded", function() {
  const inputDatetime = document.getElementById("calendar-datetime");
  if (inputDatetime) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    inputDatetime.value = now.toISOString().slice(0, 16);
  }
});

document.addEventListener("click", function(e) {
  if (e.target && e.target.id === "btn-export-calendar") {
    const datetimeInput = document.getElementById("calendar-datetime");
    let dataScelta = datetimeInput && datetimeInput.value ? new Date(datetimeInput.value) : new Date();

    // Formattazione data nel formato UTC richiesto da iCalendar (YYYYMMDDTHHMMSSZ)
    const formatICSDate = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');

    const start = formatICSDate(dataScelta);
    const endDate = new Date(dataScelta.getTime() + 60 * 60 * 1000); // Durata 1 ora
    const end = formatICSDate(endDate);

    const nomeScheda = typeof schedaVistaCorrente !== 'undefined' ? schedaVistaCorrente : 'Allenamento';

    const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GioiGym Workout//IT
BEGIN:VEVENT
UID:${Date.now()}@gioigym.app
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:🏋️‍♀️ Allenamento GioiGym - ${nomeScheda}
DESCRIPTION:Sessione di allenamento pianificata/completata su GioiGym Workout.
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'allenamento-gioigym.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});
