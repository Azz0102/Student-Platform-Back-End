"use strict";

const { Op, fn, col, literal } = require("sequelize");
const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const amqp = require("amqplib/callback_api");

const pushNotiToSystem = async ({
    type = "NEWS-001",
    senderId = 1,
    noti_content,
}) => {
    try {
        const newNoti = await db.Notification.create({
            noti_type: type,
            noti_content,
            noti_senderId: senderId,
        });

        return newNoti;
    } catch (error) {
        return error;
    }
};

const listNotiByUser = async ({ userId = 1 }) => {
    // Build the WHERE condition
    try {
        const notifications = await Notification.findAll({
            include: [
                {
                    model: NotiUser,
                    as: "notiUser", // Adjust alias if necessary
                    where: { userId },
                    attributes: ["isRead"], // Do not include NotiUser fields, just filter by userId
                    required: true,
                },
            ],
            attributes: [
                "id",
                "noti_type",
                "noti_content",
                "createdAt",
                "updatedAt",
            ],
            order: [["createdAt", "DESC"]], // Order by newest notifications first
        });

        return notifications;
    } catch (error) {
        console.error("Error fetching user notifications: ", error);
        throw error;
    }
};

const publishMessage = async ({ exchangeName, bindingKey, message }) => {
    // const channelName = 'coke_studio'
    amqp.connect("amqp://guest:12345@localhost", async (err, conn) => {
        if (err) {
            console.log(err);
        }

        // const data = await db.User.findAll({
        //     attributes: ["name"], // Select only the username from User model
        //     include: [
        //         {
        //             model: db.ChannelUser, // Join with the ChannelUser table
        //             attributes: [], // We don't need any fields from the pivot table
        //             include: [
        //                 {
        //                     model: db.Channel,
        //                     attributes: [], // We don't need any fields from the Channel table itself
        //                     where: { name: channelName }, // Filter by channel name
        //                 },
        //             ],
        //         },
        //         {
        //             model: db.Subscription, // Include subscriptions
        //             attributes: [
        //                 "endpoint",
        //                 "expirationTime",
        //                 "auth",
        //                 "p256dh",
        //             ], // Select subscription fields
        //         },
        //     ],
        // });

        const newMessage = {
            message,
            // data,
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
