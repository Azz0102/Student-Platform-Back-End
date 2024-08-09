const UserRouter = require("./UserRouter");
const RbacRouter = require("./RbacRouter");
const AdminRouter = require("./AdminRouter");
const NoteRouter = require("./NoteRouter");
const TagRouter = require("./TagRouter");
const NewsRouter = require("./NewsRouter");

const routes = (app) => {
    app.use("/api/user", UserRouter);
    app.use("/api/rbac", RbacRouter);
    app.use("/api/admin", AdminRouter);
    app.use("/api/note", NoteRouter);
    app.use("/api/tag", TagRouter);
    app.use("/api/news", NewsRouter);
};

module.exports = routes;
