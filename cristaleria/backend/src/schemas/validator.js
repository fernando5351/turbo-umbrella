const joi = require('joi');

const id = joi.number().integer();

module.exports = {
    params: joi.object({
        id: id.required()
            .description('The task identifier')
    }),
    query: joi.object().keys({
        sort: joi.string()
            .default('createdAt'),
        order: joi.string()
            .default('desc'),
        limit: joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(50),
        offset: joi.number()
            .integer()
            .min(1)
            .default(1)
    })
}