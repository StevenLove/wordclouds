var archimedean = function(x,y) {
  var e = x/y;
  var xOrigin = x/2;
  var yOrigin = y/2;
  var at = function(t) {
    return [
      (xOrigin + e * (t *= .1) * Math.cos(t) ) | 0,
      (yOrigin + t * Math.sin(t) ) | 0
    ];
  };
  var time = 0;
  var nextVal;
  return{
    hasNext:function(){
      nextVal = at(time+1);
      return (nextVal[0] > 0 && nextVal[0] < x && nextVal[1] > 0 && nextVal[1] < y)
    },
    next:function(){
      var result;
      if(nextVal){
        result = nextVal;
        nextVal = null;
      }
      else{
        result = at(time);
      }
      ++time;
      return result;
    }
  }
}

var random = function(x,y){
  var MAX_ITERATIONS = 100;
  var count = 0;
  return{
    hasNext: function(){return count < MAX_ITERATIONS;},
    next:function(){
      ++count;
      return [
        (Math.random()*(x) + (0) ) | 0,
        (Math.random()*(y) + (0) ) | 0
      ];
    }
  }
}

var rectangular = function(x,y){
   var k = 15,
      dy = k,
      dx = k * x / y,
      xOrigin = x / 2,
      yOrigin = y / 2;

   var dt = 1;
   var t = 0;
   var limit = (x*y/169) | 0;
   var x = xOrigin;
   var y = yOrigin;

  return {
    hasNext: function(){return t < limit;},
    next: function() {
    // See triangular numbers: T_n = n * (n + 1) / 2.
      switch ((Math.sqrt(1 + 4 * t) - 1) & 3) {
        case 0:  x += dx; break;
        case 1:  y += dy; break;
        case 2:  x -= dx; break;
        default: y -= dy; break;
      }
      t += dt;
      return [x | 0, y | 0];
    }
  }
}

/* This creates spiral objects with next and hasNext functions
But it doesn't calculate x,y coordinates on the fly, instead it calculates them all out ahead of time. */
function LoadedSpiral(generatorFn){
  this.t = 0;
  this.maxT = 2;
  this.maxMaxT = 6000;
  this.xs = [];
  this.ys = [];
  this.maxX = 767;
  this.maxY = 1024;
  this.generateFrom(generatorFn);
  return this;
}
LoadedSpiral.prototype.reset = function(){this.t = 0};
LoadedSpiral.prototype.generateFrom = function(genFn){
  let generator = genFn(this.maxX,this.maxY);
  let tempTime = 0;
  do{
    let result = generator.next();
    let x = result[0];
    let y = result[1];
    if((x>0&&x<this.maxX) && (y>0&&y<this.maxY) && tempTime < this.maxMaxT){
      ++tempTime
      this.xs[tempTime] = x;
      this.ys[tempTime] = y;
    }
    else if(!(x>0&&x<this.maxX) && !(y>0&&y<this.maxY)){
      this.maxT = tempTime;
      console.log(this.xs,this.ys);
      break;
    }
  }while(true);
  return this;
}
LoadedSpiral.prototype.hasNext = function(){
  return this.t < this.maxT;
}
LoadedSpiral.prototype.next = function(){
  ++this.t;
  return [this.xs[this.t],this.ys[this.t]];
}

export default {
  archimedean: new LoadedSpiral(archimedean),
  rectangular: new LoadedSpiral(rectangular),
  random: new LoadedSpiral(random)
}