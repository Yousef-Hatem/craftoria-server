const asyncHandler=require("express-async-handler")
const User =require("../models/userModel")
const ApiError = require("../utils/apiError.js")

// Add product to favorites

exports.addfavorite=asyncHandler(async(req,res,next)=>{
    const {productId}=req.body

    if(!productId){
        return next(new ApiError("Product ID is required",400))
    }
    const user=await User.findById(req.user._id)
    if(!user){
        return next(new ApiError ("User not found",404))
    }
// Check if product is already in favorites


    if(user.favorite.includes(productId)){
        return next (new ApiError("Product already in favorites"))
    }

    user.favorite.push(productId)
    await user.save()

    res.status(200).json({message: "Product added to favorites",data:user.favorite})
});





// Remove product from favorites

exports.removeFavorite=asyncHandler(async(req,res,next)=>{
    const {productId}=req.body

    if(!productId){
        return next(new ApiError("Product ID is required", 400))
    }

    const user=await User.findById(req.user._id)

if(!user){
    return next(new ApiError ("User not found", 404))
}

user.favorite=user.favorite.filter((id)=>id.toString() !==productId)
await user.save()
res.status(200).json({message:"Product removed from favorites",data: user.favorite})

});


// Get all favorites for the logged-in user

exports.getfavorites=asyncHandler(async(req,res,next)=>{
    const user =await User.findById(req.user._id).populate("favorite")

    if(!user){
        return next (new ApiError("User not found", 404))
    }
    res.status(200).json({data:user.favorite})
})