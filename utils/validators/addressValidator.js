const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.addAddressValidator = [
  check("governorate")
    .notEmpty()
    .withMessage("Governorate required")
    .isString()
    .withMessage("Invalid governorate"),
  check("city")
    .notEmpty()
    .withMessage("City required")
    .isString()
    .withMessage("Invalid city"),
  check("street")
    .notEmpty()
    .withMessage("Street required")
    .isString()
    .withMessage("Invalid street"),
  check("building")
    .notEmpty()
    .withMessage("Building required")
    .isString()
    .withMessage("Invalid building"),
  check("zipCode")
    .notEmpty()
    .withMessage("Zip code is required")
    .isString()
    .withMessage("Invalid zip code"),
  validatorMiddleware,
];

exports.updateAddressValidator = [
  check("id")
    .isMongoId()
    .withMessage("Address id is invalid")
    .custom((id, { req }) => {
      const itemIndex = req.user.addresses.findIndex(
        (address) => address._id.toString() === id
      );
      if (itemIndex === -1) {
        throw new Error(`There is no address for this id`);
      }
      req.body.itemIndex = itemIndex;
      return true;
    }),
  check("governorate").optional().isString().withMessage("Invalid governorate"),
  check("city").optional().isString().withMessage("Invalid city"),
  check("street").optional().isString().withMessage("Invalid street"),
  check("building").optional().isString().withMessage("Invalid building"),
  check("zipCode").optional().isString().withMessage("Invalid zip code"),
  validatorMiddleware,
];

exports.deleteAddressValidator = [
  check("id")
    .isMongoId()
    .withMessage("Address id is invalid")
    .custom((id, { req }) => {
      const itemIndex = req.user.addresses.findIndex(
        (address) => address._id.toString() === id
      );
      if (itemIndex === -1) {
        throw new Error(`There is no address for this id`);
      }
      req.body.itemIndex = itemIndex;
      return true;
    }),
  validatorMiddleware,
];
