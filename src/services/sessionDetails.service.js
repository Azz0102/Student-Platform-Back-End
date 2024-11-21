"use strict";
const { Op } = require("sequelize");
const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

// Tạo mới một SessionDetail
const createSessionDetail = async ({
    nameClassSession,
    nameClassroom,
    nameTeacher,
    startTime,
    numOfHour,
    dayOfWeek,
    sessionType,
    capacity,
}) => {
    try {
        // Kiểm tra xem classSession có tồn tại không
        const classSession = await db.ClassSession.findOne({
            where: { name: nameClassSession },
        });
        if (!classSession) {
            throw new NotFoundError("ClassSession not found.");
        }

        // Kiểm tra xem classroom có tồn tại không
        const classroom = await db.Classroom.findOne({
            where: { name: nameClassroom },
        });
        if (!classroom) {
            throw new NotFoundError("Classroom not found.");
        }

        // Kiểm tra xem teacher có tồn tại không
        const teacher = await db.Teacher.findOne({
            where: { name: nameTeacher },
        });
        if (!teacher) {
            throw new NotFoundError("Teacher not found.");
        }

        // Tạo SessionDetail mới
        const sessionDetail = await db.SessionDetails.create({
            classSessionId: classSession.id,
            classroomId: classroom.id,
            teacherId: teacher.id,
            startTime,
            numOfHour,
            dayOfWeek,
            sessionType,
            capacity,
        });

        const classSessionCreat = await db.ClassSession.findOne({
            where: { id: classSession.id }
        });

        classSessionCreat.numOfSessionAWeek += 1;

        await classSessionCreat.save();

        return sessionDetail;
    } catch (error) {
        return error.message;
    }
};

