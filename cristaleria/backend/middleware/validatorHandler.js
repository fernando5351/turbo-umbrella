const boom = require('@hapi/boom');

function validateSchema(schema, property) {
    return (req, res, next) => {
        const data = req[property];
        // data = 'params', 'body', 'query'
        const { error } = schema.validate(data, { abortEarly: false });
        if (error) {
            throw boom.badRequest(error);
        }
        next();
    }
}

module.exports = validateSchema;
