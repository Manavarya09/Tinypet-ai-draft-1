/* TinyPet AI JavaScript (updated to remove localStorage usage) */

// Application Data
const sampleJournalEntries = [
  { date: "2025-06-30", text: "Had an amazing day at work! Everything went perfectly.", emotion: "joy", moodScore: 9 },
  { date: "2025-06-29", text: "Feeling a bit down today. Just one of those days.", emotion: "sadness", moodScore: 4 },
  { date: "2025-06-28", text: "So excited about the weekend plans!", emotion: "joy", moodScore: 8 },
  { date: "2025-06-27", text: "Worried about the presentation tomorrow.", emotion: "fear", moodScore: 5 },
  { date: "2025-06-26", text: "Really grateful for my friends and family.", emotion: "love", moodScore: 8 }
];

const petTypes = [
  { id: "bunny", name: "Bunny", emoji: "🐰", personality: "Cheerful and energetic" },
  { id: "cat", name: "Cat", emoji: "🐱", personality: "Independent and curious" },
  { id: "dragon", name: "Dragon", emoji: "🐉", personality: "Wise and protective" },
  { id: "puppy", name: "Puppy", emoji: "🐶", personality: "Loyal and playful" }
];

const furnitureData = [
  { id: "bed", name: "Cozy Bed", emoji: "🛏️", category: "bedroom" },
  { id: "plant", name: "House Plant", emoji: "🪴", category: "decoration" },
  { id: "lamp", name: "Table Lamp", emoji: "💡", category: "lighting" },
  { id: "chair", name: "Comfy Chair", emoji: "🪑", category: "furniture" },
  { id: "bookshelf", name: "Bookshelf", emoji: "📚", category: "storage" },
  { id: "rug", name: "Soft Rug", emoji: "🏠", category: "decoration" }
];

const affirmations = [
  "You are worthy of love and happiness ✨",
  "Every day is a new opportunity to grow 🌱",
  "Your feelings are valid and important 💙",
  "You have the strength to overcome challenges 💪",
  "You deserve peace and comfort 🕊️"
];

const emotionColors = {
  joy: "#FFE066",
  sadness: "#87CEEB",
  love: "#FFB6C1",
  anger: "#FF6B6B",
  fear: "#DDA0DD",
  surprise: "#98FB98"
};

// Utility selectors
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/*****************************************************************
 * THEME HANDLING (localStorage removed per deployment guidelines)
 *****************************************************************/
const themeToggleBtn = $("#theme-toggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let currentTheme = prefersDark ? "dark" : "light";
applyTheme(currentTheme);

themeToggleBtn.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(currentTheme);
});

function applyTheme(theme) {
  document.documentElement.setAttribute("data-color-scheme", theme);
  $(".theme-icon").textContent = theme === "dark" ? "☀️" : "🌙";
}

/*****************************************************************
 * PET SETUP MODAL
 *****************************************************************/
const setupModal = $("#setup-modal");
const petTypesContainer = $("#pet-types");
let selectedPetType = null;
let petName = "";
let petStats = { happiness: 75, energy: 80, level: 1 };

