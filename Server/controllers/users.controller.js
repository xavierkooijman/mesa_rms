const db = require("../config/db");
const argon2 = require("argon2");
const catchAsync = require("../utils/catchAsync");
const usersModel = require("../models/users.model");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");

const createUser = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password, roleId, statusId } = req.body;

  const emailExists = await usersModel.findByEmail(email);
  console.log(emailExists);

  if (emailExists) {
    throw new AppError(
      "A user with this email already exists",
      ERROR_CODES.USER_EXISTS,
      400
    );
  }

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

module.exports = { createUser };
