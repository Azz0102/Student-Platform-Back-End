const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class Subject extends Model {
        static associate(models) {
            Subject.hasMany(models.ClassSession, {
                foreignKey: 'subjectId',
                onDelete: "CASCADE",
            });
        }
    }

    Subject.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            name: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Subject",
            tableName: "subjects",
            timestamps: true,
        }
    );

    return Subject;
};
