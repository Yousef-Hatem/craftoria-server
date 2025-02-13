const asyncHandler = require("express-async-handler");
const Order = require('../models/orderModel');
const User = require('../models/userModel');





//////////////////////////////////////////////////////////////////////////////

exports.createOrder = asyncHandler(async (req, res) => {
    const { paymentMethod } = req.body;
    const user = await User.findById(req.user._id).populate("").select("cart").lean();
    const totalPrice = 0;
    const items = [];

    user.cart.forEach(i => {
        const item = {
            product: i.productId._id,
            quantity: i.quantity,
            price: i.price,
        };

        totalPrice = + i.price;
        items.push(item)
    });

    const newOrder = new Order({
        user: req.user._id,
        items,
        totalPrice,
        paymentMethod
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({ message: 'Order created successfully', data: savedOrder })
}); 


////////////////////////////////////////////////////////////////////////////






exports.getAllOrders = 
    
    asyncHandler(async (req, res) => {

    const orders = await Order.find().populate('user').populate('items.product').lean();
    res.status(200).json(orders);

}); 

//////////////////////////////////////////////////////////////////////////////

exports.getOrderById =
    
    asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id).populate('user').populate('items.product').lean();

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
});

///////////////////////////////saaaaaaiiiiiiiiiiif////////////////////////////////
    exports.updateOrderStatus = asyncHandler(async (req, res) => {
        const { orderId } = req.params;
        const { status } = req.body;
    
        // جلب الطلب بناءً على الـ orderId
        const order = await Order.findById(orderId);
    
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
    
        // إذا كان المستخدم هو من قام بإنشاء الطلب، وعند التحديث إلى حالة أخرى غير "shipping"
        if (order.user.toString() === req.user._id.toString()) {
            // إذا كان الوقت الحالي قد مر عليه 7 أيام من تاريخ الطلب
            const currentTime = new Date();
            const orderTime = new Date(order.createdAt);
            const timeDifference = (currentTime - orderTime) / (1000 * 3600 * 24); // الفرق باليوم
    
            if (timeDifference >= 7 && status !== 'delivered') {
                return res.status(400).json({ message: 'Order cannot be updated to this status after 7 days. It will be marked as delivered.' });
            }
    
            // إذا كان الوضع الحالي هو "shipping" وتريد تغييره بعد مرور 7 أيام
            if (timeDifference >= 7 && status !== 'delivered') {
                order.status = 'delivered';  // التحديث التلقائي بعد مرور 7 أيام
            } else {
                order.status = status;  // تحديث الحالة إلى الحالة المطلوبة
            }
        } else if (req.user.role === 'admin' && status === 'cancelled') {
            // إذا كان المستخدم هو الـ admin وقرر إلغاء الطلب
            order.status = 'cancelled';
        }
    
        // حفظ التحديثات في قاعدة البيانات
        const updatedOrder = await order.save();
    
        res.status(200).json({ message: 'Order status updated', order: updatedOrder });
    });
    



    ///////////////////////////////////////////////////////////////////////////////////
     
    
    exports.cancelOrder =
        asyncHandler( async (req, res) => {
            try {
                const { role } = req.body; 
                const { orderId } = req.params;
        
                
            if (role !== "admin") {
                    return res.status(403).json({ message: "not allowed to you to do this action" });
                }
        
                
                const order = await Order.findById(orderId);
            if (!order) {
                    return res.status(404).json({ message: "Order not found" });
                }
        
                
            order.status = "Cancelled";
            await order.save();
        
                return res.status(200).json({ message: "Order cancelled successfully", order });
            } catch (error) {
                return res.status(500).json({ message: "خطأ في الخادم", error: error.message });
            }
    });
        ///////////////////////////////////////////////////////////////////////////////



        exports.getLoggedUserOrders = asyncHandler(async (req, res) => {
            const orders = await Order.find({ user: req.user._id }).populate('items.product').lean();
        
            res.status(200).json(orders);
        });



///////////////////////////////////////////////////////////////////////////////////


exports.getLoggedUserOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;  

    
    const order = await Order.findOne({ 
        _id: id, 
        user: req.user._id 
    }).populate('items.product').lean();

    

    res.status(200).json(order);
});


///////////////////////////////////////////////////////////////////////////


