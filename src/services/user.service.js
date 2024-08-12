"use strict";

const db = require("../models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair } = require("../auth/authUtils");

const KeyTokenService = require("./keyToken.service");
const { getInfoData } = require("../utils");

const {
    BadRequestError,
    AuthFailureError,
    ForbiddenError,
} = require("../core/error.response");

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
}

module.exports = new UserService();
