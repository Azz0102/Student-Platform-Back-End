"use strict";

const GeneticAlgorithm = require("../helpers/schedulingAlgorithm");

const schedulingClassSession = async () => {
    try {
        const schedule = GeneticAlgorithm.run();

        return schedule;
    } catch (error) {
        throw new Error("Failed to schedule class session");
    }
};

module.exports = {
    schedulingClassSession,
};
