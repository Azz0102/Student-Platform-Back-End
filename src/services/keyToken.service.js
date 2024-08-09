"use strict";

const keytokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");
class KeyTokenService {
    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken,
    }) => {
        try {
            // level 0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey,
            // });

            // return tokens ? tokens : null;

            // level xxx

            const [tokens, created] = await keytokenModel.findOrCreate({
                where: { userId: userId },
                defaults: {
                    publicKey: publicKey,
                    privateKey: privateKey,
                    refreshToken: refreshToken,
                }
            });

            if (!created) {
                await tokens.update({
                    publicKey: publicKey,
                    privateKey: privateKey,
                    refreshToken: refreshToken,
                });
            }

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({
            where: { userId: userId }
        });
    };

    static removeKeyById = async (id) => {
        return await keytokenModel.destroy({
            where: { id: id }
        });
    };

    static deleteKeyById = async (userId) => {
        return await keytokenModel.destroy({
            where: { userId: userId }
        });
    };

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({
            where: { refreshToken: refreshToken }
        });
    };
}

module.exports = KeyTokenService;
