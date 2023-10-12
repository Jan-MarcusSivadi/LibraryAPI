const {Sequelize} = require("sequelize")
const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect:"mariadb"
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
db.books = require("./models/Book")(sequelize, Sequelize)

sync = async () => {
    await sequelize.sync({ force: true }) // Erase all and recreate
    //await sequelize.sync({alter:true}) // Alter existing to match the model
}

module.exports = { db, sync }