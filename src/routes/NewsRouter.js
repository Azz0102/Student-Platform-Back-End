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
    uploadFile,
    downloadFile,
} = require("../controllers/news.controller");
const { authenticationV2 } = require("../auth/authUtils");
const { asyncHandler } = require("../helpers/asyncHandler");
const { grantAccess } = require("../middleware/rbac");
const multer = require("multer");
const path = require('path');
const fs = require('fs');

// router.use(authenticationV2);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const savePath = path.join(process.env.SAVE_PATH, 'newsAttach');

        // Kiểm tra và tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(savePath)) {
            fs.mkdirSync(savePath, { recursive: true });
        }

        cb(null, savePath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Use unique names without spaces
    },
});

const upload = multer({ storage });
router.post("", upload.array("files"), asyncHandler(newNews)); //grantAccess("createAny", "news")
router.get("", asyncHandler(newsList)); //grantAccess("readAny", "news")
router.get("/:id", asyncHandler(newsListByUser)); //grantAccess("readOwn", "news")
router.patch("/:id", asyncHandler(newsUpdate)); //grantAccess("updateAny", "news")
router.delete("/", asyncHandler(newsDelete)); //grantAccess("deleteAny", "news")

router.get("/user/:id", asyncHandler(getUserRelatedNew));

// File upload route
router.post(
    "/upload",
    upload.single("file"), // 'file' is the field name used in the form-data
    asyncHandler(uploadFile)
);

router.get("/file/:id", asyncHandler(downloadFile));

module.exports = router;
