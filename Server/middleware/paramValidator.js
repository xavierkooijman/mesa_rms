const Joi = require("joi");

const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, { abortEarly: false });
  if (error) return next(error);
  req.params = value;
  next();
};

module.exports = validateParams;
