"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const teachers = [
            "Prof. Smith",
            "Prof. White",
            "Prof. Moore",
            "Prof. Green",
            "Prof. Thompson",
            "Prof. Thomas",
            "Prof. Martin",
            "Prof. Perez",
            "Prof. Clark",
            "Prof. Robinson",
            "Prof. Hall",
            "Prof. Young",
            "Prof. Wright",
            "Prof. Adams",
            "Prof. Gonzalez",
            "Prof. Carter",
            "Prof. Turner",
            "Prof. Johnson",
            "Prof. Miller",
            "Prof. Brown",
            "Prof. Taylor",
            "Prof. Wilson",
            "Prof. Anderson",
            "Prof. Jackson",
            "Prof. Lee",
            "Prof. Harris",
            "Prof. Lewis",
            "Prof. Martinez",
            "Prof. Evans",
            "Prof. Roberts",
            "Prof. Rogers",
            "Prof. Gray",
            "Prof. Hughes",
            "Prof. Coleman",
            "Prof. Perry",
            "Prof. Morgan",
            "Prof. Murphy",
            "Prof. Powell",
            "Prof. Walker",
            "Prof. Allen",
            "Prof. King",
            "Prof. Scott",
            "Prof. Baker",
            "Prof. Nelson",
            "Prof. Mitchell",
            "Prof. Phillips",
            "Prof. Davis",
            "Prof. Garcia",
            "Prof. Lopez",
            "Prof. Rodriguez",
            "Prof. Parker",
            "Prof. Collins",
            "Prof. Ramirez",
            "Prof. James",
            "Prof. Jenkins",
            "Prof. Bailey",
            "Prof. Reed",
            "Prof. Bell",
            "Prof. Cooper"
        ];

        const teacherData = teachers.map((name, index) => ({
            name,
            email: `${name.replace(/\s+/g, '.').toLowerCase()}@university.edu`,
            dateOfBirth: new Date(`1980-${(index % 12) + 1}-15`),
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        await queryInterface.bulkInsert("teachers", teacherData);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("teachers", null, {});
    },
};
