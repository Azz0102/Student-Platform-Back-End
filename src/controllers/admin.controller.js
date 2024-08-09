"use strict";

const { SuccessResponse } = require("../core/success.response");
const { schedulingClassSession } = require("../services/admin.service");

const schedulingClassSession = async (req, res, next) => {
    new SuccessResponse({
        message: "Scheduled classes",
        metadata: await schedulingClassSession(req.body),
    }).send(res);
};

module.exports = {
    schedulingClassSession,
};
