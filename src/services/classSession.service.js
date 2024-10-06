"use strict";

const db = require("../models");
const {
    BadRequestError,
    NotFoundError,
} = require("../core/error.response");

// Tạo mới một ClassSession
const createClassSession = async ({ subjectId, semesterId, fromDate, endDate, numOfSessionAWeek, capacity }) => {
    try {
        // Kiểm tra xem subject có tồn tại không
        const subject = await db.Subject.findByPk(subjectId);
        if (!subject) {
            throw new NotFoundError("Subject not found.");
        }

        // Kiểm tra xem semester có tồn tại không
        const semester = await db.Semester.findByPk(semesterId);
        if (!semester) {
            throw new NotFoundError("Semester not found.");
        }

        // Kiểm tra xem ClassSession với thông tin này đã tồn tại chưa
        const existingClassSession = await db.ClassSession.findOne({
            where: {
                subjectId,
                semesterId,
                fromDate,
                endDate,
            },
        });

        if (existingClassSession) {
            throw new BadRequestError("ClassSession already exists.");
        }

        // Tạo ClassSession mới
        const classSession = await db.ClassSession.create({
            subjectId,
            semesterId,
            fromDate,
            endDate,
            numOfSessionAWeek,
            capacity,
        });

        return classSession;
    } catch (error) {
        return error;
    }
};

// Liệt kê tất cả ClassSessions
const listClassSessions = async () => {
    try {
        const classSessions = await db.ClassSession.findAll({
            include: [{ model: db.Subject }, { model: db.Semester }],
            order: [["fromDate", "ASC"]], // Sắp xếp theo ngày bắt đầu
        });

        return classSessions;
    } catch (error) {
        return error;
    }
};

// Xóa một ClassSession
const deleteClassSession = async ({ classSessionId }) => {
    try {
        // Tìm ClassSession theo ID
        const classSession = await db.ClassSession.findByPk(classSessionId);
        if (!classSession) {
            throw new NotFoundError("ClassSession not found.");
        }

        // Xóa ClassSession
        await classSession.destroy();
    } catch (error) {
        return error;
    }
};

// Cập nhật ClassSession
const updateClassSession = async ({ classSessionId, subjectId, semesterId, fromDate, endDate, numOfSessionAWeek, capacity }) => {
    try {
        // Tìm ClassSession theo ID
        const classSession = await db.ClassSession.findByPk(classSessionId);
        if (!classSession) {
            throw new NotFoundError("ClassSession not found.");
        }

        // Kiểm tra xem subject mới có tồn tại không
        if (subjectId) {
            const subject = await db.Subject.findByPk(subjectId);
            if (!subject) {
                throw new NotFoundError("Subject not found.");
            }
            classSession.subjectId = subjectId;
        }

        // Kiểm tra xem semester mới có tồn tại không
        if (semesterId) {
            const semester = await db.Semester.findByPk(semesterId);
            if (!semester) {
                throw new NotFoundError("Semester not found.");
            }
            classSession.semesterId = semesterId;
        }

        // Cập nhật thông tin nếu có giá trị mới
        if (fromDate) classSession.fromDate = fromDate;
        if (endDate) classSession.endDate = endDate;
        if (numOfSessionAWeek) classSession.numOfSessionAWeek = numOfSessionAWeek;
        if (capacity) classSession.capacity = capacity;

        await classSession.save();

        return classSession;
    } catch (error) {
        return error;
    }
};

// Tạo mới hàng loạt ClassSessions
const createMultipleClassSessions = async (classSessionArray) => {
    try {
        // Kiểm tra xem các subject và semester có tồn tại không
        for (const session of classSessionArray) {
            const subject = await db.Subject.findByPk(session.subjectId);
            if (!subject) {
                throw new NotFoundError(`Subject with ID ${session.subjectId} not found.`);
            }

            const semester = await db.Semester.findByPk(session.semesterId);
            if (!semester) {
                throw new NotFoundError(`Semester with ID ${session.semesterId} not found.`);
            }
        }

        // Kiểm tra các ClassSession đã tồn tại không
        const existingClassSessions = await Promise.all(classSessionArray.map(async (session) => {
            return await db.ClassSession.findOne({
                where: {
                    subjectId: session.subjectId,
                    semesterId: session.semesterId,
                    fromDate: session.fromDate,
                    endDate: session.endDate,
                },
            });
        }));

        const duplicates = existingClassSessions.filter(Boolean);
        if (duplicates.length > 0) {
            throw new BadRequestError(`ClassSession(s) already exists with subjectId: ${duplicates.map(s => s.subjectId).join(", ")}`);
        }

        // Tạo mới hàng loạt ClassSessions
        const classSessions = await db.ClassSession.bulkCreate(classSessionArray, { validate: true });

        return classSessions;
    } catch (error) {
        return error;
    }
};

module.exports = {
    createClassSession,
    listClassSessions,
    deleteClassSession,
    updateClassSession,
    createMultipleClassSessions,
};
