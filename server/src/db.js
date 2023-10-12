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
db.Sequelize = Sequelize
db.connection = sequelize
db.games = require("./models/User")(sequelize, Sequelize)

sync = async ()=>{
    await sequelize.sync({force:true}) // Erase all and recreate
    //await sequelize.sync({alter:true}) // Alter existing to match the database
}

module.exports = { db, sync }