function renderPetTypes() {
  petTypesContainer.innerHTML = "";
  petTypes.forEach((pet) => {
    const card = document.createElement("div");
    card.className = "pet-type-card";
    card.innerHTML = `
      <div class="pet-type-emoji">${pet.emoji}</div>
      <div class="pet-type-name">${pet.name}</div>
      <div class="pet-type-personality">${pet.personality}</div>
    `;
    card.onclick = () => {
      $$(".pet-type-card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedPetType = pet;
    };
    petTypesContainer.appendChild(card);
  });
}
renderPetTypes();

$("#create-pet").onclick = () => {
  const nameInput = $("#pet-name");
  if (!nameInput.value.trim() || !selectedPetType) {
    alert("Please provide a name and select a pet type.");
    return;
  }
  petName = nameInput.value.trim();
  setupModal.classList.add("hidden");
  $("#main-content").classList.remove("hidden");
  initPetDisplay();
};

/*****************************************************************
 * PET DISPLAY & ACTIONS
 *****************************************************************/
function initPetDisplay() {
  $("#pet-display-name").textContent = petName;
  $("#pet-emoji").textContent = selectedPetType.emoji;
  updateStatsUI();
}

function updateStatsUI() {
  $("#happiness-bar").style.width = `${petStats.happiness}%`;
  $("#energy-bar").style.width = `${petStats.energy}%`;
  $("#happiness-value").textContent = petStats.happiness;
  $("#energy-value").textContent = petStats.energy;
  $("#pet-level").textContent = petStats.level;
}

function modifyStat(stat, delta) {
  petStats[stat] = Math.min(100, Math.max(0, petStats[stat] + delta));
  updateStatsUI();
}

$("#feed-btn").onclick = () => {
  modifyStat("energy", 10);
  showPetReaction("Yum!", "joy");
};
$("#play-btn").onclick = () => {
  modifyStat("happiness", 10);
  modifyStat("energy", -5);
  showPetReaction("Woo!", "joy");
};
$("#hug-btn").onclick = () => {
  modifyStat("happiness", 5);
  showPetReaction("Love", "love");
};

function showPetReaction(text, emotion) {
  const bubble = $("#emotion-bubble");
  const petEmoji = $("#pet-emoji");
  $("#emotion-text").textContent = text;
  bubble.classList.remove("hidden");
  bubble.style.background = emotionColors[emotion] || "var(--color-primary)";

  // Add animation classes
  if (emotion === "joy") petEmoji.classList.add("dancing");
  if (emotion === "sadness") petEmoji.classList.add("sad");

  setTimeout(() => {
    bubble.classList.add("hidden");
    petEmoji.classList.remove("dancing", "sad");
  }, 3000);
}

/*****************************************************************
 * JOURNAL FUNCTIONALITY
 *****************************************************************/
const journalEntriesContainer = $("#journal-entries");
function emotionEmoji(emotion) {
  const map = { joy: "😊", sadness: "😢", love: "💕", anger: "😡", fear: "😨", surprise: "😲" };
  return map[emotion] || "🙂";
}
function renderJournalEntries(entries) {
  journalEntriesContainer.innerHTML = "";
  entries.forEach((e) => {
    const div = document.createElement("div");
    div.className = `journal-entry ${e.emotion}`;
    div.innerHTML = `
      <div class="journal-entry-header">
        <span class="journal-entry-date">${e.date}</span>
        <span class="journal-entry-emotion" style="color:${emotionColors[e.emotion]}">${e.emotion} ${emotionEmoji(e.emotion)}</span>
      </div>
      <p>${e.text}</p>
    `;
    journalEntriesContainer.appendChild(div);
  });
}
renderJournalEntries(sampleJournalEntries);

function simulateEmotionDetection(text) {
  const keywords = {
    joy: ["happy", "glad", "amazing", "excited"],
    sadness: ["sad", "down", "gloomy"],
    love: ["love", "grateful", "thankful"],
    anger: ["angry", "mad", "furious"],
    fear: ["worried", "scared", "fear"],
    surprise: ["surprised", "shocked", "wow"]
  };
  for (const [emotion, words] of Object.entries(keywords)) {
    if (words.some((w) => text.toLowerCase().includes(w))) return emotion;
  }
  return "joy"; // default
}

$("#analyze-emotion").onclick = () => {
  const text = $("#journal-text").value.trim();
  if (!text) return alert("Please write something first.");
  const emotion = simulateEmotionDetection(text);
  $("#emotion-result").classList.remove("hidden");
  $("#detected-emotion-text").textContent = emotion;
  $("#detected-emotion-emoji").textContent = emotionEmoji(emotion);
  $("#detected-emotion-text").style.color = emotionColors[emotion];
  showPetReaction(emotion, emotion);
};

$("#save-entry").onclick = () => {
  const textArea = $("#journal-text");
  const text = textArea.value.trim();
  if (!text) return alert("Please write your journal entry before saving.");
  const emotion = simulateEmotionDetection(text);
  const date = new Date().toISOString().split("T")[0];
  const moodScore = Number($("#mood-slider").value);
  sampleJournalEntries.unshift({ date, text, emotion, moodScore });
  renderJournalEntries(sampleJournalEntries);
  textArea.value = "";
  addMoodData({ date, mood: moodScore });
  updateMoodChart();
  updateMoodStats();
  showPetReaction(emotion, emotion);
  alert("Entry saved!");
};

/*****************************************************************
 * ROOM CUSTOMIZATION (drag & drop)
 *****************************************************************/
const furnitureItemsContainer = $("#furniture-items");
const roomCanvas = $("#room-canvas");

function renderFurnitureCatalog() {
  furnitureItemsContainer.innerHTML = "";
  furnitureData.forEach((item) => {
    const div = document.createElement("div");
    div.className = "furniture-item";
    div.draggable = true;
    div.dataset.id = item.id;
    div.innerHTML = `<span class="furniture-emoji">${item.emoji}</span><span class="furniture-name">${item.name}</span>`;
    div.ondragstart = (e) => e.dataTransfer.setData("text/plain", item.id);
    furnitureItemsContainer.appendChild(div);
  });
}
renderFurnitureCatalog();

roomCanvas.ondragover = (e) => e.preventDefault();
roomCanvas.ondrop = (e) => {
  const itemId = e.dataTransfer.getData("text/plain");
  const item = furnitureData.find((f) => f.id === itemId);
  if (!item) return;
  const div = document.createElement("div");
  div.className = "placed-furniture";
  div.style.left = `${e.offsetX}px`;
  div.style.top = `${e.offsetY}px`;
  div.draggable = true;
  div.innerHTML = `<span class="furniture-emoji">${item.emoji}</span>`;
  roomCanvas.appendChild(div);
  div.ondragstart = (ev) => {
    ev.dataTransfer.setData("text", "move");
    div.dataset.startX = ev.offsetX;
    div.dataset.startY = ev.offsetY;
  };
  div.ondragend = (ev) => {
    const rect = roomCanvas.getBoundingClientRect();
    div.style.left = `${ev.clientX - rect.left - div.dataset.startX}px`;
    div.style.top = `${ev.clientY - rect.top - div.dataset.startY}px`;
  };
};

// Theme buttons for room
$$(".theme-btn").forEach((btn) => {
  btn.onclick = () => {
    $$(".theme-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    roomCanvas.classList.remove("cozy", "modern", "fantasy");
    roomCanvas.classList.add(btn.dataset.theme);
  };
});
roomCanvas.classList.add("cozy"); // default theme

/*****************************************************************
 * MOOD TRACKER (Chart.js)
 *****************************************************************/
const moodSlider = $("#mood-slider");
const moodValueText = $("#mood-value");
let moodData = sampleJournalEntries.map((e) => ({ date: e.date, mood: e.moodScore }));

moodSlider.oninput = () => (moodValueText.textContent = moodSlider.value);

$("#save-mood").onclick = () => {
  const date = new Date().toISOString().split("T")[0];
  const mood = Number(moodSlider.value);
  addMoodData({ date, mood });
  updateMoodChart();
  updateMoodStats();
  alert("Mood saved!");
};

function addMoodData(entry) {
  const existing = moodData.find((d) => d.date === entry.date);
  if (existing) existing.mood = entry.mood; else moodData.push(entry);
}

let moodChart;
function initMoodChart() {
  const ctx = $("#mood-chart").getContext("2d");
  moodChart = new Chart(ctx, {
    type: "line",
    data: getMoodChartData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { min: 0, max: 10 } },
      plugins: { legend: { display: false } }
    }
  });
}

