const usersController = require('../controllers/usersController.js')

module.exports = (app) => {
    app.route('/users')
        .get(usersController.getAll)         // READ
        .post(usersController.createNew)     // CREATE
    app.route('/users/:id')
        .get(usersController.getById)        // READ
        .put(usersController.editById)       // UPDATE
        .delete(usersController.deleteById)  // DELETE
}