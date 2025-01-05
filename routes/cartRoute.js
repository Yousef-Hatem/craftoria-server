const express = require("express");

const {
  addItemToCartValidator,
  updateItemQuantityValidator,
  removeItemValidator,
} = require("../utils/validators/cartValidator");
const {
  getLoggedUserCart,
  addItemToCart,
  updateItemQuantity,
  removeItem,
} = require("../controllers/cartController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.use(protect);

router.get("/", getLoggedUserCart);
router.post("/", addItemToCartValidator, addItemToCart);
router.put("/:productId", updateItemQuantityValidator, updateItemQuantity);
router.delete("/:productId", removeItemValidator, removeItem);

module.exports = router;
