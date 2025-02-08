const asyncHandler = require("express-async-handler");

exports.addItemToCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const existingProductIndex = req.user.cart.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingProductIndex === -1) {
    req.user.cart.push({ productId });
  } else {
    req.user.cart[existingProductIndex].quantity += 1;
  }

  await req.user.save();

  res.json({ data: req.user.cart });
});

exports.getLoggedUserCart = asyncHandler(async (req, res) => {
  res.json({ data: req.user.cart });
});

exports.updateItemQuantity = asyncHandler(async (req, res) => {
  const { itemIndex, quantity } = req.body;

  req.user.cart[itemIndex].quantity = quantity;
  await req.user.save();

  res.json({ data: req.user.cart });
});

exports.removeItem = asyncHandler(async (req, res) => {
  const { itemIndex } = req.body;

  req.user.cart.splice(itemIndex, 1);

  await req.user.save();

  res.json({ data: req.user.cart });
});
