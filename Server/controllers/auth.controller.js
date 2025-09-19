const argon2 = require("argon2");
const catchAsync = require("../utils/catchAsync");
const usersModel = require("../models/users.model");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");

const createUser = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password, roleId, statusId } = req.body;

  //check if email is already in use
  const emailExists = await usersModel.findByEmail(email);

  if (emailExists) {
    throw new AppError(
      "A user with this email already exists",
      ERROR_CODES.USER_EXISTS,
      400
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

const login = catchAsync(async (req, res) => {
  //check if user with email and password exists
  //create access token and refresh token
});

module.exports = { createUser };
