"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
    createResource,
    resourceList,
    deleteResource,
    updateResource,
    createRole,
    roleList,
    updateRole,
    deleteRole,
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

const roleUpdate = async (req, res, next) => {
    new SuccessResponse({
        message: "updated role",
        metadata: await updateRole(req.body),
    }).send(res);
};

const resourceUpdate = async (req, res, next) => {
    new SuccessResponse({
        message: "updated resource",
        metadata: await updateResource(req.body),
    }).send(res);
};

const roleDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "deleted role",
        metadata: await deleteRole({ roleId: req.query.roleId }),
    }).send(res);
};

const resourceDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "deleted resource",
        metadata: await deleteResource({ resourceId: req.query.resourceId }),
    }).send(res);
};
module.exports = {
    newRole,
    newResource,
    listResources,
    listRoles,
    roleUpdate,
    resourceUpdate,
    roleDelete,
    resourceDelete,
};
