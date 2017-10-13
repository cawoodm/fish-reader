let loop = require("./raf");
let rand = require("./rng")(Math.random());
let f = require("./functions");
let Explosion = require("./explosion");
let Fish = require("./fish");
let Bubbles = require("./bubbles");
let Ocean = require("./ocean");

window.dp=f.dp;

function init() {
  
  window.g = {
    ticks: 0,
  };
  
  g.canvas = document.createElement("canvas");
  document.body.appendChild(g.canvas);
  g.canvas.addEventListener("click", (e) => init(e.clientX, e.clientY, e));
  g.canvas.width=document.documentElement.clientWidth; //window.screen.width/availWidth
  g.canvas.height=document.documentElement.clientHeight; //availHeight
  g.ctx = g.canvas.getContext("2d");
  
  g.entities = [];
  let osc = g.osc = [];
  osc.push({a:rand.float(1)})
  osc.push({a:rand.float(1)})
  osc.push({a:rand.float(1)})
  
  setInterval(()=>oscillate(osc[0]), 2000);
  
  restart();
}

function spawn(t, x, y) {
  oscillate(g.osc[1]);
  if (t===1)
    g.entities.push(new Fish({x: x||rand.range(0, g.canvas.width/5), y: y||rand.range(0, g.canvas.height), lifetime: 2000, size:rand.range(12,18), num: 1, gravity: 0, dd: 50, hue: rand.range(0, 360)}));
  else
    g.entities.push(new Bubbles({x: x||rand.range(0, g.canvas.width), y: g.canvas.height, height: g.canvas.height, lifetime: 1200, gravity: -50, size:rand.range(3,10), num: rand.range(10,30), hue: rand.range(120, 260)}));
};
function restart() {
  g.entities.length = 0;
  g.entities.push(new Ocean({width: g.canvas.width, height: g.canvas.height})); 
  for (let i=0; i<10; i++) spawn(0);
  for (let i=0; i<10; i++) spawn(1);
}
loop.start(function(elapsed) {
  
  // Clear the screen
  g.ctx.fillStyle="white";
  g.ctx.fillRect(0, 0, g.canvas.width, g.canvas.height);
  
  g.ticks++;
  if (g.ticks%30===0) spawn(0);
  
  oscillate(g.osc[2])
  
  g.entities.forEach((ent, index)=>{
    ent.update(elapsed);
    if (ent.objs && ent.objs.length===0) return g.entities.splice(index, 1);
    g.ctx.save();
    ent.render(g.ctx);
    g.ctx.restore();
  });
  
});

function oscillate(o) {
  o.a = ((10*++o.a)%10)/7;
  o.x=Math.cos(o.a);
  o.y=Math.sin(o.a);
}

init();