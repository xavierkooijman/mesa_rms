const catchAsync = require("../utils/catchAsync");
const tableLocationModel = require("../models/tableLocations.models");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");

const createTableLocation = catchAsync(async (req, res) => {
  const { name } = req.body;
  const restaurantId = req.token.tenant.restaurantId;
  const locationExists = await tableLocationModel.checkIfLocationExistsByName(
    restaurantId,
    name
  );
  if (locationExists) {
    throw new AppError(
      "A table location with this name already exists",
      ERROR_CODES.LOCATION_EXISTS,
      409
    );
  }
  const location = await tableLocationModel.createLocation({
    name,
    restaurantId,
  });
  res.status(201).json({
    message: "Table location created successfully",
    data: location,
  });
});

module.exports = {
  createTableLocation,
};
