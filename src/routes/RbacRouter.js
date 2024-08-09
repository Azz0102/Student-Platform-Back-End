"use strict";

const express = require("express");
const router = express.Router();
const {
    newResource,
    newRole,
    listResources,
    listRoles,
    roleDelete,
    resourceDelete,
    resourceUpdate,
    roleUpdate,
} = require("../controllers/rbac.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { grantAccess } = require("../middleware/rbac");
const { authMiddleware } = require("../middleware/auth.middleware");

router.post("/role", grantAccess("createAny", "role"), asyncHandler(newRole));
router.get("/roles", grantAccess("readAny", "role"), asyncHandler(listRoles));
router.patch(
    "/role",
    grantAccess("updateAny", "role"),
    asyncHandler(roleUpdate)
);
router.delete(
    "/role",
    grantAccess("deleteAny", "role"),
    asyncHandler(roleDelete)
);

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
router.patch(
    "/resource",
    grantAccess("updateAny", "resource"),
    asyncHandler(resourceUpdate)
);
router.delete(
    "/resource",
    grantAccess("deleteAny", "resource"),
    asyncHandler(resourceDelete)
);

module.exports = router;
