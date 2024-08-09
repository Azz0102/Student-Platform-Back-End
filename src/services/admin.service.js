"use strict";

const { BadRequestError } = require("../core/error.response");
const GeneticAlgorithm = require("../helpers/schedulingAlgorithm");

const schedulingClassSession = async () => {
    try {
        const schedule = GeneticAlgorithm.run();

        return schedule;
    } catch (error) {
        throw new BadRequestError("Failed to schedule class session");
    }
};

module.exports = {
    schedulingClassSession,
};
