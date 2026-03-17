const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        user_id: String,
        products: [
            {
                product_id: String,
                quantity: Number
            }
        ]
    },
    {
        timestamps: true
    }
);

// 🔥 DEBUG: bắt mọi lần save
cartSchema.pre('save', function (next) {
    console.log("CART SAVE TRIGGERED", {
        time: new Date().toISOString(),
        id: this._id,
        pid: process.pid,
        stack: new Error().stack
    });
    next();
});

const Cart = mongoose.model('Cart', cartSchema, 'carts');

module.exports = Cart;