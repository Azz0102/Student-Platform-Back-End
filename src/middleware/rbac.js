"use strict";
const { AuthFailureError } = require("../core/error.response");
const { roleList } = require("../services/rbac.service");
const rbac = require("./role.middleware");
/**
 *
 * @param {string} action // read, delete, update or create
 * @param {*} resource // news
 */

const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            rbac.setGrants(await roleList());
            const rol_name = req.query.role; // Get role user code later
            const permission = rbac.can(rol_name)[action](resource);
            if (!permission.granted) {
                throw new AuthFailureError("You don't have enough permissions");
            }

            // Attach the permission object to the request object
            req.permission = permission;

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = { grantAccess };
