const Factory = require("./handlersFactory");
const Category = require("../models/categoryModel");
const { sanitizeCategory } = require("../utils/sanitize/sanitizeCategory");
const {
  uploadSingleImage,
  resizeImages,
} = require("../middlewares/uploadImageMiddleware");

const factory = new Factory(Category);

exports.uploadImage = uploadSingleImage("image");

exports.resizeImage = resizeImages({
  model: Category,
  fieldName: "image",
  resize: [500, 500],
  allowSavingInPngFormat: true,
});

exports.getCategories = factory.getAll();

exports.getCategory = factory.getOne();

exports.createCategory = factory.createOne(sanitizeCategory);

exports.updateCategory = factory.updateOne({ imageKey: "image" });

exports.deleteCategory = factory.deleteOne();
