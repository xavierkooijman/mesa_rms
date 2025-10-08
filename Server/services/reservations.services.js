const reservationsModel = require("../models/reservations.models");
const tablesServices = require("./tables.services");
const AppError = require("../utils/AppError");
const ERROR_CODES = require("../utils/errorCodes");
const { ReservationStatus } = require("../constants/enums");
const { canChangeReservationStatus } = require("../utils/canChangeStatus");

const createReservation = async (data) => {
  await tablesServices.checkIfTableExistsById(data.restaurantId, data.tableId);

  const reservation = await reservationsModel.createReservation(data);
  return reservation;
};

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

const cancelReservation = async (restaurantId, reservationId) => {
  const reservation = await checkIfReservationExistsById(
    restaurantId,
    reservationId
  );

  const cancelAllowed = canChangeReservationStatus(
    reservation.status_id,
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

module.exports = {
  createReservation,
  checkIfReservationExistsById,
  cancelReservation,
};
