const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const { sanitizeUser } = require("../utils/sanitize/sanitizeUser");

// Add new address
exports.addAddress = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { street, buildingNumber, city, governorate } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    user.address.push({ street, buildingNumber, city, governorate });
    await user.save();

    const sanitizedUser = sanitizeUser(user);
    res.status(201).json({ message: "Address added successfully", user: sanitizedUser });
});

// Get all addresses for user
exports.getAddresses = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId).select("address");
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    res.status(200).json({ addresses: user.address });
});

// Update an address
exports.updateAddress = asyncHandler(async (req, res, next) => {
    const { userId, addressId } = req.params;
    const { street, buildingNumber, city, governorate } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    const address = user.address.id(addressId);
    if (!address) {
        return next(new ApiError("Address not found", 404));
    }

    // Update fields
    address.street = street || address.street;
    address.buildingNumber = buildingNumber || address.buildingNumber;
    address.city = city || address.city;
    address.governorate = governorate || address.governorate;

    await user.save();

    const sanitizedUser = sanitizeUser(user);
    res.status(200).json({ message: "Address updated successfully", user: sanitizedUser });
});

// Delete an address
exports.deleteAddress = asyncHandler(async (req, res, next) => {
    const { userId, addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    const address = user.address.id(addressId);
    if (!address) {
        return next(new ApiError("Address not found", 404));
    }

    address.remove();
    await user.save();

    const sanitizedUser = sanitizeUser(user);
    res.status(200).json({ message: "Address deleted successfully", user: sanitizedUser });
});
