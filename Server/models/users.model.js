const db = require("../config/db");

const createUser = async (data) => {
  const { firstName, lastName, email, hashedPassword, roleId, statusId } = data;

  const query =
    "INSERT INTO users(first_name, last_name, email, password_hash, role_id, status_id) VALUES($1, $2, $3, $4, $5, $6)";

  const values = [firstName, lastName, email, hashedPassword, roleId, statusId];

  const result = await db.writePool.query(query, values);
  return result.rows[0];
};

module.exports = { createUser };
