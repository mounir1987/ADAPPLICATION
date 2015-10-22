/*
** Server routes : index.server.routes.js
**
** LCL Back-end
** ballot_g
*/

module.exports = function(app) {
    var index = require('../controllers/index.server.controller');
    app.get('/', index.render);
};
