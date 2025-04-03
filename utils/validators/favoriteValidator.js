const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const productModel = require("../../models/productModel");

const checkProductExists = async (productId) => {
  const productExist = await productModel.findById(productId);
  if (!productExist) {
    throw new Error("Product does not exist.");
  }
  return true;
};

exports.createFavoriteValidation = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID is required.")
    .isMongoId()
    .withMessage("Invalid Product ID format.")
    .custom(checkProductExists), 
  validatorMiddleware, 
];



exports.deleteFavoriteValidation = [
  check("id")
    .notEmpty()
    .withMessage("Favorite ID is required.")
    .isMongoId()
    .withMessage("Invalid Favorite ID format."),
  validatorMiddleware,
];



exports.getFavoriteValidation = [
  check("id")
    .notEmpty()
    .withMessage("Favorite ID is required.")
    .isMongoId()
    .withMessage("Invalid Favorite ID format."),
  validatorMiddleware,
];
