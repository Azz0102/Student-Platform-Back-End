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
    console.log("req", req.files)
    const userId = jwtDecode(req.headers["refreshtoken"]).userId;
    // const userId = 3;

    let fileIds = [];

    const list = req.files.map((item) => {
        return {
            name: item.filename
        }
    })

    const filePromises = list.map(async (item) => {
        const file = await db.File.create({
            userId: userId,
            name: item.name,
        });
        return file.id;
    });
    // Chờ tất cả các promise hoàn thành và lưu lại các id vào mảng
    fileIds = await Promise.all(filePromises);



    new SuccessResponse({
        message: "created news",
        metadata: await createNews({
            userId,
            fileIds,
            classSessionIds: req.body.classSessionIds.map((item) => {
                return item.id;
            }),
            ...req.body
        }),
    }).send(res);
};

const newsList = async (req, res, next) => {
    const perPage = parseInt(req.query.perPage) || 10
    new SuccessResponse({
        message: "Get list news",
        metadata: await getListNews({
            filters: req.query.filters || "[]",
            sort: req.query.sort || "[]",
            limit: perPage,
            offset: parseInt(req.query.page) > 0 ? (parseInt(req.query.page) - 1) * perPage : 0,
        }),
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
        metadata: await deleteNews(req.body),
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

        // Check if it is an image file
        if ([".jpg", ".jpeg", ".png", ".gif"].includes(extension)) {
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${fileName}"`
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
                `attachment; filename="${fileName}"`
            );

            return res.download(filePath, fileName, (err) => {
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
