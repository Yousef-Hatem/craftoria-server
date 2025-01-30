const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

// Add product to favorites
// Add product to favorites


exports.addfavorite = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;


  const user = await User.findById(req.user._id);
  
  user.favorite.push(productId);
  await user.save();

  res
    .status(200)
    .json({ message: "Product added to favorites", data: user.favorite });
});

// Remove product from favorites

exports.removeFavorite = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

 

  const user = await User.findById(req.user._id);

 

  user.favorite = user.favorite.filter((id) => id.toString() !== productId);
  await user.save();
  res
    .status(200)
    .json({ message: "Product removed from favorites", data: user.favorite });
});

// Get all favorites for the logged-in user

exports.getfavorites = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("favorite");

  res.status(200).json({ data: user.favorite });
});
