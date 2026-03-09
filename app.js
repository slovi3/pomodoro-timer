let time = 25 * 60

const timer = document.getElementById("timer")

function render(){

let m = Math.floor(time/60)
let s = time % 60

timer.textContent =
String(m).padStart(2,"0")+":"+
String(s).padStart(2,"0")

}

render()

let interval

document.getElementById("pause").onclick = ()=>{

clearInterval(interval)

}

document.getElementById("next").onclick = ()=>{

clearInterval(interval)

interval = setInterval(()=>{

if(time>0){

time--
render()

}

},1000)

}

document.getElementById("reset").onclick = ()=>{

clearInterval(interval)

time = 25*60
render()

}


/* Türkiye Saati */

function updateClock(){

const now = new Date()

const tr = now.toLocaleTimeString("tr-TR")

document.getElementById("clock").textContent =
tr

}

setInterval(updateClock,1000)

updateClock()


/* Dark Mode */

document.getElementById("themeToggle")
.onclick=()=>{

document.body.classList.toggle("dark")

}