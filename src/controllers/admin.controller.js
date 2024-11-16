"use strict";

const { SuccessResponse, CREATED } = require("../core/success.response");

const {
    schedulingClassSession,
    signUp,
    signUpMultipleUsers,
    saveSchedule,
    listUser,
    deleteUser,
    deleteUsers,
    updateUser,
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

const getlistUser = async (req, res, next) => {
    // await new Promise(resolve => setTimeout(resolve, 3000));
    const perPage = parseInt(req.query.perPage) || 10
    new SuccessResponse({
        message: "Get user list",
        metadata: await listUser({
            filters: req.query.filters || "[]",
            sort: req.query.sort || "[]",
            limit: perPage,
            offset: parseInt(req.query.page) > 0 ? (parseInt(req.query.page) - 1) * perPage : 0,
        }),
    }).send(res);
};

const deleteUserById = async (req, res, next) => {
    new SuccessResponse({
        message: "Delete User By Id!",
        metadata: await deleteUser(req.body),
    }).send(res);
};

const deleteListUsers = async (req, res, next) => {
    new SuccessResponse({
        message: "Delete List Users!",
        metadata: await deleteUsers(req.body),
    }).send(res);
};

const updateUserById = async (req, res, next) => {
    new SuccessResponse({
        message: "Update User By Id!",
        metadata: await updateUser(req.body),
    }).send(res);
};

module.exports = {
    schedulingClassSessionController,
    signUpController,
    signUpMultipleUsersController,
    publish,
    savedSchedule,
    getlistUser,
    deleteUserById,
    deleteListUsers,
    updateUserById,

};
