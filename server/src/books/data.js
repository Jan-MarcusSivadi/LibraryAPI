const json = JSON.stringify(require('./books.json'))
const data = JSON.parse(json)

const getAll = () => data

const getById = (id) => {
    const book = data.find(item => item.id == id)
    return {
        "id": book.id,
        "name": book.name
    }
}

module.exports = { getAll, getById }