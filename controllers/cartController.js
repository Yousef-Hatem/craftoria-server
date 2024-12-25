const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Product = require("../models/productModel");

exports.addItemToCart = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId);
    const existingProduct = req.user.cart.find(item => item.productId.toString() === product._id.toString());

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        req.user.cart.push({ productId: product._id, quantity: 1 });
    }
    await req.user.save();
    res.json(req.user.cart);
});

exports.updateItemsQuantity = asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        const product = req.params.productId;
        const newQuantity = req.body.quantity;

        const cartItem = user.cart.find(item => item.productId.toString() === product)
        if (cartItem) {
            cartItem.quantity = newQuantity;
            await user.save();
            res.json(user.cart);
        } else {
            res.status(404).json({ message: 'Product not found' })
    }
});

exports.removeProduct = asyncHandler(async(req,res) =>{
    const user = await User.findById(req.user._id);
    const product = req.params.productId;
    user.cart = user.cart.filter(item =>item.productId.toString() !== product);
    
    if(user.isModified('cart')){
        await user.save();
        res.json({message:'Product deleted successfully'});
    }else{
        res.status(404).json({message: 'Product not found in cart'});
    }
});