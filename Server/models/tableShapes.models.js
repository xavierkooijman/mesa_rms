const db = require("../config/db");

const checkIfShapeExistsById = async (shapeId) => {
  const query = "SELECT id FROM table_shapes WHERE id = $1";
  const { rows } = await db.readPool.query(query, [shapeId]);
  return rows[0];
};

module.exports = {
  checkIfShapeExistsById,
};
