const express = require("express");
const {
  getProducts,
  updateProduct,
  createProduct,
  deleteProduct,
  getProductById,
  uploadImage,
  resizeImage,
} = require("../controllers/productController");
const authService = require("../controllers/authController");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.use(authService.protect, authService.allowedTo("admin"));
router.post("/", uploadImage,resizeImage,  createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
