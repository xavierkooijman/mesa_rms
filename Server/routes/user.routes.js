const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const validate = require("../middleware/validator");
const userValidation = require("../validation/user.validation");

router.post(
  "/",
  validate(userValidation.signUpSchema),
  usersController.createUser
);

module.exports = router;
