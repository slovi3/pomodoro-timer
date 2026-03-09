let time = 25 * 60
let interval

const timer = document.getElementById("timer")

function render(){
  const m = Math.floor(time/60)
  const s = time%60
  timer.textContent =
    String(m).padStart(2,"0")+":"+
    String(s).padStart(2,"0")
}

render()

document.getElementById("start").onclick = ()=>{
  clearInterval(interval)
  interval = setInterval(()=>{
    if(time>0){
      time--
      render()
    }
  },1000)
}

document.getElementById("pause").onclick = ()=>{
  clearInterval(interval)
}

document.getElementById("reset").onclick = ()=>{
  clearInterval(interval)
  time = 25*60
  render()
}