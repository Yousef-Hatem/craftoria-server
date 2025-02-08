const Factory = require("./handlersFactory");
const Product = require("../models/productModel");
const {
  uploadMixOfImages,
  resizeImages,
} = require("../middlewares/uploadImageMiddleware");

const factory = new Factory(Product, { populate: "category" });

exports.uploadImages = uploadMixOfImages([
  {
    name: "images",
    maxCount: 10,
  },
]);

exports.resizeImages = resizeImages({
  model: Product,
  fieldName: "images",
  resize: [800, 800],
});

exports.getProducts = factory.getAll();

exports.getProduct = factory.getOne();

exports.createProduct = factory.createOne();

exports.updateProduct = factory.updateOne();

exports.deleteProduct = factory.deleteOne();
