"use strict";

const { Op } = require("sequelize");
const db = require("../models");
const { BadRequestError, NotFoundError } = require("../core/error.response");

/**
 * new resource
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 */

const createResource = async ({
    userId,
    name = "classroom",
    slug = "p00001",
    description = "",
}) => {
    try {
        // 1. Check name or slug exists
        const existingResource = await db.Resource.findOne({
            where: {
                [Op.or]: [{ name }, { slug }],
            },
        });

        if (existingResource) {
            throw new BadRequestError(
                "Resource with the same name or slug already exists."
            );
        }

        // 2. New resource
        const resource = await db.Resource.create({
            name,
            slug,
            description,
        });

        return resource;
    } catch (error) {
        return error;
    }
};

const resourceList = async ({
    userId = 0, //admin
    limit = 30,
    offset = 0,
    search = "",
}) => {
    try {
        // 1. Check admin ? middleware function

        // 2. get List of resource
        const resources = await db.Resource.findAll();

        return resources;
    } catch (error) {
        return error;
    }
};

const updateResource = async ({
    userId,
    resourceId,
    name,
    slug,
    description,
}) => {
    try {
        // 1. Check resource exists
        const resource = await db.Resource.findByPk(resourceId);
        if (!resource) {
            throw new NotFoundError("Resource not found");
        }

        // 2. Update fields if they are provided
        if (name) resource.name = name;
        if (slug) resource.slug = slug;
        if (description) resource.description = description;

        // 3. Save the updated resource
        await resource.save();

        return resource;
    } catch (error) {
        return error;
    }
};

const deleteResource = async ({ userId, resourceId }) => {
    try {
        // 1. Check resource exists
        const resource = await db.Resource.findByPk(resourceId);
        if (!resource) {
            throw new NotFoundError("Resource not found");
        }

        // 2. Delete the resource
        await resource.destroy();
    } catch (error) {
        return error;
    }
};

const createRole = async ({
    userId,
    name = "admin",
    slug = "s00001",
    description = "admin role",
    grants = [],
}) => {
    try {
        // 1. Check role exists
        const existingRole = await db.Role.findOne({
            where: {
                [Op.or]: [{ name }, { slug }],
            },
        });

        if (existingRole) {
            throw new Error("Role with the same name or slug already exists.");
        }
        // 2. new role
        const role = await db.Role.create({
            name,
            slug,
            description,
        });

        // extract grant create new permission, resource, role_permission
        for (const grant of grants) {
            const { resourceId, permission, attribute } = grant;

            // Assuming the permissions are stored in a way that includes the action and the resource access type
            // For example, 'read:any' or 'read:own'

            // Split the permission into action and ownership
            const [action, ownership] = permission.split(":");

            // Find or create the permission
            const [permissionRecord] = await db.Permission.findOrCreate({
                where: { title: permission },
                defaults: {
                    name: permission,
                    slug: permission,
                    description: `${action} ${ownership}`,
                },
            });

            // Create the role-permission entry
            await db.RolePermission.create({
                roleId: role.id,
                permissionId: permissionRecord.id,
                resourceId,
                attributes: attribute,
            });
        }
        return role;
    } catch (error) {
        return error;
    }
};

const roleList = async ({ limit = 30, offset = 0, search = "" }) => {
    try {
        // Query to fetch roles, associated permissions, and resources
        const roles = await db.Role.findAll({
            where: search
                ? {
                      name: {
                          [Op.like]: `%${search}%`,
                      },
                  }
                : {},
            include: [
                {
                    model: RolePermission,
                    include: [
                        {
                            model: Permission,
                            attributes: ["name"], // Assuming 'title' holds the 'action:ownership' string
                        },
                        {
                            model: Resource,
                            attributes: ["name"], // Assuming 'name' holds the resource name
                        },
                    ],
                },
            ],
            limit,
            offset,
        });

        // Formatting the results into the desired structure
        const grantList = roles.flatMap((role) =>
            role.RolePermissions.map((rp) => ({
                role: role.name,
                resource: rp.Resource.name,
                action: rp.Permission.name,
                attributes: rp.attributes,
            }))
        );

        return grantList;
    } catch (error) {
        console.error("Error fetching role list:", error);
        return error;
    }
};

const updateRole = async ({ userId, roleId, name, slug, description }) => {
    try {
        // 1. Check if the role exists

        const role = await db.Role.findByPk(roleId);
        if (!role) {
            throw new NotFoundError("Role not found");
        }

        // 2. Update only the fields that are provided

        if (name) resource.name = name;
        if (slug) resource.slug = slug;
        if (description) resource.description = description;

        // 3. Save the updated role
        await role.save();

        // 4. Return the updated role
        return role;
    } catch (error) {
        return error;
    }
};

const deleteRole = async ({ userId, roleId }) => {
    try {
        // 1. Check if the role exists

        const role = await db.Role.findByPk(roleId);
        if (!role) {
            throw new NotFoundError("Role not found");
        }

        // 2. Delete the resource
        await role.destroy();
        return role;
    } catch (error) {
        return error;
    }
};
module.exports = {
    createResource,
    resourceList,
    deleteResource,
    updateResource,
    createRole,
    roleList,
    updateRole,
    deleteRole,
};
