/*
** Question model : question.server.model.js
**
** LCL Back-end
** ballot_g
*/

var mongoose = require('mongoose');
var Question = mongoose.model('Question');

exports.createQuestion = function(req, res) {
    Question.findOne({ title: req.param('title') }, function(error, question) {
	    res.writeHead(200, {
		    'Content-Type': 'application/json; charset=utf-8'
		});
	    if (!question) {
		console.log("Creating question");
		question = new Question({
			title:			req.param('title'),
			focused_status:		req.param('status'),
			updated_at:		Date.now()
		    }).save( function( err, ques, count ){
			    res.end(JSON.stringify(ques));
			});
	    } else {
		res.end(JSON.stringify(question));
	    }
	});
};