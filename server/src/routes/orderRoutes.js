const ordersController = require('../controllers/ordersController.js')

module.exports = (app) => {
    app.route('/orders')
        .get(ordersController.getAll)         // READ
        .post(ordersController.createNew)     // CREATE
    app.route('/orders/:id')
        .get(ordersController.getById)        // READ
        .put(ordersController.updateById)       // UPDATE
        .delete(ordersController.deleteById)  // DELETE
}