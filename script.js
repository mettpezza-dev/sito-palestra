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
      { 
        id: "g1_warmup", 
        esercizio: "🔥 RISCALDAMENTO & MOBILITÀ", 
        serie: "1", rep: "10 min", recupero: "-", 
        descrizione: "Tapis roulant 3-5 min + 90/90 Hip Switches (10/lato) + Monster Walks con mini-band (15/lato). Esegui 2 serie di avvicinamento prima dell'esercizio 1.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Woman_running_on_treadmill.gif"
      },
      { 
        id: "g1_ex1", 
        esercizio: "B-Stance Hip Thrust al Cavo/Bilanciere", 
        serie: "3", rep: "8-10", recupero: "120s", 
        descrizione: "Posizione asimmetrica. Mentone incassato nello sterno, blocco finale in retroversione del bacino per massimizzare la tensione sul grande gluteo.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Barbell-hip-thrust-movement.gif" 
      },
      { 
        id: "g1_ex2", 
        esercizio: "Deficit Bulgarian Split Squat (Busto 45°)", 
        serie: "3", rep: "10-12", recupero: "90s", 
        descrizione: "Piede anteriore su disco da 5kg. Busto inclinato a 45° per sovraccaricare lo stiro profondo del gluteo riducendo lo stress al ginocchio.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Bulgarian-split-squat.gif"
      },
      { 
        id: "g1_ex3", 
        esercizio: "Lat Machine Presa Supina Inversa", 
        serie: "3", rep: "10-12", recupero: "90s", 
        descrizione: "Presa palmi rivolti a te alla larghezza spalle. Tira al petto deprimendo le scapole per attivare le fibre inferiori del gran dorsale.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Lat-pulldown-movement.gif"
      },
      { 
        id: "g1_ex4", 
        esercizio: "Cable Standing Hip Abduction (a 30°)", 
        serie: "3", rep: "12-15", recupero: "60s", 
        descrizione: "Sposta la gamba indietro-diagonale a 30° per ingaggiare il fascio medio del gluteo lungo la sua reale linea anatomica.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Cable-hip-abduction.gif"
      },
      { 
        id: "g1_ex5", 
        esercizio: "Single-Leg RDL con Manubrio", 
        serie: "3", rep: "10", recupero: "75s", 
        descrizione: "Lavoro monolaterale di stabilità dell'anca per eliminare le asimmetrie di forza tra le due gambe.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/1/18/Single-leg-romanian-deadlift.gif"
      },
      { 
        id: "g1_ex6", 
        esercizio: "Frog Pumps con Elastico (Finisher)", 
        serie: "3", rep: "20-25", recupero: "45s", 
        descrizione: "Piedi a contatto, ginocchia in fuori con mini-band. Contrazione metabolica veloce ad alto numero di ripetizioni per esaurire il gluteo.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Barbell-hip-thrust-movement.gif"
      },
      { 
        id: "g1_cooldown", 
        esercizio: "🧘 DEFATICAMENTO & RESET", 
        serie: "1", rep: "5 min", recupero: "-", 
        descrizione: "Respirazione diaframmatica a terra (2 min) + Couch Stretch (60s/lato) per decontrarre i flessori dell'anca.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Couch-stretch.gif"
      }
    ],
    "Giorno 2": [
      { 
        id: "g2_warmup", 
        esercizio: "🔥 RISCALDAMENTO & MOBILITÀ", 
        serie: "1", rep: "10 min", recupero: "-", 
        descrizione: "Cyclette 3 min + Thoracic Rotations (8/lato) + Arm Circles. Esegui 2 serie di avvicinamento prima dell'esercizio 1.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Woman_running_on_treadmill.gif"
      },
      { 
        id: "g2_ex1", 
        esercizio: "Incline Chest-Supported Row (Grip Neutro)", 
        serie: "3", rep: "8-10", recupero: "90s", 
        descrizione: "Sdraiata a pancia in giù su panca 30°. Tira i manubri guidando coi gomiti. Tensione isolata su trapezio e romboidi senza carico lombare.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Incline-dumbbell-row.gif"
      },
      { 
        id: "g2_ex2", 
        esercizio: "Landmine Press Monolaterale", 
        serie: "3", rep: "10-12", recupero: "90s", 
        descrizione: "Spinta obliqua con bilanciere ad angolo. Protegge la cuffia dei rotatori e isola la testa anteriore e laterale del deltoide.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/5/52/Landmine-press.gif"
      },
      { 
        id: "g2_ex3", 
        esercizio: "Romanian Deadlift (RDL) al Cavo/Bilanciere", 
        serie: "3", rep: "8-10", recupero: "120s", 
        descrizione: "Hip hinge puro: spingi il bacino indietro mantenendo la schiena neutra. Tensione massimale in allungamento su ischiocrurali e glutei.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Barbell-RDL.gif"
      },
      { 
        id: "g2_ex4", 
        esercizio: "Cable Y-Raise su Panca Inclinata", 
        serie: "3", rep: "12-15", recupero: "60s", 
        descrizione: "Solleva i cavi incrociati a forma di Y sul piano scapolare per isolare i deltoidi senza compressione articolare.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Cable-lateral-raise.gif"
      },
      { 
        id: "g2_ex5", 
        esercizio: "Face Pulls al Cavo Alto con Extra-Rotazione", 
        serie: "3", rep: "15", recupero: "60s", 
        descrizione: "Tira la corda verso la fronte aprendo i pugni all'esterno. Esercizio posturale per correggere l'atteggiamento di spalle chiuse.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Cable-face-pull.gif"
      },
      { 
        id: "g2_ex6", 
        esercizio: "Overhead Dumbbell Triceps Extension 60°", 
        serie: "3", rep: "12-15", recupero: "60s", 
        descrizione: "Estensione sopra la testa su panca inclinata per porre il capo lungo del tricipite in massimo allungamento anatomico.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Dumbbell-triceps-extension.gif"
      },
      { 
        id: "g2_cooldown", 
        esercizio: "🧘 DEFATICAMENTO & RESET", 
        serie: "1", rep: "5 min", recupero: "-", 
        descrizione: "Decompressione alla sbarra (Hang passivo 45s) + Stretch pettorali alla parete.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Couch-stretch.gif"
      }
    ],
    "Giorno 3": [
      { 
        id: "g3_warmup", 
        esercizio: "🔥 RISCALDAMENTO & MOBILITÀ", 
        serie: "1", rep: "10 min", recupero: "-", 
        descrizione: "Camminata inclinata 5 min + 90/90 Hip Switches + Bodyweight Lunges dinamici.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Woman_running_on_treadmill.gif"
      },
      { 
        id: "g3_ex1", 
        esercizio: "Zercher Reverse Lunge su Step", 
        serie: "3", rep: "10-12", recupero: "90s", 
        descrizione: "Bilanciere all'incavo dei gomiti, passo indietro da uno step di 5cm. Attivazione sistemica di core, glutei e stabilizzatori.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Bulgarian-split-squat.gif"
      },
      { 
        id: "g3_ex2", 
        esercizio: "Chest Press Bipolare al Cavo", 
        serie: "3", rep: "10-12", recupero: "90s", 
        descrizione: "Spinta controllata con tensione costante su tutto il ROM. Mantiene lo stimolo ipertrofico al petto senza sollecitare le articolazioni.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/Cable-chest-press.gif"
      },
      { 
        id: "g3_ex3", 
        esercizio: "Hip Thrust Classico al Bilanciere", 
        serie: "3", rep: "10-12", recupero: "90s", 
        descrizione: "Esercizio cardine di spinta orizzontale per sovraccaricare la massa dei glutei nella fase di accorciamento.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Barbell-hip-thrust-movement.gif"
      },
      { 
        id: "g3_ex4", 
        esercizio: "Cable Lateral Raise (Alzate Laterali Cavo)", 
        serie: "3", rep: "12-15", recupero: "60s", 
        descrizione: "Tensione costante dal basso verso l'alto per massimizzare il lavoro sul deltoide mediale.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Cable-lateral-raise.gif"
      },
      { 
        id: "g3_ex5", 
        esercizio: "Pallof Press Dinamico Anti-Rotazionale", 
        serie: "3", rep: "12", recupero: "60s", 
        descrizione: "Spingi la maniglia del cavo in avanti stabilizzando il core contro la trazione laterale per la definizione addominale.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Pallof-press.gif"
      },
      { 
        id: "g3_ex6", 
        esercizio: "Hammer Curl ai Cavi o Manubri", 
        serie: "3", rep: "12-15", recupero: "60s", 
        descrizione: "Presa neutra a martello per sviluppare il muscolo brachiale e donare forma e definizione alle braccia.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Hammer-curl.gif"
      },
      { 
        id: "g3_cooldown", 
        esercizio: "🧘 DEFATICAMENTO & RESET", 
        serie: "1", rep: "5 min", recupero: "-", 
        descrizione: "Child's Pose (Posizione del bambino) per 90 secondi + allungamento adduttori.",
        gifUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Couch-stretch.gif"
      }
    ]
  },
  storicoCarichi: {},
  calendarEvents: {}
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
      if (data.schede && data.schede["Giorno 1"] && data.schede["Giorno 1"][0].gifUrl) {
        appData.schede = data.schede;
      } else {
        await salvaDatiFirebase();
      }
      if (data.storicoCarichi) appData.storicoCarichi = data.storicoCarichi;
      if (data.calendarEvents) appData.calendarEvents = data.calendarEvents;
    } else {
      await salvaDatiFirebase();
    }
  } catch (e) { 
    console.error("Errore caricamento:", e); 
  }
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

    const isInfoBlock = item.id.includes("warmup") || item.id.includes("cooldown");

    const card = document.createElement("div");
    card.className = "exercise-card";
    card.innerHTML = `
      <div class="exercise-title">${item.esercizio}</div>
      <div class="exercise-specs">
        <span>🔄 ${item.serie} Serie</span>
        <span>🎯 ${item.rep} Reps</span>
        <span>⏱️ ${item.recupero}</span>
      </div>
      ${item.descrizione ? `<p style="font-size:12px; color:#4B5563; margin-top:6px; margin-bottom:8px; line-height:1.4;">📖 <em>${item.descrizione}</em></p>` : ''}
      
      ${item.gifUrl ? `
        <button class="btn-toggle-gif" style="background:#EEF2FF; color:#4F46E5; border:1px solid #C7D2FE; padding:6px 12px; border-radius:8px; font-weight:600; font-size:12px; cursor:pointer; margin-bottom:10px; width:100%; text-align:center;" id="toggle-btn-${item.id}">
          🎬 Mostra Animazione Movimento
        </button>
        <div id="gif-container-${item.id}" style="display:none; text-align:center; margin-bottom:12px;">
          <img src="${item.gifUrl}" alt="${item.esercizio}" style="width:100%; max-width:280px; border-radius:12px; border:1px solid #E5E7EB; box-shadow:0 2px 8px rgba(0,0,0,0.05);" loading="lazy">
        </div>
      ` : ''}

      ${!isInfoBlock ? `
        <div class="tracker-row">
          <input type="number" id="input-${item.id}" placeholder="Kg oggi" value="${ultimoPeso}">
          <button class="btn-save" id="btn-save-${item.id}">Salva Peso</button>
        </div>
        <div style="margin-top:8px;">${htmlStorico}</div>
      ` : ''}
    `;
    container.appendChild(card);

    if (item.gifUrl) {
      document.getElementById(`toggle-btn-${item.id}`).addEventListener("click", () => {
        const box = document.getElementById(`gif-container-${item.id}`);
        const btn = document.getElementById(`toggle-btn-${item.id}`);
        if (box.style.display === "none") {
          box.style.display = "block";
          btn.textContent = "🙈 Nascondi Animazione";
        } else {
          box.style.display = "none";
          btn.textContent = "🎬 Mostra Animazione Movimento";
        }
      });
    }

    if (!isInfoBlock) {
      document.getElementById(`btn-save-${item.id}`).addEventListener("click", () => salvaCarico(item.id));
    }
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
