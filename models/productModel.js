const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
      min: [1, "Price must be at least 1."],
      max: [10000, "Price cannot exceed 10000."],
    },
    originalPrice: {
      type: Number,
      min: [1, "Price must be at least 1."],
      max: [20000, "Price cannot exceed 20000."],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category id required"],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      maxLength: 500,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required."],
      min: [0, "Quantity must be at least 0."],
      max: 10000,
    },
    images: {
      type: [String],
      required: [true, "At least one image is required."],

      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "Product must have at least one image.",
      },
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
