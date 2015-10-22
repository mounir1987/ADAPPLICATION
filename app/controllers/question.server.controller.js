/*
** Question controller : account.server.controller.js
**
** LCL Back-end
** ballot_g
*/

var mailer = require("nodemailer");
var mongoose = require('mongoose');
var Question = mongoose.model('Question');
var Customer = mongoose.model('Customer');

exports.askQuestion = function(req, res) {
    Question.findOne({ focused_status: req.param('status') }, function(error, question) {
	    res.writeHead(200, {
		    'Content-Type': 'application/json; charset=utf-8'
		});
	    if (!question) {
		res.status(404).send();
	    } else {
		res.end(question.title);
	    }
	});
};

exports.answerQuestion = function(req, res) {
    Customer.findOne({ name: req.param('name') }, function(error, customer) {
	    if (!customer) {
		res.status(403).end("error finding user");
	    } else {
		mailer.createTransport("SMTP", {
			service: "Gmail",
			auth: {
			    user: "lcl.innovation.hub@gmail.com",
			    pass: "LCL-innovation42"
			}
		    }).sendMail({
			    from: "LCL <lcl.innovation.hub@gmail.com>",
			    to: req.param('name') + ' <' + customer.email.toString() + '>',
			    subject: "Merci d'avoir répondu !",
			    text: "Nous vous remercions d'avoir répondu à notre sondage 3.0 !",
			}, function(error, response) {
			    if (error) {
				console.log(error);
			    } else {
				console.log("Message sent: " + response.message);
			    }});
		res.status(200).end("over");
	    }
	});
}