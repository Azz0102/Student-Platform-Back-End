"use strict";

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

const signUp = async ({ name, password = 1, roleId = 2 }) => {
    try {
        // step1: check name exists?

        const checkUser = await db.User.findOne({
            where: {
                name,
            },
        });
        if (checkUser) throw new BadRequestError("Error: User already exists");

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
        console.error(error);
        throw new BadRequestError('Error while signing up multiple users');
    }
};

module.exports = {
    schedulingClassSession,
    signUp,
    signUpMultipleUsers,
    saveSchedule,
};
