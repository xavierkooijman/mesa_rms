const catchAsync = require("../utils/catchAsync");
const restaurantsModel = require("../models/restaurants.models");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");
const errorCodes = require("../utils/errorCodes");

const createRestaurant = catchAsync(async (req, res) => {
  const { name } = req.body;
  const ownerId = req.token.sub;

  const restaurantExists = await restaurantsModel.checkIfRestaurantExists(
    name,
    ownerId
  );

  if (restaurantExists) {
    throw new AppError(
      "A restaurant with this name already exists",
      errorCodes.RESTAURANT_EXISTS,
      409
    );
  }
  console.log(ownerId);

  const restaurant = await restaurantsModel.createRestaurant(name, ownerId);

  res.status(201).json({
    message: "Restaurant created successfully",
    data: restaurant,
  });
});

const updateRestaurantName = catchAsync(async (req, res) => {
  const { ownerId } = req.params;
  const { name } = req.body;

  const restaurantExists = await restaurantsModel.checkIfRestaurantExists(
    name,
    ownerId
  );

  if (restaurantExists) {
    throw new AppError(
      "A restaurant with this name already exists",
      errorCodes.RESTAURANT_EXISTS,
      409
    );
  }

  const newName = await restaurantsModel.updateRestaurantName(name, ownerId);

  res.status(200).json({
    message: "Restaurant name updated successfully",
    data: newName,
  });
});

module.exports = { createRestaurant, updateRestaurantName };
