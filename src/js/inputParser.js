var utils = require("./utils.js");
var parse = function(input){
  if( typeof input === "string" ){
    return parseString(input);
  }
  else if ( typeof input === "object" ){
    utils.assertHasProperties(input,"phrases","invert","file","bg");
    return parseObject(input);
  }
  else{
    throw "wrong type of input, unable to parse";
  }
}

var parseObject = function(obj){
  return obj;
}

var parseString = function(str){
  return JSON.parse(str);
}

module.exports = {
  parse:parse
}