const AppError = require("../utils/AppError");
const errorCodes = require("../utils/errorCodes");

const errorHandler = (error, req, res, next) => {
  if (error.isJoi) {
    return res.status(400).json({
      errorCode: errorCodes.VALIDATION_ERROR,
      message: "Invalid request data",
      details: error.details.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      errorCode: error.errorCode,
      message: error.message,
    });
  }

  return res.status(500).json({
    errorCode: errorCodes.INTERNAL_SERVER_ERROR,
    message: "Something went wrong",
  });
};

module.exports = errorHandler;
