const sequelize = require('../../sequelize');
const { models } = require('../../sequelize');
const speakeasy = require('speakeasy');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

// user controller
class UserController {
    async create(data){
        let transaction;
        try {
            //const password = await bcrypt.hash(data.password, 10);
            const otp = speakeasy.generateSecret({ length: 20 }).base32;
            const otpSecret = speakeasy.totp({
                secret: otp,
                encoding: 'base32'
            });
            const dto = {...data, otpSecret, status: false};
            transaction = await sequelize.transaction();
            let newUser = await models.User.create(dto, {
                transaction: transaction
            });
            await transaction.commit();
            delete newUser.password;
            return newUser;
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
            include: [
                {
                    model: models.Role,
                    as: 'Role',
                    include: [{
                        model: models.RolePermission,
                        as: 'Permissions'
                    }]
                }
            ],
            attributes: {  exclude: ['password', 'otpSecret'] },
        };
    
        if (sort) {
            option.order = [[sort, order || 'asc']];
        } else {
            option.order = [['createdAt', 'asc']];
        }
    
        option.limit = limit || 50;
        option.offset = offset || 0;
    
        const users = await models.User.findAll(option);
    
        if (users.length < 1) {
            throw boom.badRequest('Resources not found');
        }
    
        return users;
    }

    async getById(id) {
        const user = await models.User.findByPk(id, {
            include: [
                {
                    model: models.Role,
                    as: 'Role',
                    include: [{
                            model: models.RolePermission,
                            as: 'Permissions'
                        }]
                }
            ],
            attributes: { exclude: ['password', 'otpSecret'] }
        });
        if (!user) {
            throw boom.notFound("Resource doesn't exist");
        }
        return user;
    }

    async update(id, data){
        let transaction;
        try {
            transaction = await sequelize.transaction();
            let user = await this.getById(id);
            const userUpdated = await user.update(data, {
                transaction: transaction
            });
            transaction.commit();
            return userUpdated;
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

    async delete(id) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            let user = await this.getById(id);
            await user.destroy({
                transaction: transaction
            });
            transaction.commit();
            return `Resource with id:${id} deleted`;
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
    
}

module.exports = UserController;