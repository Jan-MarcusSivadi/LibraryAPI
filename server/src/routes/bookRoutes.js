const booksController = require('../controllers/booksController.js')

module.exports = (app) => {
    app.route('/books')
        .get(booksController.getAll)        // READ
        .post(booksController.create)       // CREATE
    app.route('/books/:id')
        .get(booksController.getById)       // READ
        // .put(b)                          // UPDATE
        .delete(booksController.deleteOne)  // DELETE
}