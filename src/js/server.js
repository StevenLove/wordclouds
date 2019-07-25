var express = require('express'),
  app = express(),
  cors = require('cors'),
  multer = require('multer'),
  upload = multer(),
  bodyParser = require('body-parser'),
  url_encoded_parser = bodyParser.urlencoded(
    {
      extended: false,
      limit: "50mb"
    }
  );

  // Cross Origin Resource Sharing
  app.use(cors())
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true,
    limit: "50mb",
    parameterLimit: 1000000,
  })); 


var listen = function(port){
  app.listen(port, function() {
    console.log('Listening on port '+ port);
  });
}

var hostStaticFolder = function(folder){
  app.use(
    express.static(folder)
  );
}

var hostIndex = function(page){
  app.get(
    '/',
    url_encoded_parser,
    function(req, res) {
      res.end(page.get());
    }
  );
}

var hostMultipart = function(fieldName, callback){
  app.post('/multi', upload.single(fieldName), function (req, res, next) {
    callback(req,res);
  })
}

module.exports = {
  listen:listen,
  hostStaticFolder: hostStaticFolder,
  hostIndex: hostIndex,
  hostMultipart: hostMultipart,
  post: function(path, func){
    app.post(path, func);
  },
  get: function(path,func){
    app.get(path, func);
  }
}