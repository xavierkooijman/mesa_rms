const Joi = require("joi");

const createMenuCategorySchema = Joi.object({
  name: Joi.string().required(),
  parentCategoryId: Joi.number().integer().positive().allow(null),
});

module.exports = { createMenuCategorySchema };
