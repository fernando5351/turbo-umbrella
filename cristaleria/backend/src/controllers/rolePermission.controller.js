const sequelize = require('../../sequelize');
const { models } = require('../../sequelize');
const boom = require('@hapi/boom');

class RolePermissionController {
    async create(data){
        let transaction;
        try {
            transaction = await sequelize.transaction();
            const newRolePermission = await models.RolePermission.create(data, {
                transaction: transaction
            });
            await transaction.commit();
            return newRolePermission;
        } catch (error) {
            if (transaction) await transaction.rollback();
            if (error.errors && error.errors.length > 0) {
                const errorMessage = error.errors[0].message;
                throw boom.badRequest(errorMessage);
            } else {
                throw boom.badRequest(error);
            }
        }
    }

    async getAll() {
        const option = {
            include: ['Role']
        };
    
        const rolePermissions = await models.RolePermission.findAll(option);
    
        if (rolePermissions.length < 1) {
            throw boom.badRequest('Resources not found');
        }
    
        return rolePermissions;
    }

    async getById(id) {
        const rolePermissions = await models.RolePermission.findByPk(id, {
            include: ['Role']
        });
        if (!rolePermissions) {
            throw boom.notFound("Resource doesn't exist");
        }
        return rolePermissions;
    }

    async update(id, data){
        let transaction;
        try {
            transaction = await sequelize.transaction();
            const rolePermission = await models.RolePermission.findByPk(id, {
                include: ['Role']
            });
            if(!rolePermission){
                const permissionCreated = await this.create(data, {transaction: transaction});
                transaction.commit();
                return permissionCreated;
            }
            const rolePermissionUpdated = await rolePermission.update(data, {
                transaction: transaction
            });
            transaction.commit();
            return rolePermissionUpdated;
        } catch (error) {
            if (transaction) await transaction.rollback();
            return ;
        }
    }

    async delete(id) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            let rolePermission = await this.getById(id);
            const rolePermissionDeleted = await rolePermission.destroy({
                transaction: transaction
            });
            transaction.commit();
            return rolePermissionDeleted;
        } catch (error) {
            if (transaction) await transaction.rollback();
            throw boom.badRequest(error);
        }
    }
    
}

module.exports = RolePermissionController;