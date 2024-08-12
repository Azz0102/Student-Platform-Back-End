const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Resource extends Model {
        // Define any associations if needed
        static associate(models) {
            // For example, if resources belong to a category:
            // Resource.belongsTo(models.Category, { foreignKey: 'categoryId' });
            Resource.belongsToMany(models.Permission, {
                through: "role_permission",
                foreignKey: "resourceId",
                otherKey: "permissionId",
            });
        }
    }

    Resource.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Resource",
            tableName: "resources",
            timestamps: true,
            underscored: true,
        }
    );

    return Resource;
};
