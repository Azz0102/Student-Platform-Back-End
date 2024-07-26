const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class Enrollment extends Model {
        static associate(models) {}
    }

    Enrollment.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            classSessionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "class_sessions",
                    key: "id",
                },
            },
            enrolledAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "Enrollment",
            tableName: "enrollments",
            indexes: [
                {
                    unique: true,
                    fields: ["userId", "classSessionId"],
                },
            ],
            timestamps: true,
        }
    );

    return Enrollment;
};
