const Joi = require("joi");

const createMenuItemSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().positive().precision(2).required(),
  categoryId: Joi.number().positive(),
});

module.exports = { createMenuItemSchema };
