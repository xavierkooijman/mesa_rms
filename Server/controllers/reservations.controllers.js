const catchAsync = require("../utils/catchAsync");
const reservationsModel = require("../models/reservations.models");
const tablesModel = require("../models/table.models");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");
const { ReservationStatus } = require("../constants/enums");
const { canChangeReservationStatus } = require("../utils/canChangeStatus");
const reservationsServices = require("../services/reservations.services");

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

  const reservationStatus = await reservationsServices.noShowReservation(
    restaurantId,
    reservationId
  );

  res.status(200).json({
    message: "Reservation marked as no show sucessfully",
    data: reservationStatus,
  });
});

const showReservation = catchAsync(async (req, res) => {
  const reservationId = req.params.id;
  const restaurantId = req.token.tenant.restaurantId;

  const reservationStatus = await reservationsServices.showReservation(
    restaurantId,
    reservationId
  );

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
