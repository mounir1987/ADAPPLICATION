/*
** Server routes : index.server.routes.js
**
** LCL Back-end
** ballot_g
*/

module.exports = function(app) {
    var annonces = require('../controllers/annonces.server.controller');
    app.get('/annonces', annonces.render);
    app.get('/drop', annonces.drop);
    app.get('/update', annonces.update);
    app.get('/detail/:id', annonces.detail);
};
