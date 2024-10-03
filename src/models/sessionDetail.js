const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class SessionDetails extends Model {
        static associate(models) {}
    }

    SessionDetails.init(
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
            classroomId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "classrooms",
                    key: "id",
                },
            },
            startTime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            numOfHour: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            dayOfWeek: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            sessionType: {
                type: DataTypes.STRING(50),
                allowNull: false,
                comment: "Theory, Practice",
            },
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            teacherId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "teachers",
                    key: "id",
                },
            },
        },
        {
            sequelize,
            modelName: "SessionDetails",
            tableName: "session_details",
            timestamps: true,
        }
    );

    return SessionDetails;
};
