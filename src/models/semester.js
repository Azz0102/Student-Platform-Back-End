const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Semester extends Model {
        static associate(models) {}
    }

    Semester.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            fromDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Semester",
            tableName: "semester",
            timestamps: true,
        }
    );

    return Semester;
};
