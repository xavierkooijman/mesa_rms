const express = require("express");
const router = express.Router();
const tableLocationsController = require("../controllers/tableLocations.controllers");
const validate = require("../middleware/validator");
const tableLocationValidation = require("../validation/tableLocation.validation");
const verifyToken = require("../middleware/verifyJWT");

router.post(
  "/",
  verifyToken,
  validate(tableLocationValidation.createTableLocationSchema),
  tableLocationsController.createTableLocation
);
module.exports = router;
