class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Copy error object (name is not always copied over naturally)
    let error = { ...err, message: err.message, name: err.name, code: err.code };

    // Handle Mongoose Validation Error
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(el => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        error = new AppError(message, 400);
    }

    // Handle Mongoose duplicate key error (e.g., unique email)
    if (error.code === 11000) {
        const value = error.message.match(/(["'])(\\?.)*?\1/)[0];
        const message = `Duplicate field value: ${value}. Please use another value!`;
        error = new AppError(message, 400);
    }

    // Handle Mongoose cast error (e.g., invalid ObjectId)
    if (error.name === 'CastError') {
        const message = `Invalid ${error.path}: ${error.value}.`;
        error = new AppError(message, 400);
    }

    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            error: error.message
        });
    } else {
        // Log unexpected error to console down for debugging
        console.error('ERROR 💥', err);
        // Send generic message to client to hide sensitive error logs
        res.status(500).json({
            status: 'error',
            error: 'Something went very wrong!'
        });
    }
};

module.exports = { AppError, errorHandler };
