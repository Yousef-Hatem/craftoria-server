const express = require("express");
const {
  addfavorite,
  removeFavorite,
} = require("../controllers/favoriteController");
const authService = require("../controllers/authController");

const router = express.Router();

router.put("/:id", authService.protect, addfavorite);

router.use(authService.protect, authService.allowedTo("admin"));

router.delete("/:id", removeFavorite);

module.exports = router;
