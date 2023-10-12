const utils = require('../utils/utils')
const { db } = require('../db')
const Book = db.books

// CREATE
exports.create = async (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ error: "One or all required parameters are missing." })
    }

    const createdBook = await Book.create({ title: req.body.title })
    console.log(`${req.body.title}'s auto-generated ID:", ${createdBook.id}`);

    res.status(201)
        .location(`${utils.getBaseUrl(req)}/books/${createdBook.id}`)
        .send(createdBook)
}
// READ
exports.getAll = async (req, res) => {
    const result = await Book.findAll({ attributes: ["id", "title"] })
    res.send(JSON.stringify(result))
}
exports.getById = async (req, res) => {
    const { id } = req.params
    const book = await Book.findByPk(id)

    if (!book) {
        return res.status(404).send({ error: "book not found." })
    }

    res.send(book)
}
// UPDATE
exports.updateById = async (req, res) => {
    const { id } = req.params

    if (!req.body.title) {
        res.status(400).send({ error: "One or all required parameters are missing." })
    }

    const book = await Book.findByPk(id)

    if (!book) {
        return res.status(404).send({ error: "book not found." })
    }

    const updatedBook = await Book.update(
        { title: req.body.title },
        { where: { id: book.id } }
    )

    if (updatedBook < 1) {
        return res.status(404).send({ error: "could not update book" })
    }

    if (!updatedBook) {
        return res.status(404).send({ error: "book not found." })
    }

    res.status(200).send("book updated successfully.")
}

// DELETE
exports.deleteOne = async (req, res) => {
    const { id } = req.params

    const book = await Book.destroy({
        where: {
            id: id
        }
    });

    if (!book) {
        return res.status(404).send({ error: "book not found." })
    }

    res.status(204).send()
}