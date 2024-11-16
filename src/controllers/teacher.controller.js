const { SuccessResponse } = require("../core/success.response");
const {
    createTeacher,
    listTeachers,
    deleteTeacher,
    updateTeacher,
    createMultipleTeachers,
} = require("../services/teacher.service");

const newTeacher = async (req, res, next) => {
    new SuccessResponse({
        message: "Created teacher",
        metadata: await createTeacher(req.body),
    }).send(res);
};

const teacherList = async (req, res, next) => {
    const perPage = parseInt(req.query.perPage) || 10
    new SuccessResponse({
        message: "Get teacher list",
        metadata: await listTeachers({
            filters: req.query.filters || "[]",
            sort: req.query.sort || "[]",
            limit: perPage,
            offset: parseInt(req.query.page) > 0 ? (parseInt(req.query.page) - 1) * perPage : 0,
        }),
    }).send(res);
};

const teacherDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "Deleted teacher",
        metadata: await deleteTeacher({ teacherId: req.params.id }),
    }).send(res);
};

const teacherUpdate = async (req, res, next) => {
    new SuccessResponse({
        message: "Updated teacher",
        metadata: await updateTeacher({ teacherId: req.params.id, ...req.body }),
    }).send(res);
};

const newMultipleTeachers = async (req, res, next) => {
    new SuccessResponse({
        message: "Created multiple teachers",
        metadata: await createMultipleTeachers(req.body),
    }).send(res);
};

module.exports = {
    newTeacher,
    teacherList,
    teacherDelete,
    teacherUpdate,
    newMultipleTeachers,
};
