const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Determine status code
    const statusCode = err.statusCode || 500;

    // Format the error response
    const errorResponse = {
        error: true,
        message: err.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString()
    };

    // Add stack trace in development mode
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    // Send response
    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;