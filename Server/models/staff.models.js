const db = require("../config/db");

const getStaffByUserId = async (userId) => {
  const query =
    "SELECT s.id,s.restaurant_id, sr.staff_role FROM staff s JOIN staff_roles sr ON s.role_id = sr.id WHERE s.deleted_at IS NULL";

  await db.readPool.query("BEGIN");
  await db.readPool.query(`SET LOCAL app.jwt_userId = ${userId}`);

  const { rows } = await db.readPool.query(query, [userId]);
  await db.readPool.query("COMMIT");
  return rows[0];
};

module.exports = { getStaffByUserId };
