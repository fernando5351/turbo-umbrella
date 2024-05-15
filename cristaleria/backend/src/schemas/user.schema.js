const joi = require('joi');

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
//acepta @, $, !, %, *, ? y &.

const password = joi.string()
  .regex(passwordPattern)
  .min(8)
  .message('Debe tener letras mayusculas,minusculas, numeros y caracteres especiales como @, $, !, %, *, ? y &')
  .required();
const email = joi.string().email().required();
const name = joi.string().max(50);
const lastname = joi.string().max(50);
const status = joi.boolean();
const roleId = joi.number().integer();

const create = joi.object({
    email,
    name: name.required(),
    lastname: lastname.required(),
    roleId: roleId.required(),
    status: status.required()
});

const update = joi.object({
    name,
    lastname,
    roleId,
    status
});

module.exports = {
    create,
    update
};
