const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class UserSessionDetails extends Model {
        static associate(models) {
            UserSessionDetails.belongsTo(models.Enrollment, { foreignKey: "enrollmentId" });
            UserSessionDetails.belongsTo(models.SessionDetails, {
                foreignKey: "sessionDetailsId",
            });
        }
    }

    UserSessionDetails.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            enrollmentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "enrollments",
                    key: "id",
                },
            },
            sessionDetailsId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "session_details",
                    key: "id",
                },
            }
        },
        {
            sequelize,
            modelName: "UserSessionDetails",
            tableName: "user_session_details",
            indexes: [
                {
                    unique: true,
                    fields: ["enrollmentId", "sessionDetailsId"],
                },
            ],
            timestamps: true,
        }
    );

    return UserSessionDetails;
};
