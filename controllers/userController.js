const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const ApiError = require("../utils/apiError");
const Factory = require("./handlersFactory");
const createToken = require("../utils/createToken");

const User = require("../models/userModel");
const { sanitizeUser } = require("../utils/sanitize/sanitizeUser");

const factory = new Factory(User);

exports.getUsers = factory.getAll({ select: "name email verified createdAt" });

exports.getUser = factory.getOne({ addSelect: "-password" });

exports.createUser = factory.createOne();

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, role } = req.body;
  const document = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role },
    { new: true }
  )
    .select("-password")
    .lean();

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  )
    .select("-password")
    .lean();

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

exports.deleteUser = factory.deleteOne();

exports.getLoggedUserData = asyncHandler(async (req, res) => {
  res.status(200).json({ data: sanitizeUser(req.user) });
});

exports.updateLoggedUserData = asyncHandler(async (req, res) => {
  const update = {};
  const { name, email } = req.body;

  if (name) {
    update.name = name;
  }

  if (email && email !== req.user.email) {
    update.email = req.body.email;
    update.verified = false;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, update, {
    new: true,
  });

  res.status(200).json({ data: sanitizeUser(updatedUser) });
});

exports.updateLoggedUserPassword = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  const token = createToken(user._id);

  res.status(200).json({ data: sanitizeUser(user), token });
});
