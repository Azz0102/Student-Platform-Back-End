"use strict";

const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

// Tạo mới một subject
const createSubscription = async ({ keyStore, endpoint }) => {
    console.log("userKey", keyStore);

    const userKey = await db.KeyStore.findOne({
        where: { refreshToken: keyStore },
    });

    console.log("userKey", userKey);
    if (!userKey) {
        throw new NotFoundError("KeyStore not found");
    }
    // Check if subscription exists
    let subscription = await db.Subscription.findOne({
        where: { keyStoreId: userKey.id },
    });

    console.log("subscription", subscription);

    if (subscription) {
        // Update existing subscription
        subscription.endpoint = endpoint;
        await subscription.save();
    } else {
        // Create a new subscription
        subscription = await db.Subscription.create({
            keyStoreId: userKey.id,
            endpoint,
        });
    }

    return subscription;
};

module.exports = {
    createSubscription,
};
