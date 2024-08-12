const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class FinalExam extends Model {
        static associate(models) {}
    }

    FinalExam.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            classSessionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "class_sessions",
                    key: "id",
                },
            },
            examDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "Duration in minutes",
            },
            location: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "FinalExam",
            tableName: "final_exams",
            timestamps: true,
        }
    );

    return FinalExam;
};
