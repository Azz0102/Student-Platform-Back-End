"use strict";

const { Op, fn, col, literal } = require("sequelize");
const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const amqp = require("amqplib/callback_api");

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

    return await db.Notification.findAll({
        include: [
            {
                model: db.NotiUser,
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

const publishMessage = async ({ exchangeName, bindingKey, message }) => {
    amqp.connect("amqp://guest:12345@localhost", async (err, conn) => {
        if (err) {
            console.log(err);
        }

        const data = await db.User.findAll({
            attributes: ["name"], // Select only the username from User model
            include: [
                {
                    model: db.ChannelUser, // Join with the ChannelUser table
                    attributes: [], // We don't need any fields from the pivot table
                    include: [
                        {
                            model: db.Channel,
                            attributes: [], // We don't need any fields from the Channel table itself
                            where: { name: channelName }, // Filter by channel name
                        },
                    ],
                },
                {
                    model: db.Subscription, // Include subscriptions
                    attributes: [
                        "endpoint",
                        "expirationTime",
                        "auth",
                        "p256dh",
                    ], // Select subscription fields
                },
            ],
        });

        const newMessage = {
            message,
            data,
        };

        conn.createChannel((err, ch) => {
            ch.assertExchange(exchangeName, "fanout", { durable: true });
            ch.publish(
                exchangeName,
                bindingKey,
                new Buffer(JSON.stringify(newMessage))
            );
            console.log(
                "Notification message sent to Exchange'" + message + "' !!"
            );
        });
    });
};

module.exports = {
    pushNotiToSystem,
    listNotiByUser,
    publishMessage,
};
