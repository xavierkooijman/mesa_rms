const catchAsync = require("../utils/catchAsync");
const refreshTokenModel = require("../models/refreshToken.models");
const signTokens = require("../utils/signTokens");
const tokenContext = require("../utils/tokenContext");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const argon2 = require("argon2");
const isProd = process.env.NODE_ENV === "production";

const handleRefreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies[isProd ? "__Host-refresh" : "refresh"];

  if (!refreshToken) {
    throw new AppError(
      "Session invalid or expired",
      ERROR_CODES.AUTH_UNAUTHORIZED,
      401
    );
  }

  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err) => {
    if (err) {
      throw new AppError(
        "Session invalid or expired",
        ERROR_CODES.AUTH_UNAUTHORIZED,
        403
      );
    }
  });

  const decodedToken = jwt.decode(refreshToken);

  const { token_hash, user_id } = await refreshTokenModel.getRefreshToken(
    decodedToken.tokenId
  );

  const tokenMatch = await argon2.verify(token_hash, refreshToken);

  if (!tokenMatch) {
    throw new AppError(
      "Session invalid or expired",
      ERROR_CODES.AUTH_UNAUTHORIZED,
      403
    );
  }

  if (decodedToken.sub != user_id) {
    throw new AppError(
      "Session invalid or expired",
      ERROR_CODES.AUTH_UNAUTHORIZED,
      403
    );
  }

  const { contextRaw, contextHash } = tokenContext();

  res.cookie(isProd ? "__Host-ctx" : "ctx", contextRaw, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
    sameSite: "Strict",
    path: "/",
    secure: isProd,
  });

  const accessToken = signTokens.signAccessToken(
    decodedToken.sub,
    decodedToken.role,
    contextHash
  );

  res.status(200).json({ accessToken });
});

module.exports = { handleRefreshToken };
