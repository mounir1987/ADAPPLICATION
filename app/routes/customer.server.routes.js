/*
** Server routes : index.server.routes.js
**
** LCL Back-end
** ballot_g
*/

module.exports = function(app) {
    var customerModel = require('../models/customer.server.model');
    var customerController = require('../controllers/customer.server.controller');

    app.get('/user/create', customerModel.createCustomer);
    app.get('/user/signin', customerController.signInCustomer);
    app.get('/user/getall', customerController.getAllCustomers);
};
