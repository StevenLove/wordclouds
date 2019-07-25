// var spriter = require("./spriter.js");
var Spiral = require("./spiral.js");
let Sprite = require("./Sprite.js");
// let Text = require("./Text.js");
let Color = require("color");
let constants = require("./constants.js");
var fabric = require("./fabric.js");
var fabricutils = require("./fabricutils.js");
let utils = require("./utils.js");
let seedrandom = require("seedrandom");

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
    console.log("options",this._options);
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
  this._bg = Color("rgba(0,0,0,0)");
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
Board.prototype.setColors = function(){
  this.resetAttributeManagers();
  // this.colorAttributeManager.reset().options(this.palette());
  console.log("FOREACH");
  this.fabcan().forEachObject(obj=>{
    if(obj instanceof fabric.Text){
      let c = this.colorAttributeManager.getRandom();
      console.log(obj);
      obj.set("stroke",c);
      obj.set("fill",c);
    }
  })
  this.fabcan().renderAll();
}
Board.prototype.addText = function(t){
  this.texts.push(t);
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

["bg","width","height","sprite","seed","colorPolicy","palette","angles","fonts","shape"].forEach(prop=>{
  Board.prototype[prop] = function(newValue){
      if(newValue===undefined){return this["_"+prop]} // get the property
      
      this["_"+prop] = newValue; // set the property
      if(prop=="seed"){this.resetAttributeManagers();} // automatically update the random number generator if we change the seed
      if(prop=="palette"){this.setColors();}
      if(prop=="bg"){this.updateBG();}
      if(prop=="shape"){this.updateShape();}
      return this;
   }
})
Board.prototype.updateShape = function(){

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
Board.prototype.clear = function(){
  this.resetAttributeManagers();
  fabricutils.clearColor(this.fabcan(),this.getBGColor());
  if(this.shape()){
    this.sprite(new Sprite().fromBackgroundImage(this.shape()));
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
      var spiral = Spiral.archimedean(this.width()-1,this.height()-1);
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
    fabric.display(this._fabcan);
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


module.exports = Board;

