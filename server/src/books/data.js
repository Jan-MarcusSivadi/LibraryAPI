const json = JSON.stringify(require('./books.json'))
const data = JSON.parse(json)

const getAll = () => data

const getById = (id) => {
    const book = data.find(item => item.id == id)

    return book
}

module.exports = { getAll, getById }