const Joi = require("joi");

const createTableSchema = Joi.object({
  tableNumber: Joi.number().integer().min(1).required(),
  locationId: Joi.number().integer().min(1).required(),
  capacity: Joi.number().integer().min(1).required(),
  positionX: Joi.number().required(),
  positionY: Joi.number().required(),
  rotation: Joi.number().min(0).max(360).required(),
  shapeId: Joi.number().integer().min(1).required(),
});

module.exports = { createTableSchema };
