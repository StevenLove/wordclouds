var fabric = require('./fabric.js');
// var Canvas = require("canvas-browserify");
var canvasutils = require("./canvasutils.js");
let compressedConstants = require("./compressedoperations").constants;

var phraseToFabric = function(phrase){
  var safety_distance_from_canvas_edge = 2;
  var left = phrase.placed_x ? phrase.placed_x : safety_distance_from_canvas_edge; 
  var top = phrase.placed_y ? phrase.placed_y : safety_distance_from_canvas_edge;
  return new fabric.Text(
      phrase.text,
      {
        left: left,
        top: top,
        fill: phrase.color,
        fontFamily: phrase.font,
        fontSize: phrase.size,
      }
    )
}

var adjustedBoundingBox = function(obj){
  var bound = obj.getBoundingRect();
  return {
    left:   (bound.left + 0.5) | 0,
    top:    (bound.top + 0.5) | 0,
    width:  bound.width | 0,
    height: bound.height | 0
  }
}


// Load an image from url (path or dataURI)
// note that we set stroke width to 0
// otherwise, the img will be offset by (0.5,0.5)
// because of default strokeWidth of 1
var load = function(url, callback){
  fabric.Image.fromURL(url,function(loaded_img){
    loaded_img.setStrokeWidth(0);
    callback(loaded_img);
  });
}

// load canvas from JSON in a file: visualTests.js
// scale image??



// var loadAsCanvas = function(url, callback){
//   load(url,function(loaded_img){
//     var newCanvas = fabric.createCanvasForNode()
//   })
// }


var save = function(canv, url, callback){
  canv.renderAll()
  // console.log("saving canvas",canv);
  // var stream = canv.createPNGStream();
  // var out = fs.createWriteStream(url);//__dirname + '/'+filename+'.png');
  // // write to the fs writestream when the pngstream produces data
  // stream.on('data', function(chunk) {
  //   out.write(chunk);
  // });
  // // close the fs writestream when the pngstream has ended
  // stream.on('end',function(){
  //   out.end();
  // })
  // if(typeof callback === "function"){
  //   // when the fs writestream is finished, we're all done here.
  //   out.on('finish', function(){
  //     callback();
  //   });
  // }

}



// unused
// untested
var saveObj = function(obj, filename, callback){
  // var bounds = obj.getBoundingRect();
  console.log("w,h: " + obj.width);
  console.log(obj.height);
  var canv = fabric.StaticCanvas(obj.width,obj.height);
  canv.add(obj);
  obj.set("left",0);
  obj.set("top",0);
  save(canv,filename, callback);
}

var objToCanvas = function(obj){
  var canv = fabric.StaticCanvas(obj.width,obj.height);
  canv.add(obj);
  obj.set("left",0);
  obj.set("top",0);
  return canv;
}

var equalCanvases = function(canvasA, canvasB){

  if(!sameDimensions(canvasA, canvasB)){
    console.log("canvases have different dimensions");
    return false;
  }

  var w = canvasA.width, 
      h = canvasA.height, 
      len = w*h*compressedConstants.PIXEL_LENGTH;

  var imageDataA = canvasA.contextContainer.getImageData(0,0,w,h);
  var imageDataB = canvasB.contextContainer.getImageData(0,0,w,h);

  var dataA = imageDataA.data;
  var dataB = imageDataB.data;

  for(var i = 0; i < len; ++i){
    if(dataA[i] !== dataB[i]){
      console.log("At [" + i + "]: A(" + dataA[i] + ") != B(" + dataB[i] + ")" );
      return false;
    }
  }
  return true;
}

var sameDimensions = function(canvasA, canvasB){
  return canvasA.width === canvasB.width && canvasA.height === canvasB.height;
}
var assertSameDimensions = function(canvasA, canvasB){
  if(!sameDimensions(canvasA,canvasB)){
    throw "canvases aren't the same size: "
      + "A width:  " + canvasA.width  + ", " 
      + "A height: " + canvasA.height + ", "
      + "B width:  "  + canvasB.width + ", "
      + "B height: " + canvasB.height
  }
}


var clearWhite = function(canv){
  clearColor(canv,"#FFFFFF");
}
var drawDot = function(canv,x,y){
  canv.add(new fabric.Rect({
    left:x,
    top:y,
    fill:"black",
    width:1,
    height:1
  }))
};
var clearColor = function(canv,color){
  canv.clear();
  canv.add(new fabric.Rect({
    id:"bg",
    left: -0.5,
    top: -0.5,
    fill: color,
    width: canv.getWidth(),
    height: canv.getHeight()
  }));
}

var rgbaColor = function(r,g,b,a){
  return fabric.Color.fromSource([r,g,b,a/255]);
}


// var compareCanvases = function(canvasA, canvasB, url, operation, callback){
//   assertSameDimensions(canvasA, canvasB);

//   var w = canvasA.width, h = canvasA.height;

//   var imageDataA = canvasA.contextContainer.getImageData(0,0,w,h);
//   var imageDataB = canvasB.contextContainer.getImageData(0,0,w,h);

//   var dataA = imageDataA.data;
//   var dataB = imageDataB.data;

//   var len = w * h * compressedConstants.PIXEL_LENGTH;

//   var canvas = new Canvas(w,h);
//   var ctx = canvas.getContext('2d');
//   var imageData = ctx.createImageData(w,h);

