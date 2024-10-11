"use strict";

const db = require("../models");
const { updateConversation } = require("./conversation.service");
const { Sequelize } = require("sequelize");

const {
    BadRequestError,
    AuthFailureError,
    ForbiddenError,
    NotFoundError,
} = require("../core/error.response");
const { where } = require("sequelize");

// Create (Insert) a new chat
exports.createChat = async ({
    enrollmentId,
    message,
    timestamp,
    file = false,
}) => {
    try {
        const chat = await db.Message.create({
            enrollmentId,
            message,
            timestamp,
            file,
        });
        return chat;
    } catch (error) {
        return error;
    }
};

// Delete a chat by ID
exports.deleteChat = async ({ id }) => {
    try {
        const deletedChat = await db.Message.destroy({
            where: { id },
        });
        if (!deletedChat) {
            throw new NotFoundError("deleteChat");
        }
        return deletedChat;
    } catch (error) {
        return error;
    }
};

exports.getUserData = async ({ userId }) => {
    try {
        // Step 1: Get user
        const user = await db.User.findByPk(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Step 2: Get enrolled class sessions with messages
        const enrolllits = await db.Enrollment.findAll({
            where: { userId: userId },

            include: [
                {
                    model: db.ClassSession,
                    attributes: [
                        "id",
                        "name",
                        "subjectId",
                        "semesterId",
                        "capacity",
                        // [db.Sequelize.col('Enrollment.id'), 'enrollmentId'],
                    ],
                },
            ],
        });

        const enrollments = enrolllits.map((enrollment) => {
            return {
                id: enrollment.id, // id của Enrollment
                userId: enrollment.userId,
                classSessionId: enrollment.classSessionId,
                enrolledAt: enrollment.enrolledAt,
                createdAt: enrollment.createdAt,
                updatedAt: enrollment.updatedAt,
                ClassSessionId: enrollment.ClassSessionId,
                UserId: enrollment.UserId,
                ClassSession: {
                    id: enrollment.ClassSession.id,
                    name: enrollment.ClassSession.name,
                    subjectId: enrollment.ClassSession.subjectId,
                    semesterId: enrollment.ClassSession.semesterId,
                    capacity: enrollment.ClassSession.capacity,
                    enrollmentId: enrollment.id,
                },
            };
        });

        const listClass = enrollments.map((list) => {
            const { id, name, subjectId, semesterId, capacity, enrollmentId } =
                list.ClassSession;
            const me_enrollmentId = list.id;
            return {
                id,
                name,
                subjectId,
                semesterId,
                capacity,
                me_enrollmentId,
                enrollmentId,
            };
            // return list.id;
        });

        const classSessionIds = listClass.map((classItem) => classItem.id);

        const enrolls = await db.Enrollment.findAll({
            where: {
                classSessionId: {
                    [Sequelize.Op.in]: classSessionIds,
                },
            },
        });

        const enrollmentIds = enrolls.map((enroll) => enroll.id);

        const messageAll = await db.Message.findAll({
            where: {
                enrollmentId: {
                    [Sequelize.Op.in]: enrollmentIds,
                },
            },
        });

        const data = enrollments.map((enrollment) => {
            // const id_enroll_thamgiavaolophoc = enrollment.id;
            const classSession = enrollment.ClassSession;

            const enrollments = enrolls.filter((enroll) => {
                return enroll.classSessionId === enrollment.classSessionId;
            });

            const newenrollments = enrollments.map((enroll) => {
                const { id, userId, classSessionId } = enroll;
                return { id, userId, classSessionId };
            });

            const messages = messageAll.filter((mes) => {
                for (let index = 0; index < enrollments.length; index++) {
                    if (mes.enrollmentId === enrollments[index].id) {
                        return true;
                    }
                }
                return false;
            });

            const newmessages = messages.map((mes) => {
                const { id, enrollmentId, message, timestamp, file } = mes;
                return { id, enrollmentId, message, timestamp, file };
            });

            return { classSession, newenrollments, newmessages };
        });

        const messages = data.map((mes) => {
            return mes.newmessages;
        });

        const allMessages = messages.flatMap((messageGroup) => messageGroup);

        const fullMessages = await Promise.all(
            allMessages.map(async (mes) => {
                const temp = await db.Enrollment.findOne({
                    where: { id: mes.enrollmentId },
                    include: [
                        {
                            model: db.User,
                            attributes: ["id", "name"],
                        },
                    ],
                });

                const { id, enrollmentId, message, timestamp, file } = mes;
                const { id: usedId, name } = temp.User;
                return {
                    id,
                    enrollmentId,
                    message,
                    timestamp,
                    file,
                    usedId,
                    name,
                };
            })
        );

        data.forEach((session) => {
            session.newmessages = session.newmessages.map((mes) => {
                const fullMes = fullMessages.find((fm) => fm.id === mes.id);
                return fullMes
                    ? { ...mes, usedId: fullMes.usedId, name: fullMes.name }
                    : mes;
            });
        });

        // Step 3: Structure the result
        return {
            data,
        };
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};
