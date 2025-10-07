const catchAsync = require("../utils/catchAsync");
const reservationsModel = require("../models/reservations.models");
const tablesModel = require("../models/table.models");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");
const { ReservationStatus } = require("../constants/enums");

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
    message: "Reservation created sucessfully",
    data: reservation,
  });
});

const cancelReservation = catchAsync(async (req, res) => {
  const reservationId = req.params.id;
  const restaurantId = req.token.tenant.restaurantId;

  const reservation = await reservationsModel.checkIfReservationExistsById(
    restaurantId,
    reservationId
  );

  if (!reservation) {
    throw new AppError(
      "Reservation not found",
      ERROR_CODES.RESERVATION_NOT_FOUND,
      404
    );
  }

  const reservationStatus = await reservationsModel.changeReservationStatus({
    restaurantId,
    reservationId,
    statusId: ReservationStatus.CANCELLED,
  });

  res.status(200).json({
    message: "Reservation cancelled sucessfully",
    data: reservationStatus,
  });
});

const noShowReservation = catchAsync(async (req, res) => {
  const reservationId = req.params.id;
  const restaurantId = req.token.tenant.restaurantId;

  const reservation = await reservationsModel.checkIfReservationExistsById(
    restaurantId,
    reservationId
  );

  if (!reservation) {
    throw new AppError(
      "Reservation not found",
      ERROR_CODES.RESERVATION_NOT_FOUND,
      404
    );
  }

  const reservationStatus = await reservationsModel.changeReservationStatus({
    restaurantId,
    reservationId,
    statusId: ReservationStatus.NO_SHOW,
  });

  res.status(200).json({
    message: "Reservation marked as no show sucessfully",
    data: reservationStatus,
  });
});

const showReservation = catchAsync(async (req, res) => {
  const reservationId = req.params.id;
  const restaurantId = req.token.tenant.restaurantId;

  const reservation = await reservationsModel.checkIfReservationExistsById(
    restaurantId,
    reservationId
  );

  if (!reservation) {
    throw new AppError(
      "Reservation not found",
      ERROR_CODES.RESERVATION_NOT_FOUND,
      404
    );
  }

  const reservationStatus = await reservationsModel.changeReservationStatus({
    restaurantId,
    reservationId,
    statusId: ReservationStatus.SHOW,
  });

  res.status(200).json({
    message: "Reservation marked as show sucessfully",
    data: reservationStatus,
  });
});

module.exports = {
  createReservation,
  cancelReservation,
  noShowReservation,
  showReservation,
};
