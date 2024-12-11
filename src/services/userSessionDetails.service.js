"use strict";

const { Op, where } = require("sequelize");
const db = require("../models");
const {
    BadRequestError,
    NotFoundError,
} = require("../core/error.response");
const { includes } = require("lodash");
const { createEnrollment } = require("./enrollment.service");

const userSessionDetailsCres = async ({
    nameUser,
    sessionDetailsId,
}) => {
    // Kiểm tra xem user có tồn tại không
    const user = await db.User.findOne({
        where: { name: nameUser },
    });
    if (!user) {
        throw new NotFoundError("User not found.");
    }

    // Kiểm tra xem sessionDetails có tồn tại không
    const sessionDetails = await db.SessionDetails.findOne({
        where: { id: sessionDetailsId },
        include: [
            {
                model: db.ClassSession,
            }
        ]
    });
    if (!sessionDetails) {
        throw new NotFoundError("SessionDetails not found.");
    }

    // Kiểm tra xem enrollment có tồn tại không
    const enrollmentss = await db.Enrollment.findOne({
        where: {
            userId: user.id,
            classSessionId: sessionDetails.ClassSession.id
        },
    });
    let enrollmentId;

    console.log("PHAMDUCDAT", enrollmentss);

    if (!enrollmentss) {
        const enrollment = await createEnrollment({
            userId: user.id,
            classSessionId: sessionDetails.ClassSession.id
        })
        enrollmentId = enrollment.id
    } else {
        enrollmentId = enrollmentss.id;
    }

    console.log("enrollmentId", enrollmentId);

    // Tạo SessionDetail mới
    const sessionDetail = await db.UserSessionDetails.create({
        enrollmentId: enrollmentId,
        sessionDetailsId: sessionDetailsId
    });
    return sessionDetail;
};

// Liệt kê tất cả userSessionDetails
const userSessionDetailsLists = async ({ id, filters, sort, limit, offset }) => {
    // 1. Parse filters and sort từ JSON string thành objects nếu tồn tại
    const parsedFilters = filters ? JSON.parse(filters) : [];
    const parsedSort = sort ? JSON.parse(sort) : [];
    // 2. Xây dựng điều kiện `where` từ parsedFilters nếu có
    const whereConditions = {};
    if (parsedFilters.length > 0) {
        for (const filter of parsedFilters) {
            if (filter.value) {
                if (filter.id == 'nameUser') {
                    whereConditions["name"] = {
                        [Op.in]: filter.value, // Sử dụng toán tử Sequelize dựa trên operator
                    };
                    continue;
                }
            }
        };
    }
    // 3. Xây dựng mảng `order` từ parsedSort nếu có
    const orderConditions = parsedSort.length > 0 ? parsedSort.map((sortItem) => [
        sortItem.id,
        sortItem.desc ? "DESC" : "ASC",
    ]) : null;

    // 4. Thực hiện truy vấn findAll với điều kiện lọc và sắp xếp nếu có
    const items = await db.UserSessionDetails.findAll({
        include: [
            {
                model: db.SessionDetails,
                where: {
                    id: id
                },
                include: [
                    {
                        model: db.ClassSession
                    }
                ]
            },
            {
                model: db.Enrollment,
                include: [
                    {
                        model: db.User,
                        where: whereConditions
                    }
                ]
            }
        ],
        order: orderConditions || undefined, // Chỉ áp dụng order nếu có điều kiện sắp xếp
        limit,
        offset
    });

    const totalRecords = await db.UserSessionDetails.count({
        include: [
            {
                model: db.SessionDetails,
                where: {
                    id: id
                },
                include: [
                    {
                        model: db.ClassSession
                    }
                ]
            },
            {
                model: db.Enrollment,
                include: [
                    {
                        model: db.User,
                        where: whereConditions
                    }
                ]
            }
        ],
    });
    const totalPages = Math.ceil(totalRecords / limit);

    return {
        data: items.map((item) => {
            return {
                id: item.id,
                nameUser: item.Enrollment.User.name,
                nameClassSession: item.SessionDetail.ClassSession.name,
                sessionType: item.SessionDetail.sessionType,
                dayOfWeek: item.SessionDetail.dayOfWeek,
                startTime: item.SessionDetail.startTime,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            }
        }),
        pageCount: totalPages
    };
};

const userSessionDetailsDeletes = async ({ ids }) => {

    const userSessionDetail = await db.UserSessionDetails.findOne({
        where: { id: ids[0] },
    });

    const userSessionDetails = await db.UserSessionDetails.destroy({
        where: {
            id: {
                [Op.in]: ids,
            },
        },
    });

    const enrollmentId = userSessionDetail.enrollmentId;

    const remainingDetails = await db.UserSessionDetails.findAll({
        where: { enrollmentId },
    });

    console.log("PhamDDIDDDDDD", remainingDetails.length, enrollmentId)

    if (remainingDetails.length === 0) {
        // Nếu không còn UserSessionDetails nào, xóa Enrollment
        await db.Enrollment.destroy({
            where: { id: enrollmentId },
        });
    }
    if (userSessionDetails === 0) {
        throw new NotFoundError("deletedUserSessionDetails");
    }
    return userSessionDetails;
};

const createMultipleUserSessionDetails = async (dataArray) => {
    // Lặp qua từng phần tử trong dataArray
    for (const data of dataArray) {
        const { nameUser, sessionDetailsId } = data;

        // Kiểm tra xem user có tồn tại không
        const user = await db.User.findOne({
            where: { name: nameUser },
        });
        if (!user) {
            throw new NotFoundError(`User ${nameUser} not found.`);
        }

        // Kiểm tra xem sessionDetails có tồn tại không
        const sessionDetails = await db.SessionDetails.findOne({
            where: { id: sessionDetailsId },
            include: [
                {
                    model: db.ClassSession,
                }
            ]
        });
        if (!sessionDetails) {
            throw new NotFoundError(`SessionDetails ${sessionDetailsId} not found.`);
        }

        // Kiểm tra xem enrollment có tồn tại không
        const enrollment = await db.Enrollment.findOne({
            where: {
                userId: user.id,
                classSessionId: sessionDetails.ClassSession.id
            },
        });

        let enrollmentId;

        if (!enrollment) {
            const newEnrollment = await createEnrollment({
                userId: user.id,
                classSessionId: sessionDetails.ClassSession.id
            });
            enrollmentId = newEnrollment.id;
        } else {
            enrollmentId = enrollment.id;
        }

        // Tạo UserSessionDetails mới
        const sessionDetail = await db.UserSessionDetails.create({
            enrollmentId,
            sessionDetailsId
        });
    }
};


module.exports = {
    userSessionDetailsCres,
    userSessionDetailsLists,
    userSessionDetailsDeletes,
    createMultipleUserSessionDetails,

};