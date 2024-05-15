const { v4: uuidv4 } = require('uuid');

function codeGenerator() {
    let codigo = uuidv4();
    codigo = codigo.substring(0, 4).toUpperCase();
    return codigo;
}

module.exports = codeGenerator;