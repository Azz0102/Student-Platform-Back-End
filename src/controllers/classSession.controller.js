"use strict";

const { SuccessResponse, CREATED } = require("../core/success.response");
const {
    createClassSession,
    listClassSessions,
    deleteClassSession,
    updateClassSession,
    createMultipleClassSessions,
    getUserSpecificClassSession,
    listClassSessionsdat,
} = require("../services/classSession.service");

const newClassSession = async (req, res, next) => {
    new CREATED({
        message: "Created ClassSession",
        metadata: await createClassSession(req.body),
    }).send(res);
};

const classSessionList = async (req, res, next) => {
    const perPage = parseInt(req.query.perPage) || 10
    new SuccessResponse({
        message: "Get ClassSession list",
        metadata: await listClassSessions({
            filters: req.query.filters || "[]",
            sort: req.query.sort || "[]",
            limit: perPage,
            offset: parseInt(req.query.page) > 0 ? (parseInt(req.query.page) - 1) * perPage : 0,
        }),
    }).send(res);
};

const classSessionListss = async (req, res, next) => {
    new SuccessResponse({
        message: "Get ClassSession list",
        metadata: await listClassSessionsdat(),
    }).send(res);
};

const classSessionDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "Deleted ClassSession",
        metadata: await deleteClassSession(req.body),
    }).send(res);
};

const classSessionUpdate = async (req, res, next) => {
    new SuccessResponse({
        message: "Updated ClassSession",
        metadata: await updateClassSession(req.body),
    }).send(res);
};

const newClassSessionsBulk = async (req, res, next) => {
    new SuccessResponse({
        message: "Created multiple ClassSessions",
        metadata: await createMultipleClassSessions(req.body),
    }).send(res);
};

const userGetSpecificClassSession = async (req, res, next) => {
    new SuccessResponse({
        message: "Get user specific ClassSession",
        metadata: await getUserSpecificClassSession(req.body),
    }).send(res);
};

module.exports = {
    newClassSession,
    classSessionList,
    classSessionDelete,
    classSessionUpdate,
    newClassSessionsBulk,
    userGetSpecificClassSession,
    classSessionListss
};
