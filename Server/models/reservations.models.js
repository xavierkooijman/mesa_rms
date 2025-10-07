const db = require("../config/db");

const createReservation = async (data) => {
  const {
    restaurantId,
    tableId,
    numberPeople,
    startTime,
    endTime = null,
    reservationName,
  } = data;
  const query =
    "INSERT INTO reservations(restaurant_id, table_id, number_people, start_time, end_time, reservation_name) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, table_id, number_people, start_time, end_time, reservation_name";

  const values = [
    restaurantId,
    tableId,
    numberPeople,
    startTime,
    endTime,
    reservationName,
  ];

  await db.writePool.query("BEGIN");
  await db.writePool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);
  const { rows } = await db.writePool.query(query, values);
  await db.writePool.query("COMMIT");
  return rows[0];
};

const checkIfReservationExistsById = async (restaurantId, reservationId) => {
  const query = "SELECT id FROM reservations WHERE restaurant_id=$1 AND id=$2";
  const values = [restaurantId, reservationId];

  await db.readPool.query("BEGIN");
  await db.readPool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);
  const { rows } = await db.readPool.query(query, values);
  await db.readPool.query("COMMIT");
  return rows[0];
};

const changeReservationStatus = async (data) => {
  const { restaurantId, reservationId, statusId } = data;
  const query =
    "UPDATE reservations r SET status_id=$1 FROM reservation_status rs WHERE r.id=$2 AND rs.id=$1 RETURNING rs.status";
  const values = [statusId, reservationId];

  await db.writePool.query("BEGIN");
  await db.writePool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);
  const { rows } = await db.writePool.query(query, values);
  await db.writePool.query("COMMIT");
  return rows[0];
};

module.exports = {
  createReservation,
  changeReservationStatus,
  checkIfReservationExistsById,
};
