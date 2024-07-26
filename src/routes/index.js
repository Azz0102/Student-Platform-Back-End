const UserRouter = require("./UserRouter");
const RbacRouter = require("./RbacRouter");
const AdminRouter = require("./AdminRouter");

const routes = (app) => {
    app.use("/api/user", UserRouter);
    app.use("/api/rbac", RbacRouter);
    app.use("/api/admin", AdminRouter);
};

module.exports = routes;
