/*
** Account model : account.server.model.js
**
** LCL Back-end
** ballot_g
*/

var mongoose = require('mongoose');
var Account = mongoose.model('Account');

var _ceiling = 20000;
var _overdraft = -200;
var _rate = 4.2;

// todo account operations

exports.createAccount = function(req, res) {
    Account.findOne({ customer_id: req.param('customer_id'), name: req.param('name') }, function(error, account) {
	    res.writeHead(200, {
		    'Content-Type': 'application/json; charset=utf-8'
		});
	    if (!account) {
		console.log("Creating account");
		account = new Account({
			customer_id:	req.param('customer_id'),
			name:		req.param('name'),
			ceiling:	_ceiling,
			overdraft:	_overdraft,
			rate:		_rate,
			updated_at:	Date.now()
		    }).save( function( err, acc, count ){
			    res.end(JSON.stringify(acc));
			});
	    } else {
		res.end(JSON.stringify(account));
	    }
	});
};
