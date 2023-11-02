const utils = require('../utils/utils')
const { db } = require('../db')
const Book = db.books
const path = require('path')
const fs = require('fs')
const zlib = require('node:zlib');

const config = {
    host: 'x',
    user: 'x',
    password: 'x',
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
        var data = [];
        var files = [];

        // // UPLOAD FILE TO ZONE
        // const config = {
        //     host: '217.146.68.118',
        //     port: 21,
        //     username: 'd118287f550018',
        //     password: 'Password1234#?.x'
        // }

        if (req.busboy) {
            req.busboy.on('file', async (name, file, info) => {
                const saveTo = path.join(__dirname + '/../files', `${info.filename}`);
                // const writeStream = fs.createWriteStream(saveTo)
                // file.pipe(writeStream)

                file.on('data', (data) => {
                    console.log(`File [${name}] got ${data.length} bytes`);
                }).on('close', () => {
                    console.log(`File [${name}] done`);
                });

                const buffer = await utils.stream2buffer(file)
                // const bufferContent = buffer.toString()

                // const newFile = {
                //     name: name,
                //     buffer: buffer,
                //     info: info
                // }
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
            req.busboy.on('finish', () => {
                console.log('end!')
            })
            req.busboy.on('close', async () => {
                const formData = utils.toObject(data)

                const { title, author, description, releasedate, booklength, language, price } = formData
                if (!files || files.length <= 0) {
                    res.status(400).send('no files given')
                    return
                }
                const fileData = files.find(f => f.name == 'pdf')
                if (!fileData || fileData.length <= 0) {
                    res.status(400).send('wrong field name! It should be "pdf" instead of ?')
                    return
                }
                // const pdfRaw = fileData.buffer
                const { Readable } = require('stream');

                const stream = Readable.from(fileData.buffer);
                console.log('pdfRAW?', stream)
                if (
                    !title ||
                    !author ||
                    !releasedate ||
                    !booklength ||
                    !price ||
                    !stream
                ) {
                    res.status(400).send({ error: "One or all required parameters are missing." })
                    return
                }

                // waaaaaaaaaaaaaa
                const ftpsSession = await utils.connectFTPS(config)
                const connection = await ftpsSession.connect()
                if (!connection) {
                    console.log('Could not establish connection to FTPS server')
                    return
                }
                const gotFiles = await ftpsSession.getFiles('books/')
                console.log(gotFiles)

                const fileName = 'testing123.txt'
                ftpsSession.uploadFile(stream, "books/", fileName)

                // const buff = Buffer.from(pdfRaw, "utf-8");
                // if (!buff) {
                //     console.log('Got invalid or corrupted file.')
                //     return
                // }
                // ftpsSession.uploadFile('test.txt', "books/", "test.txt")
                // waaaaaaaaaaaaaa


                // const ftpsSession = await utils.connectFTPS(config)
                // const connection = await ftpsSession.connect()
                // if (!connection) {
                //     console.log('Could not establish connection to FTPS server')
                //     return
                // }
                // const gotFiles = await ftpsSession.getFiles()
                // console.log(gotFiles)

                // const buff = Buffer.from(pdfRaw, "utf-8");
                // if (!buff) {
                //     console.log('Got invalid or corrupted file.')
                //     return
                // }
                // ftpsSession.uploadFile(fs.createReadStream(pdfRaw), "books")

                // *UNUSED CODE*
                // const pdfZipped = zlib.gzipSync(JSON.stringify(pdfRaw)).toString('utf-8');
                // console.log('zipped', pdfZipped)
                // const pdfUnzipped = zlib.gunzipSync(pdfZipped)
                // console.log('unzipped', pdfUnzipped)
                // const bufferContent = pdfUnzipped
                // const pdfZipped = pdfRaw
                // convert buffer to string
                // const resultStr = buff.toString();

                // const buffReadable = buff.toString()
                // console.log('buffReadable', buffReadable)

                // let client = new Client();

                // const responseFromFTP = await sftp.connect(config)
                // const some = await sftp.put(buff, '/data01/virt117904/domeenid/www.jan-marcussivadi21.thkit.ee/data/foobar.txt');
                // let remotePath = '/data01/virt117904/domeenid/www.jan-marcussivadi21.thkit.ee/data/foobar.txt';

                // const client = new SFTPClient()

                // console.log('----- uploaded??? ----', some)

                // const buf = new Buffer(JSON.stringify(pdfRaw), 'utf-8');
                // console.log('final!', buff)
                // const bookData = {
                //     title: title,
                //     author: author,
                //     description: description,
                //     releasedate: releasedate,
                //     booklength: booklength,
                //     language: language,
                //     price: price,
                //     pdf: buff
                // }
                // console.log(bookData)

                // const createdBook = await Book.create(bookData)
                // console.log(`${bookData.title}'s auto-generated ID: ${createdBook.id}`);

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