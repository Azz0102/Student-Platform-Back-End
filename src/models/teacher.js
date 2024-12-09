const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class Teacher extends Model {
        static associate(models) {
            Teacher.hasMany(models.SessionDetails, {
                foreignKey: 'teacherId',
                onDelete: "CASCADE",
            });
            Teacher.hasMany(models.SessionDetails, { foreignKey: 'teacherId' });
        }
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
            email: {
                type: DataTypes.TEXT,
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
