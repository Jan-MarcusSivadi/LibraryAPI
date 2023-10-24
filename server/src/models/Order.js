module.exports = (dbConnection, Sequelize, OrderItem, User) => {
    const Order = dbConnection.define("Order", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ordernr: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        rentaldate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        returndate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        UserId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id"
            }
        },
        // paid: {
        //     type: Sequelize.DECIMAL,
        //     allowNull: false
        // },
    })
    return Order
}