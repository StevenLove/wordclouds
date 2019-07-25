
// host the server
var PORT = 8289;
var server = require("./hostHTTPServer.js");
server.host(PORT);



// return a function that takes the appropriate args and calls the callback
var localMain = require("./localMain.js");
var inputParser = require("./inputParser.js");
var outputFunction = function(input,callback){
  var io = inputParser.parse(input);
  localMain.createCloud(
    io.phrases,
    io.invert,
    io.file,
    io.bg,
    callback
  )
}
return outputFunction;

