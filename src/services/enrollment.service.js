"use strict";

const db = require("../models");

const {
    BadRequestError,
    AuthFailureError,
    ForbiddenError,
    NotFoundError,
} = require("../core/error.response");

// Create a new enrollment
exports.createEnrollment = async ({ userId, classSessionId }) => {
    const enrollment = await db.Enrollment.create({
        userId,
        classSessionId,
    });

    if (!enrollment) {
        throw new NotFoundError("Enrollment creation failed");
    }
    return enrollment;
};

// Delete an enrollment by userId and classSessionId
exports.deleteEnrollment = async ({ userId, classSessionId }) => {
    const result = await db.Enrollment.destroy({
        where: {
            userId,
            classSessionId,
        },
    });

    if (result === 0) {
        throw new NotFoundError("Enrollment not found");
    }
    return result;
};

// Create multiple enrollments
exports.createManyEnrollments = async (enrollments) => {
    const createdEnrollments = await db.Enrollment.bulkCreate(enrollments);
    return createdEnrollments;
};

// Delete multiple enrollments by IDs
exports.deleteManyEnrollments = async (enrollmentIds) => {
    const result = await db.Enrollment.destroy({
        where: {
            id: enrollmentIds,
        },
    });
    return `${result} enrollments deleted successfully`;
};
