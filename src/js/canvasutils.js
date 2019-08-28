import fs from "fs";
import $ from "jquery";
import fabric from "./fabric.js";
import fabricutils from "./fabricutils.js";
// var Image = Canvas.Image;


// var toPNG = function(canvas, path, callback){
//   var out = fs.createWriteStream(path);
//   var stream = canvas.pngStream();
//   stream.on('data', function(chunk){
//     out.write(chunk);
//   })
//   stream.on('end', function(){
//     out.end();
//   });
//   if(callback){
//     out.on("finish",callback);
//   }
// }

var toFabric = function(canvas, callback){
  var dataurl = canvas.toDataURL();
  var fabric_canvas = new fabric.StaticCanvas(canvas.width, canvas.height);
  fabricutils.load(dataurl,function(fabric_image){
    fabric_canvas.add(fabric_image);
    callback(fabric_canvas);
  });
}

// I want to resize a PNG
// get the buffer
// spritify that

// options: 
// width - png will be stretched to this width
// height - png will be stretched to this height
// var imageDataFromPNG = function(png,resizeOptions,callback){
//   var img = new Image();

//   img.onload = function(){

//     var naturalWidth = img.width;
//     var naturalHeight = img.height;

//     var resultWidth = resizeOptions.width ? resizeOptions.width : naturalWidth;
//     var resultHeight = resizeOptions.height ? resizeOptions.height : naturalHeight;

//     // make a canvas
//     var canv = new Canvas(resultWidth,resultHeight);
//     var ctx = canv.getContext('2d');

//     ctx.drawImage(img,0,0,naturalWidth,naturalHeight,0,0,resultWidth,resultHeight);

//     var imageData = ctx.getImageData(0,0,resultWidth,resultHeight);
//     callback(null,imageData);
//   }
//   img.onerror = function(err){
//     console.log(err);
//     console.log("error loading image");
//   }

//   img.src = png;
// }

// var resizeBuffer = function(buffer,inWidth,inHeight,outWidth,outHeight){
//   // make a canvas to draw the buffer onto
//   var scratchCanvas = new Canvas(inWidth,inHeight);
//   var scratchCtx = scratchCanvas.getContext('2d');
//   // putImageData expects an ImageData object, so let's make one
//   var imgData = bufferToImageData(buffer,inWidth,inHeight);
//   scratchCtx.putImageData(imgData,0,0);
// }

// var drawPNGToCanvas = function(png,canv){
//   var img = new Image();
//   img.src = png;

//   // determine dimensions
//   var w = img.width;
//   var h = img.height;

//   // make a canvas
//   var canv = new Canvas(w,h);
//   var ctx = canv.getContext('2d');

//   // draw to the canvas
//   ctx.drawImage(img,0,0);

//   // save to view
//   canvasutils.toPNG(canv,"./tests/christCopy.png");
// }

// var bufferToImageData = function(buffer,width,height){
//   var scratchCanvas = new Canvas(width,height);
//   var scratchCtx = scratchCanvas.getContext('2d');
//   var imgData = scratchCtx.createImageData(width,height);
//   imgData.data = buffer;
//   return imgData;
// }

/* Input a HTML5 Canvas object */
function display(canvas){
  $("body").append(canvas);
}


export default {
  display,
  toFabric
}