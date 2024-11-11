"use strict";

const { Op } = require("sequelize");
const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

const createNote = async ({ userId, content = "", name }) => {
    try {
        // Create the UserNote entry
        const note = await db.UserNote.create({
            userId,
            name,
            content,
        });

        return {
            id: note.id,
            name: note.name,
            content: note.content,
            tags: [],
        };
    } catch (error) {
        return error;
    }
};

const listNote = async ({ userId, limit = 30, offset = 0, search = "" }) => {
    try {
        const notes = await db.UserNote.findAll({
            where: {
                userId: userId, // Lọc theo userId
            },
            include: [
                {
                    model: db.Tag,
                    through: {
                        attributes: [], // Không lấy thuộc tính nào từ bảng trung gian
                    },
                    attributes: ["id", "name"], // Chỉ lấy các thuộc tính cần thiết
                },
            ],
            limit, // Giới hạn số lượng bản ghi trả về (nếu có)
            offset, // Dịch chuyển bản ghi (nếu có)
            order: [["createdAt", "DESC"]], // Sắp xếp theo ngày tạo
        });

        // Xử lý lại dữ liệu để trả về đúng format
        const formattedNotes = notes.map((note) => ({
            id: note.id,
            name: note.name, // Chuyển 'name' thành 'title'
            content: note.content,
            tags: note.Tags.map((tag) => ({
                id: tag.id,
                name: tag.name,
            })),
        }));
        return formattedNotes;
    } catch (error) {
        console.error(error);
        return error;
    }
};

const getNoteId = async ({ noteId }) => {
    try {
        const note = await db.UserNote.findByPk(noteId, {
            include: [
                {
                    model: db.Tag, // Nếu bạn muốn bao gồm các tag liên quan
                    through: { attributes: [] }, // Không lấy các trường của bảng trung gian
                },
            ],
        });

        return note;
    } catch (error) {
        return error;
    }
};

const updateNote = async ({ noteId, content, name, tagIds }) => {
    try {
        // Find the note to update
        const note = await db.UserNote.findByPk(noteId);

        console.log("note", name, tagIds);
        if (!note) {
            throw new NotFoundError("Note not found");
        }

        // Update the note's name
        if (name) {
            note.name = name;
        }

        // Update the note's content
        if (content) {
            note.content = content;
        }

        await note.save();

        console.log(note.content);

        // Update the associated tags if provided
        if (tagIds.length > 0) {
            const tags = await db.Tag.findAll({
                where: {
                    id: tagIds,
                },
            });

            console.log("tags", tags);

            // Duyệt qua từng tag và cập nhật vào bảng trung gian với status
            for (let tag of tags) {
                // Sử dụng upsert để cập nhật hoặc thêm mới trong bảng NoteTag
                await db.NoteTag.upsert({
                    noteId: note.id,
                    tagId: tag.id,
                });
            }
        }
        return note;
    } catch (error) {
        return error;
    }
};

const deleteNote = async ({ noteId }) => {
    try {
        // Find the note to delete
        const note = await db.UserNote.findByPk(noteId);

        if (!note) {
            throw new NotFoundError("Note not found");
        }

        // Delete the note and associated tags in the join table
        await note.destroy({ force: true });
    } catch (error) {
        return error;
    }
};

module.exports = {
    createNote,
    listNote,
    getNoteId,
    updateNote,
    deleteNote,
};
