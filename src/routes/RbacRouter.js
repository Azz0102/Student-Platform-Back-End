"use strict";

const express = require("express");
const router = express.Router();
const {
    newResource,
    newRole,
    listResources,
    listRoles,
} = require("../controllers/rbac.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { grantAccess } = require("../middleware/rbac");

router.post("/role", grantAccess("createAny", "role"), asyncHandler(newRole));
router.get("/roles", grantAccess("readAny", "role"), asyncHandler(listRoles));

router.post(
    "/resource",
    grantAccess("createAny", "resource"),
    asyncHandler(newResource)
);
router.get(
    "/resources",
    grantAccess("readAny", "resource"),
    asyncHandler(listResources)
);

module.exports = router;
