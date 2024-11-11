"use strict";

const db = require("../models");
const {
    BadRequestError,
    NotFoundError,
} = require("../core/error.response");

// Tạo mới một semester
const createSemester = async ({ fromDate, endDate }) => {
    try {
        // Kiểm tra xem semester với khoảng thời gian này đã tồn tại chưa
        const existingSemester = await db.Semester.findOne({
            where: {
                fromDate,
                endDate,
            },
        });

        if (existingSemester) {
            throw new BadRequestError("Semester already exists.");
        }

        // Tạo semester mới
        const semester = await db.Semester.create({
            fromDate,
            endDate,
        });

        return semester;
    } catch (error) {
        return error;
    }
};

// Liệt kê tất cả semesters
const listSemesters = async () => {
    try {
        const semesters = await db.Semester.findAll({
            order: [["fromDate", "ASC"]], // Sắp xếp theo ngày bắt đầu
        });

        return semesters;
    } catch (error) {
        return error;
    }
};

// Xóa một semester
const deleteSemester = async ({ semesterId }) => {
    try {
        // Tìm semester theo ID
        const semester = await db.Semester.findByPk(semesterId);
        if (!semester) {
            throw new NotFoundError("Semester not found.");
        }

        // Xóa semester
        await semester.destroy();
    } catch (error) {
        return error;
    }
};

// Cập nhật semester
const updateSemester = async ({ semesterId, fromDate, endDate }) => {
    try {
        // Tìm semester theo ID
        const semester = await db.Semester.findByPk(semesterId);
        if (!semester) {
            throw new NotFoundError("Semester not found.");
        }

        // Cập nhật thông tin nếu có giá trị mới
        if (fromDate) semester.fromDate = fromDate;
        if (endDate) semester.endDate = endDate;

        await semester.save();

        return semester;
    } catch (error) {
        return error;
    }
};

// Tạo mới hàng loạt semesters
const createMultipleSemesters = async (semesterArray) => {
    try {
        // Kiểm tra các semester đã tồn tại không
        const existingSemesters = await Promise.all(semesterArray.map(async (semester) => {
            return await db.Semester.findOne({
                where: {
                    fromDate: semester.fromDate,
                    endDate: semester.endDate,
                },
            });
        }));

        const duplicates = existingSemesters.filter(Boolean);

        if (duplicates.length > 0) {
            throw new BadRequestError(`Semester(s) already exists with dates: ${duplicates.map(s => `from ${s.fromDate} to ${s.endDate}`).join(", ")}`);
        }

        // Tạo mới hàng loạt semesters
        const semesters = await db.Semester.bulkCreate(semesterArray, { validate: true });

        return semesters;
    } catch (error) {
        return error;
    }
};

module.exports = {
    createSemester,
    listSemesters,
    deleteSemester,
    updateSemester,
    createMultipleSemesters,
};
