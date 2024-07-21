const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config.json')[env];

// Cấu hình kết nối Sequelize với MySQL
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: 'localhost',  // Địa chỉ máy chủ MySQL
    dialect: 'mysql',   // Chỉ định rằng cơ sở dữ liệu là MySQL
    logging: console.log, // Có thể bật logging để xem các truy vấn SQL (tùy chọn)
});

const Role = require('../models/User')(sequelize);

// Kiểm tra kết nối
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        // const r = await Role.findAll();
        // console.log(r);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;

