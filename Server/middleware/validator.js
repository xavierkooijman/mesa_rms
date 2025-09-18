const Joi = require("joi");

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return next(error);
  req.body = value;
  next();
};

module.exports = validate;
