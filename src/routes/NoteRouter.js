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
const { authenticationV2 } = require("../auth/authUtils");
const { grantAccess } = require("../middleware/rbac");

router.use(authenticationV2);

router.post("", grantAccess("createOwn", "note"), asyncHandler(newNote));
router.get("/:id", grantAccess("readOwn", "note"), asyncHandler(noteList));
router.patch("", grantAccess("updateOwn", "note"), asyncHandler(noteUpdate));
router.delete(
    "/:id",
    grantAccess("deleteOwn", "note"),
    asyncHandler(noteDelete)
);

module.exports = router;
