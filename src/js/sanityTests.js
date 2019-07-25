var test = require("tape").test;
var inputParser = require("./inputParser.js");
var utils = require('./utils.js');




test('A passing test', function(assert) {
  assert.pass('This test will pass.');
  assert.end();
});

test('utils assertHasProperties',function(assert){
  var obj = {one:1,two:2}
  var failed = false;
  try{
    utils.assertHasProperties(obj,"one");
    utils.assertHasProperties(obj);
    utils.assertHasProperties(obj,"two","one");
    assert.pass();
    utils.assertHasProperties(obj,"three");
  }
  catch(err){
    failed = true;
  }
  assert.equals(failed,true);
  assert.end();
});


test('inputParser', function(assert){
  var obj = {
    phrases:[
      {
        text:"Hello",
        rotation:90
      },
      {
        text:"world",
        rotation:45
      }
    ],
    invert:true,
    file:false,
    bg:{
      mode: "transparent"
    }
  }

  var str = JSON.stringify(obj);
  var parsedString = inputParser.parse(str);
  var parsedObj = inputParser.parse(obj);
  assert.deepEquals(parsedString,parsedObj);
  assert.deepEquals(obj,parsedObj);

  assert.equals(parsedString.invert,true);
  assert.equals(parsedString.file,false);
  assert.deepEquals(parsedString.bg,{mode:"transparent"});
  assert.deepEquals(parsedString.phrases,[{text:"Hello",rotation:90},{text:"world",rotation:45}]);

  var garbage = {phrases:{},invert:true};
  var failed = false;
  try{
    inputParser.parse(garbage)
  }
  catch(err){
    failed = true;
  }
  assert.equals(failed,true);


  assert.end();
})