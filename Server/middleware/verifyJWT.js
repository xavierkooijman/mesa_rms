const jwt = require("jsonwebtoken");
require("dotenv").config();
const ERROR_CODES = require("../utils/errorCodes");
const AppError = require("../utils/AppError");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return next(
      new AppError("Missing token", ERROR_CODES.AUTH_MISSING_TOKEN, 401)
    );
  }

  console.log(authHeader);
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, user) => {
    if (err) {
      return next(
        new AppError("Invalid token", ERROR_CODES.AUTH_INVALID_TOKEN, 403)
      );
    }

    req.user = user;
    next();
  });
};

module.exports = verifyJWT;
