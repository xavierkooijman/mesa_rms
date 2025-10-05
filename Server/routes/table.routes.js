const express = require("express");
const router = express.Router();
const tablesController = require("../controllers/tables.controllers");
const validate = require("../middleware/validator");
const tableValidation = require("../validation/table.validation");
const verifyToken = require("../middleware/verifyJWT");

router.post(
  "/",
  verifyToken,
  validate(tableValidation.createTableSchema),
  tablesController.createTable
);
router.get("/", verifyToken, tablesController.getTablesByRestaurant);

module.exports = router;
