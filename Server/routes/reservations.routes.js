const express = require("express");
const router = express.Router();
const reservationsController = require("../controllers/reservations.controllers");
const reservationsValidation = require("../validation/reservations.validation");
const validate = require("../middleware/validator");
const verifyToken = require("../middleware/verifyJWT");

router.post(
  "/",
  verifyToken,
  validate(reservationsValidation.createReservationSchema),
  reservationsController.createReservation
);
module.exports = router;
