module.exports = (dbConnection, Sequelize, User, Book) => {
    const Order = dbConnection.define("Order", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        paid: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        BookId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Book,
                key: "id"
            }
        },
        UserId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id"
            }
        }
    })
    return Order
}