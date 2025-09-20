const express = require("express");
const router = express.Router();
const restaurantsController = require("../controllers/restaurants.controllers");
const validate = require("../middleware/validator");
const verifyToken = require("../middleware/verifyJWT");

router.post("/", verifyToken, restaurantsController.createRestaurant);

module.exports = router;
