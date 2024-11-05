// src/migrations/<seed_file>.js
"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("news", [
            {
                userId: 3,
                name: "School Starts on September 1st",
                content:
                    '<div><span style="font-size: 18px;">Quill Rich Text Editor</span></div><div><br></div><div>Quill is a free,<a href="https://github.com/quilljs/quill/">open source</a>WYSIWYG editor built for the modern web. With its<a href="http://quilljs.com/docs/modules/">extensible architecture</a>and a<a href="http://quilljs.com/docs/api/">expressive API</a>you can completely customize it to fulfill your needs. Some built in features include:</div><div><br></div><ul><li>Fast and lightweight</li><li>Semantic markup</li><li>Standardized HTML between browsers</li><li>Cross browser support including Chrome, Firefox, Safari, and IE 9+</li></ul><div><br></div><div><span style="font-size: 18px;">Downloads</span></div><div><br></div><ul><li><a href="https://quilljs.com">Quill.js</a>, the free, open source WYSIWYG editor</li><li><a href="https://zenoamaro.github.io/react-quill">React-quill</a>, a React component that wraps Quill.js</li></ul>',
                isGeneralSchoolNews: true,
                time: new Date("2024-09-01T08:00:00"), // Thời gian
                location: "Main Auditorium", // Địa điểm
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 3,
                name: "Math Olympiad Announcements",
                content:
                    '<div><span style="font-size: 18px;">Quill Rich Text Editor</span></div><div><br></div><div>Quill is a free,<a href="https://github.com/quilljs/quill/">open source</a>WYSIWYG editor built for the modern web. With its<a href="http://quilljs.com/docs/modules/">extensible architecture</a>and a<a href="http://quilljs.com/docs/api/">expressive API</a>you can completely customize it to fulfill your needs. Some built in features include:</div><div><br></div><ul><li>Fast and lightweight</li><li>Semantic markup</li><li>Standardized HTML between browsers</li><li>Cross browser support including Chrome, Firefox, Safari, and IE 9+</li></ul><div><br></div><div><span style="font-size: 18px;">Downloads</span></div><div><br></div><ul><li><a href="https://quilljs.com">Quill.js</a>, the free, open source WYSIWYG editor</li><li><a href="https://zenoamaro.github.io/react-quill">React-quill</a>, a React component that wraps Quill.js</li></ul>',
                isGeneralSchoolNews: false,
                time: new Date("2024-10-15T09:00:00"), // Thời gian
                location: "Room 101", // Địa điểm
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("news", null, {});
    },
};
