"use strict";

module.exports = class GeneticAlgorithm {
    constructor(
        sessionDetails,
        classrooms,
        teachers,
        constantSessionsFixedTimeLocation,
        constantSessionsFixedLocation,
        constantSessionsFixedTime,
        noConflictingClassSessions,
        populationSize,
        generations,
        mutationRate
    ) {
        this.sessionDetails = sessionDetails;
        this.classrooms = classrooms;
        this.teachers = teachers;
        this.constantSessionsFixedTimeLocation =
            constantSessionsFixedTimeLocation;
        this.constantSessionsFixedLocation = constantSessionsFixedLocation;
        this.constantSessionsFixedTime = constantSessionsFixedTime;
        this.noConflictingClassSessions = noConflictingClassSessions;
        this.populationSize = populationSize;
        this.generations = generations;
        this.mutationRate = mutationRate;
    }

    createRandomSchedule() {
        const schedule = [];
        for (const session of this.sessionDetails) {
            const classroom = this.classrooms.find(
                (c) => c.type === session.detail.sessionType
            );
            const teacher = this.teachers.find(
                (t) => t.name === session.teacher.name
            );
            const startTime = this.getRandomTime();
            const dayOfWeek = this.getRandomDayOfWeek();
            const newSession = {
                detail: {
                    ...session.detail,
                    startTime,
                    dayOfWeek,
                },
                classroom,
                teacher,
            };
            schedule.push(newSession);
        }
        return schedule;
    }

    getRandomTime() {
        const times = [
            "7am",
            "8am",
            "9am",
            "10am",
            "11am",
            "12pm",
            "1pm",
            "2pm",
            "3pm",
            "4pm",
            "5pm",
            "6pm",
        ];
        return times[Math.floor(Math.random() * times.length)];
    }

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

    checkConflicts(schedule) {
        const conflicts = [];

        // Check for conflicts with constant sessions
        for (const session of this.constantSessionsFixedTimeLocation) {
            const conflictingSessions = schedule.filter(
                (s) =>
                    s.detail.classSessionName ===
                        session.detail.classSessionName &&
                    s.detail.startTime === session.detail.startTime &&
                    s.detail.dayOfWeek === session.detail.dayOfWeek &&
                    s.classroom.name !== session.classroom.name
            );
            if (conflictingSessions.length > 0) {
                conflicts.push(
                    `Fixed time and location conflict for ${session.detail.classSessionName}`
                );
            }
        }

        for (const session of this.constantSessionsFixedLocation) {
            const conflictingSessions = schedule.filter(
                (s) =>
                    s.detail.classSessionName ===
                        session.detail.classSessionName &&
                    s.classroom.name !== session.classroom.name
            );
            if (conflictingSessions.length > 0) {
                conflicts.push(
                    `Fixed location conflict for ${session.detail.classSessionName}`
                );
            }
        }

        for (const session of this.constantSessionsFixedTime) {
            const conflictingSessions = schedule.filter(
                (s) =>
                    s.detail.classSessionName ===
                        session.detail.classSessionName &&
                    s.detail.startTime === session.detail.startTime &&
                    s.detail.dayOfWeek !== session.detail.dayOfWeek
            );
            if (conflictingSessions.length > 0) {
                conflicts.push(
                    `Fixed time conflict for ${session.detail.classSessionName}`
                );
            }
        }

        // Check for conflicts between sessions
        for (const session of schedule) {
            const overlap = schedule.filter(
                (s) =>
                    s !== session &&
                    s.detail.dayOfWeek === session.detail.dayOfWeek &&
                    s.detail.startTime === session.detail.startTime &&
                    s.classroom.name === session.classroom.name
            );
            if (overlap.length > 0) {
                conflicts.push(
                    `Classroom overlap for ${session.detail.classSessionName}`
                );
            }

            const teacherOverlap = schedule.filter(
                (s) =>
                    s !== session &&
                    s.detail.dayOfWeek === session.detail.dayOfWeek &&
                    s.detail.startTime === session.detail.startTime &&
                    s.teacher.name === session.teacher.name
            );
            if (teacherOverlap.length > 0) {
                conflicts.push(
                    `Teacher overlap for ${session.detail.classSessionName}`
                );
            }
        }

        return conflicts;
    }

    schedule() {
        let population = Array.from({ length: this.populationSize }, () =>
            this.createRandomSchedule()
        );
        let bestSchedule = null;
        let bestScore = Infinity;

        for (let generation = 0; generation < this.generations; generation++) {
            for (const individual of population) {
                const conflicts = this.checkConflicts(individual);
                const score = conflicts.length;
                if (score < bestScore) {
                    bestScore = score;
                    bestSchedule = individual;
                }
            }

            if (bestScore === 0) {
                break; // Found a valid schedule
            }

            population = this.evolve(population);
        }

        if (bestScore > 0) {
            return {
                error: "Cannot find a valid schedule",
                details: this.checkConflicts(bestSchedule),
            };
        }

        return { schedule: bestSchedule };
    }

    evolve(population) {
        // Simple evolution strategy: randomly mutate existing schedules
        return population.map((individual) => {
            if (Math.random() < this.mutationRate) {
                return this.createRandomSchedule();
            }
            return individual;
        });
    }
};
