const Joi = require("joi");

const createMenuCategorySchema = Joi.object({
  name: Joi.string().required(),
  parentCategoryId: Joi.number().integer().min(1).allow(null),
});

module.exports = { createMenuCategorySchema };
