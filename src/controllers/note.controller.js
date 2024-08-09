const { SuccessResponse } = require("../core/success.response");
const {
    createNote,
    listNote,
    updateNote,
    deleteNote,
} = require("../services/note.service");

const newNote = async (req, res, next) => {
    new SuccessResponse({
        message: "created note",
        metadata: await createNote(req.body),
    }).send(res);
};

const noteList = async (req, res, next) => {
    new SuccessResponse({
        message: "get list note",
        metadata: await listNote(req.body),
    }).send(res);
};

const noteUpdate = async (req, res, next) => {
    new SuccessResponse({
        message: "updated note",
        metadata: await updateNote(req.body),
    }).send(res);
};

const noteDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "updated note",
        metadata: await deleteNote({ noteId: req.query.noteId }),
    }).send(res);
};

module.exports = {
    newNote,
    noteList,
    noteUpdate,
    noteDelete,
};
