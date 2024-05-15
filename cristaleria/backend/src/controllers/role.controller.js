const sequelize = require('../../sequelize');
const { models } = require('../../sequelize');
const { Op } = require('sequelize');
const boom = require('@hapi/boom');

class RoleController {
    async create(role){
        let transaction;
        try {
            transaction = await sequelize.transaction();
            const newRole = await models.Role.create(role, {
                transaction: transaction
            });
            await transaction.commit();
            return newRole;
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

    async getAll(sort, order, limit, offset) {
        const option = {
            include: ['Permissions']
        };
    
        if (sort) {
            option.order = [[sort, order || 'asc']];
        } else {
            option.order = [['createdAt', 'asc']];
        }
    
        option.limit = limit || 50;
        option.offset = offset || 0;
    
        const roles = await models.Role.findAll(option);
    
        if (roles.length < 1) {
            throw boom.badRequest('Resources not found');
        }
    
        return roles;
    }

    async searchByName( name ) {
        const role = await models.Role.findAll({
            where:{
                name: {
                    [Op.iLike]: `%${name}%`
                }
            }
        });
        if (role.length < 1) {
            throw boom.notFound(`The resource ${name} does not exist`);
        }
        return role;
    }

    async getById(id) {
        const role = await models.Role.findByPk(id, {
            include: ['Permissions']
        });
        if (!role) {
            throw boom.notFound("Resource doesn't exist");
        }
        return role;
    }

    async update(id, data){
        let transaction;
        try {
            transaction = await sequelize.transaction();
            let role = await this.getById(id);
            const roleUpdated = await role.update(data, {
                transaction: transaction
            });
            transaction.commit();
            return roleUpdated;
        } catch (error) {
            if (transaction) await transaction.rollback();
            return error;
        }
    }

    async delete(id) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            let role = await this.getById(id);
            const roleDeleted = await role.destroy({
                transaction: transaction
            });
            transaction.commit();
            return roleDeleted;
        } catch (error) {
            if (transaction) await transaction.rollback();
            return error;
        }
    }
    
}

module.exports = RoleController;