const db = require("../config/db");
const argon2 = require("argon2");
const catchAsync = require("../utils/catchAsync");

const createUser = catchAsync(async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  const hashedPassword = await argon2.hash(password);

  res.status(200).send({
    message: `User ${firstName}, hashedPassword: ${hashedPassword}`,
  });
});

module.exports = { createUser };
