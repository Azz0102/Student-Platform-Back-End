"use strict";

const db = require("../models");
const {
    BadRequestError,
    NotFoundError,
} = require("../core/error.response");
const { where, Sequelize } = require("sequelize");

// Tạo mới một semester
const createSemester = async ({ name, fromDate, endDate }) => {
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
            name,
            fromDate,
            endDate,
        });

        return semester;
    } catch (error) {
        return error.message;
    }
};

// Liệt kê tất cả semesters
const listSemesters = async () => {
    try {
        const semesters = await db.Semester.findAll({
            // where: { id: 1 },
            order: [["fromDate", "ASC"]], // Sắp xếp theo ngày bắt đầu
        });

        return semesters;
    } catch (error) {
        return error.message;
    }
};

const semesterDatas = async ({ semesterId }) => {
    try {
        const classroom = await db.Classroom.count();

        const classSession = await db.ClassSession.count({
            where: {
                semesterId: semesterId  // Lọc theo semesterId của kỳ học
            },
        });

        const sessionDetail = await db.SessionDetails.count({
            include: [{
                model: db.ClassSession,
                where: {
                    semesterId: semesterId  // Lọc theo semesterId của kỳ học
                },
            }],
        });

        const user = await db.Enrollment.count({
            distinct: true,
            col: 'userId',
            include: [
                {
                    model: db.ClassSession,
                    required: true,
                    include: [
                        {
                            model: db.Semester,
                            required: true,
                            where: { id: semesterId },
                        },
                    ],
                },
            ],
        });

        const usageCounts = await db.Classroom.findAll({
            attributes: [
                'id',
                [db.Sequelize.col('Classroom.name'), 'date'],
                [db.Sequelize.fn('COUNT', db.Sequelize.col('SessionDetails.id')), 'frequency'],  // Đếm số lần sử dụng
                [db.Sequelize.fn('SUM', db.Sequelize.col('SessionDetails.numOfHour')), 'time'] // Đếm thời gian
            ],
            include: [
                {
                    model: db.SessionDetails,
                    required: true,  // Đảm bảo phải có SessionDetails cho mỗi Classroom
                    include: [{
                        model: db.ClassSession,
                        required: true,  // Đảm bảo phải có ClassSession cho mỗi SessionDetails
                        include: [{
                            model: db.Semester,
                            required: true,  // Đảm bảo phải có Semester cho mỗi ClassSession
                            where: {
                                id: semesterId  // Nếu muốn lọc theo một kỳ học cụ thể
                            }
                        }],
                        attributes: []  // Không lấy thuộc tính từ ClassSession, chỉ cần đếm
                    }],
                    attributes: []  // Không lấy thuộc tính từ SessionDetails, chỉ cần đếm
                },
                {
                    model: db.Amphitheater,
                    required: true,
                }
            ],
            group: ['Classroom.id', 'Classroom.name', 'SessionDetails.ClassSession.Semester.id'],  // Thêm các cột cần thiết vào GROUP BY
            raw: true,
        });

        const usageCount = usageCounts.map((item) => {
            // return item
            return {
                id: item.id,
                date: `${item.date}-${item['Amphitheater.name']}`,
                frequency: item.frequency,
                time: item.time
            }
        })

        const topTeacher = await db.Teacher.findAll({
            include: [{
                model: db.SessionDetails,
                required: true,  // Giáo viên phải có ít nhất 1 buổi học
                include: [{
                    model: db.ClassSession,
                    required: true,  // Đảm bảo phải có ClassSession cho mỗi SessionDetails
                    // where: {
                    //     semesterId: semesterId  // Nếu muốn lọc theo một kỳ học cụ thể
                    // },
                    include: [{
                        model: db.Semester,
                        required: true,  // Đảm bảo phải có Semester cho mỗi ClassSession
                        where: {
                            id: semesterId  // Nếu muốn lọc theo một kỳ học cụ thể
                        }
                    }],
                    attributes: []  // Không lấy thuộc tính từ ClassSession, chỉ cần đếm
                }],
            }],
        });

        const teacherHours = topTeacher.map(teacher => ({
            id: teacher.id,
            month: teacher.name,
            desktop: teacher.SessionDetails.reduce((sum, session) => sum + session.numOfHour, 0),
            mobile: 0
        }));

        const topTeachers = teacherHours.sort((a, b) => b.totalHours - a.totalHours).slice(0, 6);

        const topSubject = await db.Subject.findAll({
            include: [
                {
                    model: db.ClassSession,
                    where: {
                        semesterId: semesterId  // Nếu muốn lọc theo một kỳ học cụ thể
                    },
                    include: [
                        {
                            model: db.Enrollment,
                        },
                    ],
                },
            ],
        });

        const subjectEnrollments = topSubject.map(subject => ({
            id: subject.id,
            month: subject.name,
            desktop: subject.ClassSessions.reduce((total, session) => total + session.Enrollments.length, 0),
            mobile: 0
        }));

        // Sắp xếp theo số lượng User giảm dần và lấy top 6
        const topSubjects = subjectEnrollments
            .sort((a, b) => b.userCount - a.userCount)
            .slice(0, 6);

        return {
            classroom,
            classSession,
            sessionDetail,
            user,
            usageCount,
            topTeachers,
            topSubjects
        }
    } catch (error) {
        return error.message;
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
        return error.message;
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
        return error.message;
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
        return error.message;
    }
};

module.exports = {
    createSemester,
    listSemesters,
    deleteSemester,
    updateSemester,
    createMultipleSemesters,
    semesterDatas,
};
