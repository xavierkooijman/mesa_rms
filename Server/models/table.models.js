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

const getAllTables = async (restaurantId) => {
  const query = `
    SELECT t.id, t.table_number, t.capacity, t.position_x, t.position_y, t.rotation,
            ts.shape_name, tl.table_location, tstatus.status
    FROM tables t
    JOIN table_shapes ts ON t.shape_id = ts.id
    JOIN table_locations tl ON t.location_id = tl.id
    JOIN table_status tstatus ON t.status_id = tstatus.id
    WHERE t.restaurant_id = $1
    ORDER BY t.table_number
  `;

  await db.readPool.query("BEGIN");
  await db.readPool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);
  const { rows } = await db.readPool.query(query, [restaurantId]);
  await db.readPool.query("COMMIT");
  return rows;
};

const getTablesByLocation = async (restaurantId, locationId) => {
  const query = `
    SELECT t.id, t.table_number, t.capacity, t.position_x, t.position_y, t.rotation,
            ts.shape_name, tl.table_location, tstatus.status
    FROM tables t
    JOIN table_shapes ts ON t.shape_id = ts.id
    JOIN table_locations tl ON t.location_id = tl.id
    JOIN table_status tstatus ON t.status_id = tstatus.id
    WHERE t.restaurant_id = $1 AND t.location_id = $2
    ORDER BY t.table_number
  `;
  const values = [restaurantId, locationId];

  await db.readPool.query("BEGIN");
  await db.readPool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);
  const { rows } = await db.readPool.query(query, values);
  await db.readPool.query("COMMIT");
  return rows;
};

const getTablesByStatus = async (restaurantId, statusId) => {
  const query = `
    SELECT t.id, t.table_number, t.capacity, t.position_x, t.position_y, t.rotation,
            ts.shape_name, tl.table_location, tstatus.status
    FROM tables t
    JOIN table_shapes ts ON t.shape_id = ts.id
    JOIN table_locations tl ON t.location_id = tl.id
    JOIN table_status tstatus ON t.status_id = tstatus.id
    WHERE t.restaurant_id = $1 AND t.status_id = $2
    ORDER BY t.table_number
  `;
  const values = [restaurantId, statusId];
  await db.readPool.query("BEGIN");
  await db.readPool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);
  const { rows } = await db.readPool.query(query, values);
  await db.readPool.query("COMMIT");
  return rows;
};

module.exports = {
  createTable,
  checkIfTableExists,
  getAllTables,
  getTablesByLocation,
  getTablesByStatus,
};
