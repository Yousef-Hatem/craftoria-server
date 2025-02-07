const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Category name is required'],
        maxLength: [60, 'Category name is too long'],
        minLength: [3, 'Category name is too short'],
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Category description is required'],
        maxLength: [250, 'Category description is too long'],
        minLength: [3, 'Category description is too short'],
    },
    image: {
        type: String,
        required: [true, 'Category image is required'],
    },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
