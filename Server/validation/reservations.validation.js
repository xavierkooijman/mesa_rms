const Joi = require("joi");

const createReservationSchema = Joi.object({
  tableId: Joi.number().integer().positive().required(),
  numberPeople: Joi.number().integer().positive().required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().greater(Joi.ref("startTime")).optional(),
  reservationName: Joi.string().required(),
});

module.exports = { createReservationSchema };
