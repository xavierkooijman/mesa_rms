const express = require("express");
const router = express.Router();
const menuCategoryController = require("../controllers/menuCategories.controllers");
const menuCategoryValidation = require("../validation/menuCategory.validation");
const validate = require("../middleware/validator");
const verifyToken = require("../middleware/verifyJWT");

router.post(
  "/",
  verifyToken,
  validate(menuCategoryValidation.createMenuCategorySchema),
  menuCategoryController.createMenuCategory
);

module.exports = router;
