"use strict";

const { Op } = require("sequelize");
const db = require("../models");
const {
    BadRequestError,
    NotFoundError,
} = require("../core/error.response");

const newGrades = async ({
    name,
    value,
    nameClassSession,
    nameUser,
}) => {
    try {
        const type = {
            "Thành phần": 10,
            "Giữa kỳ": 30,
            "Cuối kỳ": 60,
        }
        const classSession = await db.ClassSession.findOne({
            where: { name: nameClassSession },
        });
        if (!classSession) {
            throw new BadRequestError("Error: ClassSession not found.");
        }

        const user = await db.User.findOne({
            where: { name: nameUser },
        });
        if (!user) {
            throw new BadRequestError("Error: User not found.");
        }

        const enrollment = await db.Enrollment.findOne({
            where: {
                userId: user.id,
                classSessionId: classSession.id,
            },
        });
        if (!enrollment) {
            throw new BadRequestError("Error: User not add ClassSession.");
        }

        const existingGrade = await db.Grade.findOne({
            where: {
                name,
                userId: user.id
            },
        });

        if (existingGrade) {
            throw new BadRequestError("Grade already exists.");
        }

        // Tạo subject mới
        const grade = await db.Grade.create({
            name,
            type: type[name],
            value,
            classSessionId: classSession.id,
            userId: user.id,
        });

        return grade;
    } catch (error) {
        return error.message;
    }
};

// Liệt kê tất cả grade
const gradeLists = async ({ classSession, filters, sort, limit, offset }) => {
    try {
        // 1. Parse filters and sort từ JSON string thành objects nếu tồn tại
        const parsedFilters = filters ? JSON.parse(filters) : [];
        const parsedSort = sort ? JSON.parse(sort) : [];
        // 2. Xây dựng điều kiện `where` từ parsedFilters nếu có
        const whereConditions = {};
        const nameClassSession = {
            name: classSession
        };
        const nameUser = {};

        if (parsedFilters.length > 0) {
            for (const filter of parsedFilters) {
                if (filter.value) {
                    if (filter.id == 'name') {
                        whereConditions["name"] = {
                            [Op.in]: filter.value, // Sử dụng toán tử Sequelize dựa trên operator
                        };
                        continue;
                    }
                }
                // if (filter.id == 'nameClassSession') {
                //     nameClassSession["name"] = {
                //         [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                //     };
                //     continue;
                // }
                if (filter.id == 'nameUser') {
                    nameUser["name"] = {
                        [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                    };
                    continue;
                }
            };
        }
        // 3. Xây dựng mảng `order` từ parsedSort nếu có
        const orderConditions = parsedSort.length > 0 ? parsedSort.map((sortItem) => [
            sortItem.id,
            sortItem.desc ? "DESC" : "ASC",
        ]) : null;

        // 4. Thực hiện truy vấn findAll với điều kiện lọc và sắp xếp nếu có
        const items = await db.Grade.findAll({
            where: parsedFilters.length > 0 ? whereConditions : undefined, // Chỉ áp dụng where nếu có điều kiện
            include: [
                {
                    model: db.ClassSession,
                    where: nameClassSession
                },
                {
                    model: db.User,
                    where: parsedFilters.length > 0 ? nameUser : undefined,
                }
            ],
            order: orderConditions || undefined, // Chỉ áp dụng order nếu có điều kiện sắp xếp
            limit,
            offset
        });

        const totalRecords = await db.Grade.count({
            where: parsedFilters.length > 0 ? whereConditions : undefined,
            include: [
                {
                    model: db.ClassSession,
                    where: nameClassSession
                },
                {
                    model: db.User,
                    where: parsedFilters.length > 0 ? nameUser : undefined,
                }
            ],
        });
        const totalPages = Math.ceil(totalRecords / limit);

        return {
            data: items.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    value: item.value,
                    nameClassSession: item.ClassSession.name,
                    nameUser: item.User.name,
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

const gradeDeletes = async ({ ids }) => {
    try {
        const grade = await db.Grade.destroy({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
        });
        if (grade === 0) {
            throw new NotFoundError("deletedGrade");
        }
        return grade;
    } catch (error) {
        return error.message;
    }
};

module.exports = {
    newGrades,
    gradeLists,
    gradeDeletes,

};