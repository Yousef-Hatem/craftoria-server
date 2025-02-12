const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name required"],
    },
    email: {
      type: String,
      required: [true, "Email required"],
      unique: true,
      match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    phone: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedCode: String,
    password: {
      type: String,
      required: [true, "Password required"],
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Product id is required"],
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    addresses: [
      {
        governorate: {
          type: String,
          required: [true, "Governorate required"],
        },
        city: {
          type: String,
          required: [true, "City required"],
        },
        street: {
          type: String,
          required: [true, "Street required"],
        },
        building: {
          type: String,
          required: [true, "Building required"],
        },
        zipCode: {
          type: String,
          required: [true, "Zip code is required"],
        },
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Product id is required"],
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
