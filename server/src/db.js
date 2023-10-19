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
db.orders = require("./models/Order") (sequelize, Sequelize, db.books, db.users)

db.books.belongsToMany(db.users, { through: db.orders })
db.users.belongsToMany(db.books, { through: db.orders })
db.books.hasMany(db.orders)
db.users.hasMany(db.orders)
db.orders.belongsTo(db.users)
db.orders.belongsTo(db.books)

sync = async ()=>{
    //await sequelize.sync({force:true}) // Erase all and recreate
    await sequelize.sync({alter:true}) // Alter existing to match the database
}

module.exports = { db, sync }