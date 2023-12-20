const utils = require('../utils/utils')
const { db } = require('../db')
const Book = db.books
const Order = db.orders
const OrderItem = db.orderItems
const path = require('path')
const fs = require('fs')
const zlib = require('node:zlib');

const { Sequelize } = require("sequelize")

const config = {
    host: 'jan-marcussivadi21.thkit.ee',
    user: 'd118287f550018',
    password: 'secretword12345',
}


// CREATE
exports.create = async (req, res) => {
    console.log('MY BOOOKKK!!!!', req.body)
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
                            info.originalFilename = info.filename
                            info.filename = fixedFilename
                            info.size = doc.size
                            doc.info = info
                        });
                })
                .on('close', async () => {
                    console.log('req.busboy: finish event')
                    fields.forEach(field => {
                        if (field.name == "description") {
                            if (!field.value || field.value == undefined || field.value == "undefined") {
                                field.value = ""
                            }
                            console.log("field: ", `${field.name} - ${field.value}`)
                            // field.value = field.value ? field.value : ""
                        }
                        if (field.name == "language") {
                            if (!field.value || field.value == undefined || field.value == "undefined") {
                                field.value = ""
                            }
                            console.log("field: ", `${field.name} - ${field.value}`)
                            // field.value = field.value ? field.value : ""
                        }
                    });
                    const formData = utils.toObject(fields)
                    console.log(formData)
                    // TODO: finish frontend/backend field parding with busboy

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

                    if (!utils.isValidDate(releasedate)) {
                        return res.status(400).send({ error: "releasedate invalid." })
                    }

                    // create document object
                    const document = doc.info
                    const pdf = document?.url
                    console.log(document)

                    if (!pdf) {
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
                        // const gotFiles = await ftpsSession.getFiles('data/books/')
                        // console.log("gotFiles result: ", gotFiles)
                        // Upload to FTPS file server
                        result = await ftpsSession.uploadFile(stream, "data/books/", doc.info).then((result) => {
                            console.log(result)
                            // close session
                            ftpsSession.disconnect()
                            return result
                        });
                        // more catches here for (result.code)
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
                        pdf: pdf,
                        pdfFilename: document.originalFilename,
                        pdfId: document.filename,
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
        // const { title, author, description, releasedate, booklength, language, price } = req.body
        const { id } = req.params

        var fields = [];

        const doc = {}
        var bufs = [];
        doc.size = 0;

        const book = await Book.findByPk(id)
        if (!book) {
            res.status(404).send({ error: "book not found." })
            return
        }

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
                            const fName = book.pdfId //`file-${Date.now()}.${extension}`
                            const fixedFilename = utils.getFixedFileName(fName) //info.filename
                            const fileURL = `http://${config.host}/data/books/${fixedFilename}`
                            doc.content = Buffer.concat(bufs, doc.size);
                            info.url = fileURL
                            info.originalFilename = info.filename
                            info.filename = fixedFilename
                            info.size = doc.size
                            doc.info = info
                        });
                })
                .on('close', async () => {
                    console.log('req.busboy: finish event')
                    fields.forEach(field => {
                        if (field.name == "description") {
                            if (!field.value || field.value == undefined || field.value == "undefined") {
                                field.value = ""
                            }
                        }
                        if (field.name == "language") {
                            if (!field.value || field.value == undefined || field.value == "undefined") {
                                field.value = ""
                            }
                        }
                        console.log("field: ", `${field.name} - ${field.value}`)
                    });
                    const formData = utils.toObject(fields)
                    console.log(formData)
                    // TODO: finish frontend/backend field parding with busboy

                    // validate fields
                    const { title, author, description, releasedate, booklength, language, price } = formData
                    if (
                        !title && !author && !description && !releasedate && !booklength && !language && !price
                    ) {
                        res.status(400).send({ error: "At least one field is required." })
                        return
                    }

                    // if (!pdf) {
                    //     res.status(400).send({ error: "One or all required parameters are missing." })
                    //     return
                    // }


                    // create document object
                    const document = doc.info
                    var pdf = book.pdf


                    var pdfUpdatedFilename = book.pdfFilename //book.pdfFilename === document?.originalFilename ? book.pdfFilename : document?.originalFilename
                    var pdfUpdatedId = book.pdfId //book.pdfId === document?.filename ? book.pdfId : document?.filename
                    // if (doc.size > 0) {
                    // }
                    if (document) {
                        pdf = document.url
                        pdfUpdatedFilename = document.originalFilename
                        pdfUpdatedId = document.filename
                    }
                    console.log("DOC TEST - ", doc)

                    const ftpsSession = await utils.connectFTPS(config)
                    const connection = await ftpsSession.connect()
                    if (!connection) {
                        console.log('Could not establish connection to FTPS server')
                        return
                    }
                    const gotFiles = await ftpsSession.getFiles('data/books/')
                    // await ftpsSession.disconnect()

                    if (doc.size > 0) {
                        // delete old pdf
                        var deleteResult
                        if (gotFiles.length > 0) {
                            const bookPdf = book.pdf
                            const split = bookPdf.split("/")
                            const pdfFileName = split[split.length - 1]
                            console.log("pdfFileName", pdfFileName)

                            const uploadedPdf = document.url
                            console.log("pdfFile", document)
                            const split2 = uploadedPdf.split("/")
                            const pdfFileName2 = split2[split2.length - 1]
                            console.log("pdfFileName2", pdfFileName2)

                            const parsedFiles = gotFiles.map(f => {
                                return {
                                    id: f.name,
                                    size: f.size,
                                    ...f
                                }
                            })
                            const foundMatchFile = parsedFiles.find(f => f.id === book.pdfId)
                            console.log("foundMatchFile", foundMatchFile)
                            const isDeleteFileUpload = book.pdfFilename === document.originalFilename && (foundMatchFile !== undefined && foundMatchFile.size === document.size)
                            if (isDeleteFileUpload) {
                                return res.status(400).send({ error: "nothing to upload." })
                            }

                            // if (pdfFileName) {
                            // const ftpsSession = await utils.connectFTPS(config)
                            // const connection = await ftpsSession.connect()

                            // if ()
                            deleteResult = await ftpsSession.deleteFile(`data/books/${pdfFileName}`).then((result) => {
                                return result
                            });
                            // }
                        }
                        console.log("deleteFile result: ", deleteResult)

                        // update pdf
                        var uploadResult
                        if (doc.size > 0) {
                            const { Readable } = require('stream');
                            const stream = Readable.from(doc.content);
                            // connect to FTPS file server
                            // const ftpsSession = await utils.connectFTPS(config)
                            // const connection = await ftpsSession.connect()

                            // const gotFiles = await ftpsSession.getFiles('data/books/')
                            // console.log("gotFiles result: ", gotFiles)
                            // Upload to FTPS file server
                            uploadResult = await ftpsSession.uploadFile(stream, "data/books/", doc.info).then((result) => {
                                return result
                            });
                            // more catches here for (result.code)
                        }
                        console.log("uploadFile result: ", uploadResult)
                    }

                    // if (deleteResult && deleteResult.code !== 226) {
                    //     return res.status({ error: deleteResult.message })
                    // }

                    // close session
                    await ftpsSession.disconnect()

                    // if (uploadResult && uploadResult.code !== 226) {
                    //     return res.status({ error: uploadResult.message })
                    // }
                    if (!utils.isValidDate(releasedate)) {
                        return res.status(400).send({ error: "releasedate invalid." })
                    }


                    // try {
                    // } catch (error) {
                    //     console.log("could not update pdf data")
                    // }

                    const updatedBook = await Book.update(
                        {
                            title: title,
                            author: author,
                            description: description,
                            releasedate: releasedate,
                            booklength: booklength,
                            language: language,
                            price: price,
                            pdf: pdf,
                            pdfFilename: pdfUpdatedFilename,
                            pdfId: pdfUpdatedId,
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
                })
            req.pipe(busboy);
        }
    } catch (error) {
        console.error(error)
    }
}

