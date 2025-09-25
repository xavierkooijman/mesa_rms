const db = require("../config/db");

const createRestaurant = async (name, ownerId) => {
  await db.writePool.query("BEGIN");
  await db.writePool.query(`SET LOCAL app.jwt_ownerId = ${ownerId}`);

  const { rows } = await db.writePool.query(
    `INSERT INTO mesa_app.restaurants (restaurant_name, owner_id)
       VALUES ($1, $2)
       RETURNING restaurant_name, owner_id`,
    [name, ownerId]
  );

  await db.writePool.query("COMMIT");
  return rows[0];
};

const checkIfRestaurantExists = async (name, ownerId) => {
  const query =
    "SELECT id FROM restaurants WHERE restaurant_name = $1 AND owner_id = $2";

  const values = [name, ownerId];
  await db.readPool.query(`SET app.jwt_ownerId = ${ownerId}`);
  const { rows } = await db.readPool.query(query, values);
  return rows[0];
};

const updateRestaurantName = async (data) => {
  const { name, restaurantId } = data;

  const query = "UDPATE restaurants SET restaurant_name = $1 WHERE id = $2";

  const values = [name, restaurantId];

  const { rows } = await db.writePool.query(query, values);
  return rows[0];
};

const getOwnerRestaurantCount = async (ownerId) => {
  const query =
    "SELECT COUNT(owner_id) FROM restaurants WHERE owner_id = $1 AND deleted_at IS NULL";

  await db.readPool.query("BEGIN");
  await db.readPool.query(`SET LOCAL app.jwt_ownerId = ${ownerId}`);

  const { rows } = await db.readPool.query(query, [ownerId]);
  await db.readPool.query("COMMIT");
  return rows[0];
};

module.exports = {
  createRestaurant,
  checkIfRestaurantExists,
  updateRestaurantName,
  getOwnerRestaurantCount,
};
