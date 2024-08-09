"use strict";

const GeneticAlgorithm = require("../helpers/schedulingAlgorithm");

const schedulingClassSession = async () => {
    try {
        const schedule = GeneticAlgorithm.run();

        return schedule;
    } catch (error) {
        throw new Error("Failed to schedule class session");
    }
};

const signUp = async ({ name, password = 1, roleId = 2 }) => {
    try {
        // step1: check email exists?

        const checkUser = await db.User.findOne({
            where: {
                name,
            },
        });
        if (!checkUser) throw new BadRequestError("Error: Shop already exists");

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await db.User.create({
            name,
            passwordHash,
            roleId
        });

        if (newUser) {
            const privateKey = crypto.randomBytes(64).toString("hex");
            const publicKey = crypto.randomBytes(64).toString("hex");

            console.log({ privateKey, publicKey }); // save collection KeyStore
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newUser.id,
                publicKey,
                privateKey,
            });

            if (!keyStore) {
                throw new BadRequestError("Error: KeyStore Error");
            }

            // create token pair
            const tokens = await createTokenPair(
                { userId: newUser.id, name },
                publicKey,
                privateKey
            );

            console.log("Create token success::", tokens);

            return {
                code: 201,
                metadata: {
                    user: getInfoData({
                        fields: ["id", "name"],
                        object: newUser,
                    }),
                    tokens,
                },
            };
        }
        return {
            code: 200,
            metadata: null,
        };
    } catch (error) {
        return {
            // code: "xxx",
            // message: error.message,
            // status: "error",
            error
        };
    }
};

const signUpMultipleUsers = async ({ usersArray }) => {
    const results = [];
    for (const user of usersArray) {
        const { name, password, roleId } = user;

        try {
            const result = await signUp({ name, password, roleId });
            results.push({
                user: name,
                data: result,
            });
        } catch (error) {
            return error;
        }
    }

    return results;
};

module.exports = {
    schedulingClassSession,
    signUp,
    signUpMultipleUsers
};
