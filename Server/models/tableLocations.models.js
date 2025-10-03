const db = require("../config/db");

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
    "SELECT id FROM table_locations WHERE restaurant_id = $1 AND name = $2";
  const values = [restaurantId, name];
  await db.readPool.query("BEGIN");
  await db.readPool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);
  const { rows } = await db.readPool.query(query, values);
  await db.readPool.query("COMMIT");
  return rows[0];
};

module.exports = {
  checkIfLocationExistsById,
  checkIfLocationExistsByName,
};
