const express = require("express");
const {
    addAddress,
    updateAddress,
    deleteAddress,
    getAddresses,
    getAddressById
}=require("../controllers/addressController")
const authService =require("../controllers/authController");

const router = express.Router();
router.use(authService.protect); 
router.get("/",getAddresses)
router.post("/",addAddress)
router.put("/:addressId",updateAddress)
router.delete("/:addressId",deleteAddress)


router.get("/:id",getAddressById);






module.exports = router;



