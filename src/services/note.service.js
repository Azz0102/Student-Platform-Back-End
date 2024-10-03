"use strict";

const { Op } = require("sequelize");
const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

const createNote = async ({ userId, content = "", name }) => {
    try {
        // Create the UserNote entry
        const newNote = await db.UserNote.create({
            userId,
            name,
            content,
        });

        return newNote;
    } catch (error) {
        return error;
    }
};
const listNote = async ({ userId, limit = 30, offset = 0, search = "" }) => {
    try {
        const notes = await db.UserNote.findAll({
            where: userId, // Filter by userId if provided
            include: [db.Tag], // Include associated tags
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });
        return notes;
    } catch (error) {
        return error;
    }
};
const updateNote = async ({ noteId, content, name, tagIds = [] }) => {
    try {
        // Find the note to update
        const note = await UserNote.findByPk(noteId);

        if (!note) {
            throw new NotFoundError("Note not found");
        }

        // Update the note's name
        if (name) {
            note.name = name;
        }

        // Update the note's content
        if (content) {
            note.notes = content;
        }

        await note.save();

        // Update the associated tags if provided
        if (tagIds.length > 0) {
            const tags = await Tag.findAll({
                where: {
                    id: tagIds,
                },
            });
            await note.setTags(tags); // This will replace existing tags
        } else {
            await note.setTags([]);
        }

        return note;
    } catch (error) {
        return error;
    }
};
const deleteNote = async ({ noteId }) => {
    try {
        // Find the note to delete
        const note = await UserNote.findByPk(noteId);

        if (!note) {
            throw new NotFoundError("Note not found");
        }

        // Delete the note and associated tags in the join table
        await note.destroy();
    } catch (error) {
        return error;
    }
};
module.exports = {
    createNote,
    listNote,
    updateNote,
    deleteNote,
};
