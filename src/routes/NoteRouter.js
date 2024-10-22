"use strict";

const express = require("express");
const router = express.Router();
const {
    newNote,
    noteList,
    noteUpdate,
    noteDelete,
    noteId,
} = require("../controllers/note.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { authenticationV2 } = require("../auth/authUtils");
const { grantAccess } = require("../middleware/rbac");

// router.use(authenticationV2);

router.post("", asyncHandler(newNote));//grantAccess("createOwn", "note")
router.get("/:id", asyncHandler(noteList)); //grantAccess("readOwn", "note")
router.get("/get-id/:id", asyncHandler(noteId)); //grantAccess("readOwn", "note")
router.patch("", asyncHandler(noteUpdate));//grantAccess("updateOwn", "note")
router.delete(
    "/:id",
    asyncHandler(noteDelete)
);//grantAccess("deleteOwn", "note")

module.exports = router;
