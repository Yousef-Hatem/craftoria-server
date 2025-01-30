const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

// Add new address
exports.addAddress = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  console.log("Request Body:", req.body); 

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $push: { address: req.body },
    },
    { new: true } 
  )
    .select("address") 
    .lean();

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  console.log("Updated User:", user);

  res
    .status(201)
    .json({ message: "Address added successfully", data: user.address });
});

//get all address for users//

exports.getAddresses = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("address").lean();

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  res.status(200).json({ data: user.address }); 
});



//Get address by ID////



exports.getAddressById = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;

  const user = await User.findById(userId).select("address").lean();

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  const address = user.address.find((addr) => addr._id.toString() === id);

  if (!address) {
    return next(new ApiError("Address not found", 404));
  }

  res.status(200).json({ status: "success", data: address });
});





//update an address//
exports.updateAddress = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const { addressId } = req.params;

  const user = await User.findById(userId);

  const address = user.address.find(
    (addr) => addr._id.toString() === addressId
  );

  //this codes updates new values or keep the old value //

  const { street, buildingNumber, city, governorate, zipCode } = req.body;
  address.street = street || address.street;
  address.buildingNumber = buildingNumber || address.buildingNumber;
  address.city = city || address.city;
  address.governorate = governorate || address.governorate;
  address.zipCode = zipCode || address.zipCode;
  await user.save();
  res
    .status(200)
    .json({ message: "Address updated successfully", data: user.address });
});

//Delete an address//
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { addressId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  const addressToDelete = user.address.find(
    (addr) => addr._id.toString() === addressId
  );

  if (!addressToDelete) {
    return next(new ApiError("Address not found", 404));
  }

  user.address.pull(addressToDelete._id);

  await user.save();

  res
    .status(200)
    .json({ message: "Address deleted successfully", data: user.address });
});
