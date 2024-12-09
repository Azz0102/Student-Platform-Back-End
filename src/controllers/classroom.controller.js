"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
    createClassroom,
    listClassrooms,
    deleteClassroom,
    updateClassroom,
    createMultipleClassrooms,
    allClassrooms,
} = require("../services/classroom.service");

const newClassroom = async (req, res, next) => {
    new SuccessResponse({
        message: "Created classroom",
        metadata: await createClassroom(req.body),
    }).send(res);
};

const classroomList = async (req, res, next) => {
    const perPage = parseInt(req.query.perPage) || 10
    new SuccessResponse({
        message: "Get classroom list",
        metadata: await listClassrooms({
            filters: req.query.filters || "[]",
            sort: req.query.sort || "[]",
            limit: perPage,
            offset: parseInt(req.query.page) > 0 ? (parseInt(req.query.page) - 1) * perPage : 0,
        }),
    }).send(res);
};

const allClassroom = async (req, res, next) => {
    new SuccessResponse({
        message: "allClassroom",
        metadata: await allClassrooms(),
    }).send(res);
};

const classroomDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "Deleted classroom",
        metadata: await deleteClassroom(req.body),
    }).send(res);
};

const classroomUpdate = async (req, res, next) => {
    new SuccessResponse({
        message: "Updated classroom",
        metadata: await updateClassroom(req.body),
    }).send(res);
};

const newClassroomsBulk = async (req, res, next) => {
    new SuccessResponse({
        message: "Created multiple classrooms",
        metadata: await createMultipleClassrooms(req.body),
    }).send(res);
};

module.exports = {
    newClassroom,
    classroomList,
    classroomDelete,
    classroomUpdate,
    newClassroomsBulk,
    allClassroom,

};
