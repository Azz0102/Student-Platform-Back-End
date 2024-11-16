"use strict";

const express = require("express");
const router = express.Router();
const {
    newNews,
    newsList,
    newsListByUser,
    newsUpdate,
    newsDelete,
    getUserRelatedNew,
} = require("../controllers/news.controller");
const { authenticationV2 } = require("../auth/authUtils");
const { asyncHandler } = require("../helpers/asyncHandler");
const { grantAccess } = require("../middleware/rbac");

// router.use(authenticationV2);

router.post("/", asyncHandler(newNews)); //grantAccess("createAny", "news")
router.get("/", asyncHandler(newsList)); //grantAccess("readAny", "news")
router.get("/:id", asyncHandler(newsListByUser)); //grantAccess("readOwn", "news")
router.patch("/:id", asyncHandler(newsUpdate)); //grantAccess("updateAny", "news")
router.delete("/:id", asyncHandler(newsDelete)); //grantAccess("deleteAny", "news")

router.get("/user/:id", asyncHandler(getUserRelatedNew));

module.exports = router;
