const joi = require('joi');

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
//acepta @, $, !, %, *, ? y &.

const password = joi.string()
  .min(4)
  .message('Debe tener letras mayusculas,minusculas, numeros y caracteres especiales como @, $, !, %, *, ? y &')
  .required();
const oldPassword = joi.string();

const email = joi.string().email().required();

const login = joi.object({
    email,
    password
});

const mail = joi.object({
    password,
    oldPassword
});

const changePassword =  joi.object({
    oldPassword,
    password: password.regex(passwordPattern),
    repeatNewPassword : password.regex(passwordPattern)
});

const  updatePassword = joi.object({
   password: password.regex(passwordPattern)
});

const recovery = joi.object({
    email: email.email()
})

module.exports = {
    login,
    changePassword,
    mail,
    updatePassword,
    recovery
}