const jwt = require("jsonwebtoken");
require("dotenv").config();
const ERROR_CODES = require("../utils/errorCodes");
const AppError = require("../utils/AppError");
const isProd = process.env.NODE_ENV === "production";
const crypto = require("crypto");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return next(
      new AppError(
        "Session invalid or expired",
        ERROR_CODES.AUTH_UNAUTHORIZED,
        401
      )
    );
  }

  console.log(authHeader);
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(
        new AppError(
          "Session invalid or expired",
          ERROR_CODES.AUTH_UNAUTHORIZED,
          403
        )
      );
    }

    const contextRaw = req.cookies[isProd ? "__Host-ctx" : "ctx"];

    if (!contextRaw) {
      return next(
        new AppError(
          "Session invalid or expired",
          ERROR_CODES.AUTH_UNAUTHORIZED,
          403
        )
      );
    }

    const computedHash = crypto
      .createHash("sha256")
      .update(contextRaw)
      .digest("base64url");

    const tokenHash = decoded.ctx;

    if (
      !tokenHash ||
      !crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(tokenHash))
    ) {
      return next(
        new AppError(
          "Session invalid or expired",
          ERROR_CODES.AUTH_UNAUTHORIZED,
          403
        )
      );
    }

    req.token = decoded;
    next();
  });
};

module.exports = verifyJWT;
