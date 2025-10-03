const catchAsync = require("../utils/catchAsync");
const tableModel = require("../models/table.models");
const tableLocationModel = require("../models/tableLocations.models");
const tableShapeModel = require("../models/tableShapes.models");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");

const createTable = catchAsync(async (req, res) => {
  const {
    tableNumber,
    locationId,
    capacity,
    positionX,
    positionY,
    rotation,
    shapeId,
  } = req.body;
  const restaurantId = req.token.tenant.restaurantId;

  const tableExists = await tableModel.checkIfTableExists(
    restaurantId,
    tableNumber
  );
  if (tableExists) {
    throw new AppError(
      "A table with this number already exists",
      ERROR_CODES.TABLE_EXISTS,
      409
    );
  }

  const locationExists = await tableLocationModel.checkIfLocationExistsById(
    restaurantId,
    locationId
  );
  if (!locationExists) {
    throw new AppError(
      "The specified table location does not exist",
      ERROR_CODES.LOCATION_NOT_FOUND,
      404
    );
  }

  const shapeExists = await tableShapeModel.checkIfShapeExistsById(shapeId);
  if (!shapeExists) {
    throw new AppError(
      "The specified table shape does not exist",
      ERROR_CODES.SHAPE_NOT_FOUND,
      404
    );
  }

  const table = await tableModel.createTable({
    tableNumber,
    restaurantId,
    locationId,
    capacity,
    positionX,
    positionY,
    rotation,
    shapeId,
  });

  res.status(201).json({
    message: "Table created successfully",
    data: table,
  });
});

module.exports = { createTable };
