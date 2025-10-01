const db = require("../config/db");

const createMenuItem = async (data) => {
  const { restaurantId, name, price } = data;
  const query =
    "INSERT INTO menu_items(restaurant_id, item_name, price) VALUES($1, $2, $3)";

  values = [restaurantId, name, price];

  await db.writePool.query("BEGIN");
  await db.writePool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);
  const { rows } = await db.writePool.query(query, values);
  await db.writePool.query("COMMIT");
  return rows[0];
};

const checkIfMenuItemExists = async (restaurantId, name) => {
  const query =
    "SELECT id FROM menu_items WHERE restaurant_id = $1 AND item_name = $2";

  values = [restaurantId, name];

  await db.readPool.query("BEGIN");
  await db.readPool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);

  const { rows } = await db.readPool.query(query, values);
  await db.readPool.query("COMMIT");
  return rows[0];
};

module.exports = { createMenuItem, checkIfMenuItemExists };
