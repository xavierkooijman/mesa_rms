const db = require("../config/db");

const createMenuItem = async (data) => {
  const { restaurantId, name, price } = data;
  const query = "INSERT INTO menu_items VALUES($1, $2, $3)";

  values = [restaurantId, name, price];
  const { rows } = await db.writePool.query(query, values);
  return rows[0];
};
