const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class TrainingPoint extends Model {
        static associate(models) {}
    }

    TrainingPoint.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            semesterId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "semester",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            value: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "TrainingPoint",
            tableName: "training_point",
            timestamps: true,
        }
    );

    return TrainingPoint;
};
