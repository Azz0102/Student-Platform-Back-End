const AccessControl = require("accesscontrol");
const USER = require("../models/user.model");
const { AuthFailureError } = require("../core/error.response");

module.exports = new AccessControl();
