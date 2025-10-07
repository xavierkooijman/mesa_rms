const ReservationStatus = {
  PENDING: 1,
  NO_SHOW: 2,
  SHOW: 3,
  CANCELLED: 4,
};

const TableStatus = {
  AVAILABLE: 1,
  OCCUPIED: 2,
};

const OrderItemStatus = {
  PENDING: 1,
  COMPLETED: 2,
  CANCELLED: 3,
  REFUNDED: 4,
};

const CourseStatus = {
  PENDING: 1,
  ACTIVE: 2,
  COMPLETED: 3,
};

const TakeawayStatus = {
  PENDING: 1,
  PREPARING: 2,
  READY: 3,
  COMPLETED: 4,
};

const DiningSessionStatus = {
  ACTIVE: 1,
  CLOSED: 2,
  BILLED: 3,
};

module.exports = {
  ReservationStatus,
  TableStatus,
  OrderItemStatus,
  CourseStatus,
  TakeawayStatus,
  DiningSessionStatus,
};
