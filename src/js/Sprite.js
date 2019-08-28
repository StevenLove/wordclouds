import $ from "jquery";
import fabric from "./fabric.js";
import Color from "color";
import Utils from "./utils.js";
import compressedOps from "./compressedoperations.js";

const PIXEL_BLUR = 1; // change to 3 and we will check a pixel and then assume the next 2 are the same and just store the 1 value to cut total size down by 2/3
const PIXEL_LENGTH = 4;
const PIXEL_LENGTH_BLURRED = PIXEL_LENGTH*PIXEL_BLUR;
const PIXELS_PER_STRIP = 32; // actually stored in a strip
const PIXEL_STRIP_LENGTH = (PIXEL_LENGTH_BLURRED)* PIXELS_PER_STRIP ;
// const DIST_BETWEEN_PIXELS = 8;

const UNINHABITED = 0;
const INHABITED = 1;

function isTransparent(r,g,b,a){return a == 0;}
function isClear(r,g,b,a){return isWhite(r,g,b,a) || isTransparent(r,g,b,a)};
function isVisible(r,g,b,a){return !isClear(r,g,b,a)}
function isBlack(r,g,b,a){return (r==0 && g==0 && b==0 && a==255);};
function isWhite(r,g,b,a){return (r == 255 && g == 255 && b == 255 && a == 255);};


function Sprite(){
    this.habitableFunction = isClear;
    // this._canvas;
    // this._fab;
    // this.width;
    // this.height;
    this.xoff=0;
    this.yoff=0;
    this.inhabitedColor = Color("red");
    this.uninhabitedColor = Color("white");
    this.compressedBuffer = [];
    return this;
};
Sprite.prototype.fabcan = function(newValue){
    if(newValue===undefined){return this._fabcan};
    this._fabcan = newValue;
    this._fabcan.setDimensions({width:this.width,height:this.height},{backstoreOnly:true});
    return this;
};

["canvas","xoff","yoff"].forEach(prop=>{
    Sprite.prototype[prop] = function(newValue){
        if(newValue===undefined){return this["_"+prop]}
        this["_"+prop] = newValue;
        return this;
     }
})

Sprite.prototype.fromDimensions = function(w,h){
    this.width = w;
    this.height = h;
    let len = Utils.ceil(w*h/PIXELS_PER_STRIP);
    this.compressedBuffer = new Array(len);
    this.fullyUninhabited();
    return this;
}

Sprite.prototype.fullyInhabited = function(){
    return this.fill(-1);
}
Sprite.prototype.fullyUninhabited = function(){
    return this.fill(0);
}
Sprite.prototype.clear = function(){
    return this.fullyUninhabited();
}
Sprite.prototype.fill = function(v){
    this.compressedBuffer.fill(v);
    return this;
}
Sprite.prototype.invert = function(){
    console.log("inverting sprite",this,this.compressedBuffer);
    this.compressedBuffer = this.compressedBuffer.map(int=>~int); // bitwise invert each int in the compressed buffer
}



// Principle functions:
// compressImageData: compresses a canvas imageData object to an array of ints
// toCanvas: decompresses a sprite back into a canvas

// image_data: imageData object from a call to Context.getImageData
//   which has width, height, and data
//   data is a typed array of 8bit unsigned ints laid out like the following:
//   [R0,G0,B0,A0,R1,G1,B1,A1,R2,G2,B2,A2,...]
// output an array of 32 bit integers, where one integer represents 
//   32 colors from the input imageData.  Each color (RGBA) is turned into
//   a 1 or 0 based on whether it fits my arbitrary cutoff for being dark
//   so the length of the output array is 1/128 the length of image_data.data

