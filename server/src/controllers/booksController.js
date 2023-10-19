const utils = require('../utils/utils')
const { db } = require('../db')
const Book = db.books
const path = require('path')
const fs = require('fs')
const zlib = require('node:zlib');

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
        var data = [];
        var files = [];

        if (req.busboy) {
            req.busboy.on('file', async (name, file, info) => {
                const saveTo = path.join(__dirname + '/../files', `${info.filename}`);
                // const writeStream = fs.createWriteStream(saveTo)
                // file.pipe(writeStream)

                const buffer = await utils.stream2buffer(file)
                // const bufferContent = buffer.toString()

                const newFile = {
                    name: name,
                    buffer: buffer,
                    info: info
                }

                if (files.find(f => f.name === newFile.name) == undefined) {
                    files.push(newFile)
                }
            });
            req.busboy.on('field', (name, value, info) => {
                data.push({
                    name: name,
                    value: value
                })
            });
            req.busboy.on('close', () => {
                // console.log(data)
                // console.log(files)
                // res.writeHead(200, { 'Connection': 'close' });
                // res.end(`That's all folks!`);

                const formData = utils.toObject(data)

                const { title, author, description, releasedate, booklength, language, price } = formData
                const pdfRaw = files.find(f => f.name == 'pdf').buffer
                console.log(pdfRaw)
                if (
                    !title ||
                    !author ||
                    !releasedate ||
                    !booklength ||
                    !price ||
                    !pdfRaw
                ) {
                    res.status(400).send({ error: "One or all required parameters are missing." })
                    return
                }
                const pdfZipped = zlib.gzipSync(JSON.stringify(pdfRaw)).toString('utf-8');
                console.log('zipped',pdfZipped)
                const pdfUnzipped = zlib.gunzipSync(pdfZipped)
                console.log('unzipped',pdfUnzipped)
                const bufferContent = pdfUnzipped
                const buf = new Buffer(JSON.stringify(bufferContent), 'utf-8');
                console.log('final!',buf)
                const bookData = {
                    title: title,
                    author: author,
                    description: description,
                    releasedate: releasedate,
                    booklength: booklength,
                    language: language,
                    price: price,
                    pdf: pdfZipped
                }
                console.log(bookData)

                // const createdBook = await Book.create(bookData)
                // console.log(`${req.body.title}'s auto-generated ID: ${createdBook.id}`);

                // res.status(201)
                //     .location(`${utils.getBaseUrl(req)}/books/${createdBook.id}`)
                //     .send(createdBook)

            });
            req.pipe(req.busboy);
        }
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

        res.send(book)
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