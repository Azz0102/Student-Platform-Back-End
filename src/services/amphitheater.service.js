"use strict";

const db = require("../models");
const {
    BadRequestError,
    NotFoundError,
    ForbiddenError,
} = require("../core/error.response");

// Tạo mới một amphitheater
const createAmphitheater = async ({ name, location, latitude, longitude }) => {
    try {
        // Kiểm tra xem amphitheater với tên này đã tồn tại chưa
        const existingAmphitheater = await db.Amphitheater.findOne({
            where: { name },
        });

        if (existingAmphitheater) {
            throw new BadRequestError("Amphitheater already exists.");
        }

        // Tạo amphitheater mới
        const amphitheater = await db.Amphitheater.create({
            name,
            location,
            latitude,
            longitude,
        });

        return amphitheater;
    } catch (error) {
        return error.message;
    }
};

// Liệt kê tất cả amphitheaters
const listAmphitheaters = async () => {
    try {
        const amphitheaters = await db.Amphitheater.findAll({
            order: [["name", "ASC"]], // Sắp xếp theo tên
        });

        return amphitheaters;
    } catch (error) {
        return error.message;
    }
};

// Xóa một amphitheater
const deleteAmphitheater = async ({ amphitheaterId }) => {
    try {
        // Tìm amphitheater theo ID
        const amphitheater = await db.Amphitheater.findByPk(amphitheaterId);

        if (!amphitheater) {
            throw new NotFoundError("Amphitheater not found.");
        }

        // Xóa amphitheater
        await amphitheater.destroy();
    } catch (error) {
        return error.message;
    }
};

// Cập nhật amphitheater
const updateAmphitheater = async ({ amphitheaterId, name, location, latitude, longitude }) => {
    try {
        // Tìm amphitheater theo ID
        const amphitheater = await db.Amphitheater.findByPk(amphitheaterId);

        if (!amphitheater) {
            throw new NotFoundError("Amphitheater not found.");
        }

        // Cập nhật thông tin nếu có giá trị mới
        if (name) amphitheater.name = name;
        if (location) amphitheater.location = location;
        if (latitude) amphitheater.latitude = latitude;
        if (longitude) amphitheater.longitude = longitude;

        await amphitheater.save();

        return amphitheater;
    } catch (error) {
        return error.message;
    }
};

// Tạo mới hàng loạt amphitheaters
const createMultipleAmphitheaters = async (amphitheaterArray) => {
    try {
        // Kiểm tra các amphitheater đã tồn tại không
        const amphitheaterNames = amphitheaterArray.map(amphitheater => amphitheater.name);
        const existingAmphitheaters = await db.Amphitheater.findAll({
            where: {
                name: amphitheaterNames,
            },
        });

        if (existingAmphitheaters.length > 0) {
            const existingNames = existingAmphitheaters.map(amphitheater => amphitheater.name);
            throw new BadRequestError(`Amphitheater(s) already exists: ${existingNames.join(", ")}`);
        }

        // Tạo mới hàng loạt amphitheater
        const amphitheaters = await db.Amphitheater.bulkCreate(amphitheaterArray, { validate: true });

        return amphitheaters;
    } catch (error) {
        return error.message;
    }
};

module.exports = {
    createAmphitheater,
    listAmphitheaters,
    deleteAmphitheater,
    updateAmphitheater,
    createMultipleAmphitheaters,
};
