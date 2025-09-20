const db = require("../config/db");

const createRestaurant = async (data) => {
  const { name, ownerId } = data;
  const query =
    "INSERT INTO restaurants(restaurant_name,owner_id) VALUES($1, $2) RETURNING restaurant_name, owner_id";

  const values = [name, ownerId];

  const { rows } = await db.writePool(query, values);
  return rows[0];
};

const checkIfRestaurantExists = async (data) => {
  const { name, ownerId } = data;

  const query =
    "SELECT id FROM restaurants WHERE restaurant_name = $1 AND owner_id = $2";

  const values = [name, ownerId];

  const { rows } = await db.readPool(query, values);
  return rows[0];
};

const updateRestaurantName = async (data) => {
  const { name, restaurantId } = data;

  const query = "UDPATE restaurants SET restaurant_name = $1 WHERE id = $2";

  const values = [name, restaurantId];

  const { rows } = await db.writePool(query, values);
  return rows[0];
};

module.exports = {
  createRestaurant,
  checkIfRestaurantExists,
  updateRestaurantName,
};
