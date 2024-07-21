'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{
      roleId: 1, // Đảm bảo giá trị này tồn tại trong bảng 'roles'
      userName: 'admin',
      mobile: '123456',
      email: 'admin@gmail.com',
      passwordHash: 'hashed_password',
      lastLogin: new Date(),
      created_at: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
