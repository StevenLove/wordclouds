
var PIXEL_LENGTH = 4;
var PIXELS_PER_STRIP = 32;
var PIXEL_STRIP_LENGTH = PIXEL_LENGTH * PIXELS_PER_STRIP;


//////////////////////
/* DETECT COLLISION */
//////////////////////

var withinTest = function(outerWidth, outerHeight, innerWidth, innerHeight, xoff, yoff){
  var goodLeft = xoff >= 0;
  var goodRight = innerWidth + xoff <= outerWidth;
  var goodTop = yoff >= 0;
  var goodBottom = innerHeight + yoff <= outerHeight;

  return goodLeft && goodRight && goodTop && goodBottom;
}

var intersectionTest = function(topWidth, topHeight, botWidth, botHeight, xoff, yoff){

    // console.log("whwhxy: " 
    //   + topWidth + ", "
    //   + topHeight + ", "
    //   + botWidth + ", "
    //   + botHeight + ", "
    //   + xoff + ", "
    //   + yoff + ", "
    //   )


  var failResult = false;

  // any negative dimensions means no intersection
  if(
    topWidth  <= 0 ||
    topHeight <= 0 ||
    botWidth  <= 0 ||
    botHeight <= 0
  ){
    return failResult;
  }

  // any of these cases mean the rectangles don't intersect
  if(
    topWidth         <  xoff || // source is to the right of dest
    topHeight        <  yoff || // source is below dest
    xoff + botWidth  <= 0    || // source is to the left of dest
    yoff + botHeight <= 0       // source is above dest
    ){
    return failResult;
  }

  var left = Math.max(0,xoff)                       // 0 <= left   <  topWidth
  , top = Math.max(0,yoff)                          // 0 <= top    <  topHeight
  , right = Math.min(topWidth, xoff + botWidth)     // 0 <  right  <= topWidth
  , bottom = Math.min(topHeight, yoff + botHeight); // 0 <  bottom <= topHeight


  // If this is true, math has been done wrong.
  if(!(
    0 <= left   && left   < topWidth   &&
    0 <= top    && top    < topHeight  &&
    0 <  right  && right  <= topWidth  &&
    0 <  bottom && bottom <= topHeight &&
    left < right &&
    top  < bottom
    )){
    console.log(JSON.stringify({
      left: left,
      top: top,
      width: right - left,
      height: bottom - top
    }))

    throw "Mistake with assertions of left,right,top, and bottom properties of intersection";
  }

  return {
    left: left,
    top: top,
    width: right - left,
    height: bottom - top
  }
}

var operateOnCompressedRows = function(topArray, topWidth, topHeight, botArray, botWidth, botHeight, xoff, yoff, operation){

  var intersect = intersectionTest(topWidth, topHeight, botWidth, botHeight, xoff, yoff);

  if(!intersect){
    throw "they didn't intersect!"
    return;
  }

  // console.log(JSON.stringify(intersect));

  var bottom = intersect.top + intersect.height;
  var topOffset, botOffset;

  for(var y = intersect.top; y < bottom; ++y){
    topOffset = y * topWidth +
      intersect.left;
    botOffset = (y - yoff) * botWidth + 
      (intersect.left-xoff);
    let result = operation(topArray, botArray, topOffset, botOffset, intersect.width);
    if(result.stop){
      // console.log("stopping operating. value = " + result.value);
      return result.value;
    }
  }
  return false;
}

var collide = function(topArray, topWidth, topHeight, botArray, botWidth, botHeight, xoff, yoff){
  if(!withinTest(topWidth,topHeight,botWidth,botHeight,xoff,yoff)){
    return true;
  }
  var result = operateOnCompressedRows(
    topArray, topWidth, topHeight,
    botArray, botWidth, botHeight,
    xoff, yoff, testCompressedBitsForCollision
  );
  return result;
}

var testCompressedBitsForCollision = function(topArray, botArray, topOffset, botOffset, totalBits){
  // returns {stop: value:}
  return operateOnCompressedBits(
    topArray,botArray,
    topOffset, botOffset, 
    totalBits, 
    function(topChunk, topChunkIndex, botChunk){
      var AND = topChunk & botChunk;
      var collision = AND != 0;
      return {
        stop: collision,
        value: collision
      }
    }
  );
}










