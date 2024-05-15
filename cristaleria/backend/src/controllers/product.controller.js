const sequelize = require('../../sequelize');
const { models } = require('../../sequelize');
const { Op } = require('sequelize');
const boom = require('@hapi/boom');

class ProductController {
    async create(product) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            const newProduct = await models.Product.create(product, {
                transaction: transaction
            });
            await transaction.commit();
            return newProduct;
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
            order: sort ? [[sort, order || 'asc']] : [['createdAt', 'asc']],
            limit: limit || 50,
            offset: offset || 0
        };
        const products = await models.Product.findAll(option);
        if (products.length < 1) {
            throw boom.badRequest('Resources not found');
        }
        return products;
    }

    async getById(id) {
        const product = await models.Product.findByPk(id);
        if (!product) {
            throw boom.notFound("Resource doesn't exist");
        }
        return product;
    }

    async update(id, data) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            let product = await this.getById(id);
            const productUpdated = await product.update(data, {
                transaction: transaction
            });
            await transaction.commit();
            return productUpdated;
        } catch (error) {
            if (transaction) await transaction.rollback();
            return error;
        }
    }

    async delete(id) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            let product = await this.getById(id);
            const productDeleted = await product.destroy({
                transaction: transaction
            });
            await transaction.commit();
            return productDeleted;
        } catch (error) {
            if (transaction) await transaction.rollback();
            return error;
        }
    }
}

module.exports = ProductController;
