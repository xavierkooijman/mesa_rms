const argon2 = require("argon2");
const catchAsync = require("../utils/catchAsync");
const usersModel = require("../models/users.models");
const refreshTokenModel = require("../models/refreshToken.models");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");

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
  //check if user with email and password exists

  const user = await usersModel.getUserByEmail(email);

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      401
    );
  }

  const password_match = await argon2.verify(user.password_hash, password);

  if (!password_match) {
    throw new AppError(
      "Invalid email or password",
      ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      401
    );
  }

  const accessToken = jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    process.env.ACCESS_JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

  const tokenId = crypto.randomUUID();

  const refreshToken = jwt.sign(
    { sub: user.id, tokenId: tokenId },
    process.env.REFRESH_JWT_SECRET,
    { expiresIn: "30d" }
  );

  const decodedToken = jwt.decode(refreshToken);
  const expires_at = new Date(decodedToken.exp * 1000);

  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await refreshTokenModel.saveRefreshToken({
    tokenId,
    hashedToken,
    userId: user.id,
    expires_at,
  });

  res.cookie("jwt", refreshToken, {
    htttpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 * 30,
  });

  res.status(200).json({ accessToken });
});

module.exports = { createUser, loginHandler };
