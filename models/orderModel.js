const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [
        {
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product', 
                required: true 
            }, 
            quantity: { 
                type: Number, 
                default: 1
            }, 
            price:{
                type:Number,
                required:true
            }
        }
    ],
    totalPrice: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['shipped', 'delivered', 'cancelled'], 
        default: 'shipped' 
    },
    paymentMethod:{
        type: String, 
        enum: ['card', 'cash'], 
        default: 'cash'
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
},
{
    timestamps:true
});

module.exports = mongoose.model('Order', orderSchema);
