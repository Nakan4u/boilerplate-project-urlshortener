'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

/* 
1) should return next result on post /api/shorturl/new - https://www.google.com
2) save address to the db;
3) on success return address id;
4) on get address by this id return origin address;
*/
// short url task
var dns = require('dns');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

var Schema = mongoose.Schema;
var AddressSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
});
var Address = mongoose.model('Address', AddressSchema);


app.get("/api/shorturl/:url", function (req, res) {
  var urlParam = req.params.url;
  var regex = /\b(?!new|\s-\s).+/;
  var url = urlParam.match(regex)[0];
  
  
  if (url) {
    // save address to the DB
    dns.lookup(url, (err) => {
      if (err) {
        res.json({error: err});
      }
      var address = new Address({ url: url });
      address.save(function(err, data) {
        if (err) {
          res.json({"error": err});
        }
        var sendData = {"original_url": url,"short_url": data};
        res.json({error: err});
      })
    });
  } else {
    // get address By id
    var id = req.params.url;
    
    Address.findById(id, function(err, data) {
       if(err) { res.json({error: err}); }
       res.json(data);
    });
  }
  
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});
