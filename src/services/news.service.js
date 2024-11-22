"use strict";

const { Op } = require("sequelize");
const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { publishMessage, pushNotiToSystem } = require("./notification.service");

const createNews = async ({
    userId,
    content = "",
    name,
    isGeneralSchoolNews = false,
    classSessionIds = [],
    time,
    location,
    fileIds = [],
    type = "EVENT-002",
}) => {
    try {
        // Validate user existence
        const user = await db.User.findByPk(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Create new news entry
        const news = await db.News.create({
            userId,
            content,
            name,
            isGeneralSchoolNews,
            time,
            location,
            type,
        });

        // Create associations with class sessions if provided
        if (classSessionIds.length > 0) {
            const newsClassSessions = classSessionIds.map((classSessionId) => ({
                newsId: news.id,
                classSessionId,
            }));
            await db.NewsClassSession.bulkCreate(newsClassSessions);

            await pushNotiToSystem({
                senderId: news.id,
                noti_content: name,
                type,
                classSessionIds,
            });

            await publishMessage({
                exchangeName: "coke_studio",
                bindingKey: "coke_studio",
                message: name, // { content, title, subscription}
                type,
                classSessionIds,
                id: news.id,
            });

            // emit classSession for noti
        } // Create associations with class sessions if provided

        if (fileIds.length > 0) {
            const newsFile = fileIds.map((fileId) => ({
                newsId: news.id,
                fileId,
            }));
            await db.NewsFile.bulkCreate(newsFile);
        }

        if (isGeneralSchoolNews) {
            console.log("noti");

            const noti = await pushNotiToSystem({
                senderId: news.id,
                noti_content: name,
                type,
                classSessionIds: [],
            });

            console.log("noti", noti);

            // get all subscription

            await publishMessage({
                exchangeName: "coke_studio",
                bindingKey: "coke_studio",
                message: name, // { content, title, subscription}
                type,
                classSessionIds,
                id: news.id,
            });
        }

        return news;
    } catch (error) {
        return error;
    }
};

const updateNews = async ({
    newsId,
    content,
    name,
    isGeneralSchoolNews,
    classSessionIds = [],
}) => {
    try {
        // Find the news entry to update
        const news = await db.News.findByPk(newsId);

        if (!news) {
            throw new NotFoundError("News not found");
        }

        // Update the news
        if (content) news.content = content;
        if (name) news.name = name;
        if (isGeneralSchoolNews !== undefined)
            news.isGeneralSchoolNews = isGeneralSchoolNews;
        // Save the updated news entry
        await news.save();

        // Update associations with class sessions if provided
        if (classSessionIds.length > 0) {
            // Delete existing associations
            await NewsClassSession.destroy({ where: { newsId } });
            // Create new associations
            const newsClassSessions = classSessionIds.map((classSessionId) => ({
                newsId: news.id,
                classSessionId,
            }));
            await db.NewsClassSession.bulkCreate(newsClassSessions);
        }

        return news;
    } catch (error) {
        return error;
    }
};

const getListNews = async ({ limit = 30, offset = 0, search = "" }) => {
    try {
        const whereClause = search
            ? {
                  [Op.or]: [
                      { name: { [Op.like]: `%${search}%` } },
                      { content: { [Op.like]: `%${search}%` } },
                  ],
              }
            : {};

        const newsList = await db.News.findAll({
            where: whereClause,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });

        return newsList;
    } catch (error) {
        console.error("Error fetching news list:", error);
        throw error;
    }
};

const getListNewsByUser = async ({
    userId,
    limit = 30,
    offset = 0,
    search = "",
}) => {
    try {
        const whereClause = search
            ? {
                  [Op.or]: [
                      { name: { [Op.like]: `%${search}%` } },
                      { content: { [Op.like]: `%${search}%` } },
                  ],
              }
            : {};

        // Fetch user's enrolled class sessions
        const enrolledClassSessions = await Enrollment.findAll({
            where: { userId },
            attributes: ["classSessionId"],
        });
        const classSessionIds = enrolledClassSessions.map(
            (enrollment) => enrollment.classSessionId
        );

        const newsList = await News.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { isGeneralSchoolNews: true },
                            { classSessionId: classSessionIds },
                        ],
                    },
                    whereClause,
                ],
            },
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });

        return newsList;
    } catch (error) {
        return error;
    }
};

const deleteNews = async ({ newsId }) => {
    try {
        // Find the news entry by its ID
        const news = await db.News.findByPk(newsId);

        if (!news) {
            throw new NotFoundError("News not found");
        }
        // Delete the news entry
        await news.destroy();
    } catch (error) {
        return error;
    }
};

const formatResponseData = (responseData) => {
    return responseData.map((news) => ({
        id: news.id,
        title: news.name, // ánh xạ name thành title
        content: news.content,
        isGeneralSchoolNews: news.isGeneralSchoolNews,
        relatedTo: news.ClassSessions.map((classSession) => ({
            id: classSession.id, // chỉ giữ lại id
            name: classSession.name, // chỉ giữ lại name
        })),
        files: news.NewsFiles.map((newsFile) => ({
            id: newsFile.File.id,
            name: newsFile.File.name,
        })),
        time: news.time,
        location: news.location,
    }));
};

const getUserRelatedNews = async ({ userId }) => {
    try {
        const userNews = await db.News.findAll({
            where: {
                [Op.or]: [
                    { isGeneralSchoolNews: true },
                    { "$ClassSessions.Enrollments.userId$": userId },
                ],
            },
            include: [
                {
                    model: db.User,
                    attributes: ["id", "name"],
                    as: "Author",
                },
                {
                    model: db.ClassSession,
                    attributes: ["id", "name"],
                    through: {
                        model: db.NewsClassSession,
                        attributes: ["classSessionId"],
                    },
                    include: [
                        {
                            model: db.Enrollment,
                            where: { userId: userId },
                            required: false,
                        },
                    ],
                    as: "ClassSessions",
                },
                {
                    model: db.NewsFile,
                    as: "NewsFiles", // Ensure this matches the alias defined in the News model association
                    include: [
                        {
                            model: db.File,
                            attributes: ["id", "name"],
                            as: "File", // Ensure this matches the alias defined in the NewsFile model association
                        },
                    ],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return formatResponseData(userNews);
    } catch (error) {
        console.error("Error fetching user-related news:", error);
        throw error;
    }
};

module.exports = {
    createNews,
    updateNews,
    getListNews,
    getListNewsByUser,
    deleteNews,
    getUserRelatedNews,
};
