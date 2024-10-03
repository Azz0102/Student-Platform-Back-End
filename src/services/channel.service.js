"use strict";

const { Op, where } = require("sequelize");
const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const amqp = require("amqplib/callback_api");

const subscribe = ({ username, channel, data }) => {
    amqp.connect("amqp://guest:12345@localhost", (err, conn) => {
        conn.createChannel(async (err, ch) => {
            const notificationExchangeDLX = "notificationExDLX" + username;
            const notificationRoutingKeyDLX =
                "notificationRoutingKeyDLX" + username;
            await ch.assertExchange(channel, "fanout", { durable: true });
            const queueResult = await ch.assertQueue(username, {
                durable: true,
                exclusive: false, // allow many connections to queue
                arguments: {
                    "x-dead-letter-exchange": notificationExchangeDLX,
                    "x-dead-letter-routing-key": notificationRoutingKeyDLX,
                },
            });
            await ch.bindQueue(queueResult.queue, channel, channel);

            const user = await db.User.findOne({ where: { name: username } });

            const keyStore = await db.KeyStore.findOne({
                where: { userId: user.id },
            });

            const findChannel = await db.Channel.findOne({
                where: { name: channel },
            });

            const ChannelUser = await db.ChannelUser.create({
                userId: user.id,
                channelId: findChannel.id,
            });

            const subscription = await db.Subscription.create({
                keyStoreId: keyStore.id,
                endpoint: data.token,
            });

            console.log(
                username +
                    ` is successfully subscribed to the channel ${channel}`
            );

            return ChannelUser;
        });
    });
};

const unsubscribe = ({ username, channel }) => {
    amqp.connect("amqp://guest:12345@localhost", (err, conn) => {
        conn.createChannel((err, ch) => {
            ch.unbindQueue(username, channel, channel);

            // channel.unsubscribe(req);
        });
    });
};

module.exports = {
    subscribe,
    unsubscribe,
};