//   for(var i = 0; i < len; i+=4){
//     var colorA = rgbaColor(dataA[i],dataA[i+1],dataA[i+2],dataA[i+3]);
//     var colorB = rgbaColor(dataB[i],dataB[i+1],dataB[i+2],dataB[i+3]);
//     var colorOut = operation(colorA, colorB);
//     var arr = colorOut.getSource();
//     var alpha = arr[3]*255;
//     // console.log(JSON.stringify(arr));
//     imageData.data[i] = arr[0];
//     imageData.data[i+1] = arr[1];
//     imageData.data[i+2] = arr[2];
//     imageData.data[i+3] = alpha;
//   }

//   ctx.putImageData(imageData,0,0);

//   canvasutils.toPNG(canvas,url,callback);
//   // var other_spriter = require("../spriter.js");
//   // other_spriter.toPNG(canvas,url)
// }

// var mapCanvas = function(canvas, operation, url, callback){
//   var w = canvas.width, h = canvas.height;

//   var imageData = canvas.contextContainer.getImageData(0,0,w,h);

//   var data = imageData.data;

//   var len = w * h * compressedConstants.PIXEL_LENGTH;

//   // var Canvas = require("canvas-browserify");
//   var outCanvas = new Canvas(w,h);
//   var ctx = outCanvas.getContext('2d');
//   var imageData = ctx.createImageData(w,h);

//   for(var i = 0; i < len; i+=4){
//     // var color = rgbaColor(data[i],data[i+1],data[i+2],data[i+3]);
//     var colorOut = operation(data[i],data[i+1],data[i+2],data[i+3]);
//     var arr = colorOut;
//     // var arr = colorOut.getSource();
//     // var alpha = arr[3]*255;
//     // console.log(JSON.stringify(arr));
//     imageData.data[i] = arr[0];
//     imageData.data[i+1] = arr[1];
//     imageData.data[i+2] = arr[2];
//     imageData.data[i+3] = arr[3];
//   } 

//   ctx.putImageData(imageData,0,0);
//    canvasutils.toPNG(outCanvas,url,callback);
//   // var other_spriter = require("../spriter.js");
//   // other_spriter.toPNG(outCanvas,url)
// }

// var map = function(canvas, operation, callback){
//   var w = canvas.width, h = canvas.height;
//   var imageData = canvas.contextContainer.getImageData(0,0,w,h);
//   var data = imageData.data;
//   var len = w * h * compressedConstants.PIXEL_LENGTH;

//   var outCanvas = new Canvas(w,h);
//   var ctx = outCanvas.getContext('2d');
//   var imageData = ctx.createImageData(w,h);

//   for(var i = 0; i < len; i+=4){
//     var color = rgbaColor(data[i],data[i+1],data[i+2],data[i+3]);
//     var colorOut = operation(color);
//     var arr = colorOut.getSource();
//     var alpha = arr[3]*255;
//     // console.log(JSON.stringify(arr));
//     imageData.data[i] = arr[0];
//     imageData.data[i+1] = arr[1];
//     imageData.data[i+2] = arr[2];
//     imageData.data[i+3] = alpha;
//   }

//   ctx.putImageData(imageData,0,0);
//   canvasutils.toFabric(outCanvas,callback);
// }

var map2 = function(canvasA, canvasB, operation, callback){
  
}

var colorsEqual = function(colorA, colorB){
  var srcA = colorA.getSource();
  var srcB = colorB.getSource();
  for(var i = 0; i < 3; ++i){
    if(srcA[i] !== srcB[i]){
      return false;
    }
  }
  return true;
}


var colorIsVisible = function(color){
  var alphaThreshold = 200;
  var colorThreshold = 250;

  var minColor = 255-colorThreshold;

  var src = color.getSource();
  var alpha = src[3] * 255;

  var opaque = alpha > alphaThreshold;
  var low_red =src[0] < minColor;
  var low_green = src[1] < minColor;
  var low_blue = src[2] < minColor;
  // return (src[0] + src[1] + src[2]) == 0 && src[3] > 250;
  return opaque && (low_red && low_green && low_blue);
}

var availableColor = new fabric.Color("#FFFFFF");
var unavailableColor = new fabric.Color("#000000");

var colorToAvailability = function(color){
  return (colorIsVisible(color))? unavailableColor : availableColor;
}


var zoomCanvas = function(canvas, factor) {
  canvas.setHeight(canvas.getHeight() * factor);
  canvas.setWidth(canvas.getWidth() * factor);
  if (canvas.backgroundImage) {
    // Need to scale background images as well
    var bi = canvas.backgroundImage;
    bi.width = bi.width * factor; bi.height = bi.height * factor;
  }
  var objects = canvas.getObjects();
  for (var i in objects) {
      var scaleX = objects[i].scaleX;
    var scaleY = objects[i].scaleY;
    var left = objects[i].left;
    var top = objects[i].top;

    var tempScaleX = scaleX * factor;
    var tempScaleY = scaleY * factor;
    var tempLeft = left * factor;
    var tempTop = top * factor;

    objects[i].scaleX = tempScaleX;
    objects[i].scaleY = tempScaleY;
    objects[i].left = tempLeft;
    objects[i].top = tempTop;

    objects[i].setCoords();
  }
  canvas.renderAll();
  canvas.calcOffset();
}









module.exports = {
  drawDot,
  phraseToFabric: phraseToFabric,
  adjustedBoundingBox: adjustedBoundingBox,
  save: save,
  load: load,
  clearWhite: clearWhite,
  equalCanvases: equalCanvases,
  // compareCanvases: compareCanvases,
  // mapCanvas: mapCanvas,
  objToCanvas: objToCanvas,
  colorsEqual: colorsEqual,
  colorIsVisible: colorIsVisible,
  colorToAvailability: colorToAvailability,
  // map:map,
  zoomCanvas:zoomCanvas,
  clearColor:clearColor
}