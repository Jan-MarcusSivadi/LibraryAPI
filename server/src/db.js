const { Sequelize } = require("sequelize")
const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || "mariadb",
  define: {
    timestamps: true
  },
  logging: false
  // logging: console.log
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
db.orderItems = require("./models/OrderItem")(sequelize, Sequelize, db.orders, db.books)
db.orders = require("./models/Order")(sequelize, Sequelize, db.orderItems, db.users)

db.users.hasMany(db.orders)
db.orders.belongsTo(db.users)
db.orders.hasMany(db.orderItems)
db.orderItems.belongsTo(db.orders)
db.books.hasMany(db.orderItems)
db.orderItems.belongsTo(db.books)

sync = async () => {
  if (process.env.DROP_DB === "true") {
    console.log("Begin DROP")
    await db.connection.query('SET FOREIGN_KEY_CHECKS = 0')
    console.log("Checks disabled")
    await db.connection.sync({ force: true })
    console.log('Database synchronised.')
    await db.connection.query('SET FOREIGN_KEY_CHECKS = 1')
    console.log("Checks enabled")

    // create 3 books
    const books = await db.books.bulkCreate([
      {
        "title": "Romeo and Juliet",
        "author": "William Shakespeare",
        "description": "Romeo and Juliet, play by William Shakespeare, written about 1594–96 and first published in an unauthorized quarto in 1597. An authorized quarto appeared in 1599, substantially longer and more reliable.",
        "releasedate": "1597",
        "booklength": 480,
        "language": "English",
        "price": 5.99,
        "pdf": `${process.env.FILESERVER_URL}/Romeo%20and%20Juliet.pdf`
      },
      {
        "title": "Moby Dick; Or, The Whale",
        "author": "Herman Melville",
        "description": "Moby-Dick; or, The Whale is an 1851 novel by American writer Herman Melville. The book is the sailor Ishmael's narrative of the maniacal quest of Ahab, captain of the whaling ship Pequod, for vengeance against Moby Dick, the giant white sperm whale that bit off his leg on the ship's previous voyage.",
        "releasedate": "1851",
        "booklength": 378,
        "language": "English",
        "price": 4.99,
        "pdf": `${process.env.FILESERVER_URL}/Moby%20Dick;%20Or,%20The%20Whale.pdf`
      },
      {
        "title": "A Room with a View",
        "author": "E. M. Forster",
        "description": "A Room with a View follows Lucy Honeychurch as she fights against her society in search for both, independence and love. While she first believes these two to be mutually exclusive, she realizes that, in George Emerson, she can have both.",
        "releasedate": "1908",
        "booklength": 321,
        "language": "English",
        "price": 3.99,
        "pdf": `${process.env.FILESERVER_URL}/A%20Room%20with%20a%20View.pdf`
      }
    ])
    console.log("bulkCreate result: ", books.length); // 2
    console.log("bulkCreate result: ", books[0] instanceof db.books); // true
    console.log("bulkCreate result: ", books[0].title); // 'Jack Sparrow'
    console.log("bulkCreate result: ", books[0].id); // 1 // (or another auto-generated value)

    // create new user
    const [user, createdU] = await db.users.findOrCreate({
      where: {
        email: "jeffbezos@amazon.com",
      },
      defaults: {
        firstname: "Big",
        lastname: "Bezos",
        email: "jeffbezos@amazon.com",
        password: "markzuckerbergsux",
        username: "bigbezos420",
        phonenr: "+1 11748794"
      },
    })
    console.log("user created:", createdU)

    // create new order
    const rentaldate = Date.now()
    const returndate = Date.now()
    const [order, createdO] = await db.orders.findOrCreate({
      where: {
        ordernr: "ORDER-217417"
      },
      defaults: {
        ordernr: "ORDER-217417",
        rentaldate: rentaldate,
        returndate: returndate,
        UserId: user.id
      }
    })
    console.log("order created: ", createdO)

    const [orderItem, createdOI] = await db.orderItems.findOrCreate({
      where: {
        OrderId: order.id,
      },
      defaults: {
        OrderId: order.id,
        BookId: books[0].id,
      }
    })
    console.log("orderItem created:", createdOI)
  }
  else {
    console.log("Begin ALTER")
    await db.connection.sync({ alter: true })
    console.log('Database synchronized')
  }
}

module.exports = { db, sync }