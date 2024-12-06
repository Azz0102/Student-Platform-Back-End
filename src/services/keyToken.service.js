"use strict";
const db = require("../models");

class KeyTokenService {
    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken,
        device,
    }) => {
        try {
            const [tokens, created] = await db.KeyStore.findOrCreate({
                where: { userId: userId, device: device },
                defaults: {
                    publicKey: publicKey,
                    privateKey: privateKey,
                    refreshToken: refreshToken,
                    device: device,
                },
            });

            if (!created) {
                await tokens.update({
                    publicKey: publicKey,
                    privateKey: privateKey,
                    refreshToken: refreshToken,
                    device: device,
                });
            }

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error.message;
        }
    };

    static findByUserId = async (userId) => {
        return await db.KeyStore.findOne({
            where: { userId: userId },
        });
    };

    static removeKeyById = async (id) => {
        return await db.KeyStore.destroy({
            where: { id: id },
        });
    };

    static deleteKeyById = async (userId) => {
        return await db.KeyStore.destroy({
            where: { userId: userId },
        });
    };

    static findByRefreshToken = async (refreshToken) => {
        return await db.KeyStore.findOne({
            where: { refreshToken: refreshToken },
        });
    };
}

module.exports = KeyTokenService;
