"use strict";

const { Op } = require("sequelize");
const db = require("../models");
const {
    BadRequestError,
    NotFoundError,
} = require("../core/error.response");
const { where } = require("sequelize");

// Tạo mới một classroom
const createClassroom = async ({ nameAmphitheater, name, type, capacity }) => {
    try {
        // Kiểm tra xem amphitheater có tồn tại không
        const amphitheater = await db.Amphitheater.findOne({
            where: { name: nameAmphitheater },
        });
        if (!amphitheater) {
            throw new NotFoundError("Amphitheater not found.");
        }

        // Kiểm tra xem classroom với tên này đã tồn tại chưa
        const existingClassroom = await db.Classroom.findOne({
            where: { name },
        });

        if (existingClassroom) {
            throw new BadRequestError("Classroom already exists.");
        }

        // Tạo classroom mới
        const classroom = await db.Classroom.create({
            amphitheaterId: amphitheater.id,
            type,
            name,
            capacity,
        });

        return classroom;
    } catch (error) {
        return error.message;
    }
};

// Liệt kê tất cả classrooms
const listClassrooms = async ({ filters, sort, limit, offset }) => {
    try {
        // 1. Parse filters and sort từ JSON string thành objects nếu tồn tại
        const parsedFilters = filters ? JSON.parse(filters) : [];
        const parsedSort = sort ? JSON.parse(sort) : [];
        // 2. Xây dựng điều kiện `where` từ parsedFilters nếu có
        const whereConditions = {};
        const whereConditionsAmphitheater = {};
        if (parsedFilters.length > 0) {
            for (const filter of parsedFilters) {
                if (filter.value) {
                    if (filter.id == 'nameAmphitheater') {
                        whereConditionsAmphitheater["name"] = {
                            [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                        };
                        continue;
                    }
                    if (filter.id == 'location') {
                        whereConditionsAmphitheater[filter.id] = {
                            [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                        };
                        continue;
                    }
                    if (filter.id == 'type') {
                        whereConditions["type"] = {
                            [Op.in]: filter.value, // Sử dụng toán tử Sequelize dựa trên operator
                        };
                        continue;
                    }
                    whereConditions[filter.id] = {
                        [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                    };
                }
            };
        }
        // 3. Xây dựng mảng `order` từ parsedSort nếu có
        const orderConditions = parsedSort.length > 0 ? parsedSort.map((sortItem) => [
            sortItem.id,
            sortItem.desc ? "DESC" : "ASC",
        ]) : null;

        // 4. Thực hiện truy vấn findAll với điều kiện lọc và sắp xếp nếu có
        const items = await db.Classroom.findAll({
            where: parsedFilters.length > 0 ? whereConditions : undefined, // Chỉ áp dụng where nếu có điều kiện
            include: [
                {
                    model: db.Amphitheater,
                    where: parsedFilters.length > 0 ? whereConditionsAmphitheater : undefined,
                }
            ],
            order: orderConditions || undefined, // Chỉ áp dụng order nếu có điều kiện sắp xếp
            limit,
            offset
        });

        const totalRecords = await db.Classroom.count({
            where: parsedFilters.length > 0 ? whereConditions : undefined,
            include: [
                {
                    model: db.Amphitheater,
                    where: parsedFilters.length > 0 ? whereConditionsAmphitheater : undefined,
                }
            ],
        });
        const totalPages = Math.ceil(totalRecords / limit);

        return {
            data: items.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    nameAmphitheater: item.Amphitheater.name,
                    location: item.Amphitheater.location,
                    type: item.type,
                    capacity: item.capacity,
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

const allClassrooms = async () => {
    try {

        const items = await db.Classroom.findAll({
            include: [
                {
                    model: db.Amphitheater,
                }
            ],
        });

        return {
            data: items.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                }
            }),
        };

    } catch (error) {
        return error.message;
    }
};

// Xóa một classroom
const deleteClassroom = async ({ ids }) => {
    try {
        const classroom = await db.Classroom.destroy({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
        });
        if (classroom === 0) {
            throw new NotFoundError("deletedClassroom");
        }
        return classroom;
    } catch (error) {
        return error.message;
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
        return error.message;
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
        return error.message;
    }
};

module.exports = {
    createClassroom,
    listClassrooms,
    deleteClassroom,
    updateClassroom,
    createMultipleClassrooms,
    allClassrooms,

};