////////
/* OR */
////////
var orBottomOntoTop = function(topArray, topWidth, topHeight, botArray, botWidth, botHeight, xoff, yoff){

  return operateOnCompressedRows(
    topArray, topWidth, topHeight,
    botArray, botWidth, botHeight,
    xoff, yoff, orCompressedBits
  );
  // orRows(topArray, topWidth, topHeight,
  //     botArray, botWidth, botHeight,
  //     xoff, yoff);
}










var orOp = function(destArray,destIndex,srcChunk){
  destArray[destIndex] =  (destArray[destIndex] | srcChunk);
}

var orNotOp = function(destArray,destIndex,srcChunk){
  destArray[destIndex] = ~(destArray[destIndex] | srcChunk);
}


var or = function(topArray, topWidth, topHeight, botArray, botWidth, botHeight, xoff, yoff){
  return opOnRows(
    topArray, topWidth, topHeight,
    botArray, botWidth, botHeight,
    xoff, yoff, orOp
  );
}

// Warning: this doesn't work! because of the function bitsFrom
// bitsFrom sets bits that are supposed to be IGNORED to be 0
// so since 0s signify occupied space now, those are interpreted wrong
var orNot = function(topArray, topWidth, topHeight, botArray, botWidth, botHeight, xoff, yoff){
  return opOnRows(
    topArray, topWidth, topHeight,
    botArray, botWidth, botHeight,
    xoff, yoff, orNotOp
  );
}




var opOnRows = function(topArray, topWidth, topHeight, botArray, botWidth, botHeight, xoff, yoff, operation){

  var intersect = intersectionTest(topWidth, topHeight, botWidth, botHeight, xoff, yoff);

  if(!intersect){
    throw "they didn't intersect!"
    return;
  }


  var bottom = intersect.top + intersect.height;
  var topOffset, botOffset;

  for(var y = intersect.top; y < bottom; ++y){
    topOffset = y * topWidth +
      intersect.left;
    botOffset = (y - yoff) * botWidth + 
      (intersect.left-xoff);
    opOnRow(
      topArray, botArray,
      topOffset, botOffset,
      intersect.width,
      operation);
  }
  return false;
}

var opOnRow = function(destArray, srcArray, destOffset, srcOffset, numBits, operation){

  var destChunkIndex, destChunkOffset, srcChunkIndex, srcChunkOffset;
  var destChunk, srcChunk, numBitsOred, result;
  // console.log(JSON.stringify(destArray));

  while( numBits > 0){
    destChunkIndex = Math.floor(destOffset / PIXELS_PER_STRIP);
    destChunkOffset = destOffset % PIXELS_PER_STRIP;
    srcChunkIndex = Math.floor(srcOffset / PIXELS_PER_STRIP);
    srcChunkOffset = srcOffset % PIXELS_PER_STRIP;

    destChunk = destArray[destChunkIndex];
    srcChunk = srcArray[srcChunkIndex];

    let results = chunkMask(
      destChunk, destChunkOffset,
      srcChunk, srcChunkOffset,
      numBits
    );

    let numBitsProcessed = results.numBits;
    // console.log(destChunk);
    // console.log(srcChunk);
    operation(destArray, destChunkIndex, results.bot);

    numBits -= numBitsProcessed;
    destOffset += numBitsProcessed;
    srcOffset += numBitsProcessed;
  }
}

var chunkMask = function(topChunk, topChunkOffset, botChunk, botChunkOffset, totalBits){
  let numBitsFromBot = Math.min(
    PIXELS_PER_STRIP - topChunkOffset,
    totalBits,
    PIXELS_PER_STRIP - botChunkOffset
  );
  botChunk =
    bidirectionalRightShift(
      bitsFrom(botChunk, botChunkOffset, numBitsFromBot),
      topChunkOffset - botChunkOffset
    );

  return {top: topChunk, bot: botChunk, numBits: numBitsFromBot}
}



var orCompressedBits = function(topArray, botArray, topOffset, botOffset, totalBits){
  return operateOnCompressedBits(
    topArray,botArray,
    topOffset, botOffset, 
    totalBits, 
    function(topChunk, topChunkIndex, botChunk){

      topArray[topChunkIndex] |= botChunk;

      return {
        stop: false,
        value: false
      }
    }
  );
}


