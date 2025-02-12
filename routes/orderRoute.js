const express = require('express');
const router = express.Router();
const { 
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getLoggedUserOrders,
    getLoggedUserOrderById
} = require('../controllers/orderController');
const authService = require("../controllers/authController");

// Routes for orders
router.use(authService.protect);

router.post('/', createOrder); 
router.get('/', getLoggedUserOrders); 
router.get('/:id', getLoggedUserOrderById); 


router.use(authService.allowedTo("admin"));

router.get('/', getAllOrders); // عرض كل الطلبات (للمدير فقط)
router.get('/:id', getOrderById); // عرض طلب معين (للمدير فقط)










router.put('/update/:orderId', updateOrderStatus); // تحديث حالة الطلب
router.delete('/cancel/:id', cancelOrder); // إلغاء طلب (للمدير فقط)


module.exports = router;

