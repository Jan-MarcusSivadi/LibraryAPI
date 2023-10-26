const utils = require('../utils/utils')
const { db } = require("../db")
const User = db.users
const Book = db.books
const OrderItem = db.orderItems
const Order = db.orders

const getParsedOrders = async (allOrders) => {
    return Promise.all(allOrders.map(async order => {
        const currentOrder = order.dataValues
        currentOrder.OrderItems = await Promise.all(currentOrder.OrderItems.map(async item => {
            return { ...item.dataValues, Book: await Book.findByPk(item.dataValues.BookId) }
        }))
        return currentOrder
    }))
}

const getParsedOrder = async (oneOrder) => {
    const currentOrder = oneOrder.dataValues
    if (currentOrder.OrderItems) {
        currentOrder.OrderItems = await Promise.all(currentOrder.OrderItems.map(async item => {
            return { ...item.dataValues, Book: await Book.findByPk(item.dataValues.BookId) }
        }))
    }
    return currentOrder
}


//CREATE
exports.createNew = async (req, res) => {
    if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password || !req.body.username || !req.body.phonenr) {
        return res.status(400).send({ error: "One or all required parameters are missing" })
    }
    const createdUser = await users.create(req.body, {
        fields: ["firstname", "lastname", "email", "password", "username", "phonenr"]
    })
    res.status(201)
        .location(`${utils.getBaseUrl(req)}/users/${createdUser.id}`)
        .json(createdUser)
}
// READ
exports.getAll = async (req, res) => {
    var allOrders = await Order.findAll({ include: [User, OrderItem] })
    const parsedOrders = await getParsedOrders(allOrders)

    res.json(parsedOrders)
}
exports.getById = async (req, res) => {
    const foundOrder = await Order.findByPk(req.params.id, { include: [User, OrderItem] })
    console.log("id", req.params.id)
    console.log("foundOrder:", foundOrder)
    if (!foundOrder) {
        res.status(404).send({ error: `Order not found` })
        return
    }
    const parsedOrders = await getParsedOrder(foundOrder)
    res.send(parsedOrders)
}
// UPDATE
exports.editById = async (req, res) => {
    const updatedUser = await users.update({ ...req.body }, {
        where: { id: req.params.id },
        fields: ["firstname", "lastname", "email", "password", "username", "phonenr"]
    })
    if (updatedUser[0] == 0) {
        return res.status(404).send({ error: "User not found" })
    }
}
// DELETE
exports.deleteById = async (req, res) => {
    const deletedAmount = await users.destroy({
        where: { id: req.params.id }
    })

    if (deletedAmount == 0) {
        return res.status(404).send({ error: "User not found." })
    }
    res.status(204).send()
}
