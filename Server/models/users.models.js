const db = require("../config/db");

const createUser = async (data) => {
  const { firstName, lastName, email, hashedPassword, roleId, statusId } = data;

  const query =
    "INSERT INTO users(first_name, last_name, email, password_hash, role_id, status_id)VALUES($1, $2, $3, $4, $5, $6) RETURNING id, first_name, last_name, email, role_id, status_id";

  const values = [firstName, lastName, email, hashedPassword, roleId, statusId];

  const { rows } = await db.writePool.query(query, values);
  return rows[0];
};

const checkIfEmailExists = async (email) => {
  const query = "SELECT id FROM users WHERE email = $1 LIMIT 1";

  const { rows } = await db.readPool.query(query, [email]);
  return rows[0];
};

const getUserByEmail = async (email) => {
  const query =
    "SELECT u.id, u.password_hash, ur.user_role FROM users u JOIN user_roles ur ON u.role_id = ur.id WHERE email = $1 LIMIT 1";

  const { rows } = await db.readPool.query(query, [email]);
  return rows[0];
};

module.exports = {
  createUser,
  checkIfEmailExists,
  getUserByEmail,
};
