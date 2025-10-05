const catchAsync = require("../utils/catchAsync");
const reservationsModel = require("../models/reservations.models");
const tablesModel = require("../models/table.models");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");

const createReservation = catchAsync(async (req, res) => {
  const { tableId, numberPeople, startTime, endTime, reservationName } =
    req.body;
  const restaurantId = req.token.tenant.restaurantId;

  const tableExists = await tablesModel.checkIfTableExistsById(
    restaurantId,
    tableId
  );

  if (!tableExists) {
    throw new AppError(
      "Table does not exist in this restaurant",
      ERROR_CODES.TABLE_NOT_FOUND,
      404
    );
  }
  const reservation = await reservationsModel.createReservation({
    restaurantId,
    tableId,
    numberPeople,
    startTime,
    endTime,
    reservationName,
  });
  res.status(201).json({
    status: "Reservation created sucessfully",
    data: reservation,
  });
});

module.exports = { createReservation };
