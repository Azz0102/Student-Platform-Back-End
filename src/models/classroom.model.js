const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class Classroom extends Model {
        static associate(models) {}
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
