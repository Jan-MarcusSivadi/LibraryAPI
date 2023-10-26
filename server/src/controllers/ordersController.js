const utils = require('../utils/utils')
const { db } = require("../db")
const User = db.users
const Book = db.books
const OrderItem = db.orderItems
const Order = db.orders

const getParsedOrders = async (allOrders) => {
    return Promise.all(allOrders.map(async order => {
        const currentOrder = order.dataValues
        if (currentOrder.OrderItems) {
            currentOrder.OrderItems = await Promise.all(currentOrder.OrderItems.map(async item => {
                return { ...item.dataValues, Book: await Book.findByPk(item.dataValues.BookId) }
            }))
        }
        return currentOrder
    }))
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
    const foundUser = await users.findByPk(req.params.id)
    console.log("id", req.params.id)
    console.log("foundUser:", foundUser)
    if (foundUser === null) {
        return res.status(404).send({ error: `User not found` })
    }
    res.send(foundUser)
}
// UPDATE
exports.updateById = async (req, res) => {
    const { ordernr, rentaldate, returndate, UserId } = req.body
    const { id } = req.params

    const order = await Order.findByPk(id)

    if (!order) {
        res.status(404).send({ error: "order not found." })
        return
    }

    const user = await User.findByPk(UserId)

    if (!user) {
        res.status(404).send({ error: "user not found." })
        return
    }

    if (!ordernr && !rentaldate && !returndate && !UserId) {
        res.status(400).send({ error: "At least one field is required." })
        return
    }

    const updatedOrder = await Order.update(
        {
            ordernr: ordernr,
            rentaldate: rentaldate,
            returndate: returndate,
            UserId: UserId
        },
        { where: { id: req.params.id } }
    )

    if (updatedOrder < 1) {
        res.status(404).send({ error: "could not update order" })
        return
    }

    if (!updatedOrder) {
        res.status(404).send({ error: "order not found." })
        return
    }

    res.status(200).send("order updated successfully.")
}
// DELETE
exports.deleteById = async (req, res) => {
    const deletedAmount = await Order.destroy({
        where: { id: req.params.id }
    })

    if (deletedAmount == 0) {
        return res.status(404).send({ error: "Order not found." })
    }
    res.status(204).send()
}
