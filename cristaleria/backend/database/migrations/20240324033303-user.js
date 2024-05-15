'use strict';

const { USERS_TABLE, UsersModel } = require('../models/user.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(USERS_TABLE, UsersModel);
    //insert user
    await queryInterface.bulkInsert(USERS_TABLE, [{
      password: '$2b$10$w7Y8Ulk9SwVSIogRdqEhUeQoBCNWlyoIjkPHqfiv/lV1LoxVWsrli', //Papaya@123
      email: 'isaacfernandofernandez5351@gmail.com',
      name: 'Isaac Fernando',
      lastname: 'Fernandez Bailon',
      roleId: 1,
      otpSecret: null,
      status: true,
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP')
    }])
  },

  async down (queryInterface) {
    await queryInterface.dropTable(USERS_TABLE);
  }
};
