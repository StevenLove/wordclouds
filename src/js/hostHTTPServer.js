var server = require("./server.js");
var localMain = require("./localMain.js");


var hostService = function(callback){
  server.hostMultipart("userfile",function(req,res){

    // get arguments from the request
    var file = req.file;
    var partialPhrases = JSON.parse(req.body.phrases);
    var invert = JSON.parse(req.body.invert);
    var bg = JSON.parse(req.body.bg);
    var shape = JSON.parse(req.body.shape);
    var underlay = JSON.parse(req.body.underlay);

    actualCallback = callback.bind(null,res);

    var body = {
      partialPhrases:partialPhrases,
      invert: invert,
      bg:bg,
      shape:shape,
      underlay:underlay
    }
    body.shape.file = file;

    localMain.createCloud(
      body,
      // partialPhrases,
      // invert,
      // file,
      // bg,
      // shape,
      actualCallback
    );
  });
}

var callback = function(res,err,board){
  console.log("cloud created");
  if(err)throw err;
  board.debugPrint("./tests/canvasDebug.png","./tests/spriteDebug.png");
  res.end(board.getCanvas().toDataURL());
}

var host = function(port){
  hostService(callback);
  server.listen(port);
}

module.exports = {
  host:host
}