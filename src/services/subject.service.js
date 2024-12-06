"use strict";

const { Op } = require("sequelize");
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
        return error.message;
    }
};

// Liệt kê tất cả subjects
const listSubjects = async ({ filters, sort, limit, offset }) => {
    try {
        // 1. Parse filters and sort từ JSON string thành objects nếu tồn tại
        const parsedFilters = filters ? JSON.parse(filters) : [];
        const parsedSort = sort ? JSON.parse(sort) : [];
        // 2. Xây dựng điều kiện `where` từ parsedFilters nếu có
        const whereConditions = {};
        if (parsedFilters.length > 0) {
            for (const filter of parsedFilters) {
                if (filter.value) {
                    whereConditions[filter.id] = {
                        [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                    };
                }
            };
        }

        console.log('whereConditions', whereConditions);
        // 3. Xây dựng mảng `order` từ parsedSort nếu có
        const orderConditions = parsedSort.length > 0 ? parsedSort.map((sortItem) => [
            sortItem.id,
            sortItem.desc ? "DESC" : "ASC",
        ]) : null;

        // 4. Thực hiện truy vấn findAll với điều kiện lọc và sắp xếp nếu có
        const items = await db.Subject.findAll({
            where: parsedFilters.length > 0 ? whereConditions : undefined, // Chỉ áp dụng where nếu có điều kiện
            order: orderConditions || undefined, // Chỉ áp dụng order nếu có điều kiện sắp xếp
            limit,
            offset
        });

        const totalRecords = await db.Subject.count({
            where: parsedFilters.length > 0 ? whereConditions : undefined,
        });
        const totalPages = Math.ceil(totalRecords / limit);

        return {
            data: items.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                }
            }),
            pageCount: totalPages
        };

    } catch (error) {
        return error.message;
    }
};

// Xóa một subject
const deleteSubject = async ({ ids }) => {
    try {
        const subject = await db.Subject.destroy({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
        });
        if (subject === 0) {
            throw new NotFoundError("deletedSubject");
        }
        return subject;
    } catch (error) {
        return error.message;
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
        return error.message;
    }
};

// Tạo mới hàng loạt subjects
const createMultipleSubjects = async (subjectArray) => {
    // Lọc ra những chủ đề đã tồn tại
    const existingSubjects = await db.Subject.findAll({
        where: { name: subjectArray.map(s => s.name) },
    });

    const existingNames = existingSubjects.map(s => s.name);

    // Lọc ra những chủ đề chưa tồn tại
    const subjectsToCreate = subjectArray.filter(subject => !existingNames.includes(subject.name));

    // Nếu không có chủ đề nào mới, trả về thông báo
    if (subjectsToCreate.length === 0) {
        return { message: "All subjects already exist." };
    }

    // Tạo hàng loạt subject mới
    const subjects = await db.Subject.bulkCreate(subjectsToCreate, { validate: true });

    return subjects;
};

module.exports = {
    createSubject,
    listSubjects,
    deleteSubject,
    updateSubject,
    createMultipleSubjects,
};
