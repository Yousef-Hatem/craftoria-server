const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Factory = require("./handlersFactory");
const Product = require("../models/productModel");

const factory = new Factory(Product);

exports.getProducts = factory.getAll();

exports.getProductById = factory.getOne();

exports.createProduct = factory.createOne();

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updatedProduct) {
    return next(new ApiError(`No product found with ID ${id}`, 404));
  }

  res.status(200).json({ message: "Product updated", data: updatedProduct });
});

exports.deleteProduct = factory.deleteOne();

exports.uploadImage = asyncHandler(async (req, res) => {
  // Image upload logic here if needed.
  res.status(200).json({ message: "Image uploaded successfully" });
});

exports.resizeImage = asyncHandler(async (req, res) => {
  // Image resize logic here if needed.
  res.status(200).json({ message: "Image resized successfully" });
});
