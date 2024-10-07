const { SuccessResponse } = require("../core/success.response");
const {
    createSessionDetail,
    listSessionDetails,
    deleteSessionDetail,
    updateSessionDetail,
    createMultipleSessionDetails,
    getAllUserSessionDetails,
} = require("../services/sessionDetails.service");

const newSessionDetail = async (req, res, next) => {
    new SuccessResponse({
        message: "Created session detail",
        metadata: await createSessionDetail(req.body),
    }).send(res);
};

const sessionDetailList = async (req, res, next) => {
    new SuccessResponse({
        message: "Get session detail list",
        metadata: await listSessionDetails(),
    }).send(res);
};

const sessionDetailDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "Deleted session detail",
        metadata: await deleteSessionDetail({ sessionDetailId: req.params.id }),
    }).send(res);
};

const sessionDetailUpdate = async (req, res, next) => {
    new SuccessResponse({
        message: "Updated session detail",
        metadata: await updateSessionDetail(req.body),
    }).send(res);
};

const newMultipleSessionDetails = async (req, res, next) => {
    new SuccessResponse({
        message: "Created multiple session details",
        metadata: await createMultipleSessionDetails(req.body),
    }).send(res);
};

const getUserSessionDetails = async (req, res, next) => {
    new SuccessResponse({
        message: "Deleted session detail",
        metadata: await getAllUserSessionDetails(req.body),
    }).send(res);
};

module.exports = {
    newSessionDetail,
    sessionDetailList,
    sessionDetailDelete,
    sessionDetailUpdate,
    newMultipleSessionDetails,
    getUserSessionDetails
};
