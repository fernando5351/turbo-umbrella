const sequelize = require('../../sequelize');
const { models } = require('../../sequelize');
const boom = require('@hapi/boom');

class ExitController {
    async create(exit) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            const newExit = await models.Exit.create(exit, {
                transaction: transaction
            });
            await transaction.commit();
            return newExit;
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
            order: sort ? [[sort, order || 'asc']] : [['exitDate', 'asc']],
            limit: limit || 50,
            offset: offset || 0
        };
        const exits = await models.Exit.findAll(option);
        if (exits.length < 1) {
            throw boom.badRequest('Resources not found');
        }
        return exits;
    }

    async getById(id) {
        const exit = await models.Exit.findByPk(id);
        if (!exit) {
            throw boom.notFound("Resource doesn't exist");
        }
        return exit;
    }

    async update(id, data) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            let exit = await this.getById(id);
            const exitUpdated = await exit.update(data, {
                transaction: transaction
            });
            await transaction.commit();
            return exitUpdated;
        } catch (error) {
            if (transaction) await transaction.rollback();
            return error;
        }
    }

    async delete(id) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            let exit = await this.getById(id);
            const exitDeleted = await exit.destroy({
                transaction: transaction
            });
            await transaction.commit();
            return exitDeleted;
        } catch (error) {
            if (transaction) await transaction.rollback();
            return error;
        }
    }

    async searchByProductName(productName) {
        const exits = await models.Exit.findAll({
            include: [{
                model: models.Product,
                where: { name: { [Op.iLike]: `%${productName}%` } }
            }]
        });
        if (exits.length < 1) {
            throw boom.notFound(`No exits found for product name: ${productName}`);
        }
        return exits;
    }

    async searchByDateRange(startDate, endDate) {
        const exits = await models.Exit.findAll({
            where: {
                exitDate: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
        if (exits.length < 1) {
            throw boom.notFound(`No exits found between ${startDate} and ${endDate}`);
        }
        return exits;
    }
}

module.exports = ExitController;
