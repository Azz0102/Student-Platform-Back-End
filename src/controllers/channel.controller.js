const { Model } = require("sequelize");
const { SuccessResponse } = require("../core/success.response");
const { subscribe, unsubscribe } = require("../services/channel.service");

const userSubscribe = async (req, res, next) => {
    new SuccessResponse({
        message: "subscribe channel success",
        metadata: await subscribe(req.body),
    }).send(res);
};

const userUnsubscribe = async (req, res, next) => {
    new SuccessResponse({
        message: "unsubscribe channel success",
        metadata: await unsubscribe(req.body),
    }).send(res);
};

module.exports = {
    userSubscribe,
    userUnsubscribe,
};
