const Cart = require('../../models/cart.model');

module.exports.cartId = async (req, res, next) => {
    
    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();
        
        // CART LOG
        console.log("CART CREATED", {
            time: new Date().toISOString(),
            cartId: cart.id,
            url: req.originalUrl,
            method: req.method,
            cookie: req.cookies.cartId,
            ip: req.ip
        });

        const fs = require('fs');
        const path = require('path');

        const logPath = path.join(__dirname, '../../cart.log');

        fs.appendFileSync(
            logPath,
            JSON.stringify({
                time: new Date().toISOString(),
                cartId: cart.id,
                url: req.originalUrl,
                method: req.method,
                cookie: req.cookies.cartId,
                ip: req.ip,
                userAgent: req.headers['user-agent'],
                pid: process.pid
            }) + '\n'
        );
        // END CART LOG

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