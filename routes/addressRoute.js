const express = require("express");

const {
  addAddressValidator,
  updateAddressValidator,
  deleteAddressValidator,
} = require("../utils/validators/addressValidator");
const {
  getLoggedUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.use(protect);

router.get("/", getLoggedUserAddresses);
router.post("/", addAddressValidator, addAddress);
router.put("/:id", updateAddressValidator, updateAddress);
router.delete("/:id", deleteAddressValidator, deleteAddress);

module.exports = router;
