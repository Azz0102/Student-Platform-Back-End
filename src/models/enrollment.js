const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class Enrollment extends Model {
        static associate(models) {
            Enrollment.belongsTo(models.User, { foreignKey: "userId" });
            Enrollment.belongsTo(models.ClassSession, {
                foreignKey: "classSessionId",
            });
            Enrollment.hasMany(models.Message);
            Enrollment.hasMany(models.SessionDetails, {
                foreignKey: "classSessionId",
            });
            Enrollment.hasMany(models.UserSessionDetails, {
                foreignKey: "enrollmentId",
            });
        }
    }

    Enrollment.init(
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
