/*
** Customer model : customer.server.model.js
**
** LCL Back-end
** ballot_g
*/

var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');

exports.createCustomer = function(req, res) {
    Customer.findOne({ name: req.param('name') }, function(error, customer) {
	    res.writeHead(200, {
		    'Content-Type': 'application/json; charset=utf-8'
		});
	    if (!customer) {
		console.log("Creating user");
		customer = new Customer({
			name:		req.param('name'),
			email:		req.param('email'),
			agency:		req.param('agency'),
			age:		req.param('age'),
			childs_id:	null,
			accounts:	null,
			status:		req.param('status'),
			updated_at:	Date.now()
		    }).save( function( err, cust, count ){
			    res.end(JSON.stringify(cust));
			});
	    } else {
		res.end(JSON.stringify(customer));
	    }
	});
};
