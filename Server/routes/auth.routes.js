const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");
const validate = require("../middleware/validator");
const userValidation = require("../validation/user.validation");
const refreshTokenController = require("../controllers/refreshToken.controllers");

router.post(
  "/login",
  validate(userValidation.loginSchema),
  authController.loginHandler
);
router.get("/refresh", refreshTokenController.handleRefreshToken);
router.post("/logout", authController.logoutHandler);

module.exports = router;