function getMoodChartData() {
  return {
    labels: moodData.map((d) => d.date).reverse(),
    datasets: [{
      data: moodData.map((d) => d.mood).reverse(),
      borderColor: "#1FB8CD",
      backgroundColor: "rgba(31,184,205,0.2)",
      tension: 0.3,
      fill: true
    }]
  };
}
function updateMoodChart() { if (moodChart) { moodChart.data = getMoodChartData(); moodChart.update(); } }
function updateMoodStats() {
  const avg = (moodData.reduce((sum, d) => sum + d.mood, 0) / moodData.length).toFixed(1);
  $("#avg-mood").textContent = avg;
  $("#days-tracked").textContent = moodData.length;
}
initMoodChart();
updateMoodStats();

/*****************************************************************
 * WELLNESS FEATURES
 *****************************************************************/
function showRandomAffirmation() {
  $("#affirmation-text").textContent = affirmations[Math.floor(Math.random() * affirmations.length)];
}
$("#new-affirmation").onclick = showRandomAffirmation;
showRandomAffirmation();

// Breathing exercise
const breathingCircle = $("#breathing-circle");
const breathingText = $("#breathing-text");
let breathingInterval;
$("#start-breathing").onclick = () => {
  if (breathingCircle.classList.contains("breathing")) stopBreathing(); else startBreathing();
};
function startBreathing() {
  breathingCircle.classList.add("breathing");
  breathingText.textContent = "Inhale";
  let phase = 0;
  breathingInterval = setInterval(() => {
    phase = (phase + 1) % 2;
    breathingText.textContent = phase ? "Exhale" : "Inhale";
  }, 2000);
}
function stopBreathing() {
  clearInterval(breathingInterval);
  breathingCircle.classList.remove("breathing");
  breathingText.textContent = "Breathe";
}

/*****************************************************************
 * AMBIENT SOUNDS
 *****************************************************************/
const ambientAudio = $("#ambient-audio");
const soundBtn = $("#toggle-sounds");

soundBtn.onclick = () => {
  if (ambientAudio.paused) { ambientAudio.play(); soundBtn.classList.remove("muted"); }
  else { ambientAudio.pause(); soundBtn.classList.add("muted"); }
};

if (ambientAudio.paused) soundBtn.classList.add("muted");

/*****************************************************************
 * TAB NAVIGATION
 *****************************************************************/
$$(".tab-btn").forEach((btn) => {
  btn.onclick = () => {
    if (btn.classList.contains("active")) return;
    $$(".tab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.dataset.tab;
    $$(".tab-content").forEach((tc) => tc.classList.toggle("active", tc.id === `${target}-tab`));
  };
});

/*****************************************************************
 * ACCESSIBILITY: ESC to close modal
 *****************************************************************/
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !setupModal.classList.contains("hidden")) setupModal.classList.add("hidden");
});
