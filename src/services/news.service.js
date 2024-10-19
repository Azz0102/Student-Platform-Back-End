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
        });

        // Create associations with class sessions if provided
        if (classSessionIds.length > 0) {
            const newsClassSessions = classSessionIds.map((classSessionId) => ({
                newsId: news.id,
                classSessionId,
            }));
            await db.NewsClassSession.bulkCreate(newsClassSessions);

            await pushNotiToSystem({
                senderId: userId,
                noti_content: content,
                type: "CLASS-001",
            });

            // emit classSession for noti
        }

        const noti  = await pushNotiToSystem({
            senderId: userId,
            noti_content: content,
            type: "NEWS-001",
        });
        
        // get all subscription

        await publishMessage({
            exchangeName: "coke_studio",
            bindingKey: "coke_studio",
            message: content, // { content, title, subscription}
        });

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

module.exports = {
    createNews,
    updateNews,
    getListNews,
    getListNewsByUser,
    deleteNews,
};
