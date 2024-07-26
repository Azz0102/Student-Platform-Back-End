const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class Amphitheater extends Model {
        static associate(models) {}
    }

    Amphitheater.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            name: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            location: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            latitude: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                comment: "Latitude for Google Maps location",
            },
            longitude: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                comment: "Longitude for Google Maps location",
            },
        },
        {
            sequelize,
            modelName: "Amphitheater",
            tableName: "amphitheaters",
            timestamps: true, // Sequelize will automatically add `createdAt` and `updatedAt` fields
        }
    );

    return Amphitheater;
};
