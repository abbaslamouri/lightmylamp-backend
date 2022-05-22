"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const sendError = (res, returnError) => {
    if (process.env.NODE_ENV !== 'development') {
        res.status(returnError.statusCode).json(returnError);
    }
    else {
        if (!returnError.errors.length)
            returnError.errors.push({
                path: '',
                value: '',
                message: 'Something went terribly wrong',
            });
        res.status(returnError.statusCode).json({
            status: returnError.status,
            errors: returnError.errors,
        });
    }
};
const errorHandler = (err, req, res, next) => {
    console.log(colors_1.default.red.bold(`ERROR, ${err}`));
    const returnError = {
        status: 'error',
        statusCode: err.statusCode ? err.statusCode : 500,
        errors: [],
        err,
    };
    if (err.custom) {
        returnError.errors.push({
            path: '',
            value: '',
            message: err.message,
        });
    }
    else {
        // Mongodb errors
        returnError.statusCode = 400;
        if (err.name === 'ValidationError') {
            if (err.errors) {
                for (const prop in err.errors) {
                    returnError.errors.push({
                        path: err.errors[prop].path,
                        value: err.errors[prop].value,
                        message: err.errors[prop].message,
                    });
                }
            }
        }
        if (err.code === 11000) {
            if (err.keyValue) {
                returnError.errors.push({
                    path: Object.keys(err.keyValue)[0],
                    value: Object.values(err.keyValue)[0],
                    message: `The specified ${Object.keys(err.keyValue)[0]} is already associated with an account.`,
                });
            }
        }
        // if (err.name && err.name === 'CastError') {
        //   if(err.path && err.value
        //   error = new AppError(`Invalid ${err.path}: ${err.value}`, 400, 'castError')
        // } else if (err.name === 'ValidationError') {
        //   let errorStr =''
        //   if (err.errors) errorStr= Object.values(err.errors).map((item) => item.message)
        //   error = new AppError(errorStr, 400, 'validationError')
        // } else if (err.name === 'JsonWebTokenError') {
        //   error = new AppError(`Invalid token`, 401, 'jsonWebTokenError')
        // } else if (err.name === 'TokenExpiredError') {
        //   error = new AppError(`Your token has expired. please login`, 401, 'tokenExpiredError')
        // } else error = err
    }
    sendError(res, returnError);
};
exports.default = errorHandler;
