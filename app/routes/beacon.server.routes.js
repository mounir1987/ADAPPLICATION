/*
** Server routes : beacon.server.routes.js
**
** LCL Back-end
** ballot_g
*/

module.exports = function(app) {
    var beaconModel = require('../models/beacon.server.model');
    var beaconController = require('../controllers/beacon.server.controller');

    app.get('/beacon/set', beaconModel.setBeacon);
    app.get('/beacon/delete', beaconModel.removeBeacon);

    app.get('/beacon/get', beaconController.getBeacon);
    app.get('/beacon/all', beaconController.getAllBeacons);
};