// Liệt kê tất cả SessionDetails
const listSessionDetails = async ({ classSession, filters, sort, limit, offset }) => {
    try {

        // 1. Parse filters and sort từ JSON string thành objects nếu tồn tại
        const parsedFilters = filters ? JSON.parse(filters) : [];
        const parsedSort = sort ? JSON.parse(sort) : [];
        // 2. Xây dựng điều kiện `where` từ parsedFilters nếu có
        const whereConditions = {};
        const nameClassSession = {
            name: classSession
        };
        const nameClassroom = {};
        const nameTeacher = {};

        if (parsedFilters.length > 0) {
            for (const filter of parsedFilters) {
                if (filter.value) {
                    // if (filter.id == 'nameClassSession') {
                    //     nameClassSession["name"] = {
                    //         [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                    //     };
                    //     continue;
                    // }
                    if (filter.id == 'nameClassroom') {
                        nameClassroom["name"] = {
                            [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                        };
                        continue;
                    }
                    if (filter.id == 'nameTeacher') {
                        nameTeacher["name"] = {
                            [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                        };
                        continue;
                    }
                    if (filter.id == 'sessionType') {
                        whereConditions["sessionType"] = {
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
        const items = await db.SessionDetails.findAll({
            where: parsedFilters.length > 0 ? whereConditions : undefined, // Chỉ áp dụng where nếu có điều kiện
            include: [
                {
                    model: db.ClassSession,
                    where: nameClassSession
                },
                {
                    model: db.Classroom,
                    where: parsedFilters.length > 0 ? nameClassroom : undefined,
                },
                {
                    model: db.Teacher,
                    where: parsedFilters.length > 0 ? nameTeacher : undefined,
                },
            ],
            order: orderConditions || undefined, // Chỉ áp dụng order nếu có điều kiện sắp xếp
            limit,
            offset
        });

        const totalRecords = await db.SessionDetails.count({
            where: parsedFilters.length > 0 ? whereConditions : undefined,
            include: [
                {
                    model: db.ClassSession,
                    where: nameClassSession
                },
                {
                    model: db.Classroom,
                    where: parsedFilters.length > 0 ? nameClassroom : undefined,
                },
                {
                    model: db.Teacher,
                    where: parsedFilters.length > 0 ? nameTeacher : undefined,
                },
            ],
        });
        const totalPages = Math.ceil(totalRecords / limit);

        return {
            data: items.map((item) => {
                return {
                    id: item.id,
                    nameClassSession: item.ClassSession.name,
                    nameClassroom: item.Classroom.name,
                    nameTeacher: item.Teacher.name,
                    startTime: item.startTime,
                    numOfHour: item.numOfHour,
                    dayOfWeek: item.dayOfWeek,
                    sessionType: item.sessionType,
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

// Xóa một SessionDetail
const deleteSessionDetail = async ({ ids }) => {
    try {
        console.log("ids", ids)
        const sessionDetailsDe = await db.SessionDetails.findOne({
            where: { id: ids[0] }
        });
        console.log("sessionDetailsDe", sessionDetailsDe)
        const classSessionCreat = await db.ClassSession.findOne({
            where: { id: sessionDetailsDe.classSessionId }
        });
        console.log("classSessionCreat", classSessionCreat.numOfSessionAWeek)

        classSessionCreat.numOfSessionAWeek -= 1;

        await classSessionCreat.save();
        const sessionDetails = await db.SessionDetails.destroy({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
        });

        if (sessionDetails === 0) {
            throw new NotFoundError("deletedSessionDetails");
        }

        return sessionDetails;
    } catch (error) {
        return error.message;
    }
};

// Cập nhật SessionDetail
const updateSessionDetail = async ({
    sessionDetailId,
    classSessionId,
    classroomId,
    startTime,
    numOfHour,
    dayOfWeek,
    sessionType,
    capacity,
    teacherId,
}) => {
    try {
        // Tìm SessionDetail theo ID
        const sessionDetail = await db.SessionDetails.findByPk(sessionDetailId);
        if (!sessionDetail) {
            throw new NotFoundError("SessionDetail not found.");
        }

        // Kiểm tra xem classSession mới có tồn tại không
        if (classSessionId) {
            const classSession = await db.ClassSession.findByPk(classSessionId);
            if (!classSession) {
                throw new NotFoundError("ClassSession not found.");
            }
            sessionDetail.classSessionId = classSessionId;
        }

        // Kiểm tra xem classroom mới có tồn tại không
        if (classroomId) {
            const classroom = await db.Classroom.findByPk(classroomId);
            if (!classroom) {
                throw new NotFoundError("Classroom not found.");
            }
            sessionDetail.classroomId = classroomId;
        }

        // Kiểm tra xem teacher mới có tồn tại không
        if (teacherId) {
            const teacher = await db.Teacher.findByPk(teacherId);
            if (!teacher) {
                throw new NotFoundError("Teacher not found.");
            }
            sessionDetail.teacherId = teacherId;
        }

        // Cập nhật thông tin nếu có giá trị mới
        if (startTime) sessionDetail.startTime = startTime;
        if (numOfHour) sessionDetail.numOfHour = numOfHour;
        if (dayOfWeek) sessionDetail.dayOfWeek = dayOfWeek;
        if (sessionType) sessionDetail.sessionType = sessionType;
        if (capacity) sessionDetail.capacity = capacity;

        await sessionDetail.save();

        return sessionDetail;
    } catch (error) {
        return error.message;
    }
};

// Tạo mới hàng loạt SessionDetails
const createMultipleSessionDetails = async (sessionDetailArray) => {
    try {
        const existingSessionDetails = [];
        for (const detail of sessionDetailArray) {
            const { classSessionId, classroomId, teacherId } = detail;

            // Kiểm tra các thông tin cần thiết
            const classSession = await db.ClassSession.findByPk(classSessionId);
            if (!classSession) {
                existingSessionDetails.push(
                    `ClassSession ID ${classSessionId} not found.`
                );
            }

            const classroom = await db.Classroom.findByPk(classroomId);
            if (!classroom) {
                existingSessionDetails.push(
                    `Classroom ID ${classroomId} not found.`
                );
            }

            const teacher = await db.Teacher.findByPk(teacherId);
            if (!teacher) {
                existingSessionDetails.push(
                    `Teacher ID ${teacherId} not found.`
                );
            }
        }

        if (existingSessionDetails.length > 0) {
            throw new BadRequestError(existingSessionDetails.join(", "));
        }

        // Tạo mới hàng loạt SessionDetails
        const sessionDetails = await db.SessionDetails.bulkCreate(
            sessionDetailArray,
            { validate: true }
        );

        return sessionDetails;
    } catch (error) {
        return error.message;
    }
};

const getAllUserSessionDetails = async ({ userId }) => {
    try {
        const sessionDetails = await db.Enrollment.findAll({
            where: { userId }, // Filter by the user ID
            include: [
                {
                    model: db.ClassSession,
                    as: "classSession",
                    attributes: ["id", "name"], // Select class session id and name
                    include: [
                        {
                            model: db.SessionDetail,
                            as: "sessionDetails",
                            include: [
                                {
                                    model: db.Classroom,
                                    as: "classroom",
                                    attributes: ["id", "name"], // Select classroom id and name
                                    include: [
                                        {
                                            model: db.Amphitheater,
                                            as: "amphitheater", // Adjust alias
                                            attributes: [
                                                "name",
                                                "id",
                                                "location",
                                            ],
                                        },
                                    ],
                                },
                                {
                                    model: db.Semester,
                                    as: "semester",
                                    attributes: ["id", "fromDate", "endDate"], // Select semester details
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        return sessionDetails;
    } catch (error) {
        return error.message;
    }
};

const getDayOfWeekNumber = (dayOfWeek) => {
    const days = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
    };
    return days[dayOfWeek];
};

// Hàm để lấy tất cả các ngày có session từ fromDate đến endDate
const getSessionDates = (fromDate, endDate, dayOfWeek) => {
    let dates = [];
    let currentDate = new Date(
        Date.UTC(
            fromDate.getUTCFullYear(),
            fromDate.getUTCMonth(),
            fromDate.getUTCDate()
        )
    );
    currentDate.setHours(0, 0, 0, 0);

    // Chuyển đổi dayOfWeek (text) thành số
    const targetDay = getDayOfWeekNumber(dayOfWeek);

    // Lặp qua các tuần và tìm ngày đúng với dayOfWeek
    while (currentDate <= endDate) {
        if (currentDate.getDay() === targetDay) {
            dates.push(new Date(currentDate)); // Lưu ngày
        }
        currentDate.setDate(currentDate.getDate() + 1); // Tăng 1 ngày
    }
    return dates;
};

const getSessionDetailsById = async ({ id }) => {
    try {
        const userSessionDetails = await db.User.findByPk(id, {
            include: [
                {
                    model: db.Enrollment,
                    include: [
                        {
                            model: db.ClassSession,
                            include: [
                                {
                                    model: db.SessionDetails,
                                    include: [
                                        {
                                            model: db.Classroom,
                                            include: [
                                                {
                                                    model: db.Amphitheater,
                                                },
                                            ],
                                        },
                                        {
                                            model: db.Teacher,
                                        },
                                    ],
                                },
                                {
                                    model: db.Semester, // Include semester information
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        const formattedSessions = userSessionDetails.Enrollments.flatMap(
            (enrollment) => {
                const sessionDetails = enrollment.ClassSession.SessionDetails;
                const semester = enrollment.ClassSession.Semester;

                return sessionDetails.flatMap((detail) => {
                    // Lấy tất cả các ngày cho session dựa vào fromDate, endDate, và dayOfWeek
                    const sessionDates = getSessionDates(
                        new Date(semester.fromDate),
                        new Date(semester.endDate),
                        detail.dayOfWeek
                    );

                    // Map từng ngày thành một session
                    return sessionDates.map((sessionDate) => {
                        // Tính thời gian bắt đầu và kết thúc dựa vào startTime và numOfHour
                        const start = new Date(sessionDate);
                        start.setHours(
                            new Date(detail.startTime).getUTCHours(),
                            new Date(detail.startTime).getUTCMinutes()
                        );

                        const end = new Date(
                            start.getTime() + detail.numOfHour * 60 * 60 * 1000
                        );

                        return {
                            id: detail.id,
                            classSessionId: enrollment.ClassSession.id,
                            title: enrollment.ClassSession.name, // Dùng name của ClassSession làm title
                            start, // Thời gian bắt đầu
                            end, // Thời gian kết thúc
                        };
                    });
                });
            }
        );

        return formattedSessions;
    } catch (error) {
        console.error("Error fetching session details:", error);
        return error.message; // Handle or propagate the error as needed
    }
};

const getUserClassSessionDetails = async ({ userId, classSessionId }) => {
    try {
        const classSessionDetails = await db.ClassSession.findOne({
            where: { id: classSessionId },
            include: [
                {
                    model: db.Enrollment,
                    where: { userId: userId },
                    required: true,
                },
                {
                    model: db.Semester,
                },
                {
                    model: db.Subject,
                },
                {
                    model: db.SessionDetails,
                    include: [
                        {
                            model: db.Classroom,
                            include: [{ model: db.Amphitheater }],
                        },
                        { model: db.Teacher },
                    ],
                },
                {
                    model: db.Grade,
                    where: { userId: userId },
                },
                {
                    model: db.FinalExam,
                },
                {
                    model: db.News,
                    as: "News", // Specify the alias here
                    through: { attributes: [] },
                },
            ],
        });

        if (!classSessionDetails) {
            throw new Error("Class session not found or user not enrolled");
        }

        // Fetch user notes with matching tags
        const userNotes = await db.UserNote.findAll({
            where: { userId: userId },
            include: [
                {
                    model: db.Tag,
                    where: { name: classSessionDetails.name },
                    required: true,
                },
            ],
        });

        return {
            classSessionDetails,
            userNotes,
        };
    } catch (error) {
        console.error("Error fetching user class session details:", error);
        throw error;
    }
};

module.exports = {
    createSessionDetail,
    listSessionDetails,
    deleteSessionDetail,
    updateSessionDetail,
    createMultipleSessionDetails,
    getAllUserSessionDetails,
    getSessionDetailsById,
    getUserClassSessionDetails,
};
