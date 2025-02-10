const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Product = require("../../models/productModel");

exports.addItemToCartValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("Product id is invalid")
    .custom((id) =>
      Product.findById(id).then((product) => {
        if (!product) {
          return Promise.reject(new Error(`There is no product for this id`));
        }
      })
    ),
  validatorMiddleware,
];

exports.updateItemQuantityValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Product id is invalid")
    .custom((id, { req }) => {
      const itemIndex = req.user.cart.findIndex(
        (item) => item.product.toString() === id
      );
      if (itemIndex === -1) {
        throw new Error(`There is no product for this id`);
      }
      req.body.itemIndex = itemIndex;
      return true;
    }),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity required")
    .isNumeric()
    .withMessage("Quantity must be a number")
    .isInt({ min: 1 })
    .withMessage("Quantity must be an integer bigger than zero."),
  validatorMiddleware,
];

exports.removeItemValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Product id is invalid")
    .custom((id, { req }) => {
      const itemIndex = req.user.cart.findIndex(
        (item) => item.product.toString() === id
      );
      if (itemIndex === -1) {
        throw new Error(`There is no product for this id`);
      }
      req.body.itemIndex = itemIndex;
      return true;
    }),
  validatorMiddleware,
];
