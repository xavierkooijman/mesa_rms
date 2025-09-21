const catchAsync = require("../utils/catchAsync");
const refreshTokenModel = require("../models/refreshToken.models");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const handleRefreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    new AppError("Missing token", ERROR_CODES.AUTH_MISSING_TOKEN, 401);
  }

  const decodedToken = jwt.decode(refreshToken);

  const { tokenHash, userId } = await refreshTokenModel.getRefreshToken(
    decodedToken.tokenId
  );

  const tokenMatch = await argon2.verify(tokenHash, refreshToken);

  if (!tokenMatch) {
    new AppError("Invalid token", ERROR_CODES.AUTH_INVALID_TOKEN, 403);
  }

  if (decodedToken.sub != userId) {
    new AppError("Invalid token", ERROR_CODES.AUTH_UNAUTHORIZED, 403);
  }
});

module.exports = { handleRefreshToken };
