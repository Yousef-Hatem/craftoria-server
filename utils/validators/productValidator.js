const {check}=require ("express-validator")

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.creatProductValidation=[
    check("title")
    .notEmpty()
    .withMessage("title is required")
    .isLength({max:100})
    .withMessage("title can not exceed 200 characters"),


    check("price")
    .notEmpty()
    .withMessage("price is required")
    .isFloat({min:0,max:1000})
    .withMessage("price must be between 0 and 10000"),

    check("originalPrice")
    .optional()
    .isFloat({min:0,max:2000})
    .withMessage("original price is required"),


    check("category")
    .notEmpty()
    .withMessage("Category ID is required.")
    .isMongoId()
    .withMessage("Invalid Category ID."),



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



    check("imgeUrls")
    .notEmpty()
    .withMessage("at least one img url is required")
    .isArray({min:1})
    .withMessage("Image URLs must be an array with at least one item.")
.custom((value)=>{
if(!Array.isArray(value)||!value.every((url)=> typeof url==="string")){
    throw new Error("All image URLs must be valid strings."); 
}
return true
}),

validatorMiddleware
]







exports.updateProductValidation=[
    check("title")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters."),




    check("price")
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage("Price must be between 0 and 10000."),



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



exports.deleteProducValidation=[
check("productId")
.notEmpty()
.withMessage("product Id is required ")
.isMongoId()
.withMessage("Invalid Product ID."),


validatorMiddleware,
]