"use strict";

const { Op } = require("sequelize");
const { BadRequestError, NotFoundError, ConflictRequestError } = require("../core/error.response");
const Scheduler = require("../helpers/schedulingAlgorithm");
const { getInfoData } = require("../utils/index");
const db = require("../models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("../services/keyToken.service");
const { createTokenPair } = require("../auth/authUtils");

const schedulingClassSession = async ({
    sessionDetails,
    classrooms,
    constantSessionsFixedTimeLocation,
    constantSessionsFixedLocation,
    constantSessionsFixedTime,
    noConflictingClassSessions,
}) => {
    const scheduler = new Scheduler(
        sessionDetails,
        classrooms,
        constantSessionsFixedTimeLocation,
        constantSessionsFixedLocation,
        constantSessionsFixedTime,
        noConflictingClassSessions
    );

    const { schedule, unscheduledSessions } = scheduler.generateSchedule();

    if (unscheduledSessions.length !== 0) {
        throw new ConflictRequestError("Cannot schedule");
    }

    function cleanSchedule(schedule) {
        const cleanedSchedule = {};

        for (const [day, timeSlots] of Object.entries(schedule)) {
            cleanedSchedule[day] = {};

            const activeClasses = {}; // Lưu trữ thông tin lớp học đang diễn ra

            for (const [time, classrooms] of Object.entries(timeSlots)) {
                cleanedSchedule[day][time] = {};

                for (const [room, classInfo] of Object.entries(classrooms)) {
                    if (!classInfo) continue;

                    const { classSessionName, numOfHour } = classInfo.detail;

                    // Kiểm tra lớp học này đã tồn tại và trùng trong khoảng thời gian trước không
                    if (
                        activeClasses[classSessionName] &&
                        activeClasses[classSessionName].endTime > parseTime(time)
                    ) {
                        // Nếu lớp học đã xuất hiện và vẫn còn trong khung giờ, bỏ qua
                        continue;
                    }

                    // Thêm lớp học mới vào lịch và cập nhật activeClasses
                    cleanedSchedule[day][time][room] = classInfo;
                    activeClasses[classSessionName] = {
                        endTime: parseTime(time) + numOfHour,
                    };
                }
            }
        }

        return cleanedSchedule;
    }

    // Chuyển đổi thời gian từ chuỗi "7am", "8am", v.v. sang số giờ
    function parseTime(timeString) {
        const [hour, period] = [parseInt(timeString), timeString.slice(-2)];
        return period === "pm" && hour !== 12 ? hour + 12 : hour;
    }

    const cleanScheduleValue = cleanSchedule(schedule);

    const flattened = [];
    Object.entries(cleanScheduleValue).forEach(([day, slots]) => {
        Object.entries(slots).forEach(([time, classrooms]) => {
            Object.entries(classrooms).forEach(([classroomName, details]) => {
                if (details) {
                    flattened.push({
                        day,
                        time,
                        classroomName,
                        ...details.detail,
                        teacher: details.teacher.name,
                        classroomCapacity: details.classroom.capacity,
                        classroomType: details.classroom.type,
                        startSlot: details.startSlot,
                    });
                }
            });
        });
    });
    // return schedule
    // return [...new Set(flattened.map((item) => item.teacher))]
    return flattened;
};

const saveSchedule = async ({ data, id }) => {
    for (const session of data) {
        // Kiểm tra xem Classroom, Teacher, ClassSession đã tồn tại chưa
        const classroom = await db.Classroom.findOne({ where: { name: session.classroomName } });
        const teacher = await db.Teacher.findOne({ where: { name: session.teacher } });
        const classSession = await db.ClassSession.findOne({ where: { name: session.classSessionName } });

        if (Number(classSession.semesterId) !== Number(id)) {
            throw new NotFoundError(`${session.classSessionName} sai Học Kỳ`);
        }

        // Nếu không tồn tại Classroom, Teacher hoặc ClassSession thì tạo mới
        if (!classroom || !teacher || !classSession) {
            console.log(`Skipping session: ${session.classSessionName} because one of its dependencies doesn't exist.`);
            continue; // Bỏ qua nếu một trong các bản ghi không tồn tại
        }

        // Kiểm tra xem SessionDetails đã tồn tại chưa
        const existingSessionDetails = await db.SessionDetails.findOne({
            where: {
                classSessionId: classSession.id,
                classroomId: classroom.id,
                startTime: new Date(session.startTime),
                teacherId: teacher.id,
            }
        });

        // Nếu đã tồn tại, bỏ qua
        if (existingSessionDetails) {
            console.log(`Session ${session.classSessionName} already exists. Skipping.`);
            continue;
        }

        // Tạo bản ghi trong bảng SessionDetails nếu không tồn tại
        await db.SessionDetails.create({
            classSessionId: classSession.id, // ID của ClassSession đã tạo
            classroomId: classroom.id,       // ID của Classroom đã tạo
            startTime: new Date(session.startTime),
            numOfHour: parseInt(session.numOfHour),
            dayOfWeek: session.dayOfWeek,
            sessionType: session.sessionType,
            capacity: parseInt(session.capacity),
            teacherId: teacher.id, // ID của Teacher đã tạo
        });
    }
};

const signUp = async ({ name, password = "88888888", roleId = 2 }) => {
    // step1: check name exists?

    const checkUser = await db.User.findOne({
        where: {
            name,
        },
    });
    if (checkUser) throw new BadRequestError("Error: User already exists");

    console.log("password", name, password, roleId)

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await db.User.create({
        name,
        passwordHash,
        roleId,
    });

    if (newUser) {
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        console.log({ privateKey, publicKey }); // save collection KeyStore

        // create token pair
        const tokens = await createTokenPair(
            { userId: newUser.id, name },
            publicKey,
            privateKey
        );

        console.log("Create token success::", tokens);

        const keyStore = await KeyTokenService.createKeyToken({
            userId: newUser.id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        if (!keyStore) {
            throw new BadRequestError("Error: KeyStore Error");
        }

        return {
            tokens,
        };
    }
    throw new BadRequestError("Signup error");
};

const signUpMultipleUsers = async (usersArray) => {
    // Lấy danh sách tên người dùng từ mảng đầu vào
    const usernames = usersArray.map(user => user.name);

    // Kiểm tra những người dùng đã tồn tại trong cơ sở dữ liệu
    const existingUsers = await db.User.findAll({
        where: {
            name: usernames,
        },
        attributes: ["name"],
    });

    // Tạo danh sách tên người dùng đã tồn tại
    const existingUsernames = existingUsers.map(user => user.name);

    // Lọc ra những người dùng chưa tồn tại
    const newUsers = usersArray.filter(user => !existingUsernames.includes(user.name));

    // Mã hóa mật khẩu và gán `roleId` mặc định nếu không có
    const userData = await Promise.all(newUsers.map(async (user) => {
        const passwordHash = await bcrypt.hash(user.password, 10); // Mã hóa mật khẩu
        return {
            name: user.name,
            passwordHash,
            roleId: user.roleId || 2, // Gán giá trị mặc định là 2 nếu không có
        };
    }));

    // Nếu không có người dùng mới, trả về thông báo
    if (userData.length === 0) {
        return { message: "All users already exist in the database." };
    }

    // Thêm những người dùng mới vào cơ sở dữ liệu
    const results = await db.User.bulkCreate(userData);
};


// Liệt kê tất cả Sinhvien
const listUser = async ({ filters, sort, limit, offset }) => {
    // 1. Parse filters and sort từ JSON string thành objects nếu tồn tại
    const parsedFilters = filters ? JSON.parse(filters) : [];
    const parsedSort = sort ? JSON.parse(sort) : [];

    // 2. Xây dựng điều kiện `where` từ parsedFilters nếu có
    const whereConditions = {
        roleId: 2,
    };
    if (parsedFilters.length > 0) {
        parsedFilters.forEach((filter) => {
            if (filter.value) {
                whereConditions[filter.id] = {
                    [Op[filter.operator]]: `%${filter.value}%`, // Sử dụng toán tử Sequelize dựa trên operator
                };
            }
        });
    }

    // 3. Xây dựng mảng `order` từ parsedSort nếu có
    const orderConditions = parsedSort.length > 0 ? parsedSort.map((sortItem) => [
        sortItem.id,
        sortItem.desc ? "DESC" : "ASC",
    ]) : null;

    // 4. Thực hiện truy vấn findAll với điều kiện lọc và sắp xếp nếu có
    const users = await db.User.findAll({
        where: whereConditions, // Chỉ áp dụng where nếu có điều kiện
        order: orderConditions || undefined, // Chỉ áp dụng order nếu có điều kiện sắp xếp
        limit,
        offset
    });

    const totalRecords = await db.User.count({ where: parsedFilters.length > 0 ? whereConditions : undefined });
    const totalPages = Math.ceil(totalRecords / limit);

    return {
        data: users.map((item) => {
            return {
                id: item.id,
                name: item.name,
                lastLogin: item.lastLogin,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            }
        }),
        pageCount: totalPages
    };

};

// Delete a user by ID
const deleteUser = async ({ id }) => {
    const deleteUser = await db.User.destroy({
        where: { id },
    });
    if (!deleteUser) {
        throw new NotFoundError("deleteUser");
    }
    return deleteUser;
};

// Delete multiple users by an array of IDs
const deleteUsers = async ({ ids }) => {
    const deletedUsers = await db.User.destroy({
        where: {
            id: {
                [Op.in]: ids,
            },
        },
    });
    if (deletedUsers === 0) {
        throw new NotFoundError("deleteUsers");
    }
    return deletedUsers;
};

const updateUser = async ({ id, updateData }) => {
    // Tìm user theo id
    const user = await db.User.findByPk(id);

    // Nếu không tìm thấy user, ném lỗi NotFoundError
    if (!user) {
        throw new NotFoundError("User not found");
    }

    // Cập nhật thông tin user với các trường trong updateData
    await user.update(updateData);

    // Trả về user đã được cập nhật
    return user;
};


module.exports = {
    schedulingClassSession,
    signUp,
    signUpMultipleUsers,
    saveSchedule,
    listUser,
    deleteUser,
    deleteUsers,
    updateUser,

};
