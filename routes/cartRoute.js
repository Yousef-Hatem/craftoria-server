const express = require("express");

const { validateCart } = require('../utils/validators/cartValidator')
const {
    addItemToCart,
    updateItemsQuantity,
    removeProduct,
} = require("../controllers/cartController");


const router = express.Router();

router.post('/cart/:productId' , validateCart , updateItemsQuantity);
router.put('/cart/:productId' , validateCart , addItemToCart );
router.delete('/cart/:productId' , removeProduct)

module.exports = router;