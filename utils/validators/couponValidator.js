const {body, validationResult } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");


const couponValidator = [
  body("code").isString().notEmpty().withMessage("Coupon code is required"),
  body("discount").isNumeric().withMessage("Discount must be a number"),
  body("percentageDiscount").isNumeric().withMessage("percentageDiscount must be a number"),
  body("expirationDate").isISO8601().toDate().withMessage("Expiration date must be a valid date"),
  validatorMiddleware
];

// const validateCoupon = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ success: false, errors: errors.array() });
//   }
//   next();
// };

module.exports = { couponValidator, validateCoupon };