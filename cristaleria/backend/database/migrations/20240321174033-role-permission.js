'use strict';

const { ROLE_PERMISSION_TABLE, RolePermissionModel } = require('../models/rolePermission.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(ROLE_PERMISSION_TABLE, RolePermissionModel);
    await queryInterface.bulkInsert(ROLE_PERMISSION_TABLE, 
    [ 
      {
        role_id: 1,
        access_name: 'role',
        can_create: true,
        get_by_id: true,
        can_read: true,
        can_update: true,
        can_delete: true,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      {
        role_id: 1,
        access_name: 'user',
        can_create: true,
        get_by_id: true,
        can_read: true,
        only_my_record: true,
        can_update: true,
        can_delete: true,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      {
        role_id: 1,
        access_name: 'permissions',
        can_create: true,
        get_by_id: true,
        can_read: true,
        can_update: true,
        can_delete: true,
        createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    ]
    )
  },

  async down (queryInterface) {
    await queryInterface.dropTable(ROLE_PERMISSION_TABLE);
  }
};
