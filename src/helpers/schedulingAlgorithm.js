"use strict";

const db = require("../models");

class GeneticAlgorithm {
    constructor(
        classSessions,
        classrooms,
        sessionDetail,
        populationSize,
        generations,
        mutationRate
    ) {
        this.classSessions = classSessions;
        this.classrooms = classrooms;
        this.sessionDetail = sessionDetail;
        this.populationSize = populationSize;
        this.generations = generations;
        this.mutationRate = mutationRate;
        this.population = [];
    }

    // Load data from the database
    async loadData() {
        this.classSessions = await db.ClassSession.findAll();
        this.classrooms = await db.Classroom.findAll();
        this.sessionDetails = await db.SessionDetail.findAll();
    }

    // Create a random schedule considering session details
    createRandomSchedule() {
        const schedule = [];

        this.classSessions.forEach((session) => {
            for (let i = 0; i < session.numOfSessionAWeek; i++) {
                const availableClassrooms = this.classrooms.filter(
                    (c) => c.capacity >= session.capacity
                );
                const randomClassroom =
                    availableClassrooms[
                        Math.floor(Math.random() * availableClassrooms.length)
                    ];

                if (randomClassroom) {
                    const dayOfWeek = this.getRandomDayOfWeek();
                    const startTime = this.getRandomStartTime();

                    // Check for the 3-hour gap rule and other conflicts using sessionDetails
                    const conflictingSessions = this.sessionDetails.filter(
                        (s) =>
                            s.classSessionId === session.id &&
                            s.dayOfWeek === dayOfWeek &&
                            Math.abs(
                                new Date(
                                    `1970-01-01T${s.startTime}:00Z`
                                ).getTime() -
                                    new Date(
                                        `1970-01-01T${startTime}:00Z`
                                    ).getTime()
                            ) < 10800000
                    );

                    // Check for overlapping sessions in the same classroom
                    const overlappingSessions = schedule.filter(
                        (s) =>
                            s.classroomId === randomClassroom.id &&
                            s.dayOfWeek === dayOfWeek &&
                            this.checkTimeOverlap(
                                s.startTime,
                                s.numOfHour,
                                startTime,
                                session.numOfHour
                            )
                    );

                    if (
                        conflictingSessions.length === 0 &&
                        overlappingSessions.length === 0
                    ) {
                        schedule.push({
                            classSessionId: session.id,
                            classroomId: randomClassroom.id,
                            dayOfWeek,
                            startTime,
                            numOfHour: session.numOfHour,
                        });
                    } else {
                        i--; // Retry for this session if it conflicts
                    }
                }
            }
        });

        return schedule;
    }

    // Random day of the week generator
    getRandomDayOfWeek() {
        const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        return days[Math.floor(Math.random() * days.length)];
    }

    // Random start time generator (7am to 7pm)
    getRandomStartTime() {
        const startHour = 7 + Math.floor(Math.random() * 12);
        const minutes = Math.random() < 0.5 ? "00" : "30";
        return `${startHour}:${minutes}`;
    }

    // Check if two time periods overlap
    checkTimeOverlap(start1, duration1, start2, duration2) {
        const end1 = this.addHours(start1, duration1);
        const end2 = this.addHours(start2, duration2);

        return start1 < end2 && end1 > start2;
    }

    // Utility to add hours to a time string
    addHours(time, hours) {
        const [hour, minute] = time.split(":").map(Number);
        const date = new Date(1970, 0, 1, hour, minute);
        date.setHours(date.getHours() + hours);
        return date.toTimeString().split(" ")[0];
    }

    // Fitness function evaluates the quality of a schedule
    fitness(schedule) {
        let score = 0;

        schedule.forEach((session) => {
            // Check if session capacity fits the classroom
            const classroom = this.classrooms.find(
                (c) => c.id === session.classroomId
            );
            if (classroom && classroom.capacity >= session.capacity) {
                score++;
            }

            // Ensure sessions are at least 3 hours apart
            const sameDaySessions = schedule.filter(
                (s) =>
                    s.dayOfWeek === session.dayOfWeek &&
                    s.classSessionId === session.classSessionId
            );
            sameDaySessions.forEach((otherSession) => {
                if (session !== otherSession) {
                    const timeDifference = Math.abs(
                        new Date(
                            `1970-01-01T${session.startTime}:00Z`
                        ).getTime() -
                            new Date(
                                `1970-01-01T${otherSession.startTime}:00Z`
                            ).getTime()
                    );
                    if (timeDifference >= 10800000) {
                        // 3 hours in milliseconds
                        score++;
                    }
                }
            });
        });

        return score;
    }

    // Run the genetic algorithm
    async run() {
        await this.loadData(); // Load data from the database
        this.initializePopulation();
        for (let gen = 0; gen < this.generations; gen++) {
            this.evolve();
        }

        // Output the best schedule found
        const bestSchedule = this.population.reduce((best, schedule) => {
            return this.fitness(schedule) > this.fitness(best)
                ? schedule
                : best;
        }, this.population[0]);

        return bestSchedule;
    }

    // Initialize the population with random schedules
    initializePopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            this.population.push(this.createRandomSchedule());
        }
    }

    // Evolve the population through selection, crossover, and mutation
    evolve() {
        const newPopulation = [];

        // Selection
        const selected = this.selection();

        // Crossover
        for (let i = 0; i < this.populationSize; i += 2) {
            const parent1 = selected[i];
            const parent2 = selected[i + 1];
            const [child1, child2] = this.crossover(parent1, parent2);
            newPopulation.push(this.mutate(child1));
            newPopulation.push(this.mutate(child2));
        }

        this.population = newPopulation;
    }

    // Selection process
    selection() {
        // Simple tournament selection
        const selected = [];
        for (let i = 0; i < this.populationSize; i++) {
            const individual1 =
                this.population[
                    Math.floor(Math.random() * this.populationSize)
                ];
            const individual2 =
                this.population[
                    Math.floor(Math.random() * this.populationSize)
                ];
            selected.push(
                this.fitness(individual1) > this.fitness(individual2)
                    ? individual1
                    : individual2
            );
        }
        return selected;
    }

    // Crossover two parents to create two children
    crossover(parent1, parent2) {
        const cutPoint = Math.floor(Math.random() * parent1.length);
        const child1 = parent1
            .slice(0, cutPoint)
            .concat(parent2.slice(cutPoint));
        const child2 = parent2
            .slice(0, cutPoint)
            .concat(parent1.slice(cutPoint));
        return [child1, child2];
    }

    // Mutate a schedule with a given mutation rate
    mutate(schedule) {
        if (Math.random() < this.mutationRate) {
            const randomIndex = Math.floor(Math.random() * schedule.length);
            schedule[randomIndex] = this.createRandomSchedule()[0];
        }
        return schedule;
    }
}

module.exports = new GeneticAlgorithm([], [], [], 100, 200, 0.05);
