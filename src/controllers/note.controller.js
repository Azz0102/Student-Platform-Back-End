const { SuccessResponse } = require("../core/success.response");
const {
    createNote,
    listNote,
    updateNote,
    deleteNote,
    getNoteId,
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
        metadata: await listNote({ userId: req.params.id }),
    }).send(res);
};

const noteId = async (req, res, next) => {
    new SuccessResponse({
        message: "get list note",
        metadata: await getNoteId({ noteId: req.params.id }),
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
        metadata: await deleteNote({ noteId: req.params.id }),
    }).send(res);
};

module.exports = {
    newNote,
    noteList,
    noteId,
    noteUpdate,
    noteDelete,
};
