const db = require("../config/db");

const checkIfShapeExistsById = async (shapeId) => {
  const query = "SELECT id FROM table_shapes WHERE id = $1";
  const { rows } = await db.readPool.query(query, [shapeId]);
  return rows[0];
};

const getShapes = async () => {
  const query = "SELECT id, shape_name FROM table_shapes ORDER BY shape_name";
  const { rows } = await db.readPool.query(query);
  return rows;
};

module.exports = {
  checkIfShapeExistsById,
  getShapes,
};
