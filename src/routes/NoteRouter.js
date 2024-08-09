"use strict";

const express = require("express");
const router = express.Router();
const {
    newNote,
    noteList,
    noteUpdate,
    noteDelete,
} = require("../controllers/note.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { grantAccess } = require("../middleware/rbac");
const { authMiddleware } = require("../middleware/auth.middleware");

router.post("", grantAccess("createOwn", "note"), asyncHandler(newNote));
router.get("", grantAccess("readOwn", "note"), asyncHandler(noteList));
router.patch("", grantAccess("updateOwn", "note"), asyncHandler(noteUpdate));
router.delete("", grantAccess("deleteOwn", "note"), asyncHandler(noteDelete));

module.exports = router;
