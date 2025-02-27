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

// const verification = async (req, res, next) => {
//     new SuccessResponse({
//         message: "Verification success!",
//         metadata: await UserService.verification(req.body),
//     }).send(res);
// };

const forgotPassword = async (req, res, next) => {
    new SuccessResponse({
        message: "Verification success!",
        metadata: await UserService.forgotPassword(req.body),
    }).send(res);
};

const resetPassword = async (req, res, next) => {
    new SuccessResponse({
        message: "Verification success!",
        metadata: await UserService.resetPassword({
            token: req.params
        }),
    }).send(res);
};

const resetPasswordToken = async (req, res, next) => {
    new SuccessResponse({
        message: "Verification success!",
        metadata: await UserService.resetPasswordToken(req.body),
    }).send(res);
};

const updatePassword = async (req, res, next) => {
    new SuccessResponse({
        message: "updatePassword success!",
        metadata: await UserService.updatePassword(req.body),
    }).send(res);
};

module.exports = {
    login,
    logout,
    // verification,
    forgotPassword,
    resetPassword,
    resetPasswordToken,
    updatePassword,

};
