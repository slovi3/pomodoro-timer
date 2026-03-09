const timerEl = document.getElementById("timer");
const clockEl = document.getElementById("clock");
const themeToggle = document.getElementById("themeToggle");
const sessionCountEl = document.getElementById("sessionCount");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const DEFAULT_SECONDS = 25 * 60;
const STORAGE_KEY = "pomodoro_sessions_today";
const STORAGE_DATE_KEY = "pomodoro_sessions_date";

let totalSeconds = DEFAULT_SECONDS;
let timeLeft = totalSeconds;
let intervalId = null;
let isRunning = false;
let sessionsToday = 0;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadTodaySessions() {
  const savedDate = localStorage.getItem(STORAGE_DATE_KEY);
  const today = getTodayKey();

  if (savedDate !== today) {
    localStorage.setItem(STORAGE_DATE_KEY, today);
    localStorage.setItem(STORAGE_KEY, "0");
    sessionsToday = 0;
  } else {
    sessionsToday = Number(localStorage.getItem(STORAGE_KEY) || "0");
  }

  renderSessions();
}

function saveTodaySessions() {
  localStorage.setItem(STORAGE_DATE_KEY, getTodayKey());
  localStorage.setItem(STORAGE_KEY, String(sessionsToday));
}

function renderSessions() {
  sessionCountEl.textContent = `Sessions today: ${sessionsToday}`;
}

function renderTimer() {
  timerEl.textContent = formatTime(timeLeft);
  document.title = `${formatTime(timeLeft)} • Pomodoro`;
}

function playFinishSound() {
  try {
    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
    audio.volume = 0.5;
    audio.play();
  } catch (error) {
    console.log("Ses çalınamadı:", error);
  }
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;

  intervalId = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft -= 1;
      renderTimer();
    } else {
      clearInterval(intervalId);
      intervalId = null;
      isRunning = false;

      sessionsToday += 1;
      saveTodaySessions();
      renderSessions();

      playFinishSound();

      document.title = "Done • Pomodoro";
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;

  clearInterval(intervalId);
  intervalId = null;
  isRunning = false;
}

function resetTimer() {
  clearInterval(intervalId);
  intervalId = null;
  isRunning = false;
  timeLeft = totalSeconds;
  renderTimer();
}

function updateClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
themeToggle.addEventListener("click", toggleTheme);

loadTodaySessions();
renderTimer();
updateClock();
setInterval(updateClock, 1000);