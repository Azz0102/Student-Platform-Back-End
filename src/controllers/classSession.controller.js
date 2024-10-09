"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
    createClassSession,
    listClassSessions,
    deleteClassSession,
    updateClassSession,
    createMultipleClassSessions,
    getUserSpecificClassSession,
} = require("../services/classSession.service");

const newClassSession = async (req, res, next) => {
    new SuccessResponse({
        message: "Created ClassSession",
        metadata: await createClassSession(req.body),
    }).send(res);
};

const classSessionList = async (req, res, next) => {
    new SuccessResponse({
        message: "Get ClassSession list",
        metadata: await listClassSessions(),
    }).send(res);
};

const classSessionDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "Deleted ClassSession",
        metadata: await deleteClassSession({ classSessionId: req.params.id }),
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
};
