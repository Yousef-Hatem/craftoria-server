const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.validateCart = [
    check('productId')
    .isMongoId()
    .withMessage('Product Id is invalid'),
    check('quantity')
    .isNumeric()
    .withMessage('Quantity must be a number.')
    .isInt({min: 1})
    .withMessage('Quantity must be an integer bigger than zero.'),
    validatorMiddleware,
];
