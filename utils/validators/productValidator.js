const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const categoryModel = require("../../models/categoryModel");



const checkCategoryExists = async (categoryId) => {
  const categoryExist = await categoryModel.findById(categoryId);
  if (!categoryExist) {
    throw new Error("Category does not exist.");
  }
  return true;
};


exports.createProductValidation = [
  check("title")
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters."),

  check("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 1, max: 10000 })
    .withMessage("Price must be between 1 and 10000."),

  check("originalPrice")
    .optional()
    .isFloat({ min: 1, max: 2000 })
    .withMessage("Original Price must be between 1 and 2000.")
    .custom((value,{req})=>{
      if(value<req.body.price){
        throw new Error ("Original Price must be greater than or equal to the price.")
      }
      return true
    }),



  check("category")
    .notEmpty()
    .withMessage("Category ID is required.")
    .isMongoId()
    .withMessage("Invalid Category ID.")
    .custom(checkCategoryExists),

  check("description")
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters."),

  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required.")
    .isInt({ min: 0, max: 10000 })
    .withMessage("Quantity must be between 0 and 10000."),

  check("imageUrls")
    .notEmpty()
    .withMessage("At least one image URL is required.")
    .isArray({ min: 1 })
    .withMessage("Image URLs must be an array with at least one item.")
    .custom((value) => {
      if (!Array.isArray(value) || !value.every((url) => typeof url === "string")) {
        throw new Error("All image URLs must be valid strings.");
      }
      return true;
    }),

  validatorMiddleware,
];



exports.updateProductValidation = [
  check("title")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters."),
   

  check("price")
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage("Price must be between 0 and 10000."),


    check("category")
    .optional()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Invalid Category ID.")
    .custom(checkCategoryExists),


  check("originalPrice")
    .optional()
    .isFloat({ min: 0, max: 20000 })
    .withMessage("Original Price must be between 0 and 20000."),

  check("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters."),

  check("quantity")
    .optional()
    .isInt({ min: 0, max: 10000 })
    .withMessage("Quantity must be between 0 and 10000."),

  check("imageUrls")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Image URLs must be an array with at least one item.")
    .custom((value) => {
      if (!Array.isArray(value) || !value.every((url) => typeof url === "string")) {
        throw new Error("All image URLs must be valid strings.");
      }
      return true;
    }),

  validatorMiddleware,
];



exports.deleteProductValidation = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Product ID."),

  validatorMiddleware,
];


exports.getProductValidation = [
  check("id")
    .notEmpty()
   
    .isMongoId()
    .withMessage("Invalid ID."),

  validatorMiddleware,
];
