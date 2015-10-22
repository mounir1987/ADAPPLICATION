/*
** Beacon model : beacon.server.model.js
**
** LCL Back-end
** ballot_g
*/

var mongoose = require('mongoose');
var Beacon = mongoose.model('Beacon');

exports.setBeacon = function(req, res) {
    Beacon.findOne({ major: req.param('major'), minor: req.param('minor') },
		   function(error, beacon) {
		       res.writeHead(200, {
			       'Content-Type': 'application/json; charset=utf-8'
			   });
		       if (!beacon) {
			   console.log("Creating beacon");
			   beacon = new Beacon({
				   usecase:	req.param('usecase'),
				   major:	req.param('major'),
				   minor:	req.param('minor'),
				   profile:	req.param('profile'),
				   updated_at:	Date.now()
			       }).save( function( err, b, count ){
				       res.end(JSON.stringify(b));
				   });
		       } else {
			   if (req.param('profile'))
			       beacon.profile = req.param('profile');
			   if (req.param('usecase'))
			       beacon.usecase = req.param('usecase');
			   beacon.save(function (err, b, count) {
				   res.end(JSON.stringify(b));
			       });
		       }
		   });
};

exports.removeBeacon = function(req, res) {
    Beacon.findOne({ major: req.param('major'), minor: req.param('minor') },
		   function(error, beacon) {
		       if (!beacon) {
			   res.status(403).send();
		       } else {
			   beacon.remove();
			   res.status(200).send('true');
		       }
		   });
};
