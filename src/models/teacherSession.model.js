const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class TeacherSession extends Model {
        static associate(models) {}
    }

    TeacherSession.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            teacherId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "teachers",
                    key: "id",
                },
            },
            sessionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "session_details",
                    key: "id",
                },
            },
        },
        {
            sequelize,
            modelName: "TeacherSession",
            tableName: "teacher_sessions",
            indexes: [
                {
                    unique: true,
                    fields: ["teacherId", "sessionId"],
                },
            ],
            timestamps: true,
        }
    );

    return TeacherSession;
};
