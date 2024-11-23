const { Model } = require("sequelize");
const { SuccessResponse } = require("../core/success.response");
const {
    createNews,
    updateNews,
    getListNews,
    getListNewsByUser,
    deleteNews,
    getUserRelatedNews,
} = require("../services/news.service");
const db = require("../models");
const { jwtDecode } = require("jwt-decode");
const path = require('path');

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
        metadata: await getListNewsByUser({ userId: req.params.id }),
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
        metadata: await deleteNews({ newsId: req.params.id }),
    }).send(res);
};

const getUserRelatedNew = async (req, res, next) => {
    new SuccessResponse({
        message: "get list news",
        metadata: await getUserRelatedNews({ userId: req.params.id }),
    }).send(res);
};

const uploadFile = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // Construct the URL to access the uploaded file
    const fileName = req.file.filename;

    const userId = jwtDecode(req.headers["refreshtoken"]).userId;

    const file = await db.File.create({
        userId,
        name: fileName,
    });
    res.json({ fileName, id: file.id });
};

const downloadFile = async (req, res, next) => {
    try {
        // Await the result of the database query
        const file = await db.File.findByPk(req.params.id);

        // Check if the message exists
        if (!file) {
            return res.status(404).send("Message not found");
        }

        // Assuming message.message contains the file path
        const filePath = `${process.env.SAVE_PATH}/newsAttach/${file.name}`;

        // Extract the file name from the path
        const fileName = path.basename(filePath);
        const extension = path.extname(file.name).toLowerCase();
        const newFilename = encodeURIComponent(fileName);
        // Check if it is an image file
        if ([".jpg", ".jpeg", ".png", ".gif"].includes(extension)) {
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${newFilename}"`
            );

            return res.sendFile(filePath, (err) => {
                if (err) {
                    console.error("Error sending file:", err);
                    // return res.status(500).send("Error displaying file");
                }
            });
        } else {
            // Other files will be downloaded

            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${newFilename}"`
            );

            return res.download(filePath, newFilename, (err) => {
                if (err) {
                    console.error("Error downloading file:", err);
                    // return res.status(500).send("Error downloading file");
                }
            });
        }
    } catch (error) {
        console.error("Error fetching message:", error);
        return res.status(500).send("Internal server error");
    }
};

module.exports = {
    newNews,
    newsList,
    newsListByUser,
    newsUpdate,
    newsDelete,
    getUserRelatedNew,
    uploadFile,
    downloadFile,
};
