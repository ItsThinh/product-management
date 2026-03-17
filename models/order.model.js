const Mongoose = require('mongoose');

const orderSchema = new Mongoose.Schema(
    {
        cart_id: String,
        userInfo: {
            fullName: String,
            phone: Number,
            address: String
        },
        products: [
            {
                product_id: String,
                price: Number,
                discountPercentage: Number,
                quantity: Number
            }
        ],
        title: String,
        description: String,
        permissions: {
            type: Array,
            default: []
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
);

const Order = Mongoose.model('Order', orderSchema, 'orders');

module.exports = Order;