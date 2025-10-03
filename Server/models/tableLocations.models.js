const db = require("../config/db");

const createLocation = async (data) => {
  const { name, restaurantId } = data;
  const query =
    "INSERT INTO table_locations ( table_location, restaurant_id) VALUES($1, $2) RETURNING id, table_location";
  const values = [name, restaurantId];
  await db.writePool.query("BEGIN");
  await db.writePool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);
  const { rows } = await db.writePool.query(query, values);
  await db.writePool.query("COMMIT");
  return rows[0];
};

const checkIfLocationExistsById = async (restaurantId, locationId) => {
  const query =
    "SELECT id FROM table_locations WHERE restaurant_id = $1 AND id = $2";
  const values = [restaurantId, locationId];
  await db.readPool.query("BEGIN");
  await db.readPool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);
  const { rows } = await db.readPool.query(query, values);
  await db.readPool.query("COMMIT");
  return rows[0];
};

const checkIfLocationExistsByName = async (restaurantId, name) => {
  const query =
    "SELECT id FROM table_locations WHERE restaurant_id = $1 AND table_location = $2";
  const values = [restaurantId, name];
  await db.readPool.query("BEGIN");
  await db.readPool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);
  const { rows } = await db.readPool.query(query, values);
  await db.readPool.query("COMMIT");
  return rows[0];
};

const getLocationsByRestaurant = async (restaurantId) => {
  const query =
    "SELECT id, table_location FROM table_locations WHERE restaurant_id = $1 ORDER BY table_location";

  await db.readPool.query("BEGIN");
  await db.readPool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);
  const { rows } = await db.readPool.query(query, [restaurantId]);
  await db.readPool.query("COMMIT");
  return rows;
};

module.exports = {
  createLocation,
  checkIfLocationExistsById,
  checkIfLocationExistsByName,
  getLocationsByRestaurant,
};
