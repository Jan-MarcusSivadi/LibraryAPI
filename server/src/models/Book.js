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
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        releasedate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        booklength: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        language: {
            type: Sequelize.STRING,
            allowNull: true
        },
        price: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        pdf: {
            type: Sequelize.BLOB('long'),
            allowNull: true
        }
    })
    return Book
}