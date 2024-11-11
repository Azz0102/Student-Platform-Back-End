"use strict";

const { SuccessResponse } = require("../core/success.response");
const { createSubscription } = require("../services/subscription.service");

const newSubScription = async (req, res, next) => {
    const refreshToken = req.headers["refreshtoken"];
    new SuccessResponse({
        message: "Created subscription",
        metadata: await createSubscription({
            keyStore: refreshToken,
            endpoint: req.body.endpoint,
        }),
    }).send(res);
};

module.exports = {
    newSubScription,
};
