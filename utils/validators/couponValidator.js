const {body, validationResult } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");


const couponValidator = [
  body("code").isString().notEmpty().withMessage("Coupon code is required"),
  body("discount").isNumeric().withMessage("Discount must be a number"),
  body("percentageDiscount").isNumeric().withMessage("percentageDiscount must be a number"),
  body("expirationDate").isISO8601().toDate().withMessage("Expiration date must be a valid date"),
  validatorMiddleware
];

const createCouponValidator = [
  body("code")
    .isString()
    .notEmpty()
    .withMessage("Coupon code is required"),
  body("discount")
    .isNumeric()
    .withMessage("Discount must be a number"),
  body("percentageDiscount")
    .optional()
    .isNumeric()
    .withMessage("percentageDiscount must be a number"),
  body("expirationDate")
    .isISO8601()
    .toDate()
    .withMessage("Expiration date must be a valid date"),
  validatorMiddleware
];

const getCouponByIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid coupon ID format"),
  validatorMiddleware
];


const updateCouponValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid coupon ID format"),
  body("code")
    .optional() // This field is optional
    .isString()
    .notEmpty()
    .withMessage("Coupon code must be a non-empty string"),
  body("discount")
    .optional() // This field is optional
    .isNumeric()
    .withMessage("Discount must be a number"),
  body("percentageDiscount")
    .optional() // This field is optional
    .isNumeric()
    .withMessage("percentageDiscount must be a number"),
  body("expirationDate")
    .optional() // This field is optional
    .isISO8601()
    .toDate()
    .withMessage("Expiration date must be a valid date"),
  validatorMiddleware
];

const deleteCouponValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid coupon ID format"),
  validatorMiddleware
];
// const validateCoupon = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ success: false, errors: errors.array() });
//   }
//   next();
// };

module.exports = { couponValidator, validateCoupon, createCouponValidator,getCouponByIdValidator,updateCouponValidator,deleteCouponValidator };