const utils = require('../utils/utils')
const { db } = require('../db')
const Book = db.books
const path = require('path')
const fs = require('fs')
const zlib = require('node:zlib');

const config = {
    host: 'jan-marcussivadi21.thkit.ee',
    user: 'd118287f550018',
    password: 'secretword12345',
}


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
        pdf: NOT NULL
        */
        // temporary variables
        var fields = [];
        const doc = {}
        var bufs = [];
        doc.size = 0;

        const busboy = req.busboy;
        if (busboy) {
            busboy
                .on('field', (name, value, info) => {
                    console.log('req.busboy: field event')
                    fields.push({
                        name: name,
                        value: value
                    })
                })
                .on('file', (name, file, info) => {
                    console.log('req.busboy: file event')
                    file
                        .on('data', (data) => {
                            bufs[bufs.length] = data;
                            doc.size += data.length;
                        })
                        .on('end', () => {
                            const splits = info.mimeType.split('/')
                            const extension = splits[splits.length - 1]
                            const fixedFilename = utils.getFixedFileName(`file-${Date.now()}.${extension}`) //info.filename
                            const fileURL = `http://${config.host}/data/books/${fixedFilename}`
                            doc.content = Buffer.concat(bufs, doc.size);
                            info.url = fileURL
                            info.filename = fixedFilename
                            doc.info = info
                        });
                })
                .on('close', async () => {
                    console.log('req.busboy: finish event')
                    const formData = utils.toObject(fields)

                    // validate fields
                    const { title, author, description, booklength, language } = formData
                    var releasedate = formData.releasedate
                    var price = formData.price || 0 // default price value is 0, even when unspecified
                    if (price <= 0) {
                        price = 0
                    }
                    if (
                        !title ||
                        !author ||
                        !releasedate ||
                        !booklength
                    ) {
                        res.status(400).send({ error: "One or all required parameters are missing." })
                        return
                    }

                    console.log(releasedate, utils.isValidDate(releasedate));
                    if (!utils.isValidDate(releasedate)) {
                        res.status(400).send({ error: "releasedate invalid." })
                        return
                    }
                    // // invalid date given
                    // if (!utils.isValidDate(releasedate)) {
                    //     res.status(400).send({ error: "releasedate invalid." })
                    //     return
                    // }

                    // fix date day offset bug
                    // releasedate = utils.formatDate(releasedate)

                    var result
                    if (doc.size > 0) {
                        const { Readable } = require('stream');
                        const stream = Readable.from(doc.content);
                        // connect to FTPS file server
                        const ftpsSession = await utils.connectFTPS(config)
                        const connection = await ftpsSession.connect()
                        if (!connection) {
                            console.log('Could not establish connection to FTPS server')
                            return
                        }
                        const gotFiles = await ftpsSession.getFiles('data/books/')
                        console.log(gotFiles)
                        // Upload to FTPS file server
                        result = await ftpsSession.uploadFile(stream, "data/books/", doc.info).then((result) => {
                            console.log(result)
                            // close session
                            ftpsSession.disconnect()
                            return result
                        });
                        // more catches here for (result.code)
                    } else {
                        // when no file given, price cannot be more than 0 
                        if (price > 0) {
                            res.status(400).send({
                                message: 'Book document missing, price cannot be set'
                            })
                            return
                        }
                    }

                    // create document object
                    const document = doc.info
                    const pdf = document?.url // default value is null
                    console.log(document)

                    // create new Book
                    const bookData = {
                        title: title,
                        author: author,
                        description: description,
                        releasedate: releasedate,
                        booklength: booklength,
                        language: language,
                        price: price,
                        pdf: pdf
                    }
                    console.log(bookData)

                    const createdBook = await Book.create(bookData)
                    console.log(`${bookData.title}'s auto-generated ID: ${createdBook.id}`);

                    res.status(201)
                        .location(`${utils.getBaseUrl(req)}/books/${createdBook.id}`)
                        .json(createdBook)
                })
            req.pipe(busboy);
        }
    } catch (error) {
        console.error(error)
    }
}
// READ
exports.getAll = async (req, res) => {
    try {
        const result = await Book.findAll({ attributes: ["id", "title", "description", "author", "releasedate", "language", "booklength", "price"] })
        res.json(result)
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
            res.status(500).send({ error: "could not update book" })
            return
        }

        if (!updatedBook) {
            res.status(404).send({ error: "book not found." })
            return
        }

        res.status(200)
            .location(`${utils.getBaseUrl(req)}/books/${id}`)
            .send()
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