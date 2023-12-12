const generateUid = require('generate-unique-id');
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

const getParsedOrder = async (oneOrder) => {
    const currentOrder = oneOrder.dataValues
    if (currentOrder.OrderItems) {
        currentOrder.OrderItems = await Promise.all(currentOrder.OrderItems.map(async item => {
            return { ...item.dataValues, Book: await Book.findByPk(item.dataValues.BookId) }
        }))
    }
    return currentOrder
}

const createOrderItems = async (bookIds, createdOrderId) => {
    return new Promise(async (resolve, reject) => {
        // var createdOrderItems = []
        const books = await Book.findAll({
            where: {
                id: [...bookIds]
            }
        })
        if (!books) {
            return reject(404)
        }

        const itemsToCreate = bookIds.map(bookId => {
            return { OrderId: createdOrderId, BookId: bookId }
        })
        // console.log(itemsToCreate)

        try {
            OrderItem.bulkCreate([...itemsToCreate]).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
                resolve(200)
                return OrderItem.findAll();
            }).then(items => {
                // console.log(items) // ... in order to get the array of user objects
                if (items.length < 1) {
                    reject(500)
                }
            })
        } catch (error) {
            reject(500)
        }
    })
}

const deleteOrderItems = async (bookIds, createdOrderId) => {
    return new Promise(async (resolve, reject) => {
        var deletedOrderItems = []
        for (var i = 0; i < bookIds.length - 1; i++) {
            const book = await Book.findByPk(bookIds[i])
            if (!book) {
                return reject(404)
            }
            deletedOrderItems.push({ BookId: book.id })

            if (i === bookIds.length - 1) {
                deletedOrderItems.forEach(async (orderItem) => {
                    const deletedOrderItem = await OrderItem.destroy({
                        where: {
                            OrderId: createdOrderId,
                            BookId: orderItem.BookId
                        }
                    });
                    // const createdOrderItem = await OrderItem.deleteById(orderItem.BookId)
                    if (!deletedOrderItem) {
                        return reject(500)
                    }
                })
                resolve(200)
            }
        }
    })
}

//CREATE
exports.createNew = async (req, res) => {
    try {
        const { bookIds, userId } = req.body

        if (!bookIds || !userId) {
            res.status(400).send({ error: "One or all required parameters are missing" })
            return
        }

        const user = await User.findByPk(userId)
        if (!user) {
            res.status(404).send({ error: "User not found." })
            return
        }

        const books = await Book.findAll({
            where: {
                id: bookIds
            }
        })
        // console.log(books)
        if (!books || books.length !== bookIds.length) {
            res.status(404).send({ error: "Some books could not be not found." })
            return
        }

        const allOrders = await Order.findAll({ where: { UserId: userId }, include: [OrderItem] })
        if (allOrders && allOrders.length > 0) {
            // CRITERIA: no orderitem can have already ordered books per user
            const orderItems = await OrderItem.findAll({ where: { BookId: books.map(b => b.dataValues.id) } })
            const existingOrder = orderItems.length > 0
            console.log(existingOrder)

            if (existingOrder) {
                res.status(409).send({ error: "Order already exists for user" })
                return
            }
        }

        // generated uid
        const uid = generateUid({
            length: 6,
            useLetters: false
        })
        const ordernr = `ORDER-${uid}`;

        // rental time will be 5-30 days
        const offsetInDays = 5
        const dateNow = new Date()
        const rentalDate = utils.formatDate(dateNow)
        const returnDate = utils.formatDate(utils.getDateByOffset(dateNow, offsetInDays))
        console.log('rentaldate', rentalDate);
        console.log('returndate', returnDate);

        const createdOrder = await Order.create(
            {
                ordernr: ordernr,
                rentaldate: rentalDate,
                returndate: returnDate,
                UserId: userId
            },
            { fields: ["ordernr", "rentaldate", "returndate", "UserId"] }
        )
        if (!createdOrder) {
            res.status(500).send({ error: "Could not create order" })
            return
        }

        const createOrderItems_resultCode = await createOrderItems(bookIds, createdOrder.id)
        console.log('resultCode', createOrderItems_resultCode)

        if (createOrderItems_resultCode === 404) {
            res.status(createOrderItems_resultCode).send({ error: "Book not found." })
            return
        }
        
        if (createOrderItems_resultCode === 500) {
            // delete created order items
            const deleteOrderItems_resultCode = await deleteOrderItems(bookIds, createdOrder.id)
            if (deleteOrderItems_resultCode === 404) {
                console.log({ status: deleteOrderItems_resultCode, error: "Book not found." })
            }
            if (deleteOrderItems_resultCode === 500) {
                console.log({ status: deleteOrderItems_resultCode, error: `Some order items could not be deleted` })
            }
            // delete created order
            const deleted = await Order.destroy({
                where: { id: createdOrder.id }
            })
            res.status(createOrderItems_resultCode).send({ error: `Some order items could not be created` })
            return
        }

        res.status(201)
            .location(`${utils.getBaseUrl(req)}/orders/${createdOrder.id}`)
            .json(createdOrder)
    } catch (error) {
        console.error(error)
    }
}
// READ
exports.getAll = async (req, res) => {
    // var allOrders = await Order.findAll({ include: [User, OrderItem] })
    var allOrders = await Order.findAll({ include: [OrderItem, User] })
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

    res.status(200)
        .location(`${utils.getBaseUrl(req)}/orders/${id}`)
        .send()
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
