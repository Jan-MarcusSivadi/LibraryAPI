const {Sequelize} = require("sequelize")
const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect:"mariadb",
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
db.orderItems = require("./models/OrderItem") (sequelize, Sequelize, db.orders, db.books)
db.orders = require("./models/Order") (sequelize, Sequelize, db.orderItems, db.users)

db.users.hasMany(db.orders)
db.orders.belongsTo(db.users)
db.orders.hasMany(db.orderItems)
db.orderItems.belongsTo(db.orders)
db.books.hasMany(db.orderItems)
db.orderItems.belongsTo(db.books)

sync = async ()=>{
    //await sequelize.sync({force:true}) // Erase all and recreate
    await sequelize.sync({alter:true}) // Alter existing to match the database
}

module.exports = { db, sync }