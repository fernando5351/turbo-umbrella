const { Sequelize } = require('sequelize');
const { database, isProduction, isTest } = require('../config');
const modelsHandler = require('../database/models');

let URL = '';
let developmentDB = `postgres://${database.user}:${database.password}@${database.host}:${database.port}/${database.name}`;
URL = isProduction ? database.URI: ( isTest? database.URI_TEST: developmentDB);

let options = {
    dialect: 'postgres',
    logging: isProduction? false : console.log,
}

if (isProduction || isTest) {
    options.ssl = true;
    options.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
}

const  sequelize = new Sequelize(URL, options);

modelsHandler(sequelize);

module.exports = sequelize;