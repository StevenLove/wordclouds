 var Board = require("./board.js"),
     Samples = require("./samples.js");


 var board = new Board(200,200);

 for(var i = 0 ; i < 10; ++i){
    var phrase = Samples.genPhrase(2,0);
    board.tryToPlace(phrase);
 }

 var sprite = board.getSprite();

 // spriter.toPNG(sprite,"./hailSatan.png");

 // var ctx = board.getCanvas().getContext('2d');

 // console.log(sprite.data.length);
 console.log(JSON.stringify(sprite.data));