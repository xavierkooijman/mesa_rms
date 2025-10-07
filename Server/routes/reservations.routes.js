const express = require("express");
const router = express.Router();
const reservationsController = require("../controllers/reservations.controllers");
const reservationsValidation = require("../validation/reservations.validation");
const singleParamValidation = require("../validation/singleParam.validation");
const validateParams = require("../middleware/paramValidator");
const validate = require("../middleware/validator");
const verifyToken = require("../middleware/verifyJWT");

router.post(
  "/",
  verifyToken,
  validate(reservationsValidation.createReservationSchema),
  reservationsController.createReservation
);
router.post(
  "/:id/cancel",
  verifyToken,
  validateParams(singleParamValidation.validateParam),
  reservationsController.cancelReservation
);
router.post(
  "/:id/show",
  verifyToken,
  validateParams(singleParamValidation.validateParam),
  reservationsController.showReservation
);
router.post(
  "/:id/no-show",
  verifyToken,
  validateParams(singleParamValidation.validateParam),
  reservationsController.noShowReservation
);
module.exports = router;
