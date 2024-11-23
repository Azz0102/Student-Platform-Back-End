"use strict";
const { Op } = require("sequelize");
const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

// Tạo mới một SessionDetail
const createSessionDetail = async ({
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
        // Kiểm tra xem classSession có tồn tại không
        const classSession = await db.ClassSession.findByPk(classSessionId);
        if (!classSession) {
            throw new NotFoundError("ClassSession not found.");
        }

        // Kiểm tra xem classroom có tồn tại không
        const classroom = await db.Classroom.findByPk(classroomId);
        if (!classroom) {
            throw new NotFoundError("Classroom not found.");
        }

        // Kiểm tra xem teacher có tồn tại không
        const teacher = await db.Teacher.findByPk(teacherId);
        if (!teacher) {
            throw new NotFoundError("Teacher not found.");
        }

        // Tạo SessionDetail mới
        const sessionDetail = await db.SessionDetails.create({
            classSessionId,
            classroomId,
            startTime,
            numOfHour,
            dayOfWeek,
            sessionType,
            capacity,
            teacherId,
        });

        return sessionDetail;
    } catch (error) {
        return error;
    }
};

// Liệt kê tất cả SessionDetails
const listSessionDetails = async () => {
    try {
        const sessionDetails = await db.SessionDetails.findAll({
            include: [
                { model: db.ClassSession },
                { model: db.Classroom },
                { model: db.Teacher },
            ],
            order: [["startTime", "ASC"]],
        });

        return sessionDetails;
    } catch (error) {
        return error;
    }
};

// Xóa một SessionDetail
const deleteSessionDetail = async ({ sessionDetailId }) => {
    try {
        // Tìm SessionDetail theo ID
        const sessionDetail = await db.SessionDetails.findByPk(sessionDetailId);
        if (!sessionDetail) {
            throw new NotFoundError("SessionDetail not found.");
        }

        // Xóa SessionDetail
        await sessionDetail.destroy();
    } catch (error) {
        return error;
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
        return error;
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
        return error;
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
        return error;
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
        // const userSessionDetails = await db.User.findByPk(id, {
        //     include: [
        //         {
        //             model: db.Enrollment,
        //             include: [
        //                 {
        //                     model: db.ClassSession,
        //                     include: [
        //                         {
        //                             model: db.SessionDetails,
        //                             include: [
        //                                 {
        //                                     model: db.Classroom,
        //                                     include: [
        //                                         {
        //                                             model: db.Amphitheater,
        //                                         },
        //                                     ],
        //                                 },
        //                                 {
        //                                     model: db.Teacher,
        //                                 },
        //                             ],
        //                         },
        //                         {
        //                             model: db.Semester, // Include semester information
        //                         },
        //                     ],
        //                 },
        //             ],
        //         },
        //     ],
        // });

        const userSessionDetails = await db.SessionDetails.findAll({
            include: [
                {
                    model: db.ClassSession,
                    include: [
                        {
                            model: db.Enrollment,
                            where: { userId: id }, // Filter by userId
                        },
                        {
                            model: db.Semester, // Include Semester model
                            attributes: ["id", "fromDate", "endDate"], // Specify required Semester attributes
                        },
                    ],
                },
            ],
            attributes: ["id", "dayOfWeek", "startTime", "numOfHour"], // SessionDetails attributes
        });

        // const formattedSessions = userSessionDetails.Enrollments.flatMap(
        //     (enrollment) => {
        //         const sessionDetails = enrollment.ClassSession.SessionDetails;
        //         const semester = enrollment.ClassSession.Semester;

        //         return sessionDetails.flatMap((detail) => {
        //             // Lấy tất cả các ngày cho session dựa vào fromDate, endDate, và dayOfWeek
        //             const sessionDates = getSessionDates(
        //                 new Date(semester.fromDate),
        //                 new Date(semester.endDate),
        //                 detail.dayOfWeek
        //             );

        //             // Map từng ngày thành một session
        //             return sessionDates.map((sessionDate) => {
        //                 // Tính thời gian bắt đầu và kết thúc dựa vào startTime và numOfHour
        //                 const start = new Date(sessionDate);
        //                 start.setHours(
        //                     new Date(detail.startTime).getUTCHours(),
        //                     new Date(detail.startTime).getUTCMinutes()
        //                 );

        //                 const end = new Date(
        //                     start.getTime() + detail.numOfHour * 60 * 60 * 1000
        //                 );

        //                 return {
        //                     id: detail.id,
        //                     classSessionId: enrollment.ClassSession.id,
        //                     title: enrollment.ClassSession.name, // Dùng name của ClassSession làm title
        //                     start, // Thời gian bắt đầu
        //                     end, // Thời gian kết thúc
        //                 };
        //             });
        //         });
        //     }
        // );

        const formattedSessions = userSessionDetails.flatMap(
            (sessionDetail) => {
                const sessionDetails = [sessionDetail];
                const semester = sessionDetail.ClassSession.Semester;

                return sessionDetails.flatMap((detail) => {
                    // Lấy tất cả các ngày cho session dựa vào fromDate, endDate, và dayOfWeek
                    const sessionDates = getSessionDates(
                        new Date(detail.startTime),
                        // normalizedStartTime,
                        // new Date(semester.fromDate),
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
                            classSessionId: sessionDetail.ClassSession.id,
                            title: sessionDetail.ClassSession.name, // Dùng name của ClassSession làm title
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
        return error; // Handle or propagate the error as needed
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
                    required: false,
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
