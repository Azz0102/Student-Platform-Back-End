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
const { authenticationV2 } = require("../auth/authUtils");
const { asyncHandler } = require("../helpers/asyncHandler");
const { grantAccess } = require("../middleware/rbac");

// router.use(authenticationV2);

router.post("", asyncHandler(newNews)); //grantAccess("createAny", "news")
router.get("", grantAccess("readAny", "news"), asyncHandler(newsList));
router.get(
    "/:id",
    grantAccess("readOwn", "news"),
    asyncHandler(newsListByUser)
);
router.patch("", grantAccess("updateAny", "news"), asyncHandler(newsUpdate));
router.delete(
    "/:id",
    grantAccess("deleteAny", "news"),
    asyncHandler(newsDelete)
);

module.exports = router;
