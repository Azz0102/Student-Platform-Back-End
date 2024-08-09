"use strict";

const { SuccessResponse } = require("../core/success.response");

const {
    schedulingClassSession,
    signUp,
    signUpMultipleUsers

} = require("../services/admin.service");

const schedulingClassSessionController = async (req, res, next) => {
    new SuccessResponse({
        message: "created role",
        metadata: await schedulingClassSession(),
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

module.exports = {
    schedulingClassSessionController,
    signUpController,
    signUpMultipleUsersController

};
