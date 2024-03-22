
const startButton = document.querySelector(".start-box a");

const clickAudio = document.querySelector("audio#click");

startButton.addEventListener("click",function(e){
    e.preventDefault();
    clickAudio.play();
    
    setTimeout(()=>window.open(e.target.href,"_self"),1300);
    
});