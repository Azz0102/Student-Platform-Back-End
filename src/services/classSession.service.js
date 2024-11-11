"use strict";

const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

// Tạo mới một ClassSession
const createClassSession = async ({
    subjectId,
    semesterId,
    fromDate,
    endDate,
    numOfSessionAWeek,
    capacity,
}) => {
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
const updateClassSession = async ({
    classSessionId,
    subjectId,
    semesterId,
    fromDate,
    endDate,
    numOfSessionAWeek,
    capacity,
}) => {
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
        if (numOfSessionAWeek)
            classSession.numOfSessionAWeek = numOfSessionAWeek;
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
                throw new NotFoundError(
                    `Subject with ID ${session.subjectId} not found.`
                );
            }

            const semester = await db.Semester.findByPk(session.semesterId);
            if (!semester) {
                throw new NotFoundError(
                    `Semester with ID ${session.semesterId} not found.`
                );
            }
        }

        // Kiểm tra các ClassSession đã tồn tại không
        const existingClassSessions = await Promise.all(
            classSessionArray.map(async (session) => {
                return await db.ClassSession.findOne({
                    where: {
                        subjectId: session.subjectId,
                        semesterId: session.semesterId,
                        fromDate: session.fromDate,
                        endDate: session.endDate,
                    },
                });
            })
        );

        const duplicates = existingClassSessions.filter(Boolean);
        if (duplicates.length > 0) {
            throw new BadRequestError(
                `ClassSession(s) already exists with subjectId: ${duplicates
                    .map((s) => s.subjectId)
                    .join(", ")}`
            );
        }

        // Tạo mới hàng loạt ClassSessions
        const classSessions = await db.ClassSession.bulkCreate(
            classSessionArray,
            { validate: true }
        );

        return classSessions;
    } catch (error) {
        return error;
    }
};

const getUserSpecificClassSession = async ({ userId, classSessionId }) => {
    try {
        // First, check if the user is enrolled in the given classSession
        const enrollment = await Enrollment.findOne({
            where: {
                userId,
                classSessionId,
            },
        });

        if (!enrollment) {
            throw new NotFoundError(
                "User is not enrolled in this class session."
            );
        }

        // Fetch the specific class session with the required associations
        const classSession = await ClassSession.findOne({
            where: { id: classSessionId },
            include: [
                {
                    model: SessionDetail,
                    as: "sessionDetails", // Adjust alias if necessary
                    include: [
                        {
                            model: Teacher,
                            as: "teacher", // Adjust alias if necessary
                            attributes: ["id", "name", "dateOfBirth"],
                        },
                    ],
                },
                {
                    model: Semester,
                    as: "semester", // Adjust alias if necessary
                    attributes: ["id", "fromDate", "endDate"],
                },
                {
                    model: UserNote,
                    as: "notes", // Assuming notes are related to classSession
                    where: {
                        "$notes.tags.name$": Sequelize.col("ClassSession.name"), // Filter by classSession name
                    },
                    include: [
                        {
                            model: Tag,
                            as: "tags", // Adjust alias if necessary
                            attributes: ["id", "name"],
                        },
                    ],
                    required: false, // Ensure it works even if no notes are found
                },
                {
                    model: Grade,
                    as: "grades", // Grades must be linked to the classSession
                    where: { userId, classSessionId }, // Ensure both userId and classSessionId match
                    required: false, // Ensure it works even if no grades are found
                    attributes: ["value", "createdAt"],
                },
                {
                    model: News,
                    as: "news", // Assuming news is linked to classSession
                    required: false, // Fetch news only related to this classSession
                    attributes: ["name", "content", "createdAt"],
                    include: [
                        {
                            model: NewsClassSession, // Fetch only news related to the specific classSession
                            as: "newsClassSession",
                            where: { classSession: classSessionId },
                            required: true, // Ensure only related news is fetched
                        },
                    ],
                },
                {
                    model: Notification,
                    as: "notifications", // Assuming notifications are linked to classSession
                    where: { noti_type: "NEWS-001" }, // Adjust the condition based on your notification type logic
                    required: false, // Ensure it works even if no notifications are found
                    attributes: ["noti_content", "read", "createdAt"],
                },
            ],
        });

        if (!classSession) {
            throw new NotFoundError(
                "Class session not found for the given classSessionId."
            );
        }

        return classSession;
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
    getUserSpecificClassSession,
};
