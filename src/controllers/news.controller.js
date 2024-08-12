const { Model } = require("sequelize");
const { SuccessResponse } = require("../core/success.response");
const {
    createNews,
    updateNews,
    getListNews,
    getListNewsByUser,
    deleteNews,
} = require("../services/news.service");

const newNews = async (req, res, next) => {
    new SuccessResponse({
        message: "created news",
        metadata: await createNews(req.body),
    }).send(res);
};

const newsList = async (req, res, next) => {
    new SuccessResponse({
        message: "get list news",
        metadata: await getListNews(req.body),
    }).send(res);
};

const newsListByUser = async (req, res, next) => {
    new SuccessResponse({
        message: "get list news",
        metadata: await getListNewsByUser(req.body),
    }).send(res);
};

const newsUpdate = async (req, res, next) => {
    new SuccessResponse({
        message: "get list news",
        metadata: await updateNews(req.body),
    }).send(res);
};

const newsDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "get list news",
        metadata: await deleteNews({ newsId: req.query.newsId }),
    }).send(res);
};

module.exports = {
    newNews,
    newsList,
    newsListByUser,
    newsUpdate,
    newsDelete,
};
