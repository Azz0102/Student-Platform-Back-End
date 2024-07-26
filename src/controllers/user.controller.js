const bcrypt = require("bcrypt");
const db = require("../models");
const {
    generalAccessToken,
    generalRefreshToken,
} = require("../services/JwtService");

const createUser = async (req, res) => {
    try {
        const { roleId, userName, mobile, email, password } = req.body;
        console.log(req.body);
        const checkUser = await db.User.findOne({
            where: {
                email,
            },
        });
        if (checkUser) {
            return res.status(200).json({
                status: "ERR",
                message: "The email is already",
                data: checkUser,
            });
        }
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        const createUser = await db.User.create({
            roleId,
            userName,
            mobile,
            email,
            passwordHash: hash,
            created_at: new Date(),
        });
        if (createUser) {
            return res.status(200).json({
                status: "OK",
                message: "SUCCESS",
                data: createUser,
            });
        }
    } catch (error) {
        return res.status(404).json(error);
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const checkUser = await db.User.findOne({
            where: {
                email,
            },
        });
        if (!checkUser) {
            return res.status(200).json({
                status: "ERR",
                message: "The user is not define",
            });
        }

        const comparePassword = bcrypt.compareSync(
            password,
            checkUser.passwordHash
        );

        if (!comparePassword) {
            return res.status(200).json({
                status: "ERR",
                message: "The password or user is incorrect",
            });
        }

        const access_token = generalAccessToken({
            id: checkUser.id,
            roleId: checkUser.roleId,
        });

        const refresh_token = generalRefreshToken({
            id: checkUser.id,
            roleId: checkUser.roleId,
        });

        return res.status(200).json({
            status: "OK",
            message: "SUCCESS",
            access_token,
            refresh_token,
        });
    } catch (error) {
        return res.status(404).json({
            message: error,
        });
    }
};

module.exports = {
    createUser,
    loginUser,
};
