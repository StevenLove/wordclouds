import {fabric as fabric} from "fabric";
import $ from "jquery";

console.log("my fabric js",fabric);

// let proxy = new Proxy({
//     StaticCanvas:fabric.StaticCanvas,
//     Color:fabric.Color,
//     // initialize:fabric.initialize
// },{
//     get: function(obj, prop) {
//         if(prop in obj){
//             return obj[prop];
//         }
//         console.warn("Looking for property fabric."+prop+" not found in our custom fabric proxy");
//         return undefined;
//     }
    
// })

let scratchCanvas;
function getScratchCanvas(){
    if(!scratchCanvas){
        scratchCanvas = getCanvas(768,1025);
    }
    scratchCanvas.clear();
    // var rect = new fabric.Rect({
    //     width:1000,height:1000,fill: 'black', left: 0, top: 0});
    // scratchCanvas.add(rect);
    return scratchCanvas;
    // let options = {};
    // scratchCanvas = new fabric.StaticCanvas(document.querySelector("#scratch"),options);
    // return scratchCanvas;
    // return getCanvas(100,100);
}
let named = {}
function fromID(id){
    if(named[id])return named[id];
    named[id] = new fabric.StaticCanvas(id,{width:300,height:400,enableRetinaScaling:false});
    return named[id];
}
function getCanvas(width,height){
    console.log("getting canvas with wh",width,height);
    let $canvasElement = $("<canvas>").css("display","none");
    $("body").append($canvasElement);
    let staticCanvas = new fabric.StaticCanvas($canvasElement[0],{width:width,height:height,enableRetinaScaling:false});
    let $el = $(staticCanvas.lowerCanvasEl);
    $el.attr("width",width).attr("height",height); // if we don't do this, then the canvas is set to be bigger, but then css styled down to be smaller...
    // display(staticCanvas);
    return staticCanvas;
}

/* Will mess up if the fab already exists! */
function display(fab){
    console.log("display",fab);
    let $el = $(fab.lowerCanvasEl);
    $el.attr("width",fab.width).attr("height",fab.height);
    $("body").append($el);
}
export default {
    display,
    getScratchCanvas,
    getCanvas,
    fromID,
    Image:fabric.Image,
    Text:fabric.Text,
    Rect:fabric.Rect,
    StaticCanvas:fabric.StaticCanvas,
    Color:fabric.Color,
}
// module.exports = proxy;