const db = require("../config/db");

const createMenuItem = async (data) => {
  const { restaurantId, name, price } = data;
  const query =
    "INSERT INTO menu_items(restaurant_id, item_name, price) VALUES($1, $2, $3)";

  values = [restaurantId, name, price];
  const { rows } = await db.writePool.query(query, values);
  return rows[0];
};

const checkIfMenuItemExists = async (restaurantId, name) => {
  const query =
    "SELECT id FROM menu_items WHERE restaurant_id = $1 AND name = $2";

  values = [restaurantId, name];

  const { rows } = await db.readPool.query(query, values);
  return rows[0];
};

module.exports = { createMenuItem, checkIfMenuItemExists };
