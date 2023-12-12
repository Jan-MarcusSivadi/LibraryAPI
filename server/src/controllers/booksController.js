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
    console.log('MY BOOOKKK!!!!',req.body)
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
        var fields = [];
        var files = [];

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
                            // const splits = info.mimeType.split('/')
                            const splits = info.filename.split('.')
                            // console.log("splits?", splits)
                            // const extension = splits[splits.length - 1]
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
                    const { title, author, description, releasedate, booklength, language, price } = formData
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
                        console.log("gotFiles result: ", gotFiles)
                        // Upload to FTPS file server
                        result = await ftpsSession.uploadFile(stream, "data/books/", doc.info).then((result) => {
                            console.log(result)
                            // close session
                            ftpsSession.disconnect()
                            return result
                        });
                        // more catches here for (result.code)
                    }

                    // create document object
                    const document = doc.info
                    const pdf = document?.url
                    console.log(document)

                    if (!pdf) {
                        res.status(400).send({ error: "One or all required parameters are missing." })
                        return
                    }

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
        const result = await Book.findAll({ attributes: ["id", "title", "description", "author", "releasedate", "language", "booklength", "price", "pdf"] })
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

        const ftpsSession = await utils.connectFTPS(config)
        const connection = await ftpsSession.connect()
        if (!connection) {
            console.log('Could not establish connection to FTPS server')
            return
        }
        const gotFiles = await ftpsSession.getFiles('data/books/')
        console.log("gotFiles result: ", gotFiles)

        var result
        if (gotFiles.length > 0) {
            // Delete file from FTPS file server
            result = await ftpsSession.deleteFile(`data/books/${"file-1702389858042.pdf"}`).then((result) => {
                console.log("deleteFile result: ", result)
                // close session
                ftpsSession.disconnect()
                return result
            });
            
        }

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