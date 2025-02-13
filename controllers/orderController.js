const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const Order = require("../models/orderModel");
const User = require("../models/userModel");

exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const { shippingAddressId } = req.params;
  const user = await User.findById(req.user._id)
    .populate("cart.product")
    .select("cart")
    .lean();
  const { cart } = user;
  const lineItems = [];

  cart.forEach((item) => {
    lineItems.push({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: item.product.price * 100,
        product_data: {
          name: item.product.title,
          images: [
            `${process.env.SERVER_URL}/images/products/${item.product.images[0]}`,
          ],
        },
      },
    });
  });

  const clientUrl =
    process.env.CLIENT_URL || `${req.protocol}://${req.get("host")}`;

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `${clientUrl}/orders`,
    cancel_url: `${clientUrl}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.user._id.toString(),
    metadata: { shippingAddressId },
  });

  res.status(200).json({ status: "success", session });
});

const createCardOrder = async (session) => {
  const userId = session.client_reference_id;
  const { shippingAddressId } = session.metadata;
  const orderPrice = session.amount_total / 100;
  const items = [];

  const user = await User.findById(userId)
    .populate("cart.product")
    .select("cart");

  user.cart.forEach((item) => {
    items.push({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    });
  });

  const order = await Order.create({
    items,
    shippingAddressId,
    totalPrice: orderPrice,
    paymentMethod: "visa",
    user: userId,
  });

  if (order) {
    user.cart = [];
    await user.save();
  }
};

exports.webhookCheckout = asyncHandler(async (req, res) => {
  console.log("Test webhook checkout");

  const sig = req.headers["stripe-signature"];

  console.log(sig);

  let event;

  try {
    console.log(process.env.STRIPE_WEBHOOK_SECRET);
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    createCardOrder(event.data.object);
  }

  res.status(200).json({ received: true });
});

exports.createOrder = asyncHandler(async (req, res) => {
  const { paymentMethod } = req.body;
  const user = await User.findById(req.user._id)
    .populate("")
    .select("cart")
    .lean();
  let totalPrice = 0;
  const items = [];

  user.cart.forEach((i) => {
    const item = {
      product: i.product._id,
      quantity: i.quantity,
      price: i.price,
    };

    totalPrice = +i.price;
    items.push(item);
  });

  const newOrder = new Order({
    user: req.user._id,
    items,
    totalPrice,
    paymentMethod,
  });

  const savedOrder = await newOrder.save();

  res
    .status(201)
    .json({ message: "Order created successfully", data: savedOrder });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user")
    .populate("items.product")
    .lean();
  res.status(200).json(orders);
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id)
    .populate("user")
    .populate("items.product")
    .lean();

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json(order);
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.user.toString() === req.user._id.toString()) {
    const currentTime = new Date();
    const orderTime = new Date(order.createdAt);
    const timeDifference = (currentTime - orderTime) / (1000 * 3600 * 24);
    if (timeDifference >= 7 && status !== "delivered") {
      return res.status(400).json({
        message:
          "Order cannot be updated to this status after 7 days. It will be marked as delivered.",
      });
    }

    if (timeDifference >= 7 && status !== "delivered") {
      order.status = "delivered";
    } else {
      order.status = status;
    }
  } else if (req.user.role === "admin" && status === "cancelled") {
    order.status = "cancelled";
  }

  const updatedOrder = await order.save();

  res
    .status(200)
    .json({ message: "Order status updated", order: updatedOrder });
});

exports.cancelOrder = asyncHandler(async (req, res) => {
  try {
    const { role } = req.body;
    const { orderId } = req.params;

    if (role !== "admin") {
      return res
        .status(403)
        .json({ message: "not allowed to you to do this action" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "Cancelled";
    await order.save();

    return res
      .status(200)
      .json({ message: "Order cancelled successfully", order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "خطأ في الخادم", error: error.message });
  }
});

exports.getLoggedUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product")
    .lean();

  res.status(200).json(orders);
});

exports.getLoggedUserOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({
    _id: id,
    user: req.user._id,
  })
    .populate("items.product")
    .lean();

  res.status(200).json(order);
});
