const { SuccessResponse } = require("../core/success.response");
const { createTag, listTags, deleteTag } = require("../services/tag.service");

const newTag = async (req, res, next) => {
    new SuccessResponse({
        message: "created tag",
        metadata: await createTag(req.body),
    }).send(res);
};
const tagList = async (req, res, next) => {
    new SuccessResponse({
        message: "get tag list",
        metadata: await listTags({ userId: req.params.id }),
    }).send(res);
};
const tagDelete = async (req, res, next) => {
    new SuccessResponse({
        message: "deleted tag",
        metadata: await deleteTag({ tagId: req.params.id }),
    }).send(res);
};

module.exports = {
    newTag,
    tagList,
    tagDelete,
};
