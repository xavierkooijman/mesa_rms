const catchAsync = require("../utils/catchAsync");
const menuItemModel = require("../models/menuItem.models");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");

const createMenuItem = catchAsync(async (req, res) => {
  const { name, price, categoryId } = req.body;
  const restaurantId = req.token.tenant.restaurantId;

  const menuItemExists = await menuItemModel.checkIfMenuItemExists(
    restaurantId,
    name
  );

  if (menuItemExists) {
    throw new AppError(
      "A menu item with this name already exists",
      ERROR_CODES.MENU_ITEM_EXISTS,
      409
    );
  }

  const categoryExists = await menuItemModel.checkIfCategoryExists(
    restaurantId,
    categoryId
  );

  if (categoryId && !categoryExists) {
    throw new AppError(
      "The specified category does not exist",
      ERROR_CODES.CATEGORY_NOT_FOUND,
      404
    );
  }

  const menuItem = await menuItemModel.createMenuItem({
    restaurantId,
    name,
    price,
    categoryId,
  });

  res.status(201).json({
    message: "Menu item created successfully",
    data: menuItem,
  });
});

module.exports = { createMenuItem };
