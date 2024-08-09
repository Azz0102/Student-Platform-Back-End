"use strict";

const { SuccessResponse } = require("../core/success.response");
const UserServiece = require("../services/user.serviece");

const login = async (req, res, next) => {
    new SuccessResponse({
        message: "Login Success!",
        metadata: await UserServiece.login(req.body),
    }).send(res);
};

const logout = async (req, res, next) => {
    new SuccessResponse({
        message: "Logout success!",
        metadata: await UserServiece.logout(req.keyStore),
    }).send(res);
};

module.exports = {
    login,
    logout,

}