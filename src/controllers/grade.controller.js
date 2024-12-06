"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
    gradeLists,
    gradeDeletes,
    newGrades,
    newGradesBulk
} = require("../services/grade.service");

const newGrade = async (req, res, next) => {
    new SuccessResponse({
        message: "Created subject",
        metadata: await newGrades(req.body),
    }).send(res);
};

const gradeList = async (req, res, next) => {
    const perPage = parseInt(req.query.perPage) || 10
    new SuccessResponse({
        message: "Get grade list",
        metadata: await gradeLists({
            classSession: req.query.classSession,
            filters: req.query.filters || "[]",
            sort: req.query.sort || "[]",
            limit: perPage,
            offset: parseInt(req.query.page) > 0 ? (parseInt(req.query.page) - 1) * perPage : 0,
        }),
    }).send(res);
};

const gradeDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "Deleted subject",
        metadata: await gradeDeletes(req.body),
    }).send(res);
};

// const subjectUpdate = async (req, res, next) => {
//     new SuccessResponse({
//         message: "Updated subject",
//         metadata: await updateSubject(req.body),
//     }).send(res);
// };

const newGradesBulks = async (req, res, next) => {
    new SuccessResponse({
        message: "Created multiple subjects",
        metadata: await newGradesBulk(req.body),
    }).send(res);
};

module.exports = {
    newGrade,
    gradeList,
    gradeDelete,
    newGradesBulks,

};
