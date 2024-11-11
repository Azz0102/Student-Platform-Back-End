const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class ChannelUser extends Model {
        static associate(models) {
            ChannelUser.belongsTo(models.User);
            ChannelUser.belongsTo(models.Channel);
        }
    }

    ChannelUser.init(
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
            channelId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "channels",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
        },
        {
            sequelize,
            modelName: "ChannelUser",
            tableName: "channel_user",
            timestamps: true, // Sequelize will automatically add `createdAt` and `updatedAt` fields
        }
    );

    return ChannelUser;
};
