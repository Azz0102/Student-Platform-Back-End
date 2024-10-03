const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class ClassSession extends Model {
        static associate(models) {}
    }

    ClassSession.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            subjectId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "subjects",
                    key: "id",
                },
            },
            semesterId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "semester",
                    key: "id",
                },
            },
            fromDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            numOfSessionAWeek: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "ClassSession",
            tableName: "class_sessions",
            timestamps: true,
        }
    );

    return ClassSession;
};
