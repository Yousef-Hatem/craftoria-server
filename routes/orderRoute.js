const express = require("express");

const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getLoggedUserOrders,
  getLoggedUserOrderById,
  checkoutSession,
} = require("../controllers/orderController");
const authService = require("../controllers/authController");

// Routes for orders
router.use(authService.protect);

router.get("/checkout-session/:shippingAddressId", checkoutSession);

router.post("/", createOrder);
router.get("/", getLoggedUserOrders);
router.get("/:id", getLoggedUserOrderById);

router.use(authService.allowedTo("admin"));

router.get("/", getAllOrders);
router.get("/:id", getOrderById);

router.put("/update/:orderId", updateOrderStatus);
router.delete("/cancel/:id", cancelOrder);

module.exports = router;
