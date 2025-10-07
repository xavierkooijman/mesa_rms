const Joi = require("joi");

const validateParam = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = { validateParam };
