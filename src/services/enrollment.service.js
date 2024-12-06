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
    try {
        const enrollment = await db.Enrollment.create({
            userId,
            classSessionId,
        });

        if (!enrollment) {
            throw new NotFoundError("Enrollment creation failed");
        }
        return enrollment;
    } catch (error) {
        return error.message;
    }
};

// Delete an enrollment by userId and classSessionId
exports.deleteEnrollment = async ({ userId, classSessionId }) => {
    try {
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
    } catch (error) {
        return error.message;
    }
};

// Create multiple enrollments
exports.createManyEnrollments = async (enrollments) => {
    try {
        const createdEnrollments = await db.Enrollment.bulkCreate(enrollments);
        return createdEnrollments;
    } catch (error) {
        return error.message;
    }
};

// Delete multiple enrollments by IDs
exports.deleteManyEnrollments = async (enrollmentIds) => {
    try {
        const result = await db.Enrollment.destroy({
            where: {
                id: enrollmentIds,
            },
        });
        return `${result} enrollments deleted successfully`;
    } catch (error) {
        return error.message;
    }
};
