"use strict";

const { Op } = require("sequelize");
const db = require("../models");
const {
    BadRequestError,
    NotFoundError,
    ForbiddenError,
} = require("../core/error.response");

const createTag = async ({ userId, name, isPermanent = false }) => {
    try {
        // Check the number of tags with isPermanent: false
        const count = await Tag.count({
            where: {
                userId,
                isPermanent: false,
            },
        });

        // Restrict the number of non-permanent tags to 20
        if (count >= 20 && !isPermanent) {
            throw new BadRequestError(
                "Cannot create more than 20 tags."
            );
        }
        // Check if a tag with the same name already exists for the user
        const existingTag = await db.Tag.findOne({
            where: {
                userId,
                name,
            },
        });

        if (existingTag) {
            throw new BadRequestError("Tag already exists");
        }

        // Create the new tag
        const tag = await db.Tag.create({
            userId,
            name,
            isPermanent,
        });

        return tag;
    } catch (error) {
        return error;
    }
};
const listTags = async ({ userId }) => {
    try {
        // Fetch all tags for the user
        const tags = await db.Tag.findAll({
            where: {
                userId,
            },
            order: [["name", "ASC"]], // Order by tag name
        });

        return tags;
    } catch (error) {
        return error;
    }
};
const deleteTag = async ({ tagId }) => {
    try {
        // Find the tag by ID
        const tag = await db.Tag.findByPk(tagId);

        if (!tag) {
            throw new NotFoundError("Tag not found.");
        }

        if (tag.isPermanent) {
            throw new ForbiddenError(`You can't delete this tag`);
        }

        // Delete the tag
        await tag.destroy();
    } catch (error) {
        return error;
    }
};

module.exports = {
    createTag,
    listTags,
    deleteTag,
};
