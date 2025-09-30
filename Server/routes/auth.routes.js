const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");
const validate = require("../middleware/validator");
const userValidation = require("../validation/user.validation");
const refreshTokenController = require("../controllers/refreshToken.controllers");
const verifyToken = require("../middleware/verifyJWT");

router.post(
  "/login",
  validate(userValidation.loginSchema),
  authController.loginHandler
);
router.get("/refresh", refreshTokenController.handleRefreshToken);
router.post("/logout", authController.logoutHandler);
router.post(
  "/select-restaurant",
  verifyToken,
  authController.enterRestaurantDomain
);

module.exports = router;
