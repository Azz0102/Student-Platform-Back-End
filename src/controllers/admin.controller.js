"use strict";

const { SuccessResponse, CREATED } = require("../core/success.response");

const {
    schedulingClassSession,
    signUp,
    signUpMultipleUsers,
    saveSchedule,
} = require("../services/admin.service");
const { publishMessage } = require("../services/notification.service");

const schedulingClassSessionController = async (req, res, next) => {
    new SuccessResponse({
        message: "Scheduled classes",
        metadata: await schedulingClassSession(req.body),
    }).send(res);
};

const savedSchedule = async (req, res, next) => {
    new SuccessResponse({
        message: "Save schedule successfully",
        metadata: await saveSchedule(req.body),
    }).send(res);
};

const signUpController = async (req, res, next) => {
    new CREATED({
        message: "Registered OK!",
        metadata: await signUp(req.body),
    }).send(res);
};

const signUpMultipleUsersController = async (req, res, next) => {
    new CREATED({
        message: "Registered OK!",
        metadata: await signUpMultipleUsers(req.body),
    }).send(res);
};

const publish = async (req, res, next) => {
    new SuccessResponse({
        message: "Published message!",
        metadata: await publishMessage(req.body),
    }).send(res);
};

module.exports = {
    schedulingClassSessionController,
    signUpController,
    signUpMultipleUsersController,
    publish,
    savedSchedule,
};
