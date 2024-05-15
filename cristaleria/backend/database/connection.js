const { database, isProduction, isTest } = require('../config');

let URL = '';
let developmentDB = `postgres://${database.user}:${database.password}@${database.host}:${database.port}/${database.name}`;
URL = isProduction ? database.URI: ( isTest? database.URI_TEST: developmentDB);

module.exports = {
    development: {
        dialect: 'postgres',
        url: URL
    },
    production: {
        dialect: 'postgres',
        url: URL,
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    },
    test: {
        dialect: 'postgres',
        url: URL,
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
};