const express = require("express");
const {
  getProducts,
  updateProduct,
  createProduct,
  deleteProduct,
  getProduct,
  uploadImages,
  resizeImages,
} = require("../controllers/productController");
const authService = require("../controllers/authController");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);

router.use(authService.protect, authService.allowedTo("admin"));

router.post("/", uploadImages, resizeImages, createProduct);

router
  .put("/:id", uploadImages, resizeImages, updateProduct)
  .delete("/:id", deleteProduct);

module.exports = router;
