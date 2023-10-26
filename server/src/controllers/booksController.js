const utils = require('../utils/utils')
const { db } = require('../db')
const Book = db.books

// CREATE
exports.create = async (req, res) => {
    try {
        /* 
            title: NOT NULL
            author: NOT NULL
            description: NULL
            releasedate: NOT NULL
            booklength: NOT NULL
            language: NULL
            price: NOT NULL
        */
        const { title, author, description, releasedate, booklength, language, price } = req.body
        if (
            !title ||
            !author ||
            !releasedate ||
            !booklength ||
            !price
        ) {
            res.status(400).send({ error: "One or all required parameters are missing." })
            return
        }
        const bookData = {
            title: title,
            author: author,
            description: description,
            releasedate: releasedate,
            booklength: booklength,
            language: language,
            price: price
        }

        const createdBook = await Book.create(bookData)
        console.log(`${req.body.title}'s auto-generated ID: ${createdBook.id}`);

        res.status(201)
            .location(`${utils.getBaseUrl(req)}/books/${createdBook.id}`)
            .send(createdBook)
    } catch (error) {
        console.error(error)
    }
}
// READ
exports.getAll = async (req, res) => {
    try {
        const result = await Book.findAll({ attributes: ["id", "title", "description", "author", "releasedate", "language", "booklength", "price"] })
        res.send(JSON.stringify(result))
    } catch (error) {
        console.error(error)
    }
}
exports.getById = async (req, res) => {
    try {
        const { id } = req.params
        const book = await Book.findByPk(id)

        if (!book) {
            res.status(404).send({ error: "book not found." })
            return
        }

        res.json(book)
    } catch (error) {
        console.error(error)
    }
}
// UPDATE
exports.updateById = async (req, res) => {
    try {
        const { title, author, description, releasedate, booklength, language, price } = req.body
        const { id } = req.params

        if (!title && !author && !description && !releasedate && !booklength && !language && !price) {
            res.status(400).send({ error: "At least one field is required." })
            return
        }

        const book = await Book.findByPk(id)

        if (!book) {
            res.status(404).send({ error: "book not found." })
            return
        }

        const updatedBook = await Book.update(
            {
                title: title,
                author: author,
                description: description,
                releasedate: releasedate,
                booklength: booklength,
                language: language,
                price: price
            },
            { where: { id: book.id } }
        )

        if (updatedBook < 1) {
            res.status(404).send({ error: "could not update book" })
            return
        }

        if (!updatedBook) {
            res.status(404).send({ error: "book not found." })
            return
        }

        res.status(200).send("book updated successfully.")
    } catch (error) {
        console.error(error)
    }
}

// DELETE
exports.deleteOne = async (req, res) => {
    try {
        const { id } = req.params

        const book = await Book.destroy({
            where: {
                id: id
            }
        });

        if (!book) {
            res.status(404).send({ error: "book not found." })
            return
        }

        res.status(204).send()
    } catch (error) {
        console.error(error)
    }
}