var rng = require("./rng");
var rand = rng(Math.random());

var Ocean = function(options) {
  Object.assign(this, {x: 0, y:0, width: 0, height:0, src: "bg.jpg", ang: 0});
  Object.assign(this, options);
  this.img = new Image();
  this.img.src = this.src;
};
Ocean.prototype.update = function(delta) {
  // Rock background back and forth by 10px
  this.ang = this.ang > Math.PI*2?0:this.ang+0.01;
  this.x = 10*Math.sin(this.ang);
  this.y = 10*Math.sin(this.ang);
};
Ocean.prototype.render = function(ctx) {
  ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, -10+this.x, -10+this.y, this.width+2*10, this.height+2*10)
  let grd = ctx.createLinearGradient(0, 0, this.width/50, this.height/3);
  grd.addColorStop(0, "rgba(0, 0, 0, 0.300)");
  grd.addColorStop(0.2, "rgba(24, 58, 124, 0.60)");
  grd.addColorStop(1, "rgba(4, 2, 24, 1)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, this.width, this.height);
};
module.exports = Ocean;