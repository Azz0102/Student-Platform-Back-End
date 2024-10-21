// src/migrations/<seed_file>.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('news', [
            {
                userId: 3,
                name: 'School Starts on September 1st',
                content: 'The school year will officially begin on September 1st. Make sure to be prepared!',
                isGeneralSchoolNews: true,
                time: new Date('2024-09-01T08:00:00'), // Thời gian
                location: 'Main Auditorium', // Địa điểm
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 3,
                name: 'Math Olympiad Announcements',
                content: 'The Math Olympiad competition will be held on October 15th. Registration is open now.',
                isGeneralSchoolNews: false,
                time: new Date('2024-10-15T09:00:00'), // Thời gian
                location: 'Room 101', // Địa điểm
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 3,
                name: 'New Library Books Available',
                content: 'A new collection of science fiction books has arrived at the school library. Check them out!',
                isGeneralSchoolNews: false,
                time: null, // Thời gian (có thể để null)
                location: 'Library', // Địa điểm
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('news', null, {});
    }
};
