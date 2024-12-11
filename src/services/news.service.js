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
    console.log("classSessionIds", classSessionIds);

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

    // Create associations with class sessions if provid
    if (fileIds.length > 0) {
        const newsFile = fileIds.map((fileId) => ({
            newsId: news.id,
            fileId,
        }));
        await db.NewsFile.bulkCreate(newsFile);
    }

    if (isGeneralSchoolNews == "true") {
        console.log("phamducdat");
        const noti = await pushNotiToSystem({
            senderId: news.id,
            noti_content: name,
            type,
            classSessionIds,
        });

        // get all subscription

        await publishMessage({
            exchangeName: "coke_studio",
            bindingKey: "coke_studio",
            message: name, // { content, title, subscription}
            type,
            classSessionIds,
            id: news.id,
        });
    } else {
        const newsClassSessions = classSessionIds.map((classSessionId) => ({
            newsId: news.id,
            classSessionId,
        }));
        await db.NewsClassSession.bulkCreate(newsClassSessions);

        console.log('here');

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
    }
    return news;
};

const updateNews = async ({
    newsId,
    content,
    name,
    isGeneralSchoolNews,
    classSessionIds = [],
}) => {
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
};

const getListNews = async ({ filters, sort, limit, offset }) => {
    // 1. Parse filters and sort từ JSON string thành objects nếu tồn tại
    const parsedFilters = filters ? JSON.parse(filters) : [];
    const parsedSort = sort ? JSON.parse(sort) : [];
    // 2. Xây dựng điều kiện `where` từ parsedFilters nếu có
    const whereConditions = {};
    const whereConditionsAmphitheater = {};

    if (parsedFilters.length > 0) {
        for (const filter of parsedFilters) {
            if (filter.value) {
                if (filter.id == "owner") {
                    whereConditionsAmphitheater["name"] = {
                        [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                    };
                    continue;
                }
                if (filter.id == "type") {
                    whereConditions["type"] = {
                        [Op.in]: filter.value, // Sử dụng toán tử Sequelize dựa trên operator
                    };
                    continue;
                }
                whereConditions[filter.id] = {
                    [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                };
            }
        }
    }

    // 3. Xây dựng mảng `order` từ parsedSort nếu có
    const orderConditions =
        parsedSort.length > 0
            ? parsedSort.map((sortItem) => [
                  sortItem.id,
                  sortItem.desc ? "DESC" : "ASC",
              ])
            : null;

    // 4. Thực hiện truy vấn findAll với điều kiện lọc và sắp xếp nếu có
    const items = await db.News.findAll({
        where: parsedFilters.length > 0 ? whereConditions : undefined, // Chỉ áp dụng where nếu có điều kiện
        include: [
            {
                model: db.User,
                where:
                    parsedFilters.length > 0
                        ? whereConditionsAmphitheater
                        : undefined,
            },
        ],
        order: orderConditions || undefined, // Chỉ áp dụng order nếu có điều kiện sắp xếp
        limit,
        offset,
    });

    const totalRecords = await db.News.count({
        where: parsedFilters.length > 0 ? whereConditions : undefined,
        include: [
            {
                model: db.User,
                where:
                    parsedFilters.length > 0
                        ? whereConditionsAmphitheater
                        : undefined,
            },
        ],
    });
    const totalPages = Math.ceil(totalRecords / limit);

    return {
        data: items.map((item) => {
            return {
                id: item.id,
                name: item.name,
                content: item.content,
                owner: item.User.name,
                isGeneralSchoolNews: item.isGeneralSchoolNews,
                type: item.type,
                location: item.location,
                time: item.time,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            };
        }),
        pageCount: totalPages,
    };
};

const getListNewsByUser = async ({
    userId,
    limit = 30,
    offset = 0,
    search = "",
}) => {
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
};

const deleteNews = async ({ ids }) => {
    const news = await db.News.destroy({
        where: {
            id: {
                [Op.in]: ids,
            },
        },
    });
    if (news === 0) {
        throw new NotFoundError("deletedNews");
    }
    return news;
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
};

module.exports = {
    createNews,
    updateNews,
    getListNews,
    getListNewsByUser,
    deleteNews,
    getUserRelatedNews,
};
