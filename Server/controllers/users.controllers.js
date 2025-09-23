const argon2 = require("argon2");
const catchAsync = require("../utils/catchAsync");
const usersModel = require("../models/users.models");
const refreshTokenModel = require("../models/refreshToken.models");
const tokenContext = require("../utils/tokenContext");
const signTokens = require("../utils/signTokens");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");
const isProd = process.env.NODE_ENV === "production";

const createUser = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password, roleId, statusId } = req.body;

  //check if email is already in use
  const emailExists = await usersModel.checkIfEmailExists(email);

  if (emailExists) {
    throw new AppError(
      "A user with this email already exists",
      ERROR_CODES.USER_EXISTS,
      409
    );
  }

  //create verification code

  //send email with verification code

  //check if inserted verification code matches

  //create user
  const hashedPassword = await argon2.hash(password);

  const user = await usersModel.createUser({
    firstName,
    lastName,
    email,
    hashedPassword,
    roleId,
    statusId,
  });

  res.status(201).json({
    message: "User created successfully",
    data: user,
  });
});

const loginHandler = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await usersModel.getUserByEmail(email);
  const password_match = await argon2.verify(user.password_hash, password);

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      401
    );
  }

  if (!password_match) {
    throw new AppError(
      "Invalid email or password",
      ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      401
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
    user.id,
    user.role_id,
    contextHash
  );

  const tokenId = crypto.randomUUID();

  const refreshToken = signTokens.signRefreshToken(user.id, tokenId);

  const decodedToken = jwt.decode(refreshToken);
  const expires_at = new Date(decodedToken.exp * 1000);

  const hashedToken = await argon2.hash(refreshToken);

  await refreshTokenModel.saveRefreshToken({
    tokenId,
    hashedToken,
    userId: user.id,
    expires_at,
  });

  res.cookie(isProd ? "__Host-refresh" : "refresh", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 * 30,
    sameSite: "Strict",
    path: "/",
    secure: isProd,
  });

  res.status(200).json({ accessToken });
});

const logoutHandler = catchAsync(async (req, res) => {
  // delete accessToken in the client side

  // delete refreshToken and context cookies
  const refreshToken = req.cookies[isProd ? "__Host-refresh" : "refresh"];

  res.clearCookie(isProd ? "__Host-ctx" : "ctx", {
    httpOnly: true,
    sameSite: "Strict",
    path: "/",
    secure: isProd,
  });

  res.clearCookie(isProd ? "__Host-refresh" : "refresh", {
    httpOnly: true,
    sameSite: "Strict",
    path: "/",
    secure: isProd,
  });

  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err) => {
    if (err) {
      return res.sendStatus(204);
    }
  });

  // delete refreshToken from the db
  decoded = jwt.decode(refreshToken);
  await refreshTokenModel.deleteRefreshToken(decoded.tokenId);
  res.sendStatus(204);
});

module.exports = { createUser, loginHandler, logoutHandler };
