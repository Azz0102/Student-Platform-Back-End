const { jwtDecode } = require("jwt-decode");
const { SuccessResponse } = require("../core/success.response");
const fs = require('fs');
const path = require('path');
const {
    createSessionDetail,
    listSessionDetails,
    deleteSessionDetail,
    updateSessionDetail,
    createMultipleSessionDetails,
    getAllUserSessionDetails,
    getSessionDetailsById,
    getUserClassSessionDetails,
    allSessionDetails,
    downSessionDetails,
} = require("../services/sessionDetails.service");

const newSessionDetail = async (req, res, next) => {
    new SuccessResponse({
        message: "Created session detail",
        metadata: await createSessionDetail(req.body),
    }).send(res);
};

const sessionDetailList = async (req, res, next) => {
    const perPage = parseInt(req.query.perPage) || 10
    new SuccessResponse({
        message: "Get session detail list",
        metadata: await listSessionDetails({
            classSession: req.query.classSession,
            filters: req.query.filters || "[]",
            sort: req.query.sort || "[]",
            limit: perPage,
            offset: parseInt(req.query.page) > 0 ? (parseInt(req.query.page) - 1) * perPage : 0,
        }),
    }).send(res);
};

const sessionDetailDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "Deleted session detail",
        metadata: await deleteSessionDetail(req.body),
    }).send(res);
};

const sessionDetailUpdate = async (req, res, next) => {
    new SuccessResponse({
        message: "Updated session detail",
        metadata: await updateSessionDetail(req.body),
    }).send(res);
};

const newMultipleSessionDetails = async (req, res, next) => {
    new SuccessResponse({
        message: "Created multiple session details",
        metadata: await createMultipleSessionDetails(req.body),
    }).send(res);
};

const getUserSessionDetails = async (req, res, next) => {
    new SuccessResponse({
        message: "Get all user session detail",
        metadata: await getAllUserSessionDetails(req.body),
    }).send(res);
};

const getSessionDetailsByUserId = async (req, res, next) => {
    new SuccessResponse({
        message: "Get all user session detail",
        metadata: await getSessionDetailsById({ id: req.params.id }),
    }).send(res);
};

const getUserClassSessionDetail = async (req, res, next) => {

    const refreshToken = req.headers['refreshtoken'];
    console.log('refreshToken', refreshToken);

    const { userId } = jwtDecode(refreshToken);
    console.log('userId', userId);

    new SuccessResponse({
        message: "Get all user session detail",
        metadata: await getUserClassSessionDetails({ userId, classSessionId: req.params.id }),
    }).send(res);
};

const allSessionDetail = async (req, res, next) => {
    console.log('req.params.semester', req.params.semester)
    new SuccessResponse({
        message: "Get all user session detail",
        metadata: await allSessionDetails({ semester: Number(req.params.semester) }),
    }).send(res);
};

const downSessionDetail = async (req, res, next) => {
    try {
        // Dữ liệu cần lưu (giả lập từ `const result`)
        const result = await downSessionDetails({ semester: Number(req.params.semester) })

        // Chuyển đổi dữ liệu thành chuỗi CSV
        const convertToCSV = (data) => {
            if (data.length === 0) return '';
            const headers = Object.keys(data[0]).join(',');
            const rows = data.map(row => Object.values(row).join(','));
            return [headers, ...rows].join('\n');
        };

        const csvContent = convertToCSV(result);

        // Lưu CSV vào một file tạm thời
        const tempFilePath = path.join(__dirname, 'temp.csv');
        fs.writeFileSync(tempFilePath, csvContent, 'utf8');
        // Gửi file CSV để tải xuống
        res.setHeader('Content-Disposition', 'attachment; filename="class_sessions.csv"');
        res.setHeader('Content-Type', 'text/csv');
        return res.sendFile(tempFilePath, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                return res.status(500).send("Error generating CSV file");
            } else {
                // Xóa file tạm sau khi gửi xong
                fs.unlinkSync(tempFilePath);
            }
        });
    } catch (error) {
        console.error("Error generating CSV file:", error);
        return res.status(500).send("Internal server error");
    }
};

module.exports = {
    newSessionDetail,
    sessionDetailList,
    sessionDetailDelete,
    sessionDetailUpdate,
    newMultipleSessionDetails,
    getUserSessionDetails,
    getSessionDetailsByUserId,
    getUserClassSessionDetail,
    allSessionDetail,
    downSessionDetail
};
