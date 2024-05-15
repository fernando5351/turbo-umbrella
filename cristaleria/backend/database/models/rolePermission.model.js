const { Model, DataTypes, Sequelize } = require('sequelize');
const { ROLE_TABLE } = require('./role.model');

const ROLE_PERMISSION_TABLE = 'role_permissions'
// model
const RolePermissionModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'role_id',
        references: {
            model: ROLE_TABLE,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    accessName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'access_name'
    },
    canCreate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'can_create'
    },
    getById: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'get_by_id'
    },
    onlyMyRecord: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'only_my_record'
    },
    canRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'can_read'
    },
    canUpdate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'can_update'
    },
    canDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'can_delete'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        onUpdate: Sequelize.NOW
    }
}

class RolePermissions extends Model {
    static associate(models) {
        this.belongsTo(models.Role, { 
            foreignKey: 'role_id',
            as: 'Role'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            modelName: 'RolePermission',
            tableName: ROLE_PERMISSION_TABLE,
            timestamps: true,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        }
    }
}

module.exports = {
    ROLE_PERMISSION_TABLE,
    RolePermissionModel,
    RolePermissions
}
