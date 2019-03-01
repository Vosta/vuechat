var sendError = function (res, status, message, next) {
    const error = new Error(message);
    res.status(status);
    next(error);
}

module.exports = sendError;