const express = require("express");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const {
  login,
  signup,
  verifyEmail,
  verifyEmailCode,
  protect,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);

router.use(protect);
router.put("/verifyEmail", verifyEmail);
router.put("/verifyEmailCode", verifyEmailCode);

module.exports = router;
