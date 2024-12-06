"use strict";

const { Op } = require("sequelize");
const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

// Tạo mới một ClassSession
const createClassSession = async ({
    name,
    nameSubject,
    nameSemester,
    fromDate,
    endDate,
    numOfSessionAWeek = 0,
    capacity,
}) => {
    try {
        // Kiểm tra xem subject có tồn tại không
        const subject = await db.Subject.findOne({
            where: { name: nameSubject },
        });

        if (!subject) {
            throw new BadRequestError("Error: Subject not found.");
        }

        // Kiểm tra xem semester có tồn tại không
        const semester = await db.Semester.findOne({
            where: { name: nameSemester },
        });
        if (!semester) {
            throw new BadRequestError("Semester not found.");
        }

        // Kiểm tra xem ClassSession với thông tin này đã tồn tại chưa
        const existingClassSession = await db.ClassSession.findOne({
            where: {
                name: name,
                subjectId: subject.id,
                semesterId: semester.id,
                capacity,
            },
        });

        if (existingClassSession) {
            throw new BadRequestError("ClassSession already exists.");
        }

        // Tạo ClassSession mới
        const classSession = await db.ClassSession.create({
            name: name,
            subjectId: subject.id,
            semesterId: semester.id,
            fromDate,
            endDate,
            numOfSessionAWeek,
            capacity,
        });
        return classSession;
    } catch (error) {
        return error.message;
    }
};

