"use strict";

const db = require("../models");

const { SuccessResponse } = require("../core/success.response");
const Mesage = require("../services/mesage.service");
const path = require("path");

exports.createChat = async (req, res, next) => {
    new SuccessResponse({
        message: "Create Chat!",
        metadata: await Mesage.createChat(req.body),
    }).send(res);
};

exports.getChatById = async (req, res, next) => {
    new SuccessResponse({
        message: "Create Chat!",
        metadata: await Mesage.getChatById({
            classSessionId: req.params.id,
            refreshToken: req.headers["refreshtoken"],
        }),
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
    try {
        // Await the result of the database query
        const message = await db.Message.findByPk(req.params.id);

        // Check if the message exists
        if (!message) {
            return res.status(404).send("Message not found");
        }

        // Assuming message.message contains the file path
        const filePath = message.message;

        // Extract the file name from the path
        const fileName = path.basename(filePath);
        const extension = path.extname(fileName).toLowerCase();

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
