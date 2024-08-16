"use strict";

const { Op, fn, col, literal } = require("sequelize");
const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

const pushNotiToSystem = async ({
    type = "NEWS-001",
    receivedId = 1,
    senderId = 1,
    options = {},
}) => {
    try {
        let noti_content;

        if (type === "NEWS-001") {
            noti_content = "Tin tức mới";
        } else if (type === "TIME-001") {
            noti_content = "Sắp đến giờ học, bạn còn @@@ phút";
        }

        const newNoti = await db.Notification.create({
            noti_type: type,
            noti_content,
            noti_senderId: senderId,
            noti_receivedId: receivedId,
            noti_options: options,
        });

        return newNoti;
    } catch (error) {
        return error;
    }
};

const listNotiByUser = async ({ userId = 1, type = "All" }) => {
    // Build the WHERE condition
    const whereCondition = { userId: userId };

    if (type !== "All") {
        whereCondition["noti_type"] = type;
    }

    return await Notification.findAll({
        include: [
            {
                model: NotiUser,
                where: whereCondition,
                attributes: [],
            },
        ],
        attributes: [
            "noti_type",
            "noti_senderId",
            [col("NotiUser.userId"), "noti_receivedId"],
            [
                fn(
                    "CONCAT",
                    "Tin tức mới: ",
                    fn("COALESCE", col("noti_options.content"), "")
                ),
                "noti_content",
            ],
            "createdAt",
            "noti_options",
        ],
        raw: true, // To get plain JavaScript objects instead of Sequelize instances
    });
};

module.exports = {
    pushNotiToSystem,
    listNotiByUser,
};
