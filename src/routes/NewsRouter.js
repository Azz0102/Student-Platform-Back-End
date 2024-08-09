"use strict";

const express = require("express");
const router = express.Router();
const {
    newNews,
    newsList,
    newsListByUser,
    newsUpdate,
    newsDelete,
} = require("../controllers/news.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { grantAccess } = require("../middleware/rbac");
const { authMiddleware } = require("../middleware/auth.middleware");

router.post("", grantAccess("createAny", "news"), asyncHandler(newNews));
router.get("", grantAccess("readAny", "news"), asyncHandler(newsList));
router.get("", grantAccess("readOwn", "news"), asyncHandler(newsListByUser));
router.patch("", grantAccess("updateAny", "news"), asyncHandler(newsUpdate));
router.delete("", grantAccess("deleteAny", "news"), asyncHandler(newsDelete));

module.exports = router;
