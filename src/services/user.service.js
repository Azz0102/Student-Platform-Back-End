"use strict";

const db = require("../models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair } = require("../auth/authUtils");

const KeyTokenService = require("./keyToken.service");
const { getInfoData } = require("../utils");
const dotenv = require("dotenv");
dotenv.config();

const nodemailer = require("nodemailer");

const {
    BadRequestError,
    AuthFailureError,
    ForbiddenError,
    NotFoundError,
} = require("../core/error.response");
const { values } = require("lodash");
const { informNS } = require("./socket.service");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
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
    // handlerRefreshTokenV2 = async ({ user, keyStore, refreshToken }) => {
    //     const { id, name } = user;

    //     if (keyStore.refreshToken !== refreshToken) {
    //         throw new AuthFailureError("User not registered");
    //     }

    //     const checkUser = await db.User.findOne({
    //         where: {
    //             name,
    //         },
    //     });
    //     if (!checkUser) {
    //         throw new AuthFailureError("User not registered 2");
    //     }

    //     // create new token pair
    //     const tokens = await createTokenPair(
    //         { id, name },
    //         keyStore.publicKey,
    //         keyStore.privateKey
    //     );

    //     // update token
    //     await keyStore.update(
    //         {
    //             refreshToken: tokens.refreshToken,
    //         },
    //         {
    //             where: {
    //                 // điều kiện để chọn tài liệu/cột để cập nhật
    //             },
    //         }
    //     );

    //     return {
    //         user,
    //         tokens,
    //     };
    // };

    logout = async ({ keyStore }) => {
        const findKey = await db.KeyStore.findOne({
            where: { refreshToken: keyStore },
        });
        const delKey = await KeyTokenService.removeKeyById(findKey.id);

        global.socket.emit("offline", {
            userId: findKey.userId,
        });
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
        const { id: userId, roleId } = checkUser;
        const tokens = await createTokenPair(
            { userId, name, roleId },
            publicKey,
            privateKey
        );

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId,
        });

        // Cập nhật lastLogin với thời điểm hiện tại
        await db.User.update(
            { lastLogin: new Date() },
            { where: { id: userId } }  // Điều kiện để xác định người dùng
        );

        // await db.Subscription.create({})

        informNS({
            username: "20020672",
            userId: userId,
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

    // verification = async ({ name }) => {
    //     const verificationCode = Math.round(1000 + Math.random() * 9000);

    //     try {
    //         const data = {
    //             from: `"Support EventHub Application" <${process.env.USERNAME_EMAIL}>`,
    //             to: `${name}@vnu.edu.vn`,
    //             subject: "Verification email code",
    //             text: "Your code to verification email",
    //             html: `<h1>${verificationCode}</h1>`,
    //         };

    //         await handleSendMail(data);

    //         const user = await db.User.findOne({
    //             where: {
    //                 name,
    //             },
    //         });

    //         const checkCode = await db.Code.create({
    //             userId: user.id,
    //             value: verificationCode,
    //         });

    //         return {
    //             data: {
    //                 code: verificationCode,
    //             },
    //         };
    //     } catch (error) {
    //         return error;
    //     }
    // };

    // forgotPassword = async ({ name, code }) => {
    //     const user = await db.User.findOne({
    //         where: {
    //             name,
    //         },
    //     });

    //     const checkCode = await db.Code.findOne({
    //         where: {
    //             userId: user.id,
    //         },
    //     });

    //     if (!checkCode) {
    //         throw new NotFoundError("Code not found");
    //     }

    //     const { val, expireDate } = checkCode;
    //     if (val !== code) {
    //         throw new NotFoundError("Wrong code");
    //     }

    //     if (expireDate.getTime() > Date.now()) {
    //         throw new NotFoundError("Code has expired");
    //     }
    // };

    forgotPassword = async ({ name }) => {
        const user = await db.User.findOne({
            where: {
                name,
            },
        });

        if (!user) {
            throw new NotFoundError("User not found");
        };

        const resetToken = crypto.randomBytes(20).toString('hex');

        await user.update({
            reset_token: resetToken, // Cập nhật cột 'reset_token'
        });

        // const resetLink = `${process.env.USERNAME_EMAIL}/reset-password/${resetToken}`;
        const resetLink = `http://localhost:3001/api/user/reset-password/${resetToken}`;

        // Cấu hình nội dung email
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: `${name}@vnu.edu.vn`,
            subject: 'Reset your password',
            text: `Click this link to reset your password: ${resetLink}`,
        };

        await handleSendMail(mailOptions);
    };

    resetPassword = async ({ token }) => {

        // Kiểm tra token trong cơ sở dữ liệu
        const user = await db.User.findOne({
            where: { reset_token: token }
        });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Trả về thông tin người dùng hoặc một giá trị khác nếu cần thiết
        return user;
    };

    resetPasswordToken = async ({ resetToken, newPassword }) => {

        console.log("token", resetToken);
        // Tìm người dùng với resetToken
        const user = await db.User.findOne({ where: { reset_token: resetToken } });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu và xóa resetToken
        await db.User.update(
            { passwordHash: hashedPassword, reset_token: null }, // Cập nhật thông tin
            { where: { id: user.id } } // Điều kiện
        );
    }

    // handleSendMail = async (val) => {
    //     try {
    //         await transporter.sendMail(val);

    //         return "OK";
    //     } catch (error) {
    //         return error;
    //     }
    // };

    updatePassword = async ({ oldPassword, newPassword }) => {

        const userId = req.user.id;
        const user = await db.User.findByPk(userId);
        if (!user) throw new BadRequestError("User not registered");

        // Kiểm tra mật khẩu cũ
        const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isPasswordValid) throw new BadRequestError("Password not correct");

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu
        user.passwordHash = hashedPassword;
        await db.User.save();

    }

}

module.exports = new UserService();
