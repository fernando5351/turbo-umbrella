'use strict';

const { ROLE_TABLE, RoleModel } = require('../models/role.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(ROLE_TABLE, RoleModel);
    //insert role
    await queryInterface.bulkInsert(ROLE_TABLE, [{
      name: 'admin',
      status: true,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP')
    }])
  },

  async down (queryInterface) {
    await queryInterface.dropTable(ROLE_TABLE);
  }
};
