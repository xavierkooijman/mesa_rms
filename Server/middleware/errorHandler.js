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

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      errorCode: errorCodes.INVALID_JSON_PAYLOAD,
      message: "Invalid JSON payload! Check if your body data is valid JSON.",
    });
  }

  if (error.code) {
    console.error("Postgres error:", {
      code: error.code,
      message: error.message,
      detail: error.detail,
      hint: error.hint,
      stack: error.stack,
    });
  }

  console.error("Unexpected error:", error);

  return res.status(500).json({
    errorCode: errorCodes.INTERNAL_SERVER_ERROR,
    message: "Something went wrong",
  });
};

module.exports = errorHandler;
