"use strict";

const {
    userSessionDetailsLists,
    userSessionDetailsDeletes,
    userSessionDetailsCres,
    createMultipleUserSessionDetails
} = require("../services/userSessionDetails.service");
const { SuccessResponse } = require("../core/success.response");

const userSessionDetailsCre = async (req, res, next) => {
    new SuccessResponse({
        message: "Created session detail",
        metadata: await userSessionDetailsCres(req.body),
    }).send(res);
};

const userSessionDetailsList = async (req, res, next) => {
    const perPage = parseInt(req.query.perPage) || 10
    new SuccessResponse({
        message: "Get grade list",
        metadata: await userSessionDetailsLists({
            id: req.query.sessionDetailsId,
            filters: req.query.filters || "[]",
            sort: req.query.sort || "[]",
            limit: perPage,
            offset: parseInt(req.query.page) > 0 ? (parseInt(req.query.page) - 1) * perPage : 0,
        }),
    }).send(res);
};

const userSessionDetailsDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "Deleted subject",
        metadata: await userSessionDetailsDeletes(req.body),
    }).send(res);
};

const createMultipleUserSessionDetail = async (req, res, next) => {
    new SuccessResponse({
        message: "Created session detail",
        metadata: await createMultipleUserSessionDetails(req.body),
    }).send(res);
};

module.exports = {
    userSessionDetailsCre,
    userSessionDetailsList,
    userSessionDetailsDelete,
    createMultipleUserSessionDetail
}