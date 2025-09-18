const db = require("../config/db");
const argon2 = require("argon2");
const catchAsync = require("../utils/catchAsync");
const usersModel = require("../models/users.model");

const createUser = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password, roleId, statusId } = req.body;

  const hashedPassword = await argon2.hash(password);

  const user = usersModel.createUser({
    firstName,
    lastName,
    email,
    hashedPassword,
    roleId,
    statusId,
  });

  res.status(201).send({
    message: "User created successfully",
    data: user,
  });
});

module.exports = { createUser };
