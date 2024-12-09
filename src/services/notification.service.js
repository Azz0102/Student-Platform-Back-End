"use strict";

const { Op, fn, col, literal } = require("sequelize");
const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const amqp = require("amqplib/callback_api");
const { pushNoti } = require("../../src/dbs/init.socket");
const dotenv = require("dotenv");
dotenv.config();

const pushNotiToSystem = async ({
    type = "EVENT-002",
    senderId = 1,
    noti_content,
    classSessionIds,
}) => {
    // Create the notification
    const newNoti = await db.Notification.create({
        noti_type: type,
        noti_content,
        noti_sender_id: senderId,
    });

    let users;

    if (classSessionIds.length > 0) {
        console.log("noti");

        // Find unique users enrolled in the specified class sessions
        users = await db.User.findAll({
            include: {
                model: db.Enrollment,
                where: { classSessionId: classSessionIds },
            },
            attributes: ["id"],
            group: ["User.id"], // Ensures no duplicate users
        });
    } else {
        console.log("noti1");

        // Get all users for other notification types
        users = await db.User.findAll({ attributes: ["id"] });
    }

    // Prepare NotiUser entries
    const notiUserEntries = users.map((user) => ({
        userId: user.id,
        notiId: newNoti.id,
        read: false, // By default, mark the notification as unread
    }));

    // Bulk create NotiUser entries
    await db.NotiUser.bulkCreate(notiUserEntries);

    // Push the notification to the system
    pushNoti(newNoti, notiUserEntries);

    return newNoti;
};

const listNotiByUser = async ({ userId = 1 }) => {
    const notifications = await db.Notification.findAll({
        include: [
            {
                model: db.NotiUser,
                as: "NotiUsers", // Use the correct alias as per the association definition
                where: { userId },
                attributes: ["isRead", "id"], // Correct the field name to 'read' if it matches your schema
                required: true,
            },
        ],
        attributes: [
            "id",
            "noti_type",
            "noti_content",
            "noti_sender_id",
            "createdAt",
            "updatedAt",
        ],
        order: [["createdAt", "DESC"]], // Order by newest notifications first
    });

    return notifications;
};

const updateNotiUser = async ({ id }) => {
    // Update the NotiUser record
    const [updatedCount] = await db.NotiUser.update(
        { isRead: true }, // New value for isRead
        {
            where: {
                id: id, // Condition to find the specific NotiUser
            },
        }
    );

    return;
};

const publishMessage = async ({
    exchangeName,
    bindingKey,
    message,
    type,
    classSessionIds,
    id,
}) => {
    const channelName = "coke_studio";
    amqp.connect(`${process.env.RABBIT_URL}`, async (err, conn) => {
        if (err) {
            console.error("AMQP Connection Error:", err);
            return;
        }

        let userIds;
        console.log("classSessionIds", classSessionIds);

        if (classSessionIds.length > 0) {
            // Get unique userIds enrolled in specified class sessions and part of the specified channel
            const enrolledUsersInChannel = await db.Enrollment.findAll({
                attributes: [
                    [
                        db.Sequelize.fn("DISTINCT", db.Sequelize.col("userId")),
                        "userId",
                    ],
                ],
                where: { classSessionId: { [Op.in]: classSessionIds } },
                // include: [
                //     {
                //         model: db.User, // Ensure this relationship exists
                //         required: true,
                //         include: [
                //             {
                //                 model: db.ChannelUser, // Ensure User has ChannelUser association
                //                 required: true,
                //                 include: [
                //                     {
                //                         model: db.Channel,
                //                         where: { name: channelName },
                //                         attributes: [],
                //                     },
                //                 ],
                //             },
                //         ],
                //     },
                // ],
                raw: true,
            });
            userIds = enrolledUsersInChannel.map((e) => e.userId);
        } else {
            // Get all userIds in the specified channel
            const usersInChannel = await db.ChannelUser.findAll({
                attributes: [
                    [
                        db.Sequelize.fn("DISTINCT", db.Sequelize.col("userId")),
                        "userId",
                    ],
                ],
                include: [
                    {
                        model: db.Channel,
                        where: { name: channelName },
                        attributes: [],
                    },
                ],
                raw: true,
            });
            userIds = usersInChannel.map((cu) => cu.userId);
        }

        // Get subscriptions for these users with specific platform information
        const subscriptions = await db.Subscription.findAll({
            attributes: ["endpoint"],
            include: [
                {
                    model: db.KeyStore,
                    required: true,
                    where: { userId: { [Op.in]: userIds } },
                    attributes: ["id", "device"], // include device from KeyStore
                    include: [
                        {
                            model: db.User,
                            attributes: ["name"],
                        },
                    ],
                },
            ],
            raw: false,
        });

        // console.log("subscriptions", subscriptions[0].KeyStore.User);

        const newMessage = {
            type,
            message,
            subscriptions,
            id,
        };

        conn.createChannel((err, ch) => {
            // ch.assertExchange(exchangeName, "fanout", { durable: true });
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
    updateNotiUser,
};
