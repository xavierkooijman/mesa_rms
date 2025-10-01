const Joi = require("joi");

const createMenuItemSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().positive().precision(2).required(),
});

module.exports = { createMenuItemSchema };
