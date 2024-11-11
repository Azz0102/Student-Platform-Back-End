const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class Channel extends Model {
        static associate(models) {
            Channel.hasMany(models.ChannelUser);

            Channel.belongsToMany(models.User, {
                through: models.ChannelUser,
                foreignKey: "channelId",
                otherKey: "userId",
            });
        }
    }

    Channel.init(
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
        },
        {
            sequelize,
            modelName: "Channel",
            tableName: "channels",
            timestamps: true, // Sequelize will automatically add `createdAt` and `updatedAt` fields
        }
    );

    return Channel;
};
