"use strict";

const db = require("../models");
const { updateConversation } = require("./conversation.service");
const Sequelize = require("sequelize");
const {
    BadRequestError,
    AuthFailureError,
    ForbiddenError,
    NotFoundError,
} = require("../core/error.response");
const { name } = require("ejs");

// Create (Insert) a new chat
exports.createChat = async ({
    enrollmentId,
    message,
    timestamp,
    file = false,
}) => {
    const chat = await db.Message.create({
        enrollmentId,
        message,
        timestamp,
        file,
    });
    return chat;
};

exports.getChatById = async ({ classSessionId, refreshToken }) => {
    console.log("ref", refreshToken);
    const classSession = await db.ClassSession.findByPk(classSessionId, {
        attributes: ["id", "name"],
    });

    if (!classSession) {
        throw new Error("Class session not found");
    }

    const keyStore = await db.KeyStore.findOne({
        where: { refreshToken: refreshToken },
    });

    console.log("keyStore", keyStore);

    const enrollment = await db.Enrollment.findOne({
        where: { userId: keyStore.userId, classSessionId: classSessionId },
    });

    // Step 1: Get all enrollments for the class session
    const enrollments = await db.Enrollment.findAll({
        where: {
            classSessionId: classSessionId,
        },
        include: [
            {
                model: db.User,
                attributes: ["id", "name"],
            },
        ],
    });

    if (!enrollments.length) {
        throw new Error("No enrollments found for this class session");
    }

    // Step 2: Get enrollment IDs
    const enrollmentIds = enrollments.map((enrollment) => enrollment.id);

    // Step 3: Get all messages for these enrollments
    const messages = await db.Message.findAll({
        where: {
            enrollmentId: {
                [Sequelize.Op.in]: enrollmentIds,
            },
        },
    });

    // Step 4: Format messages with user information
    const formattedMessages = messages.map((message) => {
        const enrollment = enrollments.find(
            (e) => e.id === message.enrollmentId
        );
        return {
            id: message.id,
            message: message.message,
            timestamp: message.timestamp,
            file: message.file,
            enrollmentId: message.enrollmentId,
            userId: enrollment.User.id,
            userName: enrollment.User.name,
        };
    });

    return {
        classSessionId,
        enrollmentId: enrollment.id,
        name: classSession.name,
        messages: formattedMessages,
    };
};

// Delete a chat by ID
exports.deleteChat = async ({ id }) => {
    const deletedChat = await db.Message.destroy({
        where: { id },
    });
    if (!deletedChat) {
        throw new NotFoundError("deleteChat");
    }
    return deletedChat;
};

exports.getUserData = async ({ userId }) => {
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
            // UserId: enrollment.UserId,
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
};
