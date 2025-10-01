const Joi = require("joi");

const createMenuCategorySchema = Joi.object({
  name: Joi.string().required(),
  parentCategoryId: Joi.number().positive(),
});

module.exports = { createMenuCategorySchema };
