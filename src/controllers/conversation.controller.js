"use strict";

const { SuccessResponse } = require("../core/success.response");
const Conversation = require("../services/conversation.service");

exports.createConversation = async (req, res, next) => {
    new SuccessResponse({
        message: "Create Conversation!",
        metadata: await Conversation.createConversation(req.body),
    }).send(res);
};

exports.getConversationById = async (req, res, next) => {
    new SuccessResponse({
        message: "Get Conversation By Id!",
        metadata: await Conversation.getConversationById(req.params),
    }).send(res);
};

exports.getConversationByUserid = async (req, res, next) => {
    new SuccessResponse({
        message: "Get Conversation By Userid !",
        metadata: await Conversation.getConversationByUserid(req.params),
    }).send(res);
};

