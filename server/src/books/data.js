const json = JSON.stringify(require('./books.json'))
const data = JSON.parse(json)

const getAll = () => data

const getById = (id) => {
    const book = data.find(item => item.id == id)

    return book
}

const create = (newBook) => {
    const newId = Math.max(...data.map(book => book.id)) + 1
    newBook.id = newId
    data.push(newBook)
    return newBook
}

module.exports = { getAll, getById, create }