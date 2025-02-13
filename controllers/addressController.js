const asyncHandler = require("express-async-handler");

exports.addAddress = asyncHandler(async (req, res) => {
  req.user.addresses.push(req.body);

  await req.user.save();

  res.json({ data: req.user.addresses });
});

exports.getLoggedUserAddresses = asyncHandler(async (req, res) => {
  res.json({ data: req.user.addresses });
});

exports.updateAddress = asyncHandler(async (req, res) => {
  const { itemIndex } = req.body;

  Object.keys(req.body).forEach((key) => {
    req.user.addresses[itemIndex][key] = req.body[key];
  });

  await req.user.save();

  res.json({ data: req.user.addresses });
});

exports.deleteAddress = asyncHandler(async (req, res) => {
  const { itemIndex } = req.body;

  req.user.addresses.splice(itemIndex, 1);

  await req.user.save();

  res.json({ data: req.user.addresses });
});
