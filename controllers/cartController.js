const asyncHandler = require("express-async-handler");

exports.addItemToCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const existingProductIndex = req.user.cart.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingProductIndex === -1) {
    req.user.cart.push({ product: productId });
  } else {
    req.user.cart[existingProductIndex].quantity += 1;
  }

  await req.user.save();

  res.json({ data: req.user.cart });
});

exports.getLoggedUserCart = asyncHandler(async (req, res) => {
  await req.user.populate("cart.product");
  await req.user.populate("cart.product.category");
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
