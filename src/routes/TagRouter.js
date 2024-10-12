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

// router.use(authenticationV2);

router.post("", asyncHandler(newTag));//grantAccess("createOwn", "tag")
router.get("/:id", asyncHandler(tagList)); //grantAccess("readOwn", "tag")
router.delete("/:id", asyncHandler(tagDelete));//grantAccess("deleteOwn", "tag")
router.patch("", asyncHandler(tagUpdate));//grantAccess("updateOwn", "tag")

module.exports = router;
