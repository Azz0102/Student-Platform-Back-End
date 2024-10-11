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
const { where, Sequelize, Op } = require("sequelize");
const { name } = require("ejs");

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
<<<<<<< HEAD
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
=======
                }
            };
        });



        const listClass = enrollments.map((list) => {
            const { id, name, subjectId, semesterId, capacity, enrollmentId } = list.ClassSession;
            const me_enrollmentId = list.id;
            return { id, name, subjectId, semesterId, capacity, me_enrollmentId, enrollmentId };
>>>>>>> origin/fix_api_getAllChat
            // return list.id;
        });

        const classSessionIds = listClass.map((classItem) => classItem.id);

        const enrolls = await db.Enrollment.findAll({
            where: {
                classSessionId: {
                    [Sequelize.Op.in]: classSessionIds,
                },
<<<<<<< HEAD
            },
=======
            }
>>>>>>> origin/fix_api_getAllChat
        });

        const enrollmentIds = enrolls.map((enroll) => enroll.id);

<<<<<<< HEAD
=======

>>>>>>> origin/fix_api_getAllChat
        const messageAll = await db.Message.findAll({
            where: {
                enrollmentId: {
                    [Sequelize.Op.in]: enrollmentIds,
                },
<<<<<<< HEAD
            },
=======
            }
>>>>>>> origin/fix_api_getAllChat
        });

        const data = enrollments.map((enrollment) => {
            // const id_enroll_thamgiavaolophoc = enrollment.id;
            const classSession = enrollment.ClassSession;

            const enrollments = enrolls.filter((enroll) => {
<<<<<<< HEAD
                return enroll.classSessionId === enrollment.classSessionId;
=======
                return enroll.classSessionId === enrollment.classSessionId
>>>>>>> origin/fix_api_getAllChat
            });

            const newenrollments = enrollments.map((enroll) => {
                const { id, userId, classSessionId } = enroll;
                return { id, userId, classSessionId };
<<<<<<< HEAD
            });
=======
            })

>>>>>>> origin/fix_api_getAllChat

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
<<<<<<< HEAD
            });

            return { classSession, newenrollments, newmessages };
        });

        const messages = data.map((mes) => {
            return mes.newmessages;
        });

        const allMessages = messages.flatMap((messageGroup) => messageGroup);

=======
            })

            return { classSession, newenrollments, newmessages }

        })

        const messages = data.map((mes) => {

            return mes.newmessages;
        })

        const allMessages = messages.flatMap((messageGroup) => messageGroup);



>>>>>>> origin/fix_api_getAllChat
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
<<<<<<< HEAD
                    id,
                    enrollmentId,
                    message,
                    timestamp,
                    file,
                    usedId,
                    name,
=======
                    id, enrollmentId, message, timestamp, file, usedId, name
>>>>>>> origin/fix_api_getAllChat
                };
            })
        );

<<<<<<< HEAD
        data.forEach((session) => {
            session.newmessages = session.newmessages.map((mes) => {
                const fullMes = fullMessages.find((fm) => fm.id === mes.id);
                return fullMes
                    ? { ...mes, usedId: fullMes.usedId, name: fullMes.name }
                    : mes;
=======
        data.forEach(session => {
            session.newmessages = session.newmessages.map(mes => {
                const fullMes = fullMessages.find(fm => fm.id === mes.id);
                return fullMes ? { ...mes, usedId: fullMes.usedId, name: fullMes.name } : mes;
>>>>>>> origin/fix_api_getAllChat
            });
        });

        // Step 3: Structure the result
        return {
<<<<<<< HEAD
            data,
=======
            data
>>>>>>> origin/fix_api_getAllChat
        };
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};
