"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach((k) => {
        if (obj[k] == null) {
            delete obj[k];
        }
    });

    return obj;
};

const updateNestedObjectParser = (obj) => {
    const final = {};
    Object.keys(final).forEach((k) => {
        if (typeof obj[k] === "Object" && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k]);
            Object.keys(response).forEach((a) => {
                final[`${k}.${a}`] = res(a);
            });
        } else {
            final[k] = obj[k];
        }
    });
    return final;
};

const replacePlaceholder = (template, params) => {
    Object.keys(params).forEach((k) => {
        const placeholder = `{{${k}}}`; // {{verifykey}}
        template = template.replace(new RegExp(placeholder, "g"), params[k]);
    });

    return template;
};

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb,
    replacePlaceholder,
};
