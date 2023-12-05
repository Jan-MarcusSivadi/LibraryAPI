const {Sequelize} = require("sequelize")
const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect:"mariadb",
  define: {
    timestamps: true
  },
  logging: console.log
})
try {
  sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.')
});
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
const db = {}
db.sequelize = Sequelize
db.connection = sequelize
db.users = require("./models/User")(sequelize, Sequelize)
db.books = require("./models/Book")(sequelize, Sequelize)
db.orderItems = require("./models/OrderItem") (sequelize, Sequelize, db.orders, db.books)
db.orders = require("./models/Order") (sequelize, Sequelize, db.orderItems, db.users)

db.users.hasMany(db.orders)
db.orders.belongsTo(db.users)
db.orders.hasMany(db.orderItems)
db.orderItems.belongsTo(db.orders)
db.books.hasMany(db.orderItems)
db.orderItems.belongsTo(db.books)

sync = async ()=>{
  if (process.env.DROP_DB === "true") {
    console.log("Begin DROP")
    await db.connection.query('SET FOREIGN_KEY_CHECKS = 0')
    console.log("Checks disabled")
    await db.connection.sync({ force: true })
    console.log('Database synchronised.')
    await db.connection.query('SET FOREIGN_KEY_CHECKS = 1')
    console.log("Checks enabled")

    const [book, createdB] = await db.books.findOrCreate({
      where: {
        title: "Romeo and Juliet"
      },
      defaults: {
        title: "Romeo and Juliet",
        author:"William Shakespeare",
        price:5.99,
      }
    })
    console.log("book created :", createdB)
    const [order, createdO] = await db.orders.findOrCreate({
      where: {
        rentaldate: Date.now()
      },
      defaults: {
        rentaldate: Date.now(),
      }
    })
    console.log("order created: ", createdO)
    const [orderItem, createdOI] = await db.orderItems.findOrCreate({
      where: {
        id: 1
      },
      defaults: {
        OrderId: order.id,
        BookId: book.id,
      }
    })
    console.log("orderItem created:", createdOI)
  }
  else {
    console.log("Begin ALTER")
    await db.connection.sync({ alter: true})
    console.log('Database synchronized')
  }
}

module.exports = { db, sync }