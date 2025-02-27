const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Grade extends Model {
        static associate(models) {
            Grade.belongsTo(models.User, { foreignKey: 'userId' });
            Grade.belongsTo(models.ClassSession, { foreignKey: 'classSessionId' });
        }
    }

    Grade.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            type: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            name: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            classSessionId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "class_sessions",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            value: {
                type: DataTypes.DOUBLE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Grade",
            tableName: "grade",
            timestamps: true,
        }
    );

    return Grade;
};
