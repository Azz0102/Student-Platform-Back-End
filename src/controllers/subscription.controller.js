"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
    createSubscription
} = require("../services/subscription.service");

const newSubScription = async (req, res, next) => {
    new SuccessResponse({
        message: "Created subscription",
        metadata: await createSubscription(req.body),
    }).send(res);
};


module.exports = {
    newSubScription
};
