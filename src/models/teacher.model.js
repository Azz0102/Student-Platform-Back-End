const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class Teacher extends Model {
        static associate(models) {}
    }

    Teacher.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            name: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            dateOfBirth: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Teacher",
            tableName: "teachers",
            timestamps: true,
        }
    );

    return Teacher;
};
