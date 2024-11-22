"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};
const dotenv = require("dotenv");
dotenv.config();

let sequelize;

sequelize = new Sequelize(
    process.env.DB_HOST_NAME,
    process.env.DB_HOST_USER,
    process.env.DB_HOST_PASSWORD,
    {
        host: process.env.DB_HOST, // Địa chỉ máy chủ MySQL
        port: process.env.DB_HOST_PORT,
        dialect: "mysql", // Chỉ định rằng cơ sở dữ liệu là MySQL
        logging: console.log, // Có thể bật logging để xem các truy vấn SQL (tùy chọn)
    }
);

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js" &&
            file.indexOf(".test.js") === -1
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
