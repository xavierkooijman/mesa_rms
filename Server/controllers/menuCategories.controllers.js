const catchAsync = require("../utils/catchAsync");
const menuCategoryModel = require("../models/menuCategories.models");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");

const createMenuCategory = catchAsync(async (req, res) => {
  const { name } = req.body;
  const restaurantId = req.token.tenant.restaurantId;

  const menuCategoryExists = await menuCategoryModel.checkIfMenuCategoryExists(
    restaurantId,
    name
  );

  if (menuCategoryExists) {
    throw new AppError(
      "A menu category with this name already exists",
      ERROR_CODES.MENU_ITEM_EXISTS,
      409
    );
  }

  const menuCategory = await menuCategoryModel.createMenuCategory({
    restaurantId,
    name,
  });

  res.status(201).json({
    message: "Menu category created successfully",
    data: menuCategory,
  });
});

module.exports = { createMenuCategory };
