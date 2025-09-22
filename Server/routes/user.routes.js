const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controllers");
const validate = require("../middleware/validator");
const userValidation = require("../validation/user.validation");
const refreshTokenController = require("../controllers/refreshToken.controllers");

router.post(
  "/",
  validate(userValidation.signUpSchema),
  usersController.createUser
);
router.post(
  "/login",
  validate(userValidation.loginSchema),
  usersController.loginHandler
);
router.get("/refresh", refreshTokenController.handleRefreshToken);
router.get("/logout", usersController.logoutHandler);

module.exports = router;
