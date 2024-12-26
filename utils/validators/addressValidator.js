const {check} =require ("express-validator")
const validatorMiddleware = require ("../../middlewares/validatorMiddleware")


exports.addressValidator = [
    check("street")
    .notEmpty()
    .withMessage("street is required")
    .isLength({min:3})
    .withMessage("Street name must be at least 3 characters")
    
    ,

    check("buildingNumber")
    .notEmpty()
    .withMessage("building number is required")
    .isNumeric()
    .withMessage("Building number must be a number")
    ,
    check("governorate")
    .notEmpty()
    .withMessage("governorate is required")
    .isLength({min:2})
    .withMessage("governorate name must be at least 2 characters")
    ,
    validatorMiddleware
];