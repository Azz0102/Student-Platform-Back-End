const { SuccessResponse } = require("../core/success.response");
const {
    listNotiByUser,
    updateNotiUser,
} = require("../services/notification.service");

const getListNoti = async (req, res, next) => {
    new SuccessResponse({
        message: "created amphitheater",
        metadata: await listNotiByUser({ userId: req.params.userId }),
    }).send(res);
};

const changeNotiUser = async (req, res, next) => {
    new SuccessResponse({
        message: "created amphitheater",
        metadata: await updateNotiUser(req.body),
    }).send(res);
};

module.exports = { getListNoti, changeNotiUser };
