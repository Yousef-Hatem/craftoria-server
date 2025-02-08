const express = require("express");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
  resizeImage,
} = require("../controllers/categoryController");

const authService = require("../controllers/authController");

const router = express.Router();

router.route("/").get(getCategories);
router.route("/:id").get(getCategory);

router.use(authService.protect, authService.allowedTo("admin"));

router.route("/").post(uploadImage, resizeImage, createCategory);
router
  .route("/:id")
  .put(uploadImage, resizeImage, updateCategory)
  .delete(deleteCategory);

module.exports = router;
