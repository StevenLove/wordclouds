var seedrandom = require("seedrandom");

var SetGlobalSeed = function(seed){
  seedrandom(seed, { global: true });
}

var CloneObject = function(obj){
  var result = {};
  for (var i in obj) {
    if(obj.hasOwnProperty(i)){
      result[i] = obj[i];
    }
  }
  return result;
}
var CloneArray = function(arr){
  var result = [];
  for (var i in arr) {
    result[i] = arr[i];
  }
  return result;
}

var GetRandomElement =function(array,rand){
  return array[GetRandomIndex(array,rand)];
}

var GetModuloElement = function(array,index){
  var mod = array.length;
  var mod_index = index % mod;
  return array[mod_index];
}

var RandomInRange = function(min,max,rand){
  if(!rand) rand = Math.random;
  if(min > max) throw "random in range with min > max";
  var width = max-min;
  var result = min + rand() * width;
  return result;
}

var RandomIntInRange = function(min,max,rand){
  if(!rand) rand = Math.random;
  min = Math.ceil(min);
  max = Math.floor(max);
  max += 1;
  return Math.floor(RandomInRange(min,max,rand));
}

var RandomSubset = function(array, subset_len){
  var all_indices = WholeNumbers(array.length);
  var all_indices_shuffled = Shuffle(all_indices);
  var chosen_indices = all_indices_shuffled.slice(0,subset_len);
  return chosen_indices.map(function(index){
    return array[index];
  })
}

var GetRandomIndex = function(array,rand){
  if(!rand)rand = Math.random;
  if(!array || array.length < 1){
    console.error("Tried to get random index of empty array");
  }
  var size = array.length;
  var r = rand() * size;
  // round down
  r = Math.floor(r);
  return r;
}

var Update = function(obj, updater){
  for(var i in updater){
    if(obj.hasOwnProperty(i)){
      obj[i] = updater[i];
    }
  }
}

var FindClosestItemInList = function(item, list){
  if(!list){
    return item
  }
  var diff = function(a,b){
    return Math.abs(a-b);
  };
  var closest = list.reduce(function (prev, curr) {
    return (diff(item,curr) < diff(item,prev) ? curr : prev);
  });
  return closest;
};

var ArrayToFrequencyObject = function(arr){
  return arr.reduce(function(obj,item){
    var current_count = obj[item]? obj[item] : 0
    obj[item] = current_count + 1;
    return obj;
  },
  {});
}

var Clamp = function(min,val,max){
  return Math.min(Math.max(min,val),max);
}

