module.exports = (dbConnection, Sequelize, Order, Book) => {
    const OrderItem = dbConnection.define("OrderItem", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        OrderId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Order,
                key: "id"
            }
        },
        BookId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Book,
                key: "id"
            }
        }
    })
    return OrderItem
}