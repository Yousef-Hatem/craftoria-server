const mongoose = require('mongoose');

// Define Product Schema
const productSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required.'] 
    },
    price: { 
        type: Number, 
        required: [true, 'Price is required.'], 
        min: [0, 'Price must be at least 0.'], 
        max: [10000, 'Price cannot exceed 10000.'] 
    },
    category: { 
        type: String, 
        required: [true, 'Category is required.'] 
    },
    description: { 
        type: String, 
        required: [true, 'Description is required.'] 
    },
    quantity: { 
        type: Number, 
        required: [true, 'Quantity is required.'], 
        min: [0, 'Quantity must be at least 0.'] 
    },
    imageUrls: { 
        type: [String], 
        required: [true, 'At least one image is required.'], 
        validate: {
            validator: function(value) {
                return value.length > 0;
            },
            message: 'Product must have at least one image.'
        }
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
