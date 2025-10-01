const express = require("express");
const router = express.Router();
const menuItemsController = require("../controllers/menuItems.controllers");
const menuItemsValidation = require("../validation/menuItem.validation");
const validate = require("../middleware/validator");
const verifyToken = require("../middleware/verifyJWT");

router.post(
  "/",
  verifyToken,
  validate(menuItemsValidation.createMenuItemSchema),
  menuItemsController.createMenuItem
);

module.exports = router;
