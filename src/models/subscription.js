const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class Subscription extends Model {
        static associate(models) {}
    }

    Subscription.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            keyStoreId: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "keystores",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            endpoint: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Subscription",
            tableName: "subscriptions",
            timestamps: true, // Sequelize will automatically add `createdAt` and `updatedAt` fields
        }
    );

    return Subscription;
};
