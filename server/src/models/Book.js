module.exports = (dbConnection, Sequelize) => {
    const Book = dbConnection.define("Book", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })
    return Book
}