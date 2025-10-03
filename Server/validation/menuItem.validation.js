const Joi = require("joi");

const createMenuItemSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().positive().precision(2).required(),
  categoryId: Joi.number().integer().positive(),
});

module.exports = { createMenuItemSchema };
