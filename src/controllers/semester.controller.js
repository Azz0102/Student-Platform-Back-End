"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
    createSemester,
    listSemesters,
    deleteSemester,
    updateSemester,
    createMultipleSemesters,
    semesterDatas,
} = require("../services/semester.service");

const newSemester = async (req, res, next) => {
    new SuccessResponse({
        message: "Created semester",
        metadata: await createSemester(req.body),
    }).send(res);
};

const semesterList = async (req, res, next) => {
    new SuccessResponse({
        message: "Get semester list",
        metadata: await listSemesters(),
    }).send(res);
};

const semesterDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "Deleted semester",
        metadata: await deleteSemester({ semesterId: req.params.id }),
    }).send(res);
};

const semesterUpdate = async (req, res, next) => {
    new SuccessResponse({
        message: "Updated semester",
        metadata: await updateSemester(req.body),
    }).send(res);
};

const newSemestersBulk = async (req, res, next) => {
    new SuccessResponse({
        message: "Created multiple semesters",
        metadata: await createMultipleSemesters(req.body),
    }).send(res);
};

const semesterData = async (req, res, next) => {
    new SuccessResponse({
        message: "Get semester list",
        metadata: await semesterDatas({ semesterId: req.params.id }),
    }).send(res);
};

module.exports = {
    newSemester,
    semesterList,
    semesterDelete,
    semesterUpdate,
    newSemestersBulk,
    semesterData,
};
