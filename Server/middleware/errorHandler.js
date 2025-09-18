const AppError = require("../utils/AppError");

const errorHandler = (error, req, res, next) => {
  console.log(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      type: "ValidationError",
      details: error.details,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      errorCode: error.errorCode,
      message: error.message,
    });
  }

  return res.status(500).json("Something went wrong");
};

module.exports = errorHandler;
