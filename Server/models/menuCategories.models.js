const db = require("../config/db");

const createMenuCategory = async (data) => {
  const { restaurantId, name } = data;
  const query =
    "INSERT INTO menu_categories(restaurant_id, category_name) VALUES($1, $2)";

  values = [restaurantId, name];

  await db.writePool.query("BEGIN");
  await db.writePool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);
  const { rows } = await db.writePool.query(query, values);
  await db.writePool.query("COMMIT");
  return rows[0];
};

const checkIfMenuCategoryExists = async (restaurantId, name) => {
  const query =
    "SELECT id FROM menu_categories WHERE restaurant_id = $1 AND category_name = $2";

  values = [restaurantId, name];

  await db.readPool.query("BEGIN");
  await db.readPool.query(`SET LOCAL app.jwt_restaurantId = ${restaurantId}`);

  const { rows } = await db.readPool.query(query, values);
  await db.readPool.query("COMMIT");
  return rows[0];
};

module.exports = { createMenuCategory, checkIfMenuCategoryExists };
