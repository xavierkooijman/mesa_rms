const Joi = require("joi");

const createTableSchema = Joi.object({
  tableNumber: Joi.number().integer().positive().required(),
  locationId: Joi.number().integer().positive().required(),
  capacity: Joi.number().integer().positive().required(),
  positionX: Joi.number().required(),
  positionY: Joi.number().required(),
  rotation: Joi.number().min(0).max(360).required(),
  shapeId: Joi.number().integer().positive().required(),
});

module.exports = { createTableSchema };
