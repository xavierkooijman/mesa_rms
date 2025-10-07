const enums = require("../constants/enums");

const canChangeReservationStatus = (currentStatusId, newStatusId) => {
  const statusFlow = {
    [enums.ReservationStatus.PENDING]: [
      enums.ReservationStatus.CANCELLED,
      enums.ReservationStatus.SHOW,
      enums.ReservationStatus.NO_SHOW,
    ],
    [enums.ReservationStatus.SHOW]: [],
    [enums.ReservationStatus.NO_SHOW]: [],
    [enums.ReservationStatus.CANCELLED]: [],
  };

  return statusFlow[currentStatusId].includes(newStatusId);
};

module.exports = { canChangeReservationStatus };