// Liệt kê tất cả ClassSessions
const listClassSessions = async ({ filters, sort, limit, offset }) => {
    try {
        // 1. Parse filters and sort từ JSON string thành objects nếu tồn tại
        const parsedFilters = filters ? JSON.parse(filters) : [];
        const parsedSort = sort ? JSON.parse(sort) : [];
        // 2. Xây dựng điều kiện `where` từ parsedFilters nếu có
        const whereConditions = {};
        const nameSubject = {};
        const nameSemester = {};

        if (parsedFilters.length > 0) {
            for (const filter of parsedFilters) {
                if (filter.value) {
                    if (filter.id == 'nameSubject') {
                        nameSubject["name"] = {
                            [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                        };
                        continue;
                    }
                    if (filter.id == 'descriptionSubject') {
                        nameSubject["description"] = {
                            [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                        };
                        continue;
                    }
                    if (filter.id == 'nameSemester') {
                        nameSemester["name"] = {
                            [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                        };
                        continue;
                    }
                    whereConditions[filter.id] = {
                        [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                    };
                }
            };
        }

        // 3. Xây dựng mảng `order` từ parsedSort nếu có
        const orderConditions = parsedSort.length > 0 ? parsedSort.map((sortItem) => [
            sortItem.id,
            sortItem.desc ? "DESC" : "ASC",
        ]) : null;

        // 4. Thực hiện truy vấn findAll với điều kiện lọc và sắp xếp nếu có
        const items = await db.ClassSession.findAll({
            where: whereConditions.length > 0 ? whereConditions : undefined, // Chỉ áp dụng where nếu có điều kiện
            include: [
                {
                    model: db.Subject,
                    where: parsedFilters.length > 0 ? nameSubject : undefined,
                },
                {
                    model: db.Semester,
                    where: parsedFilters.length > 0 ? nameSemester : undefined,
                }
            ],
            order: orderConditions || undefined, // Chỉ áp dụng order nếu có điều kiện sắp xếp
            limit,
            offset
        });

        const totalRecords = await db.ClassSession.count({
            where: parsedFilters.length > 0 ? whereConditions : undefined, // Chỉ áp dụng where nếu có điều kiện
            include: [
                {
                    model: db.Subject,
                    where: parsedFilters.length > 0 ? nameSubject : undefined,
                },
                {
                    model: db.Semester,
                    where: parsedFilters.length > 0 ? nameSemester : undefined,
                }
            ]
        });
        const totalPages = Math.ceil(totalRecords / limit);

        return {
            data: items.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    nameSubject: item.Subject.name,
                    descriptionSubject: item.Subject.description,
                    nameSemester: item.Semester.name,
                    numOfSessionAWeek: item.numOfSessionAWeek,
                    capacity: item.capacity,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                }
            }),
            pageCount: totalPages
        };

    } catch (error) {
        return error.message;
    }
};

const listClassSessionsdat = async () => {
    const classSession = await db.ClassSession.findAll();
    return classSession;

};

// Xóa một ClassSession
const deleteClassSession = async ({ ids }) => {
    try {
        const classSession = await db.ClassSession.destroy({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
        });
        if (classSession === 0) {
            throw new NotFoundError("deletedClassSession");
        }
        return classSession;
    } catch (error) {
        return error.message;
    }
};

// Cập nhật ClassSession
const updateClassSession = async ({
    classSessionId,
    subjectId,
    semesterId,
    fromDate,
    endDate,
    numOfSessionAWeek,
    capacity,
}) => {
    try {
        // Tìm ClassSession theo ID
        const classSession = await db.ClassSession.findByPk(classSessionId);
        if (!classSession) {
            throw new NotFoundError("ClassSession not found.");
        }

        // Kiểm tra xem subject mới có tồn tại không
        if (subjectId) {
            const subject = await db.Subject.findByPk(subjectId);
            if (!subject) {
                throw new NotFoundError("Subject not found.");
            }
            classSession.subjectId = subjectId;
        }

        // Kiểm tra xem semester mới có tồn tại không
        if (semesterId) {
            const semester = await db.Semester.findByPk(semesterId);
            if (!semester) {
                throw new NotFoundError("Semester not found.");
            }
            classSession.semesterId = semesterId;
        }

        // Cập nhật thông tin nếu có giá trị mới
        if (fromDate) classSession.fromDate = fromDate;
        if (endDate) classSession.endDate = endDate;
        if (numOfSessionAWeek)
            classSession.numOfSessionAWeek = numOfSessionAWeek;
        if (capacity) classSession.capacity = capacity;

        await classSession.save();

        return classSession;
    } catch (error) {
        return error.message;
    }
};

// Tạo mới hàng loạt ClassSessions
const createMultipleClassSessions = async (classSessionsArray) => {
    // Kiểm tra và tạo từng class session
    for (const session of classSessionsArray) {
        const { name, nameSubject, nameSemester, fromDate, endDate, numOfSessionAWeek, capacity } = session;

        // Kiểm tra xem subject có tồn tại không
        const subject = await db.Subject.findOne({
            where: { name: nameSubject },
        });
        if (!subject) {
            throw new BadRequestError(`Subject ${nameSubject} not found.`);
        }

        // Kiểm tra xem semester có tồn tại không
        const semester = await db.Semester.findOne({
            where: { name: nameSemester },
        });
        if (!semester) {
            throw new BadRequestError(`Semester ${nameSemester} not found.`);
        }

        // Kiểm tra xem classSession đã tồn tại chưa
        const existingClassSession = await db.ClassSession.findOne({
            where: {
                name,
                subjectId: subject.id,
                semesterId: semester.id,
                capacity,
            },
        });
        if (existingClassSession) {
            throw new BadRequestError("ClassSession already exists.");
        }

        // Tạo ClassSession mới
        const classSession = await db.ClassSession.create({
            name,
            subjectId: subject.id,
            semesterId: semester.id,
            fromDate,
            endDate,
            numOfSessionAWeek,
            capacity,
        });
    }
};


const getUserSpecificClassSession = async ({ userId, classSessionId }) => {
    try {
        // First, check if the user is enrolled in the given classSession
        const enrollment = await Enrollment.findOne({
            where: {
                userId,
                classSessionId,
            },
        });

        if (!enrollment) {
            throw new NotFoundError(
                "User is not enrolled in this class session."
            );
        }

        // Fetch the specific class session with the required associations
        const classSession = await ClassSession.findOne({
            where: { id: classSessionId },
            include: [
                {
                    model: SessionDetail,
                    as: "sessionDetails", // Adjust alias if necessary
                    include: [
                        {
                            model: Teacher,
                            as: "teacher", // Adjust alias if necessary
                            attributes: ["id", "name", "dateOfBirth"],
                        },
                    ],
                },
                {
                    model: Semester,
                    as: "semester", // Adjust alias if necessary
                    attributes: ["id", "fromDate", "endDate"],
                },
                {
                    model: UserNote,
                    as: "notes", // Assuming notes are related to classSession
                    where: {
                        "$notes.tags.name$": Sequelize.col("ClassSession.name"), // Filter by classSession name
                    },
                    include: [
                        {
                            model: Tag,
                            as: "tags", // Adjust alias if necessary
                            attributes: ["id", "name"],
                        },
                    ],
                    required: false, // Ensure it works even if no notes are found
                },
                {
                    model: Grade,
                    as: "grades", // Grades must be linked to the classSession
                    where: { userId, classSessionId }, // Ensure both userId and classSessionId match
                    required: false, // Ensure it works even if no grades are found
                    attributes: ["value", "createdAt"],
                },
                {
                    model: News,
                    as: "news", // Assuming news is linked to classSession
                    required: false, // Fetch news only related to this classSession
                    attributes: ["name", "content", "createdAt"],
                    include: [
                        {
                            model: NewsClassSession, // Fetch only news related to the specific classSession
                            as: "newsClassSession",
                            where: { classSession: classSessionId },
                            required: true, // Ensure only related news is fetched
                        },
                    ],
                },
                {
                    model: Notification,
                    as: "notifications", // Assuming notifications are linked to classSession
                    where: { noti_type: "NEWS-001" }, // Adjust the condition based on your notification type logic
                    required: false, // Ensure it works even if no notifications are found
                    attributes: ["noti_content", "read", "createdAt"],
                },
            ],
        });

        if (!classSession) {
            throw new NotFoundError(
                "Class session not found for the given classSessionId."
            );
        }

        return classSession;
    } catch (error) {
        return error.message;
    }
};

module.exports = {
    createClassSession,
    listClassSessions,
    deleteClassSession,
    updateClassSession,
    createMultipleClassSessions,
    getUserSpecificClassSession,
    listClassSessionsdat,
};
