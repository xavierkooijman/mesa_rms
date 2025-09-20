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
    "SELECT id, email, password_hash FROM users WHERE email = $1 LIMIT 1";

  const { rows } = await db.readPool.query(query, [email]);
  return rows[0];
};

const createRefreshToken = async (data) => {
  const { hashedToken, userId, expires_at } = data;

  const query =
    "INSERT INTO refresh_tokens(token_hash, user_id, expires_at) VALUES($1, $2, $3) RETURNING id";

  const values = [hashedToken, userId, expires_at];

  const { rows } = await db.writePool.query(query, values);
  return rows[0];
};

module.exports = {
  createUser,
  checkIfEmailExists,
  getUserByEmail,
  createRefreshToken,
};
