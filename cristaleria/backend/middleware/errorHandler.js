const { ValidationError } = require('sequelize');

function logErrors(err, req, res, next) {
    console.error('Error:', err);
    next(err);
}

function errorHandler(err, req, res, next) {
    res.status(500).json({
        message: err.message,
        stack: err.stack,
    });
}

function ormErrorHandler(err, req, res, next) {
    if(err instanceof ValidationError) {
        res.status(409).json({
            statusCode: 409,
            message: err.name,
            errors: err.errors
        });
    } else {
        next(err);
    }
}


function boomErrorHandler(err, req, res, next) {
    if (err.isBoom) {
        const { output } = err;
        res.status(output.statusCode).json(output.payload);
    }
    next(err);
}

module.exports = {
    logErrors,
    ormErrorHandler,
    errorHandler,
    boomErrorHandler
}