var Shuffle = function(array){
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var WholeNumbers = function(length){
  var result = [];
  for(var i = 0; i < length; ++i){
    result[i] = i;
  }
  return result;
}

var RemoveDuplicates = function(array){
  return Object.keys(ArrayToFrequencyObject(array));
}

var LogBaseBofX = function(base,x){
  return Math.log(x) / Math.log(base);
}

var IsString = function(variable){
  return typeof variable === "string"
}


var assign = function (target) {
  // Object.assign polyfill
  'use strict';
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  var output = Object(target);
  for (var index = 1; index < arguments.length; index++) {
    var source = arguments[index];
    if (source !== undefined && source !== null) {
      for (var nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
  }
  return output;
}

var isInteger = function(num){
  return (num === (~~num));
}

var ceil = function(num){
  return (num+1) | 0;
}
var floor = function(num){
  return num | 0;
}
var assertHasProperty = function(obj,prop){
  console.log(prop);
  if(obj[prop] === undefined) throw "object doesn't have the required " + prop + " property.";
}
var assertHasProperties = function(obj){
  var props = Array.prototype.slice.call(arguments,1);
  // console.log(props);
  props.forEach(function(prop){
    assertHasProperty(obj,prop);
  })
}
/* Observer */
function Observer(){
  this.handlers = [];
}
Observer.prototype.on = function(h){this.handlers.push(h)};
Observer.prototype.off = function(r){this.handlers = this.handlers.filter(h=>h!==r)};
Observer.prototype.notify = function(){this.handlers.forEach(h=>h(...arguments))};


/* Timer */
function Timer(){
    this.delayTime = 1000;
    this.repeats = false;
    this.obs = new Observer();
    this.handle = undefined;
    this._inProgress = false;
}
Timer.prototype.stop = function(){
    if(this.handle)clearTimeout(this.handle);
    this.handle = undefined;
    this._inProgress = false;
    return this;
}
/* Calling start on an already started timer will do nothing
but even if the timer doesn't repeat, if it has finished then calling start will restart it */
Timer.prototype.start = function(){
    if(this._inProgress) return; // already in progress
    this._inProgress = true;
    this.handle = setTimeout(()=>{
        this.obs.notify();
        this._inProgress = false;
        if(this.repeats)this.start();
    },this.delayTime)
    return this;
}
Timer.prototype.reset = function(){
    this.stop();
    this.start();
    return this;
}
Timer.prototype.repeat = function(bool){ this.repeats=bool;return this;}
Timer.prototype.delay = function(ms){this.delayTime = ms; return this;}
Timer.prototype.repeatEvery = function(ms){this.repeats=true;this.delayTime=ms;return this;}
Timer.prototype.destroyWith = function(scope){scope.$on("$destroy",this.stop);return this;}
Timer.prototype.then = function(f){this.obs.on(f); return this;}
/* Helps us invoke asynchronous calls sequentially */
function Serializer(){
    this.clear();
}
Serializer.prototype.add = function(f){
  this.queue.push(f);
  if(!this.busy){
    this.busy = true;
    this.call().finally(this.callFinished.bind(this));
  }
}
Serializer.prototype.call = function(){
  if(this.stopping)return Promise.resolve();
  let firstFunction = this.queue.shift();
  return firstFunction().finally(this.callFinished.bind(this,this.id));
}
Serializer.prototype.callFinished = function(callerID){
  console.log("call finished",callerID);
  if(this.id == callerID){
    if(this.queue.length >0){
      this.call();
    }
    else{
      this.busy = false;
      this.obs.notify();
    }
  }
};
Serializer.prototype.start = function(){
  this.stopping = false;
  this.call();
}
Serializer.prototype.stop = function(){
  console.log("stopping serializer");
  this.stopping = true;
}
Serializer.prototype.on = function(){
  return this.obs.on(...arguments);
}
Serializer.prototype.clear = function(){
  this.id = Math.random();
  this.queue = [];
  this.obs = new Observer();
  this.busy = false;
  this.stopping = false;
}

/* perform a function on each element of an array in sequence, for asynchronous functions that return promises */
function asyncSequentially(array,fn) {
  let p = Promise.resolve(); // Q() in q

  array.forEach(element =>{
      p = p.then(() => fn(element)); 
  });
  return p;
}


function getPropertySafe(){
  let args = Array.from(arguments);
  let obj = args.shift();
  let result = args.reduce((acc,curr)=>{
      if(acc === undefined || curr === undefined){
          return undefined;
      }
      else{
          return acc[curr];
      }
  },obj)
  return result;
}

function setPropertySafe(obj,propertyName,propertyValue){
  let args = Array.from(arguments);
  if(args.length <  3) return;
  if(args.length == 3){
      obj[propertyName] = propertyValue;
  }
  if(args.length > 3){
      if(obj[propertyName] == undefined){
          obj[propertyName] = {};
      }
      // now obj[propName] becomse the base object
      // and the remaining args are all shifted up one.
      return this.setSafe(obj[propertyName],...args.slice(2));
  }
}


module.exports = {
  getPropertySafe,
  setPropertySafe,
  Timer,
  Observer,
  Serializer,
  asyncSequentially,
  CloneObject: CloneObject,
  CloneArray: CloneArray,
  GetRandomElement: GetRandomElement,
  GetModuloElement: GetModuloElement,
  RandomInRange: RandomInRange,
  RandomIntInRange: RandomIntInRange,
  RandomSubset: RandomSubset,
  Update: Update,
  FindClosestItemInList: FindClosestItemInList,
  IsString: IsString,
  LogBaseBofX: LogBaseBofX,
  RemoveDuplicates: RemoveDuplicates,
  WholeNumbers: WholeNumbers,
  Shuffle: Shuffle,
  Clamp: Clamp,
  ArrayToFrequencyObject: ArrayToFrequencyObject,
  assign: assign,
  isInteger: isInteger,
  floor:floor,
  ceil:ceil,
  SetGlobalSeed: SetGlobalSeed,
  assertHasProperties: assertHasProperties
}
