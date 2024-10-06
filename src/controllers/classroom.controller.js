"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
    createClassroom,
    listClassrooms,
    deleteClassroom,
    updateClassroom,
    createMultipleClassrooms,
} = require("../services/classroom.service");

const newClassroom = async (req, res, next) => {
    new SuccessResponse({
        message: "Created classroom",
        metadata: await createClassroom(req.body),
    }).send(res);
};

const classroomList = async (req, res, next) => {
    new SuccessResponse({
        message: "Get classroom list",
        metadata: await listClassrooms(),
    }).send(res);
};

const classroomDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "Deleted classroom",
        metadata: await deleteClassroom({ classroomId: req.params.id }),
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
};
