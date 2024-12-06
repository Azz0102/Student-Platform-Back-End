"use strict";

const { Op, where } = require("sequelize");
const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

// Tạo mới một Teacher
const createTeacher = async ({ name, email, dateOfBirth }) => {
    try {
        // Kiểm tra xem teacher có tồn tại không
        const existingTeacher = await db.Teacher.findOne({ where: { name } });
        if (existingTeacher) {
            throw new BadRequestError("Teacher already exists.");
        }
        // Tạo Teacher mới
        const teacher = await db.Teacher.create({ name, email, dateOfBirth });
        return teacher;
    } catch (error) {
        return error.message;
    }
};

// Liệt kê tất cả Teachers
const listTeachers = async ({ filters, sort, limit, offset }) => {
    try {
        // 1. Parse filters and sort từ JSON string thành objects nếu tồn tại
        const parsedFilters = filters ? JSON.parse(filters) : [];
        const parsedSort = sort ? JSON.parse(sort) : [];
        // 2. Xây dựng điều kiện `where` từ parsedFilters nếu có
        const whereConditions = {};
        if (parsedFilters.length > 0) {
            parsedFilters.forEach((filter) => {
                if (filter.value) {
                    whereConditions[filter.id] = {
                        [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                    };
                }
            });
        }
        // 3. Xây dựng mảng `order` từ parsedSort nếu có
        const orderConditions = parsedSort.length > 0 ? parsedSort.map((sortItem) => [
            sortItem.id,
            sortItem.desc ? "DESC" : "ASC",
        ]) : null;

        // 4. Thực hiện truy vấn findAll với điều kiện lọc và sắp xếp nếu có
        const items = await db.Teacher.findAll({
            where: parsedFilters.length > 0 ? whereConditions : undefined, // Chỉ áp dụng where nếu có điều kiện
            order: orderConditions || undefined, // Chỉ áp dụng order nếu có điều kiện sắp xếp
            limit,
            offset
        });

        const totalRecords = await db.Teacher.count({ where: parsedFilters.length > 0 ? whereConditions : undefined });
        const totalPages = Math.ceil(totalRecords / limit);

        return {
            data: items,
            pageCount: totalPages
        };
    } catch (error) {
        return error.message;
    }
};

// Xóa một Teacher
const deleteTeacher = async ({ ids }) => {
    try {
        const deletedTeacher = await db.Teacher.destroy({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
        });
        if (deletedTeacher === 0) {
            throw new NotFoundError("deletedTeacher");
        }
        return deletedTeacher;
    } catch (error) {
        return error.message;
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
        return error.message;
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
        return error.message;
    }
};

module.exports = {
    createTeacher,
    listTeachers,
    deleteTeacher,
    updateTeacher,
    createMultipleTeachers,
};
