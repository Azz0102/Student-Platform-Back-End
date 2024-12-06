const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class Classroom extends Model {
        static associate(models) {
            Classroom.belongsTo(models.Amphitheater, {
                foreignKey: "amphitheaterId",
                onDelete: "CASCADE",
            });

            Classroom.hasMany(models.SessionDetails, {
                foreignKey: "classroomId",
                onDelete: "CASCADE",
            });
        }
    }

    Classroom.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            amphitheaterId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "amphitheaters",
                    key: "id",
                },
            },
            name: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM("Theory", "Practice"),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Classroom",
            tableName: "classrooms",
            timestamps: true,
        }
    );

    return Classroom;
};
