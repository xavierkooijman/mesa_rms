const Joi = require("joi");

const createTableLocationSchema = Joi.object({
  name: Joi.string().required(),
});
module.exports = { createTableLocationSchema };
