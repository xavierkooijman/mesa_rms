const reservationsModel = require("../models/reservations.models");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");
const { ReservationStatus } = require("../constants/enums");
const { canChangeReservationStatus } = require("../utils/canChangeStatus");

const checkIfReservationExistsById = async (restaurantId, reservationId) => {
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

  return reservation;
};

const cancelReservation = async (
  restaurantId,
  reservationId,
  currentStatusId
) => {
  const cancelAllowed = canChangeReservationStatus(
    currentStatusId,
    ReservationStatus.CANCELLED
  );

  if (!cancelAllowed) {
    throw new AppError(
      "Reservation cannot be cancelled",
      ERROR_CODES.RESERVATION_CANNOT_BE_CANCELLED,
      400
    );
  }

  const reservationStatus = await reservationsModel.changeReservationStatus({
    restaurantId,
    reservationId,
    statusId: ReservationStatus.CANCELLED,
  });

  return reservationStatus;
};

module.exports = { checkIfReservationExistsById, cancelReservation };
