const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validator");
const userValidation = require("../validation/user.validation");

router.post(
  "/",
  validate(userValidation.signUpSchema),
  authController.createUser
);
router.post(
  "/login",
  validate(userValidation.loginSchema),
  authController.login
);

module.exports = router;
