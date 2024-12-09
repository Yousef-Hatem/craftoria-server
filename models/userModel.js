const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedCode: String,
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
      },
    ],
    address: [
      {
        street: String,
        buildingNumber: String,
        city: String,
        governorate: String,
        zipCode: String,
      },
    ],
    phone: {
      type: String,
      match: /^\+20\d{10}$/,
    },
    favorite: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
