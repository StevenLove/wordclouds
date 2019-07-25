
// var archimedean = function(x,y) {
//   var e = x/y;
//   var k = 5;
//   var limit = 50;
//   var xOrigin = x/2;
//   var yOrigin = y/2;

//   var kt = 0;
//   var klimit = limit * k;

//   return {
//     hasNext: function(){return kt < klimit},
//     next: function(){
//       kt += k;
//         return [xOrigin + e * kt * Math.cos(kt), yOrigin + kt * Math.sin(kt)];
//     }
//   };
// }

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

module.exports = {
  archimedean: archimedean,
  rectangular: rectangular,
  random: random
}