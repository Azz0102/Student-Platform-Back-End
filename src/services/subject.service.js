"use strict";

const db = require("../models");
const {
    BadRequestError,
    NotFoundError,
} = require("../core/error.response");

// Tạo mới một subject
const createSubject = async ({ name, description }) => {
    try {
        // Kiểm tra xem subject với tên này đã tồn tại chưa
        const existingSubject = await db.Subject.findOne({
            where: { name },
        });

        if (existingSubject) {
            throw new BadRequestError("Subject already exists.");
        }

        // Tạo subject mới
        const subject = await db.Subject.create({
            name,
            description,
        });

        return subject;
    } catch (error) {
        return error;
    }
};

// Liệt kê tất cả subjects
const listSubjects = async () => {
    try {
        const subjects = await db.Subject.findAll({
            order: [["name", "ASC"]], // Sắp xếp theo tên
        });

        return subjects;
    } catch (error) {
        return error;
    }
};

// Xóa một subject
const deleteSubject = async ({ subjectId }) => {
    try {
        // Tìm subject theo ID
        const subject = await db.Subject.findByPk(subjectId);
        if (!subject) {
            throw new NotFoundError("Subject not found.");
        }

        // Xóa subject
        await subject.destroy();
    } catch (error) {
        return error;
    }
};

// Cập nhật subject
const updateSubject = async ({ subjectId, name, description }) => {
    try {
        // Tìm subject theo ID
        const subject = await db.Subject.findByPk(subjectId);
        if (!subject) {
            throw new NotFoundError("Subject not found.");
        }

        // Cập nhật thông tin nếu có giá trị mới
        if (name) subject.name = name;
        if (description) subject.description = description;

        await subject.save();

        return subject;
    } catch (error) {
        return error;
    }
};

// Tạo mới hàng loạt subjects
const createMultipleSubjects = async (subjectArray) => {
    try {
        // Kiểm tra các subject đã tồn tại không
        const subjectNames = subjectArray.map(subject => subject.name);
        const existingSubjects = await db.Subject.findAll({
            where: {
                name: subjectNames,
            },
        });

        if (existingSubjects.length > 0) {
            const existingNames = existingSubjects.map(subject => subject.name);
            throw new BadRequestError(`Subject(s) already exists: ${existingNames.join(", ")}`);
        }

        // Tạo mới hàng loạt subjects
        const subjects = await db.Subject.bulkCreate(subjectArray, { validate: true });

        return subjects;
    } catch (error) {
        return error;
    }
};

module.exports = {
    createSubject,
    listSubjects,
    deleteSubject,
    updateSubject,
    createMultipleSubjects,
};
