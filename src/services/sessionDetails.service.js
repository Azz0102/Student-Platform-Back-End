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

module.exports = {
    createSessionDetail,
    listSessionDetails,
    deleteSessionDetail,
    updateSessionDetail,
    createMultipleSessionDetails,
    getAllUserSessionDetails,
};
