"use strict";

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
    "7pm",
    "8pm",
];

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
class Session {
    constructor(detail, classroom, teacher) {
        this.detail = detail;
        this.classroom = classroom;
        this.teacher = teacher;
        this.startSlot = null; // This will represent the starting time slot
    }
}
module.exports = class Scheduler {
    constructor(
        sessionDetails,
        classrooms,
        constantSessionsFixedTimeLocation,
        constantSessionsFixedLocation,
        constantSessionsFixedTime,
        noConflictingClassSessions
    ) {
        this.sessions = sessionDetails.map(
            (s) => new Session(s.detail, s.classroom, s.teacher)
        );
        this.classrooms = classrooms;
        this.constantSessionsFixedTimeLocation =
            constantSessionsFixedTimeLocation.map(
                (s) => new Session(s.detail, s.classroom, s.teacher)
            );
        this.constantSessionsFixedLocation = constantSessionsFixedLocation.map(
            (s) => new Session(s.detail, s.classroom, s.teacher)
        );
        this.constantSessionsFixedTime = constantSessionsFixedTime.map(
            (s) => new Session(s.detail, s.classroom, s.teacher)
        );
        this.noConflictingClassSessions = noConflictingClassSessions;
        this.graph = {};
        this.timeSlots = times;
        this.daysOfWeek = days;
        this.schedule = this.initializeSchedule();
        this.unscheduledSessions = [];
    }

    initializeSchedule() {
        const schedule = {};
        for (let day of this.daysOfWeek) {
            schedule[day] = {};
            for (let slot of this.timeSlots) {
                schedule[day][slot] = {};
                for (let classroom of this.classrooms) {
                    schedule[day][slot][classroom.name] = null;
                }
            }
        }
        return schedule;
    }

    buildGraph() {
        const allSessions = [
            ...this.sessions,
            ...this.constantSessionsFixedLocation,
            ...this.constantSessionsFixedTime,
        ];
        for (let session of allSessions) {
            this.graph[session.detail.classSessionName] = [];
        }
        for (let i = 0; i < allSessions.length; i++) {
            for (let j = i + 1; j < allSessions.length; j++) {
                if (this.areConflicting(allSessions[i], allSessions[j])) {
                    this.graph[allSessions[i].detail.classSessionName].push(
                        allSessions[j].detail.classSessionName
                    );
                    this.graph[allSessions[j].detail.classSessionName].push(
                        allSessions[i].detail.classSessionName
                    );
                }
            }
        }
    }

    areConflicting(session1, session2) {
        // Check if sessions are in the same no-conflict group
        for (let group of this.noConflictingClassSessions) {
            if (
                group.includes(session1.detail.classSessionName) &&
                group.includes(session2.detail.classSessionName)
            ) {
                return true;
            }
        }
        // Check if sessions have the same teacher
        return session1.teacher.name === session2.teacher.name;
    }

    colorGraph() {
        const allSessions = [
            ...this.sessions,
            ...this.constantSessionsFixedLocation,
            ...this.constantSessionsFixedTime,
        ];
        allSessions.sort(
            (a, b) =>
                this.graph[b.detail.classSessionName].length -
                this.graph[a.detail.classSessionName].length
        );

        for (let session of allSessions) {
            if (session.detail.startTime) {
                session.startSlot = this.timeSlots.indexOf(
                    session.detail.startTime
                );
            } else {
                let availableSlot = this.findAvailableSlot(session);
                if (availableSlot !== -1) {
                    session.startSlot = availableSlot;
                }
            }
        }
    }

    findAvailableSlot(session) {
        for (let day of this.daysOfWeek) {
            for (
                let i = 0;
                i < this.timeSlots.length - session.detail.numOfHour + 1;
                i++
            ) {
                if (
                    this.isSlotAvailable(session, day, i) &&
                    this.endsBeforeOrAt8PM(i, session.detail.numOfHour)
                ) {
                    return i;
                }
            }
        }
        return -1;
    }

    endsBeforeOrAt8PM(startSlot, duration) {
        return startSlot + duration <= this.timeSlots.indexOf("8pm");
    }

    isSlotAvailable(session, day, startSlot) {
        // Check if the required number of consecutive slots are available
        for (let i = 0; i < session.detail.numOfHour; i++) {
            if (startSlot + i >= this.timeSlots.length) return false;

            const currentSlot = this.timeSlots[startSlot + i];

            // Check if any conflicting session is scheduled in this slot
            for (let conflictingSessionName of this.graph[
                session.detail.classSessionName
            ]) {
                const conflictingSession =
                    this.sessions.find(
                        (s) =>
                            s.detail.classSessionName === conflictingSessionName
                    ) ||
                    this.constantSessionsFixedLocation.find(
                        (s) =>
                            s.detail.classSessionName === conflictingSessionName
                    ) ||
                    this.constantSessionsFixedTime.find(
                        (s) =>
                            s.detail.classSessionName === conflictingSessionName
                    );

                if (
                    conflictingSession &&
                    conflictingSession.detail.dayOfWeek === day
                ) {
                    const conflictStart = this.timeSlots.indexOf(
                        conflictingSession.detail.startTime
                    );
                    const conflictEnd =
                        conflictStart + conflictingSession.detail.numOfHour;
                    if (
                        startSlot + i >= conflictStart &&
                        startSlot + i < conflictEnd
                    ) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    assignClassrooms() {
        const allSessions = [
            ...this.sessions,
            ...this.constantSessionsFixedLocation,
            ...this.constantSessionsFixedTime,
        ];
        for (let session of allSessions) {
            if (session.classroom) continue;

            let scheduled = false;
            for (let day of this.daysOfWeek) {
                const availableClassroom = this.findAvailableClassroom(
                    session,
                    day
                );
                if (availableClassroom) {
                    session.classroom = availableClassroom;
                    session.detail.dayOfWeek = day;
                    this.scheduleSession(session, day);
                    scheduled = true;
                    break;
                }
            }
            if (!scheduled) {
                this.unscheduledSessions.push(session);
            }
        }
    }

    findAvailableClassroom(session, day) {
        return this.classrooms.find(
            (classroom) =>
                classroom.type === session.detail.sessionType &&
                classroom.capacity >= session.detail.capacity &&
                this.isClassroomAvailable(classroom, session, day)
        );
    }

    isClassroomAvailable(classroom, session, day) {
        for (let i = 0; i < session.detail.numOfHour; i++) {
            const slot = this.timeSlots[session.startSlot + i];
            if (this.schedule[day][slot][classroom.name] !== null) {
                return false;
            }
        }
        return true;
    }

    scheduleSession(session, day) {
        for (let i = 0; i < session.detail.numOfHour; i++) {
            const slot = this.timeSlots[session.startSlot + i];
            this.schedule[day][slot][session.classroom.name] = session;
        }
    }

    generateSchedule() {
        this.buildGraph();
        this.colorGraph();
        this.assignClassrooms();

        // Schedule constant sessions with fixed time and location
        for (let session of this.constantSessionsFixedTimeLocation) {
            if (
                this.endsBeforeOrAt8PM(
                    this.timeSlots.indexOf(session.detail.startTime),
                    session.detail.numOfHour
                )
            ) {
                this.scheduleSession(session, session.detail.dayOfWeek);
            } else {
                this.unscheduledSessions.push(session);
            }
        }

        return {
            schedule: this.schedule,
            unscheduledSessions: this.unscheduledSessions,
        };
    }
};