// make it take top array, bot array
var operateOnCompressedBits = function(topArray, botArray, topOffset, botOffset, totalBits, operation){

  var topChunkIndex, topChunkOffset, botChunkIndex, botChunkOffset;
  var topChunk, botChunk, numBitsOred, result;

  while( totalBits > 0){
    topChunkIndex = Math.floor(topOffset / PIXELS_PER_STRIP);
    topChunkOffset = topOffset % PIXELS_PER_STRIP;
    botChunkIndex = Math.floor(botOffset / PIXELS_PER_STRIP);
    botChunkOffset = botOffset % PIXELS_PER_STRIP;

    topChunk = topArray[topChunkIndex];
    botChunk = botArray[botChunkIndex];

    let results = chunkMask(
      topChunk, topChunkOffset,
      botChunk, botChunkOffset,
      totalBits
    );

    let numBitsProcessed = results.numBits;

    result = operation(topChunk, topChunkIndex, results.bot);
    if(result.stop){
      return result;
    }

    totalBits -= numBitsProcessed;
    topOffset += numBitsProcessed;
    botOffset += numBitsProcessed;
  }
  return {stop: false, value:false};
}






/* ALTERNATE IMPLEMENTATION */
// reevaluate when optimizing

// var orRows = function(destArray, destWidth, destHeight, srcArray, srcWidth, srcHeight, xoff, yoff){
//   var intersect = intersectionTest(destWidth, destHeight, srcWidth, srcHeight, xoff, yoff);

//   if(!intersect){
//     throw "they didn't intersect!"
//     return;
//   }

//   var bottom = intersect.top + intersect.height;

//   for(var y = intersect.top; y < bottom; ++y){
//     var destOffset = y * destWidth +
//       intersect.left;
//     var srcOffset = (y - yoff) * srcWidth + 
//       (intersect.left-xoff);

//     orRow(destArray, srcArray, destOffset, srcOffset, intersect.width);
//   }
// }

// var orRow = function(destArray,srcArray, destBitIndex, srcBitIndex, bitsLeft){
//   var subA = subSprite(destArray,destBitIndex,bitsLeft);
//   var subB = subSprite(srcArray, srcBitIndex, bitsLeft);
//   var offsetA = Math.floor(destBitIndex % PIXELS_PER_STRIP);
//   var offsetB = Math.floor(srcBitIndex  % PIXELS_PER_STRIP);
//   shiftSpriteLeft(subA,offsetA);
//   shiftSpriteLeft(subB,offsetB);
//   var processed = subA.map(function(chunkA,index){
//     return chunkA | subB[index];
//   });
//   shiftSpriteRight(processed,offsetA);

//   var chunkStartIndex = Math.floor(destBitIndex / PIXELS_PER_STRIP);
//   var chunks = subA.length;
//   for(var i = 0; i < subA.length; ++i){
//     destArray[chunkStartIndex + i] = processed[i];
//   }
// }

// // only viable for
// // 0 <= startBit
// // 0 <= numBits
// var subSprite = function(sprite,startBit,numBits){
//   var endBit = startBit + numBits - 1;
//   endBit = Math.min(endBit,sprite.length*PIXELS_PER_STRIP - 1);

//   var startChunkIndex = Math.floor(startBit / PIXELS_PER_STRIP);
//   var endChunkIndex =   Math.floor(endBit   / PIXELS_PER_STRIP);

//   var numChunks = endChunkIndex - startChunkIndex + 1;

//   var result = [];

//   if(numChunks < 1){
//     return result;
//   }

//   // copy over the relevant chunks
//   for(var i = 0; i < numChunks; ++i){
//     result[i] = sprite[startChunkIndex + i];
//   }
//   // shave off extra bits on leftmost chunk
//   var offsetInStartChunk = startBit % PIXELS_PER_STRIP;
//   result[0] = bitsFrom(result[0],offsetInStartChunk,32);
//   // shave off extra bits on rightmost chunk
//   var offsetInEndChunk = endBit % PIXELS_PER_STRIP;
//   var preservedLeftBits = offsetInEndChunk + 1;
//   result[numChunks-1] = bitsFrom(result[numChunks-1], 0, preservedLeftBits);


//   return result;
// }

