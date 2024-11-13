"use strict";

const { Op, where } = require("sequelize");
const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const amqp = require("amqplib/callback_api");
const dotenv = require("dotenv");
dotenv.config();

const subscribe = ({ username, channel, data }) => {
    amqp.connect(`${process.env.RABBIT_URL}`, (err, conn) => {
        conn.createChannel(async (err, ch) => {
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

            // const subscription = await db.Subscription.create({
            //     keyStoreId: keyStore.id,
            //     endpoint: data.token,
            // });

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
