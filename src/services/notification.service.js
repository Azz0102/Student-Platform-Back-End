"use strict";

const { Op, fn, col, literal } = require("sequelize");
const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const amqp = require("amqplib/callback_api");
const { pushNoti } = require("../../src/dbs/init.socket");

const pushNotiToSystem = async ({
    type = "NEWS-001",
    senderId = 1,
    noti_content,
}) => {
    try {
        const newNoti = await db.Notification.create({
            noti_type: type,
            noti_content,
            noti_sender_id: senderId,
        });

        const users = await db.User.findAll();

        const notiUserEntries = users.map((user) => ({
            userId: user.id,
            notiId: newNoti.id,
            isRead: false, // By default, mark the notification as unread
        }));

        const notiUser = await db.NotiUser.bulkCreate(notiUserEntries);

        pushNoti(newNoti, notiUser);

        return newNoti;
    } catch (error) {
        return error;
    }
};

const listNotiByUser = async ({ userId = 1 }) => {
    try {
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

const updateNotiUser = async ({ id }) => {
    try {
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
    } catch (error) {
        return error;
    }
};

const publishMessage = async ({ exchangeName, bindingKey, message }) => {
    const channelName = "coke_studio";
    amqp.connect("amqp://guest:12345@localhost", async (err, conn) => {
        if (err) {
            console.log(err);
        }

        // First, get all user IDs in the specified channel
        const usersInChannel = await db.ChannelUser.findAll({
            attributes: ["userId"],
            include: [
                {
                    model: db.Channel,
                    where: { name: channelName },
                    attributes: [],
                },
            ],
        });

        console.log("usersInChannel", usersInChannel);

        const userIds = usersInChannel.map((cu) => cu.userId);

        // Now, get all subscriptions for these users
        const subscriptions = await db.Subscription.findAll({
            attributes: ["endpoint"],
            include: [
                {
                    model: db.KeyStore,
                    where: { userId: { [Op.in]: userIds } },
                    attributes: [],
                    include: [
                        {
                            model: db.User,
                            attributes: ["name"],
                        },
                    ],
                },
            ],
        });

        console.log("subscriptions", subscriptions);

        const newMessage = {
            message,
            subscriptions,
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
    updateNotiUser,
};