// // 0 <= shamt < 32 
// var shiftSpriteLeft = function(sprite,shamt){
//   if(shamt === 0)return sprite;
//   // now 0 < shamt < 32
//   var lastIndex = sprite.length - 1;
//   // stop before the last element
//   for(var i = 0; i < lastIndex; ++i){
//     sprite[i] = sprite[i] << shamt | sprite[i+1] >>> (PIXELS_PER_STRIP-shamt)
//   }
//   sprite[lastIndex] = sprite[lastIndex] << shamt;
//   return sprite;
// }
// // 0 <= shamt < 32
// var shiftSpriteRight = function(sprite,shamt){
//   if(shamt === 0)return sprite;
//   // now 0 < shamt < 32
//   var lastIndex = sprite.length - 1;
//   // stop before the last element
//   for(var i = lastIndex; i > 1; --i){
//     sprite[i] = sprite[i] >>> shamt | sprite[i-1] << (PIXELS_PER_STRIP-shamt)
//   }
//   sprite[0] = sprite[0] >>> shamt;
//   return sprite;
// }






var unboundedUnsignedRightShift = function(value,shamt){
  var shiftedTooFar = shamt >= 32 || shamt <= -32;
  // shamt >= 32 : multiplier = 0;
  // shamt <  32 : multiplier = 1;
  var multiplier = 1-shiftedTooFar;
  return multiplier * bidirectionalRightShift(value,shamt);
}


// integer: 32 bit unsigned
// start: 0 <= start <= 31 : the index of first bit to include
// num  : 0 <= num: the number of bits to try to include
// if the supplied start or num don't fall in their ranges, garbage out.
var bitsFrom = function(integer, start, num){
  // now 0 <= num <= 32
  num = Math.min(32,num);

  var fromLeft = start;
  var fromRight = PIXELS_PER_STRIP - (start + num);
  integer = integer  << fromLeft;
  integer = integer >>> fromLeft;
  integer = unboundedUnsignedRightShift(integer,fromRight);
  integer = unboundedUnsignedRightShift(integer,-fromRight);
  return integer;
}

// value: bits to be shifted
// shamt: negative or positive integer
// if shamt > 0, shift to the right, return value >> shamt
// if shamt < 0, shift to the left, return value << shamt
// if shamt = 0, return value
var bidirectionalRightShift = function(value, shamt){
  // shamt <  0 : multiplier = 0
  // shamt >= 0 : multiplier = 1
  // flip the leftmost(sign) bit and shift it to the rightmost position
  var multiplier = (~shamt) >>> 31;
  var rightshamt = multiplier * shamt;
  // shamt <  0 : multiplier = 1
  // shamt >= 0 : multiplier = 0
  multiplier = 1-multiplier;
  var leftshamt =  - multiplier * shamt;
  // it's important that we left shift, then right shift
  // this makes the return value UNSIGNED as >>> returns unsigned
  return ((value << leftshamt) >>> rightshamt);
}


var fill = function(width, height, value){
  var data = [];
  for(var i = 0; i < width*height; ++i){
    data[i] = value;
  }
  return data;
}



var max32 = 0xFFFFFFFF;
var random32Bit = function(){
  return (Math.random()*max32) | 0;
}

/////////////
/* TESTING */
/////////////

var assertEq = function(a,b){
  if(a !== b){
    throw a.toString(16) + " was not equal to " + b.toString(16);
  }
}

var testBidirectionalRightShift = function(){
  let f = bidirectionalRightShift;
  assertEq(f(0x0000FF00,  8), 0x0000FF00 >>  8);
  assertEq(f(0x000000FF,-24), 0x000000FF << 24);
}

var constants = {
  PIXEL_LENGTH: PIXEL_LENGTH,
  PIXELS_PER_STRIP: PIXELS_PER_STRIP,
  PIXEL_STRIP_LENGTH: PIXEL_STRIP_LENGTH
}


module.exports = {
  orBottomOntoTop: orBottomOntoTop,
  or: or,
  orNot: orNot,
  collide: collide,
  fill: fill,
  constants: constants,
  random32Bit:random32Bit,
  __test__: {
    bidirectionalRightShift: bidirectionalRightShift,
    bitsFrom: bitsFrom,
    unboundedUnsignedRightShift: unboundedUnsignedRightShift,
    chunkMask: chunkMask,
    // subSprite: subSprite,
    // orRow: orRow
  }
}