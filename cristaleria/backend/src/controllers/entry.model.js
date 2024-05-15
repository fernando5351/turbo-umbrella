const sequelize = require('../../sequelize');
const { models } = require('../../sequelize');
const boom = require('@hapi/boom');

class EntryController {
    async create(entry) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            const newEntry = await models.Entry.create(entry, {
                transaction: transaction
            });
            await transaction.commit();
            return newEntry;
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
            order: sort ? [[sort, order || 'asc']] : [['entryDate', 'asc']],
            limit: limit || 50,
            offset: offset || 0
        };
        const entries = await models.Entry.findAll(option);
        if (entries.length < 1) {
            throw boom.badRequest('Resources not found');
        }
        return entries;
    }

    async getById(id) {
        const entry = await models.Entry.findByPk(id);
        if (!entry) {
            throw boom.notFound("Resource doesn't exist");
        }
        return entry;
    }

    async update(id, data) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            let entry = await this.getById(id);
            const entryUpdated = await entry.update(data, {
                transaction: transaction
            });
            await transaction.commit();
            return entryUpdated;
        } catch(error) {
            if (transaction) await transaction.rollback();
            if (error.errors && error.errors.length > 0) {
                const errorMessage = error.errors[0].message;
                throw boom.badRequest(errorMessage);
            } else {
                throw boom.badRequest(error);
            }
        }
    }
    
    async searchByProductName(productName) {
        const entries = await models.Entry.findAll({
            include: [{
                model: models.Product,
                where: { name: { [Op.iLike]: `%${productName}%` } }
            }]
        });
        if (entries.length < 1) {
            throw boom.notFound(`No entries found for product name: ${productName}`);
        }
        return entries;
    }

    async searchByDateRange(startDate, endDate) {
        const entries = await models.Entry.findAll({
            where: {
                entryDate: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
        if (entries.length < 1) {
            throw boom.notFound(`No entries found between ${startDate} and ${endDate}`);
        }
        return entries;
    }
}

module.exports = EntryController;
