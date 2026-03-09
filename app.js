const el = (id) => document.getElementById(id);

const timeDisplay = el("timeDisplay");
const modeLabel = el("modeLabel");
const statusChip = el("statusChip");
const helperText = el("helperText");
const toast = el("toast");

const totalSessionsEl = el("totalSessions");
const todaySessionsEl = el("todaySessions");

const startBtn = el("startBtn");
const pauseBtn = el("pauseBtn");
const resetBtn = el("resetBtn");
const addSessionBtn = el("addSessionBtn");
const clearDataBtn = el("clearDataBtn");

const presetButtons = document.querySelectorAll(".preset-btn");

// Storage
const LS_TOTAL = "pomodoro_pro_total_sessions";
const LS_TODAY = "pomodoro_pro_today_sessions";
const LS_TODAY_DATE = "pomodoro_pro_today_date";

// State
let currentMode = "Focus";
let presetMinutes = 25;
let totalSeconds = presetMinutes * 60;
let remainingSeconds = totalSeconds;
let intervalId = null;
let isRunning = false;

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function showToast(message) {
  toast.textContent = message;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function renderTime() {
  timeDisplay.textContent = formatTime(remainingSeconds);
  document.title = `${formatTime(remainingSeconds)} • ${currentMode}`;
}

function refreshPresetActiveState() {
  presetButtons.forEach((btn) => {
    const mins = Number(btn.dataset.minutes);
    btn.classList.toggle("active", mins === presetMinutes);
  });
}

function syncMode() {
  modeLabel.textContent = currentMode;
}

function syncStatus(text) {
  statusChip.textContent = text;
}

function loadCounters() {
  const total = Number(localStorage.getItem(LS_TOTAL) || "0");
  totalSessionsEl.textContent = String(total);

  const currentDay = todayKey();
  const savedDay = localStorage.getItem(LS_TODAY_DATE);

  if (savedDay !== currentDay) {
    localStorage.setItem(LS_TODAY_DATE, currentDay);
    localStorage.setItem(LS_TODAY, "0");
  }

  const today = Number(localStorage.getItem(LS_TODAY) || "0");
  todaySessionsEl.textContent = String(today);
}

function increaseSessions() {
  const total = Number(localStorage.getItem(LS_TOTAL) || "0") + 1;
  localStorage.setItem(LS_TOTAL, String(total));
  totalSessionsEl.textContent = String(total);

  const today = Number(localStorage.getItem(LS_TODAY) || "0") + 1;
  localStorage.setItem(LS_TODAY, String(today));
  todaySessionsEl.textContent = String(today);
}

function stopInterval() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function setPreset(minutes) {
  if (isRunning) {
    helperText.textContent = "Timer çalışırken preset değiştiremezsin.";
    return;
  }

  presetMinutes = minutes;
  currentMode = minutes === 25 ? "Focus" : "Break";
  totalSeconds = minutes * 60;
  remainingSeconds = totalSeconds;

  syncMode();
  refreshPresetActiveState();
  renderTime();
  syncStatus("Ready");
  helperText.textContent = `${currentMode} modu seçildi: ${minutes} dakika.`;
  showToast("");
}

function onTimerComplete() {
  stopInterval();
  isRunning = false;

  if (currentMode === "Focus") {
    increaseSessions();
    showToast("Focus oturumu tamamlandı. +1 session ✅");
    helperText.textContent = "Güzel. Bir focus oturumu daha tamamlandı.";
  } else {
    showToast("Mola tamamlandı ✅");
    helperText.textContent = "Mola bitti. Hazırsan tekrar focus başlat.";
  }

  remainingSeconds = totalSeconds;
  renderTime();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  syncStatus("Completed");
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  syncStatus("Running");
  helperText.textContent = `${currentMode} başladı.`;
  showToast("");

  intervalId = setInterval(() => {
    remainingSeconds -= 1;
    renderTime();

    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
      renderTime();
      onTimerComplete();
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;

  stopInterval();
  isRunning = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  syncStatus("Paused");
  helperText.textContent = "Timer duraklatıldı.";
  showToast("Pause");
}

function resetTimer() {
  stopInterval();
  isRunning = false;
  remainingSeconds = totalSeconds;
  renderTime();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  syncStatus("Ready");
  helperText.textContent = `${currentMode} modu başlangıca döndü.`;
  showToast("Reset");
}

function clearAllData() {
  localStorage.removeItem(LS_TOTAL);
  localStorage.removeItem(LS_TODAY);
  localStorage.removeItem(LS_TODAY_DATE);
  loadCounters();
  helperText.textContent = "Sayaç verileri sıfırlandı.";
  showToast("Veriler temizlendi.");
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

addSessionBtn.addEventListener("click", () => {
  increaseSessions();
  helperText.textContent = "Session sayacı manuel artırıldı.";
  showToast("+1 session");
});

clearDataBtn.addEventListener("click", clearAllData);

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const minutes = Number(button.dataset.minutes);
    setPreset(minutes);
  });
});

// init
loadCounters();
syncMode();
refreshPresetActiveState();
syncStatus("Ready");
renderTime();
helperText.textContent = "Hazır. Focus 25 ile başlayabilirsin.";