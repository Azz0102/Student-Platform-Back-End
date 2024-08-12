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

module.exports = {
    login,
    logout,
};