// DELETE
exports.deleteOne = async (req, res) => {
    try {
        const { id } = req.params

        var allOrders = await Order.findAll({ include: [OrderItem] })
        
        // convert data to readable format, get needed data (OrderItems.BookId)
        const datas = allOrders.map(order => {
            return { orderId: order.id, bookIds: order.dataValues.OrderItems.map(i => i.dataValues.BookId) }
        })
        
        // get only values from array, so that id comparison would succeed
        const allIds = datas.map(data => {
            const values = data.bookIds
            var finalValue = -1
            values.forEach(value => {
                finalValue = value
            });
            return finalValue
        })
        
        // do not delete book, if any order has book with id
        const orderExists = allIds.find(theId => theId == id) == id
        if (orderExists) {
            res.status(409).send({ error: "book could not be deleted due to an existing order" })
            return
        }

        const ftpsSession = await utils.connectFTPS(config)
        const connection = await ftpsSession.connect()
        if (!connection) {
            console.log('Could not establish connection to FTPS server')
            return
        }
        const gotFiles = await ftpsSession.getFiles('data/books/')
        // console.log("gotFiles result: ", gotFiles)

        var result
        if (gotFiles.length > 0) {
            // Delete file from FTPS file server
            const book = await Book.findByPk(id)

            if (!book) {
                console.log({ error: "book not found." })
            } else {
                const bookPdf = book.pdf
                const split = bookPdf.split("/")
                const pdfFileName = split[split.length - 1]
                if (pdfFileName) {
                    result = await ftpsSession.deleteFile(`data/books/${pdfFileName}`).then((result) => {
                        console.log("deleteFile result: ", result)
                        // close session
                        ftpsSession.disconnect()
                        return result
                    });
                }
            }
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