let fabric = require("./fabric.js");
let Color = require("color");
let Utils = require('./utils.js');
let Sprite = require("./Sprite.js");

function Text(){
    this._text = "hello world"; 
    this._color = Color("#000000");
    this._fontFamily = "Courier";
    this._fontSize = 12;
    this._angle = 0;
    this._strokeWidth = 1
    // this._leftOffsetToCenter;
    // this._topOffsetToCenter;
    return this;
};


["text","color","fontFamily","fontSize","angle","strokeWidth","sprite"].forEach(prop=>{
    Text.prototype[prop] = function(newValue){
        if(newValue===undefined){return this["_"+prop]}
        if(prop=="color"){
            try{
                newValue = Color(newValue);
            }
            catch(e){newValue = Color("black")}
        }
        if(prop=="fontSize"){
            if(newValue < 6) newValue = 6;
        }
        if(prop=="angle"){
            console.log("text new angle",newValue);
        }
        this["_"+prop] = newValue;
        this._fab = undefined; // if we changed a property, invalidate the old fab
        if(["text","fontFamily","fontSize","angle","strokeWidth"].includes(prop)){
            this._sprite = undefined; // if we changed a property, invalidate the old sprite
        }
        return this;
     }
})

Text.prototype.toFabric = function(){
    if(this._fab)return this._fab;
    this._fab = new fabric.Text(
        this.text(),
        {
          left: 0,
          top: 0,
          fill: this.color().hex(),
          stroke: this.color().hex(),
          fontFamily: this.fontFamily(),
          fontSize: this.fontSize(),
          angle: this.angle(),
          // stroke: "#000000",
          strokeWidth: this.strokeWidth(),
  
        }
      );
    return this._fab;
}

Text.prototype.getBounds = function(){
    let scratch = fabric.getScratchCanvas();
    let fab_text = this.toFabric();
    // get the dimensions of this bad boy
    scratch.add(fab_text);
    var bounds = fab_text.getBoundingRect();
    bounds.left = Utils.floor(bounds.left);
    bounds.top = Utils.floor(bounds.top);
    bounds.width = Utils.ceil(bounds.width);
    bounds.height = Utils.ceil(bounds.height);
    return bounds;
}

Text.prototype.fixOffset = function(){
    /* automatically adjust the top/left to be at (1,1) */
    let fabObj = this.toFabric();
    // if we didn't move this to (0,0) first then we could get the wrong impression of where it needs to be offset
    fabObj.set("left",0);
    fabObj.set("top",0);
    let bounds = this.getBounds();
    fabObj.set("left",-bounds.left);
    fabObj.set("top",-bounds.top);
    this._leftOffsetToCenter = -bounds.left;
    this._topOffsetToCenter = -bounds.top;
}

/* Draw a text
optionally input a fabric canvas and we'll draw the text on that canvas */
Text.prototype.draw = function(fab){
    let b = this.getBounds();
    let w = b.width;
    let h = b.height;

    /* bounds to be drawn */
    let boundingRect = new fabric.Rect({
        left: 0,
        top: 0,
        width: w,
        height: h,
        fill: 'rgba(0,0,0,0)', // no fill
        stroke: 'red',
        strokeWidth: 1
     });

    let fab_text = this.toFabric();
    this.fixOffset();

    if(!fab){
        let newfab = fabric.getCanvas(w,h);
        newfab.add(fab_text,boundingRect);
        fabric.display(newfab);
    }
    else{
        fab.add(fab_text,boundingRect);
        // fab.renderAll();
    }
    return this;
}
Text.prototype.toImageData = function(){
    let scratch = fabric.getScratchCanvas(); // clears the scratch canvas
    let b = this.getBounds(); // draws the text on it
    
    // let fab = this.toFabric();
    // scratch.add(fab); // we don't need to add because getting the bounds did so
    scratch.renderAll(); // otherwise the canvas will still be blank when we try to get the image data
    // fabric.display(scratch);
    var image_data = scratch.contextContainer.getImageData(0,0,b.width,b.height);
    return image_data;
}
Text.prototype.fromImageData = function(data){
    let c = fabric.getCanvas(200,200);
    c.contextContainer.putImageData(data,0,0);
}

Text.prototype.toSprite = function(){
    if(this._sprite)return this._sprite;
    // this.angle(0);
    console.log("to sprite of text",this._text,this);
    let scratch = fabric.getScratchCanvas(); // automatically clears the scratch canvas
    let b = this.getBounds(); // gets the bounds but it also draws the text on the canvas so we don't need to redo that step
    this.fixOffset();
    
    scratch.renderAll(); // otherwise the canvas may still be blank when we try to get the image data
    var image_data = scratch.contextContainer.getImageData(0,0,b.width,b.height);
    this.sprite(new Sprite().fromImageData(image_data));
    return this._sprite
}

module.exports = Text;