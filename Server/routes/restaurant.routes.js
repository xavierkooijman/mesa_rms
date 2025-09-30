const express = require("express");
const router = express.Router();
const restaurantsController = require("../controllers/restaurants.controllers");
const validate = require("../middleware/validator");
const restaurantValidation = require("../validation/restaurant.validation");
const verifyToken = require("../middleware/verifyJWT");

router.post(
  "/",
  verifyToken,
  validate(restaurantValidation.createRestaurantSchema),
  restaurantsController.createRestaurant
);

module.exports = router;
