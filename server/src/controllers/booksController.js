const utils = require('../utils/utils')
const books = require('../books/data')

// CREATE
exports.create = async (req, res) => {
    if (!req.body.name) {
        res.status(400).send({ error: "One or all required parameters are missing." })
    }

    const createdBook = books.create({
        name: req.body.name
    })

    res.status(201)
        .location(`${utils.getBaseUrl(req)}/books/${createdBook.id}`)
        .send(createdBook)
}
// READ
exports.getAll = async (req, res) => {
    res.send(books.getAll())
}
exports.getById = async (req, res) => {
    const { id } = req.params

    const book = books.getById(id)

    if (!book) {
        return res.status(404).send({ error: "book not found." })
    }

    res.send(book)
}
// UPDATE

// DELETE
exports.deleteOne = async (req, res) => {
    const { id } = req.params

    const book = books.deleteOne(id);

    if (!book) {
        return res.status(404).send({ error: "book not found." })
    }

    res.status(204).send()
}