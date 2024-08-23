"use strict";

const { SuccessResponse } = require("../core/success.response");
const Mesage = require("../services/mesage.service");

exports.createChat = async (req, res, next) => {
    new SuccessResponse({
        message: "Create Chat!",
        metadata: await Mesage.createChat(req.body),
    }).send(res);
};

exports.getChatById = async (req, res, next) => {
    new SuccessResponse({
        message: "Get Chat By Id!",
        metadata: await Mesage.getChatById(req.body),
    }).send(res);
};

exports.getChatByConversationId = async (req, res, next) => {
    new SuccessResponse({
        message: "Get Chat By Conversation Id!",
        metadata: await Mesage.getChatByConversationId(req.body),
    }).send(res);
};


exports.deleteChat = async (req, res, next) => {
    new SuccessResponse({
        message: "Delete Chat!",
        metadata: await Mesage.deleteChat(req.body),
    }).send(res);
};