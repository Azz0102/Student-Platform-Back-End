"use strict";

const { SuccessResponse } = require("../core/success.response");
const { schedulingClassSession } = require("../services/admin.service");

const schedulingClassSession = async (req, res, next) => {
    new SuccessResponse({
        message: "created role",
        metadata: await schedulingClassSession(),
    }).send(res);
};

module.exports = {
    schedulingClassSession,
};
