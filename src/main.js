let loop = require("./raf");
let rand = require("./rng")(Math.random());
let f = require("./functions");

let Explosion = require("./explosion");
let Fish = require("./fish");
let Bubbles = require("./bubbles");
let Ocean = require("./ocean");

window.dp=f.dp;
window.g = {
  ticks: 0,
  difficulty: 0,
};

function init() {
  
  g.canvas = document.createElement("canvas");
  document.body.appendChild(g.canvas);
  g.canvas.addEventListener("click", (e) => g.click(e));
  g.canvas.width=document.documentElement.clientWidth;
  g.canvas.height=document.documentElement.clientHeight;
  g.ctx = g.canvas.getContext("2d");
  
  g.entities = [];
  
  restart();
}
window.speechSynthesis.onvoiceschanged = function() {
  if (g.voice) return;
  g.voice = window.speechSynthesis.getVoices().find((o)=>o.name==="Google UK English Female");
  say("Welcome to the Fish Reader!")
};
function say(text) {
  if (!g.voice) return;
  let blah = new SpeechSynthesisUtterance(text);
  blah.voice = g.voice;
  speechSynthesis.speak(blah);
}
function spawnBubbles() {
  g.entities.push(new Bubbles({x: rand.range(0, g.canvas.width), y: rand.range(g.canvas.height-200, g.canvas.height), height: g.canvas.height, lifetime: 1200, gravity: -50, size:rand.range(3,10), num: rand.range(10,30), hue: rand.range(120, 260)}));
}
function spawnFish(word) {
  let x = rand.pick([rand.int(100), g.canvas.width-rand.int(100)]);
  let dd = rand.range(50, 30+g.difficulty*5);
  if (x>100) dd=-dd;
  g.entities.push(new Fish({
    x: x,
    y: rand.range(100, g.canvas.height-100),
    width: g.canvas.width,
    size:rand.range(12,18),
    num: 1,
    word: word,
    gravity: 0,
    dd: dd,
    hue: rand.range(0, 360)
  }));
};
function restart() {
  g.entities.length = 0;
  g.entities.push(new Ocean({width: g.canvas.width, height: g.canvas.height})); 
  for (let i=0; i<10; i++) spawnBubbles();
  window.setTimeout(function(){
    g.nextRound();
  }, 1000);
}
g.nextRound = function() {
  g.difficulty++;
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
  // Fish to find
  g.word = alphabet.splice(rand.int(alphabet.length-1), 1);
  spawnFish(g.word);
  say(`Find the letter "${g.word}"!`)
  
  // Distraction Fish
  let maxWords = Math.min(24, g.difficulty+3);
  for (let i=1; i<maxWords; i++)
    spawnFish(alphabet.splice(rand.int(alphabet.length-1), 1)[0]);
}
g.click = function(e) {
  dp(e.clientX)
}
g.countFish = function() {
  return g.entities.reduce((n, e)=> {
    return n + (e instanceof Fish)?1:0
  }, 0);
};
loop.start(function(elapsed) {
  
  // Clear the screen
  g.ctx.fillStyle="white";
  g.ctx.fillRect(0, 0, g.canvas.width, g.canvas.height);
  
  g.ticks++;
  if (g.ticks%30===0) {
    spawnBubbles();
  }
  
  g.entities.forEach((ent, index)=>{
    ent.update(elapsed);
    if (ent.objs && ent.objs.length===0) return g.entities.splice(index, 1);
    g.ctx.save();
    ent.render(g.ctx);
    g.ctx.restore();
  });
  
});

init();