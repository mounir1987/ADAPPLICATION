/*
** Beacon controller : beacon.server.controller.js
**
** LCL Back-end
** ballot_g
*/

var mongoose = require('mongoose');
var Beacon = mongoose.model('Beacon');

exports.getBeacon = function(req, res) {
    console.log("Trying to find beacon");
    Beacon.findOne({ major: req.param('major'), minor: req.param('minor') },
		   function(error, beacon) {
		       if (!beacon) {
			   res.status(403).send();
			   console.log("Beacon not found");
		       } else {
			   console.log("Beacon found");
			   res.writeHead(200, {
				   'Content-Type': 'application/json; charset=utf-8'
				       });
			   res.end(JSON.stringify({ profile: beacon.profile, usecase: beacon.usecase}));
		       }
		   });
};

exports.getAllBeacons = function(res, res) {
    console.log("Sending all beacons");
    Beacon.find({}, function(error, beacon) {
	    if (!beacon) {
		res.status(403).send();
		console.log("Beacons not found");
	    } else {
		console.log("Beacons found");
		res.writeHead(200, {
			'Content-Type': 'application/json; charset=utf-8'
			    });
		res.end(JSON.stringify(beacon));
	    }
	});
};