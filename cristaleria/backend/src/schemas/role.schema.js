const joi = require('joi');

const name = joi.string();
const status = joi.boolean();

const create = joi.object({
    name: name.required(),
    status
});

// An id is required when you are updating an existing
const  update = joi.object({
    name,
    status
});

module.exports = {
    create,
    update
};