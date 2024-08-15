"use strict";

const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

const login = async (req, res, next) => {
    new SuccessResponse({
        message: "Login Success!",
        metadata: await UserService.login(req.body),
    }).send(res);
};

const logout = async (req, res, next) => {
    new SuccessResponse({
        message: "Logout success!",
        metadata: await UserService.logout(req.body),
    }).send(res);
};

const verification = async (req, res, next) => {
    new SuccessResponse({
        message: "Verification success!",
        metadata: await UserService.verification(req.body),
    }).send(res);
};

const forgotPassword = async (req, res, next) => {
    new SuccessResponse({
        message: "Verification success!",
        metadata: await UserService.forgotPassword(req.body),
    }).send(res);
};

const updateForgotPassword = async (req, res, next) => {
    new SuccessResponse({
        message: "Verification success!",
        metadata: await UserService.updateForgotPassword(req.body),
    }).send(res);
};

const updatePassword = async (req, res, next) => {
    console.log("ssss", req.headers);

    new SuccessResponse({
        message: "updatePassword success!",
        metadata: await UserService.updatePassword({
            refreshToken: req.headers.refreshtoken,
            data: req.body
        }),
    }).send(res);
};

module.exports = {
    login,
    logout,
    verification,
    forgotPassword,
    updateForgotPassword,
    updatePassword,

};