Sprite.prototype.fromImageData = function(imageData){
    let w = imageData.width;
    let h = imageData.height;
    this.width = w;
    this.height = h;
    let buffer = imageData.data;
    let numPixels = w*h;
    let bufferLength = numPixels * PIXEL_LENGTH;
  
    let result = [];
    let single_integer;
  
    let r,g,b,a;
    for (let outerIndex = 0;
      outerIndex < bufferLength;
      outerIndex += PIXEL_STRIP_LENGTH){
      single_integer = 0;
      for(let innerIndex = 0;
        innerIndex < PIXEL_STRIP_LENGTH;
        innerIndex += PIXEL_LENGTH_BLURRED){
  
        // calculate the index of a color in the image_data.data array
        let index = outerIndex + innerIndex;
        // extract that individual color
        r = buffer[index];
        g = buffer[index+1];
        b = buffer[index+2];
        a = buffer[index+3];
        // determine if the pixel counts as a 0 or a 1
        let inhabited_bit = !this.habitableFunction(r,g,b,a);
        // add that bit to the end of the integer we are building
        single_integer = (single_integer << 1) + inhabited_bit;
  
      }
      result.push(single_integer);
    }

    this.compressedBuffer = result;
    return this;
}
Sprite.prototype.fromBackgroundImage = function(image){
    console.log("sprite from background image",image);
    let src = "./images/"+image;
    let fab = fabric.getCanvas(768,1025);
    let $imgElement = $("<img>").attr("src",src).css("display","none");
    $("body").append($imgElement);
    let fabImage = new fabric.Image($imgElement[0],{
        width:fab.width,
        height:fab.height,
        left:0,
        top:0
    })
    fab.add(fabImage);
    fab.renderAll();
    return new Sprite().fromFabric(fab);
    
}
Sprite.prototype.fromFabric = function(fab){
    if(!fab.contextContainer){
        let scratch = fabric.getScratchCanvas(); // automatically clears the scratch canvas
        scratch.add(fab);
        scratch.renderAll(); // otherwise the canvas may still be blank when we try to get the image data
        var image_data = scratch.contextContainer.getImageData(0,0,fab.width,fab.height);
        return this.fromImageData(image_data);
    }
    return this.fromImageData(fab.contextContainer.getImageData(0,0,fab.width,fab.height));
}
Sprite.prototype.toFabricAsync = function(){
    return new Promise((res,rej)=>{
        let canvas = this.toCanvas();
        let dataURL = canvas.toDataURL();
        fabric.Image.fromURL(dataURL, function(img) {
            res(img);
        });
    })
}
Sprite.prototype.draw = function(fab){
    if(fab){
        this.fabcan(fab);
    }
    if(!this.fabcan()){
        let newfab = fabric.getCanvas(this.width,this.height);
        this.toFabricAsync().then(fabObj=>{
            newfab.add(fabObj);
            // fabric.display(newfab);
            this.fabcan(newfab);
        })
    }
    else{
        this.toFabricAsync().then(fabObj=>{
            this.fabcan().clear();
            this.fabcan().add(fabObj);
            this.fabcan().renderAll();
        })
    }
    return this;
};

Sprite.prototype.toCanvas = function(){
    if(!this.canvas()){
        let $newCanvas = $("<canvas>").attr("width",this.width).attr("height",this.height).css("display","none");
        $("body").append($newCanvas);
        this.canvas($newCanvas[0]);
    }
    var ctx = this._canvas.getContext('2d');
    var imgData = ctx.createImageData(this.width,this.height);
    

    var rA = this.inhabitedColor.red();
    var gA = this.inhabitedColor.green();
    var bA = this.inhabitedColor.blue();
    var aA = this.inhabitedColor.alpha()*255 | 0; // floor

    var rB = this.uninhabitedColor.red();
    var gB = this.uninhabitedColor.green();
    var bB = this.uninhabitedColor.blue();
    var aB = this.uninhabitedColor.alpha()*255 | 0; // floor

    let numPixels = this.width*this.height;
    let numStrips = numPixels / (PIXELS_PER_STRIP);
    
    var strips = this.compressedBuffer;
    var pixelIndex, stripIndex, index, strip;

    let baseDestPixelIndex;
    
    for(stripIndex = 0;
    stripIndex < numStrips;
    ++stripIndex){

    strip = strips[stripIndex];

    for(pixelIndex = 0;
        pixelIndex < PIXEL_STRIP_LENGTH;
        pixelIndex += PIXEL_LENGTH_BLURRED){

        baseDestPixelIndex = stripIndex * PIXEL_STRIP_LENGTH + pixelIndex;
        var on = strip >>> 31;

        var r,g,b,a;
        if(on){
        r = rA;
        g = gA;
        b = bA;
        a = aA;
        }
        else{
        r = rB;
        g = gB;
        b = bB;
        a = aB;
        }

        for(let i = 0; i < PIXEL_LENGTH_BLURRED; i+=4){
            imgData.data[baseDestPixelIndex+i] = r;
            imgData.data[baseDestPixelIndex+i+1] = g;
            imgData.data[baseDestPixelIndex+i+2] = b;
            imgData.data[baseDestPixelIndex+i+3] = a;
        }
        strip = strip << 1;

    }
    }

    ctx.putImageData(imgData,0,0);

    return this.canvas();
}


// other: sprite
// xoff: int
// yoff: int
// returns true or false
// apply offset to the 'other' sprite and then test if there is any intersection between the two sprites
Sprite.prototype.collidesWithOffsetSprite = function(other,xoff,yoff){
    return compressedOps.collide(
        this.compressedBuffer,this.width,this.height,
        other.compressedBuffer,other.width,other.height,
        xoff+other.xoff - this.xoff, yoff + other.yoff - this.yoff);
}

// other: sprite
// xoff: int
// yoff: int
// returns undefined
// modifies this sprite to be the logical OR of the two sprites, where the other sprite is offset
Sprite.prototype.addSprite = function(other,xoff,yoff){
    compressedOps.or(
        this.compressedBuffer,this.width,this.height,
        other.compressedBuffer,other.width,other.height,
        xoff+other.xoff - this.xoff, yoff + other.yoff - this.yoff
    );
}

export default Sprite;