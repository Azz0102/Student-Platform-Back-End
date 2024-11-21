"use strict";

const { Op } = require("sequelize");
const { BadRequestError } = require("../core/error.response");
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
    try {
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
            throw ConflictRequestError("Cannot schedule");
        }

        return schedule;
    } catch (error) {
        throw new BadRequestError("Failed to schedule class session");
    }
};

const saveSchedule = async ({ data }) => {
    try {
    } catch (error) { }
};

const signUp = async ({ name, password = "88888888", roleId = 2 }) => {
    try {
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
    } catch (error) {
        return error.message;
    }
};

const signUpMultipleUsers = async (usersArray) => {
    try {
        // Mã hóa mật khẩu cho từng người dùng
        const userData = await Promise.all(usersArray.map(async (user) => {
            const passwordHash = await bcrypt.hash(user.password, 10); // Mã hóa mật khẩu
            return {
                name: user.name,
                passwordHash,
                roleId: user.roleId,
            };
        }));

        // Sử dụng bulkCreate để thêm tất cả người dùng
        const results = await db.User.bulkCreate(userData);

        return results;
    } catch (error) {
        return error.message;
    }
};

// Liệt kê tất cả Sinhvien
const listUser = async ({ filters, sort, limit, offset }) => {
    try {
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
    } catch (error) {
        return error.message;
    }
};

// Delete a user by ID
const deleteUser = async ({ id }) => {
    try {
        const deleteUser = await db.User.destroy({
            where: { id },
        });
        if (!deleteUser) {
            throw new NotFoundError("deleteUser");
        }
        return deleteUser;
    } catch (error) {
        return error.message;
    }
};

// Delete multiple users by an array of IDs
const deleteUsers = async ({ ids }) => {
    try {
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
    } catch (error) {
        return error.message;
    }
};

const updateUser = async ({ id, updateData }) => {
    try {
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
    } catch (error) {
        return error.message;
    }
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
