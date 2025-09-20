const Joi = require("joi");

const createRestaurantSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = { createRestaurantSchema };
