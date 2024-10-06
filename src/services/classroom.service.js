"use strict";

const db = require("../models");
const {
    BadRequestError,
    NotFoundError,
} = require("../core/error.response");

// Tạo mới một classroom
const createClassroom = async ({ amphitheaterId, name, capacity }) => {
    try {
        // Kiểm tra xem amphitheater có tồn tại không
        const amphitheater = await db.Amphitheater.findByPk(amphitheaterId);
        if (!amphitheater) {
            throw new NotFoundError("Amphitheater not found.");
        }

        // Kiểm tra xem classroom với tên này đã tồn tại chưa
        const existingClassroom = await db.Classroom.findOne({
            where: { name, amphitheaterId },
        });

        if (existingClassroom) {
            throw new BadRequestError("Classroom already exists.");
        }

        // Tạo classroom mới
        const classroom = await db.Classroom.create({
            amphitheaterId,
            name,
            capacity,
        });

        return classroom;
    } catch (error) {
        return error;
    }
};

// Liệt kê tất cả classrooms
const listClassrooms = async () => {
    try {
        const classrooms = await db.Classroom.findAll({
            include: [{ model: db.Amphitheater }],
            order: [["name", "ASC"]], // Sắp xếp theo tên
        });

        return classrooms;
    } catch (error) {
        return error;
    }
};

// Xóa một classroom
const deleteClassroom = async ({ classroomId }) => {
    try {
        // Tìm classroom theo ID
        const classroom = await db.Classroom.findByPk(classroomId);
        if (!classroom) {
            throw new NotFoundError("Classroom not found.");
        }

        // Xóa classroom
        await classroom.destroy();
    } catch (error) {
        return error;
    }
};

// Cập nhật classroom
const updateClassroom = async ({ classroomId, amphitheaterId, name, capacity }) => {
    try {
        // Tìm classroom theo ID
        const classroom = await db.Classroom.findByPk(classroomId);
        if (!classroom) {
            throw new NotFoundError("Classroom not found.");
        }

        // Kiểm tra xem amphitheater mới có tồn tại không
        if (amphitheaterId) {
            const amphitheater = await db.Amphitheater.findByPk(amphitheaterId);
            if (!amphitheater) {
                throw new NotFoundError("Amphitheater not found.");
            }
            classroom.amphitheaterId = amphitheaterId;
        }

        // Cập nhật thông tin nếu có giá trị mới
        if (name) classroom.name = name;
        if (capacity) classroom.capacity = capacity;

        await classroom.save();

        return classroom;
    } catch (error) {
        return error;
    }
};

// Tạo mới hàng loạt classrooms
const createMultipleClassrooms = async (classroomArray) => {
    try {
        // Kiểm tra các classroom đã tồn tại không
        const classroomNames = classroomArray.map(classroom => classroom.name);
        const amphitheaterId = classroomArray[0].amphitheaterId; // Giả sử amphitheaterId là giống nhau cho tất cả
        const existingClassrooms = await db.Classroom.findAll({
            where: {
                name: classroomNames,
                amphitheaterId,
            },
        });

        if (existingClassrooms.length > 0) {
            const existingNames = existingClassrooms.map(classroom => classroom.name);
            throw new BadRequestError(`Classroom(s) already exists: ${existingNames.join(", ")}`);
        }

        // Tạo mới hàng loạt classrooms
        const classrooms = await db.Classroom.bulkCreate(classroomArray, { validate: true });

        return classrooms;
    } catch (error) {
        return error;
    }
};

module.exports = {
    createClassroom,
    listClassrooms,
    deleteClassroom,
    updateClassroom,
    createMultipleClassrooms,
};
