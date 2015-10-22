/*
** Server controller : index.server.controller.js
**
** Achat-vente  Back-end
** ballot_g
*/

var mongoose = require('mongoose');
var Telephone = mongoose.model('Telephone');
var moment = require('moment');

exports.render = function(req, res) {
	Telephone.
      find({ }).
      sort('-annonce.date_time').
      exec( function (err, telephones) {
      	var telMap = {};

	    telephones.forEach(function(telephone) {
	      telMap[telephone._id] = telephone;
	    });
	    //res.send(telMap[1]);  
	    res.render("annonces/annonces", {data : telephones});
      });

	

    //res.render("annonces/annonces", {});
};

exports.detail = function(req, res) {

	
    Telephone.findOne({  'annonce.numero': req.param('id')  },
		   function(error, telephone) {
		       if (!Telephone) {
			   console.log("Telephone not found");
		       } else {
		       	console.log("Telephone was found");
			   
			    //res.send(telephone);
				res.render("annonces/detail", telephone);
			   //res.end(JSON.stringify({ profile: beacon.profile, usecase: beacon.usecase}));
		       }
		   });

};


exports.drop = function(req, res) {

	res.render("annonces/remove",{});
	Telephone.remove({}, function(err) { 
       //res.send("remove all annonces");

    });
};

exports.update = function (req, res) {
	Telephone.find({}, function (err, telephones) {
	  	if (err) return handleError(err);
	  
	  	var day = moment('2015-10-10 15:22').locale('fr');
		console.log(day['_d']);

	    telephones.forEach(function(telephone) {
	      	telephone.annonce.date_time = day['_d'];
	      	telephone.save(function (err) {
			   	if (err) return handleError(err);
			    
			    console.log('saved');
			});

	    });
	    res.send(telephones);

	});
	console.log('update');

}