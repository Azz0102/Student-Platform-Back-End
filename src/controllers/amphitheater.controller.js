const { SuccessResponse } = require("../core/success.response");
const {
    createAmphitheater,
    listAmphitheaters,
    deleteAmphitheater,
    updateAmphitheater,
    createMultipleAmphitheaters,
} = require("../services/amphitheater.service");

const newAmphitheater = async (req, res, next) => {
    new SuccessResponse({
        message: "created amphitheater",
        metadata: await createAmphitheater(req.body),
    }).send(res);
};

const amphitheaterList = async (req, res, next) => {
    new SuccessResponse({
        message: "get amphitheater list",
        metadata: await listAmphitheaters(),
    }).send(res);
};

const amphitheaterDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "deleted amphitheater",
        metadata: await deleteAmphitheater({ amphitheaterId: req.params.id }),
    }).send(res);
};

const amphitheaterUpdate = async (req, res, next) => {
    new SuccessResponse({
        message: "updated amphitheater",
        metadata: await updateAmphitheater({
            amphitheaterId: req.params.id,
            ...req.body,
        }),
    }).send(res);
};

const newMultipleAmphitheaters = async (req, res, next) => {
    new SuccessResponse({
        message: "created multiple amphitheaters",
        metadata: await createMultipleAmphitheaters(req.body),
    }).send(res);
};

module.exports = {
    newAmphitheater,
    amphitheaterList,
    amphitheaterDelete,
    amphitheaterUpdate,
    newMultipleAmphitheaters, // Xuất khẩu hàm tạo hàng loạt
};
