const Cart = require('../../models/cart.model');

module.exports.cartId = async (req, res, next) => {
    
    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();
        
        console.log("CART CREATED", {
            time: new Date().toISOString(),
            cartId: cart.id,
            url: req.originalUrl,
            method: req.method,
            cookie: req.cookies.cartId,
            ip: req.ip
        });

        const cookieExpires = 365 * 24 * 60 * 60 * 1000;

        res.cookie('cartId', cart.id, {
            expires: new Date(Date.now() + cookieExpires)
        });
    } else {
        const cart = await Cart.findOne({ _id: req.cookies.cartId });

        cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);

        res.locals.miniCart = cart;
    }

    next();
}