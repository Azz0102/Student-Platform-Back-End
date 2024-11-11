const { SuccessResponse } = require("../core/success.response");
const {
    createEnrollment,
    deleteEnrollment,
    createManyEnrollments,
    deleteManyEnrollments,
    getConversationByUserid, // Assuming you might want to get enrollments by user as well
} = require("../services/enrollment.service");

// Create a new enrollment
const newEnrollment = async (req, res, next) => {
    const { userId, classSessionId } = req.body;
    new SuccessResponse({
        message: "Created enrollment successfully",
        metadata: await createEnrollment({ userId, classSessionId }),
    }).send(res);
};

// Delete an enrollment
const enrollmentDelete = async (req, res, next) => {
    const { userId, classSessionId } = req.body;
    new SuccessResponse({
        message: "Deleted enrollment successfully",
        metadata: await deleteEnrollment({ userId, classSessionId }),
    }).send(res);
};

// Create multiple enrollments
const newManyEnrollments = async (req, res, next) => {
    const enrollments = req.body; // Expecting an array of enrollment objects
    new SuccessResponse({
        message: "Created multiple enrollments successfully",
        metadata: await createManyEnrollments(enrollments),
    }).send(res);
};

// Delete multiple enrollments by IDs
const removeManyEnrollments = async (req, res, next) => {
    const enrollmentIds = req.body; // Expecting an array of enrollment IDs
    new SuccessResponse({
        message: "Deleted multiple enrollments successfully",
        metadata: await deleteManyEnrollments(enrollmentIds),
    }).send(res);
};

// Get list of enrollments by UserId
const enrollmentListByUser = async (req, res, next) => {
    const { userId } = req.params;
    new SuccessResponse({
        message: "Get list of enrollments by user",
        metadata: await getConversationByUserid({ userId }),
    }).send(res);
};

module.exports = {
    newEnrollment,
    enrollmentDelete,
    newManyEnrollments,
    removeManyEnrollments,
    enrollmentListByUser,
};
