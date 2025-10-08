const catchAsync = require("../utils/catchAsync");
const reservationsModel = require("../models/reservations.models");
const tablesModel = require("../models/table.models");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");
const { ReservationStatus } = require("../constants/enums");
const { canChangeReservationStatus } = require("../utils/canChangeStatus");
const reservationsServices = require("../services/reservations.services");
const tablesServices = require("../services/tables.services");

const createReservation = catchAsync(async (req, res) => {
  const { tableId, numberPeople, startTime, endTime, reservationName } =
    req.body;
  const restaurantId = req.token.tenant.restaurantId;

  const reservation = await reservationsServices.createReservation({
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

  const reservationStatus = await reservationsServices.cancelReservation(
    restaurantId,
    reservationId
  );

  res.status(200).json({
    message: "Reservation cancelled sucessfully",
    data: reservationStatus,
  });
});

const noShowReservation = catchAsync(async (req, res) => {
  const reservationId = req.params.id;
  const restaurantId = req.token.tenant.restaurantId;

  const reservation = await reservationsServices.checkIfReservationExistsById(
    restaurantId,
    reservationId
  );

  const noShowAllowed = canChangeReservationStatus(
    reservation.status_id,
    ReservationStatus.NO_SHOW
  );

  if (!noShowAllowed) {
    throw new AppError(
      "Reservation cannot be marked as no show",
      ERROR_CODES.RESERVATION_CANNOT_BE_MARKED_NO_SHOW,
      400
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

  await reservationsServices.checkIfReservationExistsById(
    restaurantId,
    reservationId
  );

  const showAllowed = canChangeReservationStatus(
    reservation.status_id,
    ReservationStatus.NO_SHOW
  );

  if (!showAllowed) {
    throw new AppError(
      "Reservation cannot be marked as show",
      ERROR_CODES.RESERVATION_CANNOT_BE_MARKED_SHOW,
      400
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
