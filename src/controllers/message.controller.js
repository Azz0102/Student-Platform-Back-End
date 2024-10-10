"use strict";

const db = require("../models");

const { SuccessResponse } = require("../core/success.response");
const Mesage = require("../services/mesage.service");

exports.createChat = async (req, res, next) => {
    new SuccessResponse({
        message: "Create Chat!",
        metadata: await Mesage.createChat(req.body),
    }).send(res);
};

exports.deleteChat = async (req, res, next) => {
    new SuccessResponse({
        message: "Delete Chat!",
        metadata: await Mesage.deleteChat(req.body),
    }).send(res);
};

exports.getUserData = async (req, res, next) => {
    new SuccessResponse({
        message: "Get Chat!",
        metadata: await Mesage.getUserData({ userId: req.params.userId }),
    }).send(res);
};

exports.dowloadFile = async (req, res, next) => {
    const message = db.Message.findByPk(
        req.params.id
    );

    const filePath = message.message;

    const extension = path.extname(fileName).toLowerCase();

    // Kiểm tra nếu là file ảnh thì hiển thị trực tiếp
    if (['.jpg', '.jpeg', '.png', '.gif'].includes(extension)) {
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error("Lỗi khi gửi file:", err);
                res.status(500).send("Lỗi khi hiển thị file");
            }
        });
    } else {
        // Các file khác sẽ được tải xuống
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error("Lỗi khi tải file:", err);
                res.status(500).send("Lỗi khi tải file");
            }
        });
    }
};