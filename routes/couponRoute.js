const express = require("express");
const {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} = require("./controllers/couponController");
const { couponValidator, validateCoupon } = require("../middlewares/validatorMiddleware");

const router = express.Router();

router.post("/", couponValidator, validateCoupon, createCoupon);
router.get("/", getCoupons);
router.get("/:id", getCouponById);
