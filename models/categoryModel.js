const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: true,
        minlength: [3, 'Category name must be at least 3 characters long'],
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});


const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
