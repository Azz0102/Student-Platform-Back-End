"use strict";

const db = require("../models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair } = require("../auth/authUtils");

const KeyTokenService = require("./keyToken.service");
const { getInfoData } = require("../utils");
const dotenv = require('dotenv');
dotenv.config();

const nodemailer = require('nodemailer');

const {
    BadRequestError,
    AuthFailureError,
    ForbiddenError,
    NotFoundError,
} = require("../core/error.response");
const { values } = require("lodash");


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.USERNAME_EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    },
});

const handleSendMail = async (val) => {
    try {
        await transporter.sendMail(val);
        return true;
    } catch (error) {
        return error;
    }
};

class UserService {
    /*
        check this token used?
    */
    handlerRefreshTokenV2 = async ({ user, keyStore, refreshToken }) => {
        const { id, name } = user;

        if (keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError("User not registered");
        }

        const checkUser = await db.User.findOne({
            where: {
                name,
            },
        });
        if (!checkUser) {
            throw new AuthFailureError("User not registered 2");
        }

        // create new token pair
        const tokens = await createTokenPair(
            { id, name },
            keyStore.publicKey,
            keyStore.privateKey
        );

        // update token
        await keyStore.update(
            {
                refreshToken: tokens.refreshToken,
            },
            {
                where: {
                    // điều kiện để chọn tài liệu/cột để cập nhật
                },
            }
        );

        return {
            user,
            tokens,
        };
    };

    logout = async ({ keyStore }) => {
        const findKey = await db.KeyStore.findOne({
            where: { refreshToken: keyStore },
        });
        const delKey = await KeyTokenService.removeKeyById(findKey.id);
        console.log({ delKey });
        return delKey;
    };
    /*
        1 - check email in dbs
        2 - match password
        3 - create AT vs RT and save
        4 - generate tokens
        5 - get data return login 
    */
    login = async ({ name, password }) => {
        // 1.
        const checkUser = await db.User.findOne({
            where: {
                name,
            },
        });
        if (!checkUser) throw new BadRequestError("User not registered");

        // 2.
        const comparePassword = bcrypt.compareSync(
            password,
            checkUser.passwordHash
        );
        if (!comparePassword)
            throw new AuthFailureError("Authentication error");

        // 3.
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        // 4.
        const { id: userId } = checkUser;
        const tokens = await createTokenPair(
            { userId, name },
            publicKey,
            privateKey
        );

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId,
        });

        // 5.
        return {
            user: getInfoData({
                fields: ["id", "name"],
                object: checkUser,
            }),
            tokens,
        };
    };

    verification = async ({ name }) => {

        const verificationCode = Math.round(1000 + Math.random() * 9000);

        try {
            const data = {
                from: `"Support EventHub Appplication" <${process.env.USERNAME_EMAIL}>`,
                to: `${name}@vnu.edu.vn`,
                subject: 'Verification email code',
                text: 'Your code to verification email',
                html: `<h1>${verificationCode}</h1>`,
            };

            await handleSendMail(data);

            const user = await db.User.findOne({
                where: {
                    name,
                },
            });

            const checkCode = await db.Code.create({
                userId: user.id,
                value: verificationCode,
            });

            return {
                data: {
                    code: verificationCode,
                },
            }
        } catch (error) {
            return error;
        }
    };

    forgotPassword = async ({ name, code }) => {

        const user = await db.User.findOne({
            where: {
                name,
            },
        });

        const checkCode = await db.Code.findOne({
            where: {
                userId: user.id,
            },
        });

        if (!checkCode) {
            throw new NotFoundError("Code not found");
        }

        const { val, expireDate } = checkCode;
        if (val !== code) {
            throw new NotFoundError("Wrong code");
        }

        if (expireDate.getTime() > Date.now()) {
            throw new NotFoundError("Code has expired");
        }

    };

    handleSendMail = async (val) => {
        try {
            await transporter.sendMail(val);

            return 'OK';
        } catch (error) {
            return error;
        }
    };

    updatePassword = async ({ refreshToken, data }) => {

        const { name, password } = data;

        const checkUser = await db.User.findOne({
            where: {
                name,
            },
        });
        if (!checkUser) throw new BadRequestError("User not registered");

        const keyStore = await db.KeyStore.findOne({
            where: {
                userId: checkUser.id,
            },
        })

        if (keyStore.refreshToken !== refreshToken) {
            throw new BadRequestError("You not have permisson")
        }

        const passwordHash = await bcrypt.hash(password, 10);
        checkUser.passwordHash = passwordHash;
        await checkUser.save();
    }

    updateForgotPassword = async ({ name, password, code }) => {
        const checkUser = await db.User.findOne({
            where: {
                name,
            },
        });
        if (!checkUser) throw new BadRequestError("User not registered");


        const checkCode = await db.Code.findOne({
            where: {
                userId: checkUser.id,
            },
        });

        if (!checkCode) {
            throw new NotFoundError("Code not found");
        }

        const { val } = checkCode;
        if (val !== code) {
            throw new NotFoundError("Wrong code");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        checkUser.passwordHash = passwordHash;
        await checkUser.save();
    }
}

module.exports = new UserService();
