const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Code extends Model {
        static associate(models) { }
    }

    Code.init(
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
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            value: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            expireDate: {
                type: DataTypes.DATE,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: "Code",
            tableName: "code",
            timestamps: true,
        }
    );

    return Code;
};
