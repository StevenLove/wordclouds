import Spiral from "./spiral.js";
import Sprite from "./Sprite.js";
import Color from "color";
import constants from "./constants.js";
import fabric from "./fabric.js";
import fabricutils from "./fabricutils.js";
import utils from "./utils.js";
import seedrandom from "seedrandom";

function AttributeManager(seed){
  this._options = [];
  this._seed = seed;
  this.reset();
}
AttributeManager.prototype.reset = function(){this._rand = seedrandom(this._seed);return this;}
AttributeManager.prototype.getRandom = function(){
  if(this._options && this._options.length > 0){
    return utils.GetRandomElement(this._options,this._rand);
  }
}
AttributeManager.prototype.options = function(){
  if(arguments.length > 0){
    this._options = arguments[0];
    return this;
  }
  else{
    return this._options;
  }
}

function Board(){
  this._seed = Math.random();
  this.resetAttributeManagers();
  this._palette=["#000000"];
  this._angles=[0];
  this._fonts=["courier"];
  this.texts = [];
  this._width = constants.BLANKET_WIDTH_PIXELS;
  this._height = constants.BLANKET_HEIGHT_PIXELS;
  this._bg = {mode:"transparent",color:"rgb(255,255,255)"}
  this._sprite = new Sprite().fromDimensions(this._width,this._height);
  // this._fabcan;
  // this.worker = new Worker("./worker.js");
  return this;
}
Board.prototype.resetAttributeManagers = function(){
  this.fontAttributeManager = new AttributeManager(this.seed()).options(this.fonts());
  this.colorAttributeManager = new AttributeManager(this.seed()).options(this.palette());
  this.rotationAttributeManager = new AttributeManager(this.seed()).options(this.angles());
}
/* Reapply current color rules to all existing fabric text elements on the page */
Board.prototype.setExistingColors = function(){
  console.log("set existing colors",this);
  this.fabcan().forEachObject(obj=>{
    if(obj instanceof fabric.Text){
      let c = this.colorAttributeManager.getRandom();
      console.log("color set to ",c);
      obj.set("stroke",c);
      obj.set("fill",c);
    }
  })
  this.fabcan().renderAll();
}
Board.prototype.fabcan = function(newvalue){
  if(newvalue){
    this._fabcan = newvalue;
    console.log("setting dimensions",this.width(),this.height());
    this._fabcan.setDimensions({width:this.width(),height:this.height()},{backstoreOnly:true})
    // this._fabcan.setWidth(this.width());
    // this._fabcan.setHeight(this.height());
    return this;
  }
  else{
    if(!this._fabcan){
      this._fabcan = fabric.getCanvas(this.width(),this.height());
    }
    return this._fabcan;
  }
};

["bg","width","height","sprite","seed","palette","angles","fonts","shape"].forEach(prop=>{
  Board.prototype[prop] = function(newValue){
      if(newValue===undefined){return this["_"+prop]} // get the property
      this["_"+prop] = newValue; // set the property
      if(prop=="angles" || prop=="fonts" || prop == "palette" || prop == "seed"){this.resetAttributeManagers();}
      // if(prop=="seed"){this.resetAttributeManagers();} // automatically update the random number generator if we change the seed
      if(prop=="palette"){this.setExistingColors();}
      if(prop=="bg"){this.updateBG();}
      if(prop=="shape"){this.updateShape();}
      return this;
   }
})
Board.prototype.updateShape = function(){
  let sprite = new Sprite().fromBackgroundImage(this.shape().filename);
  if(this.shape().inverted){
    sprite.invert();
  }
  this.sprite().clear().addSprite(sprite,0,0);
}
Board.prototype.toSprite = function(){
  return this.sprite();
};
Board.prototype.updateBG = function(){
  this.fabcan().forEachObject(obj=>{
    if(obj.id=="bg"){
      console.log("board applying bg",this.bg(),"to el",obj);
      obj.set("fill",this.getBGColor());
      this.fabcan().renderAll();
    }
  })
}
Board.prototype.getBGColor = function(){
  if(this.bg().mode=="transparent"){
   return "rgba(0,0,0,0)"
  }
  else{
    return this.bg().color;
  }
}
Board.prototype.showSpiral = function(spiral){
    spiral.reset();
    while(spiral.hasNext()){
      let loc = spiral.next();
      fabricutils.drawDot(this.fabcan(),loc[0],loc[1]);
    }
}
Board.prototype.clear = function(){
  this.resetAttributeManagers();
  this.fabcan().remove(...this.fabcan().getObjects());
  fabricutils.clearColor(this.fabcan(),this.getBGColor());
  // this.showSpiral(Spiral.random);
  if(this.shape()){
    this.updateShape();
  }
  else{
    this.sprite(new Sprite().fromDimensions(this.width(),this.height()));
  }
  return this;
};
Board.prototype.tryToPlace = function(text){
  // console.log("trying to place",text.text());

  text.fontFamily(this.fontAttributeManager.getRandom());
  text.angle(this.rotationAttributeManager.getRandom());
  

  return new Promise((res,rej)=>{
    setTimeout(()=>{
      let spiral = Spiral.rectangular;// Spiral.random(this.width()-1,this.height()-1);
      spiral.reset();
      // var spiral = Spiral.archimedean(this.width()-1,this.height()-1);
      while(spiral.hasNext()){
        var loc = spiral.next();
        // console.log(JSON.stringify(loc));
        var x = loc[0] | 0;
        var y = loc[1] | 0;
        if(this.canPlace(text,x,y)){
          text.color(Color(this.colorAttributeManager.getRandom())); // only get a random color for words we can actually place. This way we get the same randomness as when we iterate over existing words
          this.place(text,x,y);
          res();
          // console.log("after place");
          return;
        }
      }
      rej();
      console.log("failed to place");
    })
  })
  
  // this.worker.postMessage(text);
  
}
Board.prototype.place = function(text, x,y){
    this.sprite().addSprite(text.toSprite(),x,y);
    // console.log("after placement sprite",this.sprite());
    // this.sprite(text.toSprite());
    var fab = text.toFabric();
    fab.set("left",x+text._leftOffsetToCenter);
    fab.set("top",y+text._topOffsetToCenter);
    this.fabcan().add(fab);
}
Board.prototype.canPlace = function(text,x,y){
  return !this.sprite().collidesWithOffsetSprite(text.toSprite(),x,y);
}
Board.prototype.draw = function(){
  // if(this._fabcan){
  //   // this.fabcan().renderAll();
  //   return this;
  // }
  // fabric.display(this.fabcan());
  // return this;

  if(!this._fabcan){
    this._fabcan = fabric.getCanvas(this.width(),this.height());
    // fabric.display(this._fabcan);
  }
  else{
    let f = this._fabcan;
      // f.clear();
      // f.add(new fabric.Rect({width:10,height:20,fill:"red"}));
  }
}
Board.prototype.matchSpriteToCanvas = function(){
  let s = new Sprite().fromFabric(this.fabcan());
  this.sprite(s);
  return this;
}
Board.prototype.showSpriteOnCanvas = function(canvasID){
  let spriteFabcan = fabric.fromID(canvasID);
  this.toSprite().draw(spriteFabcan);
}


export default Board;

