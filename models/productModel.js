const mongoose = require('mongoose');

// Define Product Schema
const productSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required.'] ,
        maxLength: 100 
    },
    price: { 
        type: Number, 
        required: [true, 'Price is required.'], 
        min: [0, 'Price must be at least 0.'], 
        max: [10000, 'Price cannot exceed 10000.'] 
    }
    ,
    originalPrice: { 
        type: Number, 
        min: 0, 
        max: 20000 
    }
    ,
    category: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: [true,"Category id required"]
    },
    description: { 
        type: String, 
        required: [true, 'Description is required.'] ,
        maxLength: 500 
    },
    quantity: { 
        type: Number, 
        required: [true, 'Quantity is required.'], 
        min: [0, 'Quantity must be at least 0.'] ,
        max:10000
    },
    imageUrls: { 
        type: [String], 
        required: [true, 'At least one image is required.'], 
        // `required` ensures the field exists and is not undefined.
        // `validate` adds custom logic to ensure the array is not empty.
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









