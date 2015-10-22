/*
** achat-vente Hub project
** server.js - Server entry point
*/

require('./db');
var express = require('./config/express');
var moment = require('moment');
var httpreq = require('httpreq');
var fs = require('fs');

var port = 21996;
var app = express();


//var day = moment('2015-10-17 15:22').locale('fr');
//console.log(day['_d']);

app.listen(port);
module.exports = app;
console.log('Server running on a AWS server on port:' + port);


/*
var nom = "photo.jpg";

httpreq.get('http://images.ouedkniss.com/photos_annonces/7681377/phone.jpg?v=1445131612', {binary: true}, function (err, res){
  if (err){
      console.log(err);
  }else{
    //console.log(src);
    fs.writeFile( __dirname + '/' + nom, res.body, function (err) {
        if(err)
            console.log("error writing file");
    });

    
  }
});
*/