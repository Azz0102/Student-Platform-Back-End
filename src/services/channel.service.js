"use strict";

const { Op, where } = require("sequelize");
const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const amqp = require("amqplib/callback_api");

const subscribe = ({ username, channel, data }) => {
    amqp.connect("amqp://guest:12345@localhost", (err, conn) => {
        conn.createChannel(async (err, ch) => {
            ch.assertExchange(channel, "fanout", { durable: true });
            ch.assertQueue(username, { durable: true });
            ch.bindQueue(username, channel, channel);
            // channel
            //     .subscribe(req)
            //     .then(() => {
            //         console.log(
            //             req.username +
            //                 " is successfully subscribed to the channel req.channel"
            //         );
            //     })
            //     .catch((err) => {
            //         debugger;
            //     });

            const user = await db.User.findOne({ where: { name: username } });

            const channel = await db.Channel.findOne({
                where: {
                    name: channel,
                },
            });

            const channelUser = await db.ChannelUser.create({
                userId: user.id,
                channelId: channel.id,
            });

            const keyStore = await db.KeyStore.findOne({
                where: { userId: user.id },
            });

            const subscription = await db.Subscription.create({
                keyStoreId: keyStore.id,
                endpoint: data.endpoint,
                expirationTime: 60,
                auth: data.keys["auth"],
                p256dh: data.keys["p256dh"],
            });

            console.log(
                username +
                    ` is successfully subscribed to the channel ${channel}`
            );

            return subscription;
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
