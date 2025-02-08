const express = require("express");
const {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/CouponController");
const { couponValidator, validateCoupon } = require("../middlewares/validatorMiddleware");

const router = express.Router();

router.post("/createCopoun", couponValidator, validateCoupon, createCoupon);
router.get("/getCopouns", getCoupons);
router.get("/:id", getCouponById);
router.put('/:id', couponValidation, updateCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;