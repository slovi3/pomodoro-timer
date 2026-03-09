const timerEl = document.getElementById("timer");
const clockEl = document.getElementById("clock");
const themeToggle = document.getElementById("themeToggle");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

let totalSeconds = 25 * 60;
let timeLeft = totalSeconds;
let intervalId = null;
let isRunning = false;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function renderTimer() {
  timerEl.textContent = formatTime(timeLeft);
  document.title = `${formatTime(timeLeft)} • Pomodoro`;
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

renderTimer();
updateClock();
setInterval(updateClock, 1000);