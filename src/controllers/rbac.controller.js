"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
    createResource,
    createRole,
    roleList,
    resourceList,
} = require("../services/rbac.service");

/**
 * @desc Create a new role
 * @param {String} name
 * @param {String} slug
 * @param {String} description
 */

const newRole = async (req, res, next) => {
    new SuccessResponse({
        message: "created role",
        metadata: await createRole(req.body),
    }).send(res);
};

const newResource = async (req, res, next) => {
    new SuccessResponse({
        message: "created resource",
        metadata: await createResource(req.body),
    }).send(res);
};

const listRoles = async (req, res, next) => {
    new SuccessResponse({
        message: "get list roles",
        metadata: await roleList(req.query),
    }).send(res);
};

const listResources = async (req, res, next) => {
    new SuccessResponse({
        message: "get list resources",
        metadata: await resourceList(req.query),
    }).send(res);
};

module.exports = { newRole, newResource, listResources, listRoles };
