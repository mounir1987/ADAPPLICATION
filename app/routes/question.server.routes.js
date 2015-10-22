/*
** Server routes : account.server.routes.js
**
** LCL Back-end
** ballot_g
*/

module.exports = function(app) {
    var questionModel = require('../models/question.server.model');
    var questionController = require('../controllers/question.server.controller');

    app.get('/question/create', questionModel.createQuestion);
    app.get('/question/answer', questionController.answerQuestion);
    app.get('/question/ask', questionController.askQuestion);
};
