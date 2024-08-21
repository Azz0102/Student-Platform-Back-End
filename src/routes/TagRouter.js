"use strict";

const express = require("express");
const router = express.Router();
const { newTag, tagDelete, tagList } = require("../controllers/tag.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { grantAccess } = require("../middleware/rbac");

router.post("", grantAccess("createOwn", "tag"), asyncHandler(newTag));
router.get("/:id", grantAccess("readOwn", "tag"), asyncHandler(tagList));
router.delete("/:id", grantAccess("deleteOwn", "tag"), asyncHandler(tagDelete));

module.exports = router;
