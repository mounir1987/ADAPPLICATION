/*
** Server routes : index.server.routes.js
**
** LCL Back-end
** ballot_g
*/

module.exports = function(app) {
    var request = require('../controllers/request.server.controller');
    app.get('/get/telephones', request.getTelephones);
};
