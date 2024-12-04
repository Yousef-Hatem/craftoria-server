const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const { emailVerificationMessage } = require("../utils/emailMessages");
const createToken = require("../utils/createToken");
const { sanitizeUser } = require("../utils/sanitize/sanitizeUser");

const User = require("../models/userModel");

exports.signup = asyncHandler(async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    promotionalNotifications: req.body.promotionalNotifications,
  });

  const token = createToken(user._id);

  res.status(201).json({ data: sanitizeUser(user), token });
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
  if (req.user.verified) {
    return next(new ApiError("User is already verified", 400));
  }

  const user = await User.findOne({ email: req.user.email });

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedRestCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.verifiedCode = hashedRestCode;

  await user.save();

  const message = `${emailVerificationMessage(user.name, resetCode)}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Email Verification Code",
      message,
    });
  } catch (err) {
    user.verifiedCode = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "success", message: "Verification code sent to email" });
});

exports.verifyEmailCode = asyncHandler(async (req, res, next) => {
  const { code } = req.body;
  const { email } = req.user;

  const user = await User.findOne({ email });

  if (user.verified) {
    return next(new ApiError("User is already verified", 400));
  }

  if (!user.verifiedCode) {
    return next(
      new ApiError("The verification code has not been sent yet", 400)
    );
  }

  const hashedRestCode = crypto.createHash("sha256").update(code).digest("hex");

  if (user.verifiedCode === hashedRestCode) {
    user.verified = true;
    user.verifiedCode = undefined;
    await user.save();
  } else {
    return next(new ApiError("Verification code invalid", 400));
  }

  res.status(200).json({ status: "success" });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  const token = createToken(user._id);

  res.status(200).json({
    data: sanitizeUser(user),
    token,
  });
});

const getToken = (req) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  return token;
};

exports.protect = asyncHandler(async (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }

  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password, please login again..",
          401
        )
      );
    }
  }

  req.user = currentUser;

  next();
});

exports.verified = asyncHandler(async (req, res, next) => {
  if (!req.user.verified) {
    return next(new ApiError("This user has not been verified", 401));
  }

  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });
