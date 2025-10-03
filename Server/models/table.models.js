const db = require("../config/db");

const createTable = async (data) => {
  const {
    tableNumber,
    restaurantId,
    locationId,
    capacity,
    positionX,
    positionY,
    rotation,
    shapeId,
  } = data;

  const query = `INSERT INTO tables
    ( table_number, restaurant_id, location_id, capacity, position_x, position_y, rotation, shape_id)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, table_number, location_id, capacity, position_x, position_y, rotation, shape_id`;

  const values = [
    tableNumber,
    restaurantId,
    locationId,
    capacity,
    positionX,
    positionY,
    rotation,
    shapeId,
  ];

  await db.writePool.query("BEGIN");
  await db.writePool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);
  const { rows } = await db.writePool.query(query, values);
  await db.writePool.query("COMMIT");
  return rows[0];
};

const checkIfTableExists = async (restaurantId, tableNumber) => {
  const query =
    "SELECT id FROM tables WHERE restaurant_id = $1 AND table_number = $2";
  const values = [restaurantId, tableNumber];

  await db.readPool.query("BEGIN");
  await db.readPool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);
  const { rows } = await db.readPool.query(query, values);
  await db.readPool.query("COMMIT");
  return rows[0];
};

module.exports = {
  createTable,
  checkIfTableExists,
};
