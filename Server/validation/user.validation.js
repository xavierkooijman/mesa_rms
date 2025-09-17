const Joi = require("joi");

const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  password: Joi.string().password().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().password().min(8).required(),
});

module.exports = {
  signUpSchema,
  loginSchema,
};
