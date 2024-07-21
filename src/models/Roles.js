'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
    class Role extends Model {
        static associate(models) {
            // Define any associations here if needed
        }
    }

    Role.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(75),
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        }
    }, {
        sequelize,
        modelName: 'Role',
        tableName: 'roles',
        underscored: true, // Đảm bảo sử dụng tên cột với dấu gạch dưới
        timestamps: true
    });

    return Role;
};
