const timer = document.getElementById("timer")

const startBtn = document.getElementById("start")
const pauseBtn = document.getElementById("pause")
const resetBtn = document.getElementById("reset")

const clock = document.getElementById("clock")

const themeToggle = document.getElementById("themeToggle")

let time = 25 * 60

let interval = null

function render(){

let m = Math.floor(time / 60)

let s = time % 60

timer.textContent =
String(m).padStart(2,"0") + ":" +
String(s).padStart(2,"0")

}

render()

startBtn.onclick = () => {

if(interval) return

interval = setInterval(()=>{

if(time > 0){

time--

render()

}

},1000)

}

pauseBtn.onclick = () => {

clearInterval(interval)

interval = null

}

resetBtn.onclick = () => {

clearInterval(interval)

interval = null

time = 25 * 60

render()

}

/* CLOCK */

function updateClock(){

const now = new Date()

clock.textContent = now.toLocaleTimeString("tr-TR")

}

setInterval(updateClock,1000)

updateClock()

/* DARK MODE */

themeToggle.onclick = () => {

document.body.classList.toggle("dark")

}