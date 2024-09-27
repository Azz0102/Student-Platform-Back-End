"use strict";

const express = require("express");
const router = express.Router();
const {
    newTag,
    tagDelete,
    tagList,
    tagUpdate,
} = require("../controllers/tag.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { authenticationV2 } = require("../auth/authUtils");
const { grantAccess } = require("../middleware/rbac");

router.use(authenticationV2);

router.post("", grantAccess("createOwn", "tag"), asyncHandler(newTag));
router.get("/:id", grantAccess("readOwn", "tag"), asyncHandler(tagList));
router.delete("/:id", grantAccess("deleteOwn", "tag"), asyncHandler(tagDelete));
router.patch("", grantAccess("updateOwn", "tag"), asyncHandler(tagUpdate));

module.exports = router;
