const { Sequelize } = require("sequelize");
require('dotenv').config();

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/config.json")[env];

// Cấu hình kết nối Sequelize với MySQL
const sequelize = new Sequelize(
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


// Kiểm tra kết nối
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

module.exports = connectDB;
