"use strict";

const express = require("express");
const router = express.Router();
const {
    newNote,
    noteList,
    noteUpdate,
    noteDelete,
    noteId,
    uploadFile,
} = require("../controllers/note.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { authenticationV2 } = require("../auth/authUtils");
const { grantAccess } = require("../middleware/rbac");
const multer = require("multer");
// router.use(authenticationV2);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${process.env.SAVE_PATH}/uploads/`); // Save files to 'uploads' directory
    },
    filename: (req, file, cb) => {
        // Remove all spaces from the original file name
        const cleanFileName = file.originalname.replace(/\s+/g, "");
        const newFilename = encodeURIComponent(cleanFileName);

        cb(null, `${Date.now()}-${newFilename}`); // Use unique names without spaces
    },
});

const upload = multer({ storage });

router.post("", asyncHandler(newNote)); //grantAccess("createOwn", "note")
router.get("/:id", asyncHandler(noteList)); //grantAccess("readOwn", "note")
router.get("/get-id/:id", asyncHandler(noteId)); //grantAccess("readOwn", "note")
router.patch("", asyncHandler(noteUpdate)); //grantAccess("updateOwn", "note")
router.delete("/:id", asyncHandler(noteDelete)); //grantAccess("deleteOwn", "note")

// File upload route
router.post(
    "/upload",
    upload.single("file"), // 'file' is the field name used in the form-data
    asyncHandler(uploadFile)
);

module.exports = router;
