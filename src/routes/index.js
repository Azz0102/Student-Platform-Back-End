const UserRouter = require("./UserRouter");
const RbacRouter = require("./RbacRouter");
const AdminRouter = require("./AdminRouter");
const NoteRouter = require("./NoteRouter");
const TagRouter = require("./TagRouter");
const NewsRouter = require("./NewsRouter");
const ChannelRouter = require("./ChannelRouter");


const MesageRouter = require("./mesageRouter");
const AmphitheaterRouter = require("./amphitheaterRouter");
const ClassroomRouter = require("./classroomRoute");
const SubjectRouter = require("./subjectRoute");
const SemesterRouter = require("./semesterRoute");
const ClassSessionRouter = require("./classSessionRoute");
const TeacherRouter = require("./teacherRoute");
const SessionDetailsRouter = require("./sessionDetailsRoute");
const EnrollmentRouter = require("./enrollmentRouter");

const routes = (app) => {
    app.use("/api/user", UserRouter);
    app.use("/api/rbac", RbacRouter);
    app.use("/api/admin", AdminRouter);
    app.use("/api/note", NoteRouter);
    app.use("/api/tag", TagRouter);
    app.use("/api/news", NewsRouter);
    app.use("/api/channel", ChannelRouter);

    app.use("/api/mesage", MesageRouter);

    app.use("/api/amphitheater", AmphitheaterRouter);
    app.use("/api/classroom", ClassroomRouter);
    app.use("/api/subject", SubjectRouter);
    app.use("/api/semester", SemesterRouter);
    app.use("/api/class_session", ClassSessionRouter);
    app.use("/api/teacher", TeacherRouter);
    app.use("/api/session_details", SessionDetailsRouter);

    app.use("/api/enrollment", EnrollmentRouter);


};

module.exports = routes;
