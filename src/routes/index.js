const UserRouter = require("./UserRouter");
const RbacRouter = require("./RbacRouter");
const AdminRouter = require("./AdminRouter");
const NoteRouter = require("./NoteRouter");
const TagRouter = require("./TagRouter");
const NewsRouter = require("./NewsRouter");
const ChannelRouter = require("./ChannelRouter");

const MesageRouter = require("./messageRouter");
const AmphitheaterRouter = require("./amphitheaterRouter");
const ClassroomRouter = require("./classroomRouter");
const SubjectRouter = require("./subjectRouter");
const SemesterRouter = require("./semesterRouter");
const ClassSessionRouter = require("./classSessionRouter");
const TeacherRouter = require("./teacherRouter");
const SessionDetailsRouter = require("./sessionDetailsRouter");
const EnrollmentRouter = require("./enrollmentRouter");
const NotiRouter = require("./NotiRouter");
const SubscriptionRouter = require("./SubscriptionRouter");
const GradeRouter = require("./gradeRouter");
const UserSessionDetailsRouter = require("./UserSessionDetailsRouter");


const routes = (app) => {
    app.use("/api/user", UserRouter);
    app.use("/api/rbac", RbacRouter);
    app.use("/api/admin", AdminRouter);
    app.use("/api/note", NoteRouter);
    app.use("/api/tag", TagRouter);
    app.use("/api/news", NewsRouter);
    app.use("/api/channel", ChannelRouter);

    app.use("/api/message", MesageRouter);
    app.use("/api/notification", NotiRouter);

    app.use("/api/amphitheater", AmphitheaterRouter);
    app.use("/api/classroom", ClassroomRouter);
    app.use("/api/subject", SubjectRouter);
    app.use("/api/semester", SemesterRouter);
    app.use("/api/class-session", ClassSessionRouter);
    app.use("/api/teacher", TeacherRouter);
    app.use("/api/session_details", SessionDetailsRouter);
    app.use("/api/grade", GradeRouter);
    app.use("/api/user_session_details", UserSessionDetailsRouter);

    app.use("/api/enrollment", EnrollmentRouter);
    app.use("/api/subscription", SubscriptionRouter);
};

module.exports = routes;
