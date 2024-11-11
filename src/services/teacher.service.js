"use strict";

const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

// Tạo mới một Teacher
const createTeacher = async ({ name, dateOfBirth }) => {
    try {
        // Kiểm tra xem teacher có tồn tại không
        const existingTeacher = await db.Teacher.findOne({ where: { name } });
        if (existingTeacher) {
            throw new BadRequestError("Teacher already exists.");
        }

        // Tạo Teacher mới
        const teacher = await db.Teacher.create({ name, dateOfBirth });
        return teacher;
    } catch (error) {
        return error;
    }
};

// Liệt kê tất cả Teachers
const listTeachers = async () => {
    try {
        const teachers = await db.Teacher.findAll({ order: [["name", "ASC"]] });
        return teachers;
    } catch (error) {
        return error;
    }
};

// Xóa một Teacher
const deleteTeacher = async ({ teacherId }) => {
    try {
        // Tìm Teacher theo ID
        const teacher = await db.Teacher.findByPk(teacherId);
        if (!teacher) {
            throw new NotFoundError("Teacher not found.");
        }

        // Xóa Teacher
        await teacher.destroy();
    } catch (error) {
        return error;
    }
};

// Cập nhật Teacher
const updateTeacher = async ({ teacherId, name, dateOfBirth }) => {
    try {
        // Tìm Teacher theo ID
        const teacher = await db.Teacher.findByPk(teacherId);
        if (!teacher) {
            throw new NotFoundError("Teacher not found.");
        }

        // Cập nhật thông tin nếu có giá trị mới
        if (name) teacher.name = name;
        if (dateOfBirth) teacher.dateOfBirth = dateOfBirth;

        await teacher.save();
        return teacher;
    } catch (error) {
        return error;
    }
};

// Tạo mới hàng loạt Teachers
const createMultipleTeachers = async (teacherArray) => {
    try {
        // Kiểm tra các teacher đã tồn tại không
        const existingTeachers = await db.Teacher.findAll({
            where: { name: teacherArray.map(t => t.name) },
        });

        if (existingTeachers.length > 0) {
            const existingNames = existingTeachers.map(t => t.name);
            throw new BadRequestError(`Teacher(s) already exists: ${existingNames.join(", ")}`);
        }

        // Tạo mới hàng loạt Teachers
        const teachers = await db.Teacher.bulkCreate(teacherArray, { validate: true });
        return teachers;
    } catch (error) {
        return error;
    }
};

module.exports = {
    createTeacher,
    listTeachers,
    deleteTeacher,
    updateTeacher,
    createMultipleTeachers,
};
