"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
    createSubject,
    listSubjects,
    deleteSubject,
    updateSubject,
    createMultipleSubjects,
} = require("../services/subject.service");

const newSubject = async (req, res, next) => {
    new SuccessResponse({
        message: "Created subject",
        metadata: await createSubject(req.body),
    }).send(res);
};

const subjectList = async (req, res, next) => {
    const perPage = parseInt(req.query.perPage) || 10
    new SuccessResponse({
        message: "Get subject list",
        metadata: await listSubjects({
            filters: req.query.filters || "[]",
            sort: req.query.sort || "[]",
            limit: perPage,
            offset: parseInt(req.query.page) > 0 ? (parseInt(req.query.page) - 1) * perPage : 0,
        }),
    }).send(res);
};

const subjectDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "Deleted subject",
        metadata: await deleteSubject(req.body),
    }).send(res);
};

const subjectUpdate = async (req, res, next) => {
    new SuccessResponse({
        message: "Updated subject",
        metadata: await updateSubject(req.body),
    }).send(res);
};

const newSubjectsBulk = async (req, res, next) => {
    new SuccessResponse({
        message: "Created multiple subjects",
        metadata: await createMultipleSubjects(req.body),
    }).send(res);
};

module.exports = {
    newSubject,
    subjectList,
    subjectDelete,
    subjectUpdate,
    newSubjectsBulk,
};
