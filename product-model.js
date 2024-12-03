const mongoose = require('mongoose');

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    minlength: [2, 'Product name must be at least 2 characters long'], 
    maxlength: [100, 'Product name cannot be more than 100 characters'], 
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number'],
    max: [10000, 'Price cannot exceed 10000'], 
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters long'], 
    maxlength: [500, 'Description cannot be more than 500 characters'], 
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Stock must be a positive number'],
  },
  imageUrls: {
    type: [String],
    required: [true, 'At least one image URL is required'],
    validate: {
      validator: function (value) {
      
        return value.length > 0;
      },
      message: 'At least one image URL is required',
    },
  },
});

// Product Model